import type { Request, Response, NextFunction } from "express"
import { utils } from "ethers"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  likePublish,
  disLikePublish,
  estimateGasForLikePublishTxn,
  getPlatformOwnerAddress,
  getProfileContractAddress,
  getPublishContractAddress,
  calculateLikeFee,
  getPlatformFee,
} from "../lib/likeNFT"
import { decrypt } from "../lib/kms"
import { Role } from "../types"

/**
 * The route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { role } = req.body as { role: Role }
    if (!uid || !role) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const hasRole = await checkUserRole({ key, role, address })

    res.status(200).json({ hasRole })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to like a publish.
 */
export async function likePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { publishId, profileId } = req.body as {
      publishId: number
      profileId: number
    }
    // Validate input.
    if (!uid || !publishId || !profileId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await likePublish(key, Number(publishId), Number(profileId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to dislike a publish.
 */
export async function disLikePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { publishId, profileId } = req.body as {
      publishId: number
      profileId: number
    }
    // Validate input.
    if (!uid || !publishId || !profileId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await disLikePublish(key, Number(publishId), Number(profileId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to estimate gas used to like Publish NFT.
 */
export async function estimateGasLikePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { publishId, profileId } = req.body as {
      publishId: number
      profileId: number
    }
    // Validate input.
    // description can be empty.
    if (!uid || !publishId || !profileId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const estimatedGas = await estimateGasForLikePublishTxn(
      key,
      Number(publishId),
      Number(profileId)
    )

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get the platform owner address.
 */
export async function getPlatformOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = await getPlatformOwnerAddress()

    res.status(200).json({ address })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get the profile contract address.
 */
export async function getProfileContract(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = await getProfileContractAddress()

    res.status(200).json({ address })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get the publish contract address.
 */
export async function getPublishContract(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = await getPublishContractAddress()

    res.status(200).json({ address })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get the like fee.
 */
export async function getLikeFee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fee = await calculateLikeFee()

    res.status(200).json({ fee: utils.formatEther(fee) })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get the platform fee.
 */
export async function platformFee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fee = await getPlatformFee()

    res.status(200).json({ fee })
  } catch (error) {
    next(error)
  }
}
