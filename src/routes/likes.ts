import express from "express"

import {
  checkRole,
  likePublishNFT,
  disLikePublishNFT,
  estimateGasLikePublishNFT,
  getPlatformOwner,
  getProfileContract,
  getPublishContract,
  likeFee,
  platformFee,
} from "../controllers/likes"
import { authMiddleware } from "../middlewares/auth"

export const likesRouter = express.Router()

likesRouter.post("/role", authMiddleware, checkRole)
likesRouter.post("/like", authMiddleware, likePublishNFT)
likesRouter.post("/disLike", authMiddleware, disLikePublishNFT)
likesRouter.post("/gas/like", authMiddleware, estimateGasLikePublishNFT)
likesRouter.get("/platform-owner", getPlatformOwner)
likesRouter.get("/profile-contract", getProfileContract)
likesRouter.get("/publish-contract", getPublishContract)
likesRouter.get("/fee/like", likeFee)
likesRouter.get("/fee/platform", platformFee)
