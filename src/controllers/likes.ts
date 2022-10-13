import { Request, Response } from "express"

import {
  checkUserRole,
  getLikeFee,
  getPlatformFee,
  like,
  unLike,
  estimateCreateLikeGas,
} from "../lib/LikeNFT"
import { decrypt } from "../lib/kms"
import type { CreateLikeInput } from "../lib/LikeNFT"
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
 * The route to check how much ethers to send when like a Publish.
 */
export async function getLikeRate(req: Request, res: Response) {
  try {
    const fee = await getLikeFee()

    res.status(200).json({ fee })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to check platform fee.
 */
export async function platformFee(req: Request, res: Response) {
  try {
    const fee = await getPlatformFee()

    res.status(200).json({ fee })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to like Publish NTF (and create Like NFT).
 * @dev see CreateLikeInput
 */
export async function likePublish(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { profileId, publishId } = req.body as CreateLikeInput["data"]

    if (!uid || !profileId || !publishId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 2. Like a publish
    const token = await like({
      key,
      data: {
        profileId,
        publishId,
      },
    })

    if (!token) throw new Error("Follow failed.")

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to unlike.
 */
export async function unLikePublish(req: Request, res: Response) {
  try {
    const { uid, likeId } = req.params as {
      uid: string
      likeId: string
    }

    if (!uid || !likeId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 2. Unlike
    const token = await unLike(key, Number(likeId))

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to estimate gas used to create Like NFT.
 * @dev see CreateLikeInput
 */
export async function estimateCreateLikeNftGas(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { profileId, publishId } = req.body as CreateLikeInput["data"]

    // Check if all required parameters are availble
    if (!uid || !profileId || !publishId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    const estimatedGas = await estimateCreateLikeGas({
      key,
      data: { profileId, publishId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
