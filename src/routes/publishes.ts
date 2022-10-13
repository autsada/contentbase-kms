import express from "express"

import {
  checkRole,
  createPublishNft,
  updatePublishNft,
  deleteUserPublish,
  getMyPublishes,
  getPublishes,
  getPublish,
  totalPublishes,
  fetchTokenURI,
  estimateCreatePublishNftGas,
} from "../controllers/publishes"
import { authMiddleware } from "../middlewares/auth"

export const publishesRouter = express.Router()

publishesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
publishesRouter.post("/create/uid/:uid", authMiddleware, createPublishNft)
publishesRouter.post(
  "/update/publishId/:publishId/uid/:uid",
  authMiddleware,
  updatePublishNft
)
publishesRouter.delete(
  "/delete/publishId/:publishId/uid/:uid",
  authMiddleware,
  deleteUserPublish
)
// Has to be a post route as the route has to receive an array from request body
publishesRouter.post("/my-publishes/uid/:uid", authMiddleware, getMyPublishes)
publishesRouter.post("/get", authMiddleware, getPublishes)
publishesRouter.get("/publishId/:publishId", authMiddleware, getPublish)
publishesRouter.get("/total", authMiddleware, totalPublishes)
publishesRouter.get(
  "/token-uri/publishId/:publishId",
  authMiddleware,
  fetchTokenURI
)
publishesRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreatePublishNftGas
)
