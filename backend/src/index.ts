import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import router from './routes'
import cors from 'cors'
import http from 'http'
import io from './lib/socketio'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(router)

io(server)

app.get('/', (req: Request, res: Response) => {
  res.send('Commenting API')
})

server.listen(port, () => {
  console.log(`[backend]: Server is running at PORT ${port}`)
})
