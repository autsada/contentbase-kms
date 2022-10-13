import express from "express"

import {
  checkRole,
  getLikeRate,
  platformFee,
  likePublish,
  unLikePublish,
  estimateCreateLikeNftGas,
} from "../controllers/likes"
import { authMiddleware } from "../middlewares/auth"

export const likesRouter = express.Router()

likesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
likesRouter.get("/fee", authMiddleware, getLikeRate)
likesRouter.get("/platform/fee", authMiddleware, platformFee)
likesRouter.post("/uid/:uid", authMiddleware, likePublish)
likesRouter.delete("/likeId/:likeId/uid/:uid", authMiddleware, unLikePublish)
likesRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreateLikeNftGas
)
