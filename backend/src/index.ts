import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import router from './routes'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(router)

app.get('/', (req: Request, res: Response) => {
  res.send('Commenting API')
})

app.listen(port, () => {
  console.log(`[backend]: Server is running at PORT ${port}`)
})
