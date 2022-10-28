import { Request, Response } from "express"

import {
  createDoc,
  deleteDocById,
  getWallet,
  searchDocByField,
  updateDocById,
} from "../lib/firebase"
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
import {
  CheckRoleParams,
  PublishDoc,
  Category,
  CreatePublishInput,
  UpdatePublishInput,
} from "../types"
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
        description: description || "", // use empty string if it's undefined.
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
      },
    })

    if (!token) throw new Error("Create publish failed.")

    // Create a new doc in "publishes" collection.
    await createDoc<Partial<PublishDoc>>({
      collectionName: publishesCollection,
      data: {
        ...token,
        primaryCategory,
        secondaryCategory:
          secondaryCategory === Category.Empty &&
          tertiaryCategory !== Category.Empty
            ? tertiaryCategory
            : secondaryCategory,
        tertiaryCategory:
          secondaryCategory === Category.Empty &&
          tertiaryCategory !== Category.Empty
            ? Category.Empty
            : tertiaryCategory,
        uid,
      },
    })

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

    // Validate required input.
    if (!uid || !publishId || !creatorId) throw new Error("User input error")

    // Check to make sure at least one of the publish data is provided.
    if (
      !imageURI &&
      !contentURI &&
      !metadataURI &&
      !title &&
      !description &&
      !primaryCategory &&
      !secondaryCategory &&
      !tertiaryCategory
    )
      throw new Error("User input error")

    // Find the publish doc in Firestore.
    const publishes = await searchDocByField<PublishDoc>({
      collectionName: publishesCollection,
      fieldName: "tokenId",
      fieldValue: Number(publishId), // Must be a number
    })
    const publish = publishes[0]

    // If doc doesn't exist.
    if (!publish) throw new Error("Bad request")

    // // Throw error if none of the data is changed.
    // if (
    //   publish.imageURI === imageURI &&
    //   publish.contentURI === contentURI &&
    //   publish.metadataURI === metadataURI &&
    //   publish.title === title &&
    //   publish.description === description &&
    //   publish.primaryCategory === primaryCategory &&
    //   publish.secondaryCategory === secondaryCategory &&
    //   publish.tertiaryCategory === tertiaryCategory
    // )
    //   throw new Error("Bad request")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Update publish
    // If the argument is undefined | null, use the existing data from the database.
    const token = await updatePublish({
      key,
      data: {
        tokenId: Number(publishId),
        creatorId,
        imageURI: !imageURI ? publish.imageURI : imageURI,
        contentURI: !contentURI ? publish.contentURI : contentURI,
        metadataURI: !metadataURI ? publish.metadataURI : metadataURI,
        title: !title ? publish.title : title,
        description: !description ? publish.description : description,
        // The primary category cannot be "Empty", so if "Empty" is provided, use the existing data.
        primaryCategory:
          !primaryCategory || primaryCategory === Category.Empty
            ? publish.primaryCategory
            : primaryCategory,
        secondaryCategory: !secondaryCategory
          ? publish.secondaryCategory
          : secondaryCategory,
        tertiaryCategory: !tertiaryCategory
          ? publish.tertiaryCategory
          : tertiaryCategory,
      },
    })

    if (!token) throw new Error("Update publish failed.")

    // Update the publish doc in Firestore.
    await updateDocById({
      collectionName: publishesCollection,
      docId: publish.id,
      data: {
        ...token,
        // If secondary is "Empty" and tertiary is not, then use the tertiary as secondary and make tertiary "Empty".
        secondaryCategory:
          token.secondaryCategory === Category.Empty &&
          token.tertiaryCategory !== Category.Empty
            ? token.tertiaryCategory
            : token.secondaryCategory,
        tertiaryCategory:
          token.secondaryCategory === Category.Empty &&
          token.tertiaryCategory !== Category.Empty
            ? Category.Empty
            : token.tertiaryCategory,
      },
    })

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

    // Find and delete the publish doc in Firestore.
    const publishes = await searchDocByField<PublishDoc>({
      collectionName: publishesCollection,
      fieldName: "tokenId",
      fieldValue: Number(publishId), // Must be a number
    })
    const publish = publishes[0]

    if (publish) {
      await deleteDocById({
        collectionName: publishesCollection,
        docId: publish.id,
      })
    }

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
