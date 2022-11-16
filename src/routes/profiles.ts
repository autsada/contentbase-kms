import express from "express"

import {
  checkRole,
  createProfileNft,
  setProfileImage,
  setProfileAsDefault,
  followProfile,
  verifyProfileHandle,
  getUserDefaultProfile,
  estimateGasCreateProfileNft,
  estimateGasFollowProfile,
  getProfileTokenURI,
} from "../controllers/profiles"
import { authMiddleware } from "../middlewares/auth"

export const profilesRouter = express.Router()

profilesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
profilesRouter.post("/create/uid/:uid", authMiddleware, createProfileNft)
profilesRouter.post("/update/uid/:uid", authMiddleware, setProfileImage)
profilesRouter.post("/default/uid/:uid", authMiddleware, setProfileAsDefault)
profilesRouter.post("/follow/uid/:uid", authMiddleware, followProfile)
profilesRouter.post("/handle/verify", authMiddleware, verifyProfileHandle)
profilesRouter.post(
  "/gas/profile/uid/:uid",
  authMiddleware,
  estimateGasCreateProfileNft
)
profilesRouter.post(
  "/gas/follow/uid/:uid",
  authMiddleware,
  estimateGasFollowProfile
)
profilesRouter.get("/default/uid/:uid", authMiddleware, getUserDefaultProfile)
profilesRouter.get(
  "/token-uri/tokenId/:tokenId",
  authMiddleware,
  getProfileTokenURI
)
