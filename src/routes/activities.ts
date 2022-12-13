import express from "express"

import { updateActivity } from "../controllers/activities"

export const activitiesRouter = express.Router()

// This route doesn't need to have auth middleware as it will be called from the webhook route of contentbase server.
activitiesRouter.post("/update", updateActivity)
