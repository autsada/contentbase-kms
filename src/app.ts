import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../.env') })
import express from 'express'
import cors from 'cors'
import https from 'https'
import http from 'http'
import fs from 'fs'

import * as router from './routes'
import type { Environment, EnvConfig } from './types'

const { DEV_PORT, PROD_PORT, NODE_ENV } = process.env

const configurations: Record<Environment, EnvConfig> = {
  production: { ssl: true, port: Number(PROD_PORT) || 443, hostname: '' },
  development: {
    ssl: false,
    port: Number(DEV_PORT) || 4000,
    hostname: 'localhost',
  },
}

const environment = (NODE_ENV || 'production') as Environment
const config: EnvConfig = configurations[environment]

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.use('/profiles', router.profilesRouter)
app.use('/wallet', router.walletRouter)

// Create the HTTPS or HTTP server, per configuration
let httpServer: https.Server | http.Server
if (config.ssl) {
  // Assumes certificates are in a .ssl folder off of the package root.
  // Make sure these files are secured.
  httpServer = https.createServer(
    {
      key: fs.readFileSync(
        path.join(__dirname, `../ssl/${environment}/server.key`)
      ),
      cert: fs.readFileSync(
        path.join(__dirname, `../ssl/${environment}/server.crt`)
      ),
    },

    app
  )
} else {
  httpServer = http.createServer(app)
}

httpServer.listen({ port: config.port }, () => {
  console.log(
    'Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}`
  )
})
