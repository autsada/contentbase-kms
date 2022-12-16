/**
 * These are handlers for the routes that only allow admin to access.
 */

import express from "express"

import { generateCryptoKey } from "../controllers/kms"
import {
  setProfileForFollow,
  setProfileForPublish,
  setPlatformOwner,
  setProfileForLike,
  setPublishForLike,
  setPlatformFee,
  withdraw,
  setProfileForComment,
  setPublishForComment,
} from "../controllers/admin"
import { authMiddleware } from "../middlewares/auth"

export const adminRouter = express.Router()

// TODO: add a middleware to allow only admin user to access this route.
adminRouter.post("/key/create/master", authMiddleware, generateCryptoKey)

//  All the below routes will be used in development only. In production connect to the blockchain directly from the UI.
adminRouter.post("/set/profile-follow", authMiddleware, setProfileForFollow)
adminRouter.post("/set/profile-publish", authMiddleware, setProfileForPublish)
adminRouter.post("/set/owner", authMiddleware, setPlatformOwner)
adminRouter.post("/set/profile-like", authMiddleware, setProfileForLike)
adminRouter.post("/set/publish-like", authMiddleware, setPublishForLike)
adminRouter.post("/set/fee/platform", authMiddleware, setPlatformFee)
adminRouter.post("/withdraw", authMiddleware, withdraw)
adminRouter.post("/set/profile-comment", authMiddleware, setProfileForComment)
adminRouter.post("/set/publish-comment", authMiddleware, setPublishForComment)
