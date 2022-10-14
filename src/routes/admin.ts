import express from "express"

import {
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
adminRouter.post(
  "/set/platform-address",
  authMiddleware,
  setPlatformOwnerAddress
)
adminRouter.post("/withdraw", authMiddleware, withdrawFunds)
adminRouter.post("/set/like-fee", authMiddleware, setLikeSupportFee)
adminRouter.post("/set/platform-fee", authMiddleware, setFeeForPlatform)
adminRouter.get("/owner-address", authMiddleware, fetchOwnerAddress)
adminRouter.get("/balance", authMiddleware, fetchContractBalance)
