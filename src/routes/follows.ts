import express from "express"

import {
  checkRole,
  followProfile,
  unFollowProfile,
  fetchFollows,
  estimateCreateFollowNftGas,
} from "../controllers/follows"
import { authMiddleware } from "../middlewares/auth"

export const followsRouter = express.Router()

followsRouter.post("/role/uid/:uid", authMiddleware, checkRole)
followsRouter.post("/create/uid/:uid", authMiddleware, followProfile)
followsRouter.delete(
  "/delete/tokenId/:tokenId/uid/:uid",
  authMiddleware,
  unFollowProfile
)

// This must be a post request as it will receive data in the body
followsRouter.post("/", authMiddleware, fetchFollows)
followsRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreateFollowNftGas
)
