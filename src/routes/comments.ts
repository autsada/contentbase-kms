import express from "express"

import {
  checkRole,
  commentPublish,
  commentComment,
  updateCommentNFT,
  deleteCommentNFT,
  likeCommentNFT,
  disLikeCommentNFT,
  getComment,
  tokenURI,
  getProfileContract,
  getPublishContract,
} from "../controllers/comments"
import { authMiddleware } from "../middlewares/auth"

export const commentsRouter = express.Router()

commentsRouter.post("/role", authMiddleware, checkRole)
commentsRouter.post("/publish", authMiddleware, commentPublish)
commentsRouter.post("/comment", authMiddleware, commentComment)
commentsRouter.post("/update", authMiddleware, updateCommentNFT)
commentsRouter.post("/delete", authMiddleware, deleteCommentNFT)
commentsRouter.post("/like", authMiddleware, likeCommentNFT)
commentsRouter.post("/disLike", authMiddleware, disLikeCommentNFT)
commentsRouter.get("/commentId/:commentId", authMiddleware, getComment)
commentsRouter.get("/token-uri/tokenId/:tokenId", authMiddleware, tokenURI)
commentsRouter.get("/profile-contract", authMiddleware, getProfileContract)
commentsRouter.get("/publish-contract", authMiddleware, getPublishContract)
