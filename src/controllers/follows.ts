import { Request, Response } from "express"

import {
  checkUserRole,
  follow,
  unfollow,
  getFollowingCount,
  getFollowersCount,
  getFollows,
  estimateCreateFollowGas,
} from "../lib/FollowNFT"
import { decrypt } from "../lib/kms"
import type { CreateFollowInput } from "../lib/FollowNFT"
import type { CheckRoleParams } from "../types"

/**
 * The route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { uid } = req.params
    const { role, address } = req.body as Pick<
      CheckRoleParams,
      "role" | "address"
    >

    if (!role || !address) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    const hasRole = await checkUserRole({ key, role, address })

    res.status(200).json({ hasRole })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to follow other Profile (and create Follow NFT).
 * @dev see CreateFollowInput
 */
export async function followProfile(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]

    if (!uid || !followerId || !followeeId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 2. Follow
    const token = await follow({
      key,
      data: {
        followerId,
        followeeId,
      },
    })

    if (!token) throw new Error("Follow failed.")

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to unfollow.
 */
export async function unFollowProfile(req: Request, res: Response) {
  try {
    const { uid, profileId } = req.params as {
      uid: string
      profileId: string
    }

    if (!uid || !profileId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 2. Unfollow
    await unfollow(key, Number(profileId))

    res.status(200).json({ status: "success" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get number of following.
 */
export async function getFollowing(req: Request, res: Response) {
  try {
    const { profileId } = req.params as {
      profileId: string
    }

    if (!profileId) throw new Error("User input error")

    const count = await getFollowingCount(Number(profileId))

    res.status(200).json({ count })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get number of followers.
 */
export async function getFollowers(req: Request, res: Response) {
  try {
    const { profileId } = req.params as {
      profileId: string
    }

    if (!profileId) throw new Error("User input error")

    const count = await getFollowersCount(Number(profileId))

    res.status(200).json({ count })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get follows by provided ids.
 * @dev token ids array is required and it's length must not more than 40
 */
export async function fetchFollows(req: Request, res: Response) {
  try {
    const { tokenIds } = req.body as { tokenIds: number[] }
    if (tokenIds.length === 0) throw new Error("User input error.")

    const follows = await getFollows(tokenIds)

    res.status(200).json({ tokens: follows })
  } catch (error) {
    res.status(200).json({ tokens: [] })
  }
}

/**
 * The route to estimate gas used to create Follow NFT.
 * @dev see CreateFollowInput
 */
export async function estimateCreateFollowNftGas(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]

    // Check if all required parameters are availble
    if (!uid || !followerId || !followeeId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    const estimatedGas = await estimateCreateFollowGas({
      key,
      data: { followerId, followeeId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
