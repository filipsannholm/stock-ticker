import express, {Express, Response, Request} from 'express';
import cors from 'cors'
import { getTickerData, getMarket, TickerQueryParams } from './redisClient.js'


const app: Express = express()

app.use(cors())

app.get('/api/market/:market', async (req: Request, res: Response) => {
    console.log(req)
    if (!req.params.market) {
        res.status(400)
        res.send({error: 'Missing parameter.'})
    } else {
        const data = await getMarket(req.params.market)
        res.send(data)
    }
})

app.get('/api/tickers', async (req: Request, res: Response) => {
    try {
        if (!req.query.ticker) {
            throw new Error ('Missing parameter "ticker".')
        }
        if(!req.query.market) {
            throw new Error ('Missing parameter "market".')
        }
        const query = req.query as unknown as TickerQueryParams
        const data = await getTickerData(query)
        res.send(data)
    } catch(e: any) {
        res.status(400).send({error: e.message})
        
    }
})

app.listen(process.env.SERVER_PORT || 5000, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`)
})


