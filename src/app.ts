import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../.env') })
import express from 'express'
import cors from 'cors'
import http from 'http'

import * as router from './routes'

const { PORT } = process.env

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.use('/profiles', router.profilesRouter)
app.use('/wallet', router.walletRouter)

// Create the HTTP server
const httpServer = http.createServer(app)

httpServer.listen({ port: PORT || 8000 }, () => {
  console.log(`Server ready at port: ${PORT}`)
})
