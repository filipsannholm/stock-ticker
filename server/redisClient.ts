import * as dotenv from 'dotenv'
dotenv.config({path: '../.env'});
import { createClient } from 'redis';
import { eachDayOfInterval, parse, format, isBefore } from 'date-fns'

const redisClient = createClient({url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`})

const DATE_FORMAT = 'yyyy-MM-dd'

export interface TickerQueryParams {
    ticker: string[],
    market: string,
    to?: string,
    from?: string
}

export const getMarket = async (marketId: string) => {
    await redisClient.connect()
    const data = await redisClient.get(`market-${marketId}`) || '[]'
    await redisClient.disconnect()
    try {
        const parsed = JSON.parse(data);
        return parsed
    } catch(e) {
        throw new Error('Error fetching market data')
    }
}

export const getTickerData = async (params: TickerQueryParams) => {
    const keys = getRedisKeys(params)
    let data: Record<string,any> = {}
    for (const [key, dates] of keys) {
        const redisKeys = dates.map((date: string) => `${key}-${date}`)
        await redisClient.connect()
        const res = await redisClient.mGet(redisKeys)
        await redisClient.disconnect()
        const dataObj = res.filter(value => typeof value === 'string').map(value => value && JSON.parse(value))
        dataObj.sort((a, b) => {
            const firstDate = parse(a.date, DATE_FORMAT, new Date())
            const secondDate = parse(b.date, DATE_FORMAT, new Date())
            return isBefore(firstDate, secondDate) ? -1 : 1
        })
        data[key] = dataObj
    }
    return data
}

const getRedisKeys = (params: TickerQueryParams) => {
    const dates = generateDateRange(params)
    let redisParams = new Map()
    if (typeof params.ticker === 'string') {
        redisParams.set(`${params.market}-${params.ticker}`, dates)
    } else {
        for(const ticker of params.ticker) {
            redisParams.set(`${params.market}-${ticker}`, dates)
        }
    }
    return redisParams
}

const generateDateRange = (params: TickerQueryParams) => {
    let to = new Date()
    let from = new Date()
    if (params.to) {
        to = parse(params.to, DATE_FORMAT, new Date())
    }
    if(!params.from) {
        from = parse('2021-01-01', DATE_FORMAT, new Date())
    }else {
        from = parse(params.from, DATE_FORMAT, new Date())
    }
    const dates = eachDayOfInterval({start: from, end: to})
    return dates.map(date => format(date, DATE_FORMAT))
}