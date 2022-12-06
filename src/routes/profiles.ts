import express from "express"

import {
  checkRole,
  createProfileNFT,
  setProfileImage,
  setProfileAsDefault,
  verifyProfileHandle,
  getUserDefaultProfile,
  estimateGasCreateProfileNFT,
  getProfileTokenURI,
} from "../controllers/profiles"
import { authMiddleware } from "../middlewares/auth"

export const profilesRouter = express.Router()

profilesRouter.post("/role", authMiddleware, checkRole)
profilesRouter.post("/create", authMiddleware, createProfileNFT)
profilesRouter.post("/update", authMiddleware, setProfileImage)
profilesRouter.post("/default", authMiddleware, setProfileAsDefault)
profilesRouter.post("/handle/verify", verifyProfileHandle)
profilesRouter.post("/gas/create", authMiddleware, estimateGasCreateProfileNFT)
profilesRouter.get("/default", authMiddleware, getUserDefaultProfile)
profilesRouter.get(
  "/token-uri/tokenId/:tokenId",
  authMiddleware,
  getProfileTokenURI
)
