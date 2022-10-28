import { Request, Response } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  follow,
  unfollow,
  getFollows,
  estimateCreateFollowGas,
} from "../lib/FollowNFT"
import { decrypt } from "../lib/kms"
import type { CheckRoleParams, CreateFollowInput } from "../types"

/**
 * The route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { uid } = req.params
    const { role } = req.body as Pick<CheckRoleParams, "role">

    if (!role) throw new Error("User input error")

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
 * The route to follow other Profile (and create Follow NFT).
 * @dev see CreateFollowInput
 */
export async function followProfile(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]

    // Validate input.
    if (
      !uid ||
      typeof followerId !== "number" ||
      !followerId ||
      typeof followeeId !== "number" ||
      !followeeId
    )
      throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Follow
    const token = await follow({
      key,
      data: {
        followerId,
        followeeId,
      },
    })

    if (!token) throw new Error("Follow failed.")

    // // Create a new doc in "follows" collection in Firestore.
    // await createDoc<Partial<FollowDoc>>({
    //   collectionName: followsCollection,
    //   data: {
    //     ...token,
    //     uid,
    //   },
    // })

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
    const { uid, tokenId } = req.params as {
      uid: string
      tokenId: string
    }

    if (!uid || !tokenId) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Unfollow
    await unfollow(key, Number(tokenId))

    // // Find and delete the follow doc in Firestore.
    // const follows = await searchDocByField<FollowDoc>({
    //   collectionName: followsCollection,
    //   fieldName: "tokenId",
    //   fieldValue: Number(tokenId), // Must be a number
    // })
    // const follow = follows[0]

    // if (follow) {
    //   await deleteDocById({
    //     collectionName: followsCollection,
    //     docId: follow.id,
    //   })
    // }

    res.status(200).json({ status: 200 })
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

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    const estimatedGas = await estimateCreateFollowGas({
      key,
      data: { followerId, followeeId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
