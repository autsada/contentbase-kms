import { Request, Response } from "express"

import {
  createPublish,
  updatePublish,
  deletePublish,
  fetchMyPublishes,
  fetchPublishes,
  fetchPublish,
  totalPublishesCount,
  getTokenURI,
  estimateCreatePublishGas,
} from "../lib/PublishNFT"
import { decrypt } from "../lib/kms"
import type { CreatePublishInput, UpdatePublishInput } from "../lib/PublishNFT"

/**
 * The route to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function createPublishNft(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { tokenURI, creatorId, imageURI, contentURI } =
      req.body as CreatePublishInput["data"]

    if (!uid || !tokenURI || !creatorId || !imageURI || !contentURI)
      throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 3. Create profile
    const token = await createPublish({
      key,
      data: {
        tokenURI,
        creatorId,
        imageURI,
        contentURI,
      },
    })

    if (!token) throw new Error("Create publish failed.")

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to update Publish NFT.
 * @dev see UpdatePublishInput
 */
export async function updatePublishNft(req: Request, res: Response) {
  try {
    const { uid, publishId } = req.params as {
      uid: string
      publishId: string
    }
    const { tokenURI, creatorId, imageURI, contentURI } =
      req.body as UpdatePublishInput["data"]

    // imageURI can be empty.
    if (!uid || !publishId || !creatorId || !tokenURI)
      throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 3. Update publish
    const token = await updatePublish({
      key,
      data: {
        tokenId: Number(publishId),
        creatorId,
        tokenURI,
        imageURI: imageURI || "",
        contentURI,
      },
    })

    if (!token) throw new Error("Update publish failed.")

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to delete Publish NFT.
 */
export async function deleteUserPublish(req: Request, res: Response) {
  try {
    const { uid, publishId } = req.params as {
      uid: string
      publishId: string
    }

    if (!uid || !publishId) throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    await deletePublish(key, Number(publishId))

    res.status(200)
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get user's publishes.
 * @dev token ids array is required and it's length must not more than 40
 */
export async function getMyPublishes(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { tokenIds } = req.body as { tokenIds: number[] }

    if (!uid || tokenIds.length === 0) throw new Error("User input error.")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    // 2. Get publishes
    const publishes = await fetchMyPublishes(key, tokenIds)

    res.status(200).json({ tokens: publishes })
  } catch (error) {
    res.status(200).json({ tokens: [] })
  }
}

/**
 * The route to get publishes by provided ids.
 * @dev token ids array is required and it's length must not more than 40
 */
export async function getPublishes(req: Request, res: Response) {
  try {
    const { tokenIds } = req.body as { tokenIds: number[] }
    const publishes = await fetchPublishes(tokenIds)

    if (tokenIds.length === 0) throw new Error("User input error.")

    res.status(200).json({ tokens: publishes })
  } catch (error) {
    res.status(200).json({ tokens: [] })
  }
}

/**
 * The route to get one publish.
 */
export async function getPublish(req: Request, res: Response) {
  try {
    const { publishId } = req.params as { publishId: string }

    if (!publishId) throw new Error("User input error.")

    const token = await fetchPublish(Number(publishId))

    res.status(200).json({ token })
  } catch (error) {
    res.status(200).json({ token: null })
  }
}

/**
 * The route to get total publishes count.
 */
export async function totalPublishes(req: Request, res: Response) {
  try {
    const total = await totalPublishesCount()

    res.status(200).json({ total })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get token uri.
 */
export async function fetchTokenURI(req: Request, res: Response) {
  try {
    const { publishId } = req.params as { publishId: string }

    if (!publishId) throw new Error("User input error.")

    const uri = await getTokenURI(Number(publishId))

    res.status(200).json({ uri })
  } catch (error) {
    res.status(200).json({ valid: false })
  }
}

/**
 * The route to estimate gas used to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function estimateCreatePublishNftGas(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { tokenURI, creatorId, imageURI, contentURI } =
      req.body as CreatePublishInput["data"]

    // Check if all required parameters are availble
    if (!uid || !creatorId || !tokenURI || !imageURI || !contentURI)
      throw new Error("User input error")

    // 1. Decrypt the key
    const key = await decrypt(uid)

    const estimatedGas = await estimateCreatePublishGas({
      key,
      data: { creatorId, contentURI, imageURI, tokenURI },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
