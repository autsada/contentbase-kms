/**
 * These are handlers for the routes that only allow admin to access.
 */

import express from "express"

import { generateCryptoKey } from "../controllers/kms"
import {
  setPlatformOwner,
  setProfileContract,
  setLikeFee,
  setPlatformFee,
} from "../controllers/admin"
import { authMiddleware } from "../middlewares/auth"

export const adminRouter = express.Router()

adminRouter.post("/key/create/master", authMiddleware, generateCryptoKey)

//  All the below routes will be used in development only. In production connect to the blockchain directly from the UI.
adminRouter.post("/address/owner", authMiddleware, setPlatformOwner)
adminRouter.post("/address/profile", authMiddleware, setProfileContract)
adminRouter.post("/fee/like", authMiddleware, setLikeFee)
adminRouter.post("/fee/platform", authMiddleware, setPlatformFee)
