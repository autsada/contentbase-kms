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

publishesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
publishesRouter.post("/create/uid/:uid", authMiddleware, createPublishNft)
publishesRouter.post("/update/uid/:uid", authMiddleware, updatePublishNft)
publishesRouter.post("/delete/uid/:uid", authMiddleware, deleteUserPublish)
publishesRouter.post("/like/uid/:uid", authMiddleware, likePublishNft)
publishesRouter.post("/disLike/uid/:uid", authMiddleware, disLikePublishNft)
publishesRouter.post(
  "/comment/create/uid/:uid",
  authMiddleware,
  createCommentNft
)
publishesRouter.post(
  "/comment/update/uid/:uid",
  authMiddleware,
  updateCommentNft
)
publishesRouter.post(
  "/comment/delete/uid/:uid",
  authMiddleware,
  deleteCommentNft
)
publishesRouter.post("/comment/like/uid/:uid", authMiddleware, likeCommentNft)
publishesRouter.post(
  "/comment/disLike/uid/:uid",
  authMiddleware,
  disLikeCommentNft
)
publishesRouter.post(
  "/gas/publish/create/uid/:uid",
  authMiddleware,
  estimateGasCreatePublishNft
)
publishesRouter.post(
  "/gas/publish/like/uid/:uid",
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
