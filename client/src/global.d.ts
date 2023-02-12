export type Datapoint = {
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    adjusted_close: number,
    volume: number
}

export type PlotData = {
    dataPoints: Datapoint[],
    color?: string
}

export type StockData = Record<string, PlotData>

export type Ticker = {
    code: string,
    name: string,
    country: string,
    exchange: string,
    currency: string,
    type: string,
    isin: string,
    fetched: boolean
}

export type DateRange = {
    from: Date
    to: Date
}