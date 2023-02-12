import process from 'node:process'
import {readdirSync, readFileSync} from 'node:fs'
import * as dotenv from 'dotenv'
import {createClient} from 'redis'
dotenv.config({path: '../.env'})

const MARKET_FILE_REGEX = /codes-(\w+)\.json/
const TICKER_KEY_REGEX = /\w+-(\w+).json/

interface PriceData extends Record<string, any> {
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    adjusted_close: number,
    volume: number
}

if (!process.env.REDIS_HOST) {
    console.log('No REDIS_HOST in environment variables. Exiting.')
    process.exit(1)
}
if (!process.env.REDIS_PORT) {
    console.log('No REDIS_PORT in environment variables. Exiting.')
    process.exit(1);
}

const redisClient = createClient({url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`})
redisClient.on('error', err => console.log('Redis error:', err))

const getMarketFiles = () => {
    return readdirSync('../data').filter(fileName => MARKET_FILE_REGEX.test(fileName))
}

const getMarketKey = (fileName:string) => {
    const keyMatch = fileName.match(MARKET_FILE_REGEX)
    if (keyMatch && keyMatch[1]) {
        return keyMatch[1]
    } else {
        throw new Error('Could not parse market key')
    }
}

const writeMarket = async (marketFileNames: string[]) => {
    for (const fileName of marketFileNames) {
        const content = readFileSync(`../data/${fileName}`, 'utf-8')
        try {
            const data = JSON.parse(content)
            const key = getMarketKey(fileName)
            await setKey('market-' + key, JSON.stringify(data))
        } catch(e) {
            console.log('Error parsing market data', e)
            process.exit(1)
        }

    }
}

const getTickerFilesforMarket = (marketKey: string) => {
    const tickerFileRegex = new RegExp(`${marketKey}-\\w+\\.json`)
    return readdirSync('../data').filter(fileName => {
        return tickerFileRegex.test(fileName)
    })
}

const writeTickerData = async (marketKey: string, fileNames: string[]) => {
    for (const fileName of fileNames) {
        const tickerData = readFileSync(`../data/${fileName}`, 'utf-8')
        try {
            const priceData = JSON.parse(tickerData)
            const ticker = getTickerCode(fileName)
            const redisData = convertPriceData(marketKey, ticker, priceData)
            redisClient.connect()
            await redisClient.mSet(redisData)
            redisClient.disconnect()
        } catch (e) {
            console.log(`Could not parse price data in ${fileName}.`, e)
        }
    }
}

const getTickerCode = (fileName: string) => {
    const match = fileName.match(TICKER_KEY_REGEX)
    if (match && match[1]) {
        return match[1]
    }
    throw new Error('Could not parse ticker code.')
}

const convertPriceData = (marketKey: string, ticker: string, priceData: PriceData[]) => {
    return priceData.reduce<Record<string, string>>((acc, data) => {
        const key = `${marketKey}-${ticker}-${data.date}`
        acc[key] = JSON.stringify(data)
        return acc
    }, {})
}

const setKey = async (key: string, value: string) => {
    await redisClient.connect()
    await redisClient.set(key, value)
    await redisClient.disconnect()
}

const marketFiles = getMarketFiles()
if (!marketFiles.length) {
    console.log('No market files found in data dir. Exiting.')
    process.exit(1)
}
await writeMarket(marketFiles)
for (const marketFile of marketFiles) {
    const key = getMarketKey(marketFile)
    const tickerFiles = getTickerFilesforMarket(key)
    await writeTickerData(key, tickerFiles)
}

