import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"

import "./config/firebase"
import * as router from "./routes"
import { errorHandler } from "./middlewares/error"

const { PORT } = process.env

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.use("/wallet", router.walletRouter)
app.use("/profiles", router.profilesRouter)
app.use("/follows", router.followsRouter)
app.use("/publishes", router.publishesRouter)
app.use("/comments", router.commentsRouter)
app.use("/likes", router.likesRouter)
app.use("/admin", router.adminRouter)
app.use("/activities", router.activitiesRouter)
app.use(errorHandler)

// Create the HTTP server
const httpServer = http.createServer(app)

httpServer.listen({ port: PORT || 8000 }, () => {
  console.log(`Server ready at port: ${PORT}`)
})
