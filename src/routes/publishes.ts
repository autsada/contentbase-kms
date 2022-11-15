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
  getPublishTokenURI,
  estimateGasCreatePublishNft,
  estimateGasLikePublishNft,
  estimateGasLikeCommentNft,
} from "../controllers/publishes"
import { authMiddleware } from "../middlewares/auth"

export const publishesRouter = express.Router()

publishesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
publishesRouter.post("/create/uid/:uid", authMiddleware, createPublishNft)
publishesRouter.post("/update/uid/:uid", authMiddleware, updatePublishNft)
publishesRouter.post("/delete/uid/:uid", authMiddleware, deleteUserPublish)
publishesRouter.post("/like/uid/:uid", authMiddleware, likePublishNft)
publishesRouter.post("/dislike/uid/:uid", authMiddleware, disLikePublishNft)
publishesRouter.get("/publishId/:publishId", authMiddleware, getPublish)
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
  "/comment/dislike/uid/:uid",
  authMiddleware,
  disLikeCommentNft
)
publishesRouter.get("/token-uri/:tokenId", authMiddleware, getPublishTokenURI)
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
publishesRouter.post(
  "/gas/comment/like/uid/:uid",
  authMiddleware,
  estimateGasLikeCommentNft
)
