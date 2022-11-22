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

profilesRouter.post("/role", authMiddleware, checkRole)
profilesRouter.post("/create", authMiddleware, createProfileNft)
profilesRouter.post("/update", authMiddleware, setProfileImage)
profilesRouter.post("/default", authMiddleware, setProfileAsDefault)
profilesRouter.post("/follow", authMiddleware, followProfile)
profilesRouter.post("/handle/verify", authMiddleware, verifyProfileHandle)
profilesRouter.post("/gas/profile", authMiddleware, estimateGasCreateProfileNft)
profilesRouter.post("/gas/follow", authMiddleware, estimateGasFollowProfile)
profilesRouter.get("/default", authMiddleware, getUserDefaultProfile)
profilesRouter.get(
  "/token-uri/tokenId/:tokenId",
  authMiddleware,
  getProfileTokenURI
)
