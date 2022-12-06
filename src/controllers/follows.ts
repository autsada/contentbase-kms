import { Request, Response } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  follow,
  estimateGasForFollowTxn,
  getFollowCounts,
} from "../lib/followNFT"
import { decrypt } from "../lib/kms"
import { CreateFollowInput, Role } from "../types"

/**
 * A route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(req: Request, res: Response) {
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
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to follow a profile.
 * @dev see CreateFollowInput
 */
export async function followProfile(req: Request, res: Response) {
  try {
    const { uid } = req
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]
    // Validate input.
    if (!uid || !followerId || !followeeId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Follow
    await follow({
      key,
      data: {
        followerId,
        followeeId,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to estimate gas used to follow a profile.
 * @dev see CreateFollowInput
 */
export async function estimateGasFollowProfile(req: Request, res: Response) {
  try {
    const { uid } = req
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]
    // Validate input.
    if (!uid || !followerId || !followeeId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const estimatedGas = await estimateGasForFollowTxn({
      key,
      data: { followerId, followeeId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to get followers and following of a profile.
 */
export async function getFollows(req: Request, res: Response) {
  try {
    const { uid } = req
    const { profileId } = req.params as { profileId: string }
    if (!uid || !profileId) throw new Error("User input error")
    const { followers, following } = await getFollowCounts(Number(profileId))
    res.status(200).json({ followers, following })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
