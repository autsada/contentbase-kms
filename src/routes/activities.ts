import express from "express"

import { updateActivity } from "../controllers/activities"
import { authMiddleware } from "../middlewares/auth"

export const activitiesRouter = express.Router()

activitiesRouter.post("/update", authMiddleware, updateActivity)
