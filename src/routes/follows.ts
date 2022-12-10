import express from "express"

import {
  checkRole,
  followProfile,
  estimateGasFollowProfile,
  getFollows,
} from "../controllers/follows"
import { authMiddleware } from "../middlewares/auth"

export const followsRouter = express.Router()

followsRouter.post("/role", authMiddleware, checkRole)
followsRouter.post("/following", authMiddleware, followProfile)
followsRouter.post("/gas/following", authMiddleware, estimateGasFollowProfile)
followsRouter.get("/profileId/:profileId", getFollows)
