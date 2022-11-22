import { Request, Response } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  createPublish,
  updatePublish,
  deletePublish,
  likePublish,
  disLikePublish,
  fetchPublish,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  disLikeComment,
  getTokenURI,
  estimateGasForCreatePublishTxn,
  estimateGasForLikePublishTxn,
  estimateGasForLikeCommentTxn,
  getLikeFee,
  getPlatformFee,
  getPlatformOwnerAddress,
  getProfileContractAddress,
  fetchComment,
} from "../lib/PublishNFT"
import { decrypt } from "../lib/kms"
import {
  CreatePublishInput,
  UpdatePublishInput,
  Role,
  CommentInput,
  UpdateCommentInput,
} from "../types"

/**
 * The route to check role.
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
 * The route to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function createPublishNft(req: Request, res: Response) {
  try {
    const { uid } = req
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
    await createPublish({
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

    res.status(200).json({ status: "Ok" })
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
    const { uid } = req
    const {
      tokenId,
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
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
    // If the argument is undefined | null, use the existing data from the database.
    await updatePublish({
      key,
      data: {
        tokenId,
        creatorId,
        imageURI,
        contentURI,
        metadataURI,
        title,
        description: description || "",
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to delete Publish NFT.
 */
export async function deleteUserPublish(req: Request, res: Response) {
  try {
    const { uid } = req
    const { publishId, creatorId } = req.body as {
      publishId: number
      creatorId: number
    }
    // Validate input.
    if (!uid || !publishId || !creatorId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await deletePublish(key, Number(publishId), Number(creatorId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to like a Publish.
 */
export async function likePublishNft(req: Request, res: Response) {
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
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to dislike a Publish.
 */
export async function disLikePublishNft(req: Request, res: Response) {
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
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to create a comment NFT.
 * @dev see CommentInput
 */
export async function createCommentNft(req: Request, res: Response) {
  try {
    const { uid } = req
    const { targetId, creatorId, contentURI } = req.body as CommentInput["data"]
    // Validate input.
    if (!uid || !targetId || !creatorId || !contentURI)
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Create comment
    await createComment({
      key,
      data: {
        targetId,
        creatorId,
        contentURI,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to update a comment NFT.
 * @dev see UpdateCommentInput
 */
export async function updateCommentNft(req: Request, res: Response) {
  try {
    const { uid } = req
    const { tokenId, creatorId, contentURI } =
      req.body as UpdateCommentInput["data"]
    // Validate input.
    if (!uid || !tokenId || !creatorId || !contentURI)
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Create comment
    await updateComment({
      key,
      data: {
        tokenId,
        creatorId,
        contentURI,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to delete Comment NFT.
 */
export async function deleteCommentNft(req: Request, res: Response) {
  try {
    const { uid } = req
    const { commentId, creatorId } = req.body as {
      commentId: number
      creatorId: number
    }
    // Validate input.
    if (!uid || !commentId || !creatorId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await deleteComment(key, Number(commentId), Number(creatorId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to like a Comment.
 */
export async function likeCommentNft(req: Request, res: Response) {
  try {
    const { uid } = req
    const { commentId, profileId } = req.body as {
      commentId: number
      profileId: number
    }
    // Validate input.
    if (!uid || !commentId || !profileId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await likeComment(key, Number(commentId), Number(profileId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to dislike a Comment.
 */
export async function disLikeCommentNft(req: Request, res: Response) {
  try {
    const { uid } = req
    const { commentId, profileId } = req.body as {
      commentId: number
      profileId: number
    }
    // Validate input.
    if (!uid || !commentId || !profileId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await disLikeComment(key, Number(commentId), Number(profileId))

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
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
 * The route to get one comment.
 */
export async function getComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params as { commentId: string }
    // Validate input.
    if (!commentId) throw new Error("User input error.")
    const token = await fetchComment(Number(commentId))

    res.status(200).json({ token })
  } catch (error) {
    res.status(200).json({ token: null })
  }
}

/**
 * The route to get Publish | Comment token uri.
 */
export async function tokenURI(req: Request, res: Response) {
  try {
    const { tokenId } = req.params as { tokenId: string }
    // Validate input.
    if (!tokenId) throw new Error("User input error.")
    const uri = await getTokenURI(Number(tokenId))

    res.status(200).json({ uri })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to estimate gas used to create Publish NFT.
 * @dev see CreatePublishInput
 */
export async function estimateGasCreatePublishNft(req: Request, res: Response) {
  try {
    const { uid } = req
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
    const estimatedGas = await estimateGasForCreatePublishTxn({
      key,
      data: {
        creatorId,
        imageURI,
        contentURI,
        metadataURI,
        title,
        description: description || "",
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

/**
 * The route to estimate gas used to like Publish NFT.
 */
export async function estimateGasLikePublishNft(req: Request, res: Response) {
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
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get the platform owner address.
 */
export async function platformOwner(req: Request, res: Response) {
  try {
    const address = await getPlatformOwnerAddress()

    res.status(200).json({ address })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get the profile contract address.
 */
export async function profileContract(req: Request, res: Response) {
  try {
    const address = await getProfileContractAddress()

    res.status(200).json({ address })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get the like fee.
 */
export async function likeFee(req: Request, res: Response) {
  try {
    const fee = await getLikeFee()

    res.status(200).json({ fee })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get the platform fee.
 */
export async function platformFee(req: Request, res: Response) {
  try {
    const fee = await getPlatformFee()

    res.status(200).json({ fee })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
