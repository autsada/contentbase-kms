import express from "express"

import {
  checkRole,
  createProfileNft,
  updateProfileImage,
  setProfileAsDefault,
  getUserDefaultProfile,
  verifyProfileHandle,
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
profilesRouter.get("/default/uid/:uid", authMiddleware, getUserDefaultProfile)
profilesRouter.post("/verifyHandle", authMiddleware, verifyProfileHandle)
profilesRouter.post(
  "/estimateGas/uid/:uid",
  authMiddleware,
  estimateCreateProfileNftGas
)
