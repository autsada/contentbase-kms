import express from "express"

import {
  checkRole,
  createPublishNft,
  updatePublishNft,
  deleteUserPublish,
  likePublishNft,
  disLikePublishNft,
  getPublish,
  createCommentNft,
  updateCommentNft,
  deleteCommentNft,
  likeCommentNft,
  disLikeCommentNft,
  getComment,
  tokenURI,
  estimateGasCreatePublishNft,
  estimateGasLikePublishNft,
  likeFee,
  platformFee,
  platformOwner,
  profileContract,
} from "../controllers/publishes"
import { authMiddleware } from "../middlewares/auth"

export const publishesRouter = express.Router()

publishesRouter.post("/role", authMiddleware, checkRole)
publishesRouter.post("/create", authMiddleware, createPublishNft)
publishesRouter.post("/update", authMiddleware, updatePublishNft)
publishesRouter.post("/delete", authMiddleware, deleteUserPublish)
publishesRouter.post("/like", authMiddleware, likePublishNft)
publishesRouter.post("/disLike", authMiddleware, disLikePublishNft)
publishesRouter.post("/comment/create", authMiddleware, createCommentNft)
publishesRouter.post("/comment/update", authMiddleware, updateCommentNft)
publishesRouter.post("/comment/delete", authMiddleware, deleteCommentNft)
publishesRouter.post("/comment/like", authMiddleware, likeCommentNft)
publishesRouter.post("/comment/disLike", authMiddleware, disLikeCommentNft)
publishesRouter.post(
  "/gas/publish/create",
  authMiddleware,
  estimateGasCreatePublishNft
)
publishesRouter.post(
  "/gas/publish/like",
  authMiddleware,
  estimateGasLikePublishNft
)
publishesRouter.get("/publishId/:publishId", authMiddleware, getPublish)
publishesRouter.get("/comment/commentId/:commentId", authMiddleware, getComment)
publishesRouter.get("/token-uri/tokenId/:tokenId", authMiddleware, tokenURI)
publishesRouter.get("/address/owner", authMiddleware, platformOwner)
publishesRouter.get("/address/profile", authMiddleware, profileContract)
publishesRouter.get("/fee/like", authMiddleware, likeFee)
publishesRouter.get("/fee/platform", authMiddleware, platformFee)
