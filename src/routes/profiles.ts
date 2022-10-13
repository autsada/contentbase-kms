import express from "express"

import {
  checkRole,
  createProfileNft,
  updateProfileImage,
  setProfileAsDefault,
  getMyProfiles,
  getUserDefaultProfile,
  getProfile,
  totalProfiles,
  verifyProfileHandle,
  fetchTokenURI,
  estimateCreateProfileNftGas,
} from "../controllers/profiles"
import { authMiddleware } from "../middlewares/auth"

export const profilesRouter = express.Router()

profilesRouter.post("/role/uid/:uid", authMiddleware, checkRole)
profilesRouter.post("/create/uid/:uid", authMiddleware, createProfileNft)
profilesRouter.post(
  "/update/profileId/:profileId/uid/:uid",
  authMiddleware,
  updateProfileImage
)
profilesRouter.post(
  "/default/profileId/:profileId/uid/:uid",
  authMiddleware,
  setProfileAsDefault
)
// Has to be a post route as the route has to receive an array from request body
profilesRouter.post("/my-profiles/uid/:uid", authMiddleware, getMyProfiles)
profilesRouter.get("/default/uid/:uid", authMiddleware, getUserDefaultProfile)
profilesRouter.get("/profileId/:profileId", authMiddleware, getProfile)
profilesRouter.get("/total", authMiddleware, totalProfiles)
profilesRouter.post("/verifyHandle", authMiddleware, verifyProfileHandle)
profilesRouter.get(
  "/token-uri/profileId/:profileId",
  authMiddleware,
  fetchTokenURI
)
profilesRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreateProfileNftGas
)
