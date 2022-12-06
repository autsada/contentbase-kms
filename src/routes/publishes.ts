import express from "express"

import {
  checkRole,
  createPublishNFT,
  updatePublishNFT,
  deletePublishNFT,
  getPublish,
  tokenURI,
  estimateGasCreatePublishNFT,
  getProfileContract,
} from "../controllers/publishes"
import { authMiddleware } from "../middlewares/auth"

export const publishesRouter = express.Router()

publishesRouter.post("/role", authMiddleware, checkRole)
publishesRouter.post("/create", authMiddleware, createPublishNFT)
publishesRouter.post("/update", authMiddleware, updatePublishNFT)
publishesRouter.post("/delete", authMiddleware, deletePublishNFT)
publishesRouter.post("/gas/create", authMiddleware, estimateGasCreatePublishNFT)
publishesRouter.get("/publishId/:publishId", authMiddleware, getPublish)
publishesRouter.get("/token-uri/tokenId/:tokenId", authMiddleware, tokenURI)
publishesRouter.get("/profile-contract", authMiddleware, getProfileContract)
