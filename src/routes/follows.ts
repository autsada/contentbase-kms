import express from "express"

import {
  checkRole,
  followProfile,
  unFollowProfile,
  getFollowing,
  getFollowers,
  fetchFollows,
  estimateCreateFollowNftGas,
} from "../controllers/follows"
import { authMiddleware } from "../middlewares/auth"

export const followsRouter = express.Router()

followsRouter.post("/role/uid/:uid", authMiddleware, checkRole)
followsRouter.post("/uid/:uid", authMiddleware, followProfile)
followsRouter.delete(
  "/profileId/:profileId/uid/:uid",
  authMiddleware,
  unFollowProfile
)
followsRouter.get(
  "/following/profileId/:profileId",
  authMiddleware,
  getFollowing
)
followsRouter.get(
  "/followers/profileId/:profileId",
  authMiddleware,
  getFollowers
)
followsRouter.get("/follows", authMiddleware, fetchFollows)
followsRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreateFollowNftGas
)
