/**
 * These are handlers for the routes that only allow admin to access.
 * @dev All these route will be used in development only. In production connect to the blockchain directly from the UI.
 */

import express from "express"

import {
  setFollowContractOnProfileContract,
  setProfileContractOnPublishContract,
  setLikeContractOnPublishContract,
  setProfileContractOnFollowContract,
  setProfileContractOnLikeContract,
  setPublishContractOnLikeContract,
  setPlatformOwnerAddress,
  withdrawFunds,
  setLikeSupportFee,
  setFeeForPlatform,
  fetchOwnerAddress,
  fetchContractBalance,
} from "../controllers/admin"
import { authMiddleware } from "../middlewares/auth"

export const adminRouter = express.Router()

adminRouter.post(
  "/set/profile-follow",
  authMiddleware,
  setFollowContractOnProfileContract
)
adminRouter.post(
  "/set/publish-profile",
  authMiddleware,
  setProfileContractOnPublishContract
)
adminRouter.post(
  "/set/publish-like",
  authMiddleware,
  setLikeContractOnPublishContract
)
adminRouter.post(
  "/set/follow-profile",
  authMiddleware,
  setProfileContractOnFollowContract
)
adminRouter.post(
  "/set/like-profile",
  authMiddleware,
  setProfileContractOnLikeContract
)
adminRouter.post(
  "/set/like-publish",
  authMiddleware,
  setPublishContractOnLikeContract
)
adminRouter.post("/set/owner-address", authMiddleware, setPlatformOwnerAddress)
adminRouter.post("/withdraw", authMiddleware, withdrawFunds)
adminRouter.post("/set/like-fee", authMiddleware, setLikeSupportFee)
adminRouter.post("/set/platform-fee", authMiddleware, setFeeForPlatform)
adminRouter.get("/owner-address", authMiddleware, fetchOwnerAddress)
adminRouter.get("/balance", authMiddleware, fetchContractBalance)
