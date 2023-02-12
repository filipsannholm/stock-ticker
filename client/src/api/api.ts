import { useEffect, useState } from "react";
import axios from "axios";
import {Ticker, DateRange, StockData, Datapoint} from '../global'
import { generateRGBString } from "../utils/dataHelpers";
import {format} from 'date-fns'

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'

export type GetMarketTickerHook = [
    {
        data: Ticker[],
        isLoading: boolean,
        isError: boolean
    },
    (value: string) => void
]

export type GetTickerDataHook = [
    {
        data: StockData,
        isLoading: boolean,
        isError: boolean
    },
    (value: string[]) => void,
    (value: DateRange | undefined) => void,
    (value: string) => void
]

type TickerAPIData = Record<string,Datapoint[]>


export const useGetMarketTickers = (initialMarket: string): GetMarketTickerHook => {
    const [market, setMarket] = useState(initialMarket)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState<Ticker[]>([]) 

    useEffect(() => {
        let ignore = false
        setIsError(false)
        setIsLoading(true)
        const getTickerData = async (ignore: boolean) => {
            try {
                if(!ignore) {
                const res = await axios.get<Ticker[]>('/api/market/' + market)
                setIsLoading(false)
                setData(res.data)
                }
            } catch(e: any) {
                console.log(e)
                setIsError(true)
            }
        }
        getTickerData(ignore)
        return () => {
            ignore = true
        }

    }, [market])

    return [{data, isLoading, isError}, setMarket]
}

export const useGetTickerData = (initialMarket: string): GetTickerDataHook => {
    const [tickers, setTickers] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [market, setStockMarket] = useState(initialMarket)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [stockData, setData] = useState<StockData>({} as StockData)
    const params = buildQueryParams(tickers, dateRange, market)

    useEffect(() => {
        let ignore = false
        if (tickers.length !== 0) {
            setIsError(false)
            setIsLoading(true)
    
            const fetch = async () => {
                try {
                    if(!ignore) {
                        const res = await axios.get<TickerAPIData>('/api/tickers?' + params)
                        setIsLoading(false)
                        const plotData = {} as StockData
                        for (const [key, val] of Object.entries(res.data)) {
                            const color = stockData[key] ? stockData[key].color : generateRGBString()
                            plotData[key] = {dataPoints: val, color }
                        }
                        setData(plotData)
                    }
                } catch(e: any) {
                    console.log(e)
                    setIsError(true)
                }
            }
            fetch()
        }
        return () => { ignore = true}
    }, [params, tickers.length]) //eslint-disable-line react-hooks/exhaustive-deps

    return [{ data: stockData, isLoading, isError}, setTickers, setDateRange, setStockMarket]
}

const buildQueryParams = (tickers: string[], dateRange: DateRange | undefined, market: string) => {
    const params = new URLSearchParams()
    tickers.forEach(ticker => {
        params.append('ticker', ticker.toLowerCase())
    })
    if (dateRange) {
        params.set('from', format(dateRange.from, DEFAULT_DATE_FORMAT))
        params.set ('to', format(dateRange.to, DEFAULT_DATE_FORMAT))
    }
    params.set('market', market)
    return params.toString()
}
