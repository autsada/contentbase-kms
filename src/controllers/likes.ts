import { Request, Response } from "express"

import { getWallet, searchDocByField, updateDocById } from "../lib/firebase"
import {
  checkUserRole,
  getLikeFee,
  getPlatformFee,
  like,
  unLike,
  estimateCreateLikeGas,
} from "../lib/LikeNFT"
import { decrypt } from "../lib/kms"
import type { CheckRoleParams, CreateLikeInput, PublishDoc } from "../types"
import { publishesCollection } from "../config/firebase"

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

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Like a publish
    const token = await like({
      key,
      data: {
        profileId,
        publishId,
      },
    })

    if (!token) throw new Error("Like failed.")

    // // Create a new doc in "likes" colletion in Firestore.
    // await createDoc<Partial<LikeDoc>>({
    //   collectionName: likesCollection,
    //   data: {
    //     ...token,
    //     uid,
    //   },
    // })

    // Update the publish doc (increase likes) in Firestore.
    // Find the publish doc in Firestore.
    const publishes = await searchDocByField<PublishDoc>({
      collectionName: publishesCollection,
      fieldName: "tokenId",
      fieldValue: Number(publishId), // Must be a number
    })
    const publish = publishes[0]

    if (publish) {
      await updateDocById<Partial<PublishDoc>>({
        collectionName: publishesCollection,
        docId: publish.id,
        data: {
          likes: publish.likes + 1,
        },
      })
    }

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
    const { uid, tokenId } = req.params as {
      uid: string
      tokenId: string
    }

    if (!uid || !tokenId) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Unlike
    const token = await unLike(key, Number(tokenId))

    if (!token) throw new Error("Unlike failed")

    // // Find and delete the like doc in Firestore.
    // const likes = await searchDocByField<LikeDoc>({
    //   collectionName: likesCollection,
    //   fieldName: "tokenId",
    //   fieldValue: Number(tokenId), // Must be a number
    // })
    // const like = likes[0]

    // if (like) {
    //   await deleteDocById({
    //     collectionName: likesCollection,
    //     docId: like.id,
    //   })
    // }

    // Update the publish doc (decrease likes) in Firestore.
    // Find the publish doc in Firestore.
    const publishes = await searchDocByField<PublishDoc>({
      collectionName: publishesCollection,
      fieldName: "tokenId",
      fieldValue: Number(token.publishId), // Must be a number
    })
    const publish = publishes[0]

    if (publish) {
      await updateDocById<Partial<PublishDoc>>({
        collectionName: publishesCollection,
        docId: publish.id,
        data: {
          likes: publish.likes - 1,
        },
      })
    }

    res.status(200).json({ status: 200 })
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

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    const estimatedGas = await estimateCreateLikeGas({
      key,
      data: { profileId, publishId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
