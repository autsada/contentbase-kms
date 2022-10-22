import { Request, Response } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  createPublish,
  updatePublish,
  deletePublish,
  fetchMyPublishes,
  fetchPublishes,
  fetchPublish,
  totalPublishesCount,
  estimateCreatePublishGas,
} from "../lib/PublishNFT"
import { decrypt } from "../lib/kms"
import type { CreatePublishInput, UpdatePublishInput } from "../lib/PublishNFT"
import type { CheckRoleParams } from "../types"

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
 * The route to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function createPublishNft(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const {
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    } = req.body as CreatePublishInput["data"]

    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !creatorId ||
      !imageURI ||
      !contentURI ||
      !metadataURI ||
      !title ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory
    )
      throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Create publish
    const token = await createPublish({
      key,
      data: {
        creatorId,
        imageURI,
        contentURI,
        metadataURI,
        title,
        description,
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
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
    const {
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    } = req.body as Omit<UpdatePublishInput["data"], "tokenId">

    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !publishId ||
      !creatorId ||
      !imageURI ||
      !contentURI ||
      !metadataURI ||
      !title ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory
    )
      throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Update publish
    const token = await updatePublish({
      key,
      data: {
        tokenId: Number(publishId),
        creatorId,
        imageURI,
        contentURI,
        metadataURI,
        title,
        description,
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
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

    // Validate input.
    if (!uid || !publishId) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    await deletePublish(key, Number(publishId))

    res.status(200).json({ status: 200 })
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

    // Validate input.
    if (!uid || tokenIds.length === 0) throw new Error("User input error.")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

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

    // Validate input.
    if (tokenIds.length === 0) throw new Error("User input error.")

    const publishes = await fetchPublishes(tokenIds)

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

    // Validate input.
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
 * The route to estimate gas used to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function estimateCreatePublishNftGas(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const {
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    } = req.body as CreatePublishInput["data"]

    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !creatorId ||
      !imageURI ||
      !contentURI ||
      !metadataURI ||
      !title ||
      !description ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory
    )
      throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    const estimatedGas = await estimateCreatePublishGas({
      key,
      data: {
        creatorId,
        imageURI,
        contentURI,
        metadataURI,
        title,
        description,
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
      },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
