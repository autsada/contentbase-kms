import type { Request, Response, NextFunction } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  createPublish,
  updatePublish,
  deletePublish,
  fetchPublish,
  getTokenURI,
  estimateGasForCreatePublishTxn,
  getProfileContractAddress,
} from "../lib/publishNFT"
import { decrypt } from "../lib/kms"
import { CreatePublishInput, UpdatePublishInput, Role } from "../types"

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
 * The route to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function createPublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const {
      creatorId,
      contentURI,
      contentRef,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      kind,
    } = req.body as CreatePublishInput["data"]
    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !creatorId ||
      !contentURI ||
      !contentRef ||
      !title ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory ||
      !kind
    )
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Create publish
    await createPublish({
      key,
      data: {
        creatorId,
        contentURI,
        contentRef,
        title,
        description: description || "", // use empty string if it's undefined.
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
        kind,
      },
    })

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to update Publish NFT.
 * @dev see UpdatePublishInput
 */
export async function updatePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const {
      tokenId,
      creatorId,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    } = req.body as UpdatePublishInput["data"]
    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !tokenId ||
      !creatorId ||
      !title ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory
    )
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Update publish
    // If the argument is undefined | null, use the existing data from the database.
    await updatePublish({
      key,
      data: {
        tokenId,
        creatorId,
        title,
        description: description || "",
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
      },
    })

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to delete Publish NFT.
 */
export async function deletePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { publishId, creatorId } = req.body as {
      publishId: number
      creatorId: number
    }
    // Validate input.
    if (!uid || !publishId || !creatorId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await deletePublish(key, Number(publishId), Number(creatorId))

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to get one publish.
 */
export async function getPublish(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
 * The route to get Publish | Comment token uri.
 */
export async function tokenURI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { tokenId } = req.params as { tokenId: string }
    // Validate input.
    if (!tokenId) throw new Error("User input error.")
    const uri = await getTokenURI(Number(tokenId))

    res.status(200).json({ uri })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to estimate gas used to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function estimateGasCreatePublishNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const {
      creatorId,
      contentURI,
      contentRef,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      kind,
    } = req.body as CreatePublishInput["data"]
    // Validate input.
    // description can be empty.
    if (
      !uid ||
      !creatorId ||
      !contentURI ||
      !contentRef ||
      !title ||
      !primaryCategory ||
      !secondaryCategory ||
      !tertiaryCategory ||
      !kind
    )
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const estimatedGas = await estimateGasForCreatePublishTxn({
      key,
      data: {
        creatorId,
        contentURI,
        contentRef,
        title,
        description: description || "",
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
        kind,
      },
    })

    res.status(200).json({ gas: estimatedGas })
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
