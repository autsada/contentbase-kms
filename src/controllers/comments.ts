import type { Request, Response, NextFunction } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  commentOnPublish,
  commentOnComment,
  updateComment,
  deleteComment,
  likeComment,
  disLikeComment,
  fetchComment,
  getProfileContractAddress,
  getPublishContractAddress,
} from "../lib/commentNFT"
import { decrypt } from "../lib/kms"
import { Role, CommentInput, UpdateCommentInput } from "../types"

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
 * The route to comment on a publish.
 * @dev see CommentOnPublishInput
 */
export async function commentPublish(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { parentId, creatorId, text } = req.body as CommentInput["data"]
    // Validate input.
    if (!uid || !parentId || !creatorId || !text)
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Make a comment
    await commentOnPublish({
      key,
      data: {
        parentId,
        creatorId,
        text,
      },
    })

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to comment on a comment.
 * @dev see CommentOnCommentInput
 */
export async function commentComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { parentId, creatorId, text } = req.body as CommentInput["data"]
    // Validate input.
    if (!uid || !parentId || !creatorId || !text)
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Make a comment
    await commentOnComment({
      key,
      data: {
        parentId,
        creatorId,
        text,
      },
    })

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to update a comment.
 * @dev see UpdateCommentInput
 */
export async function updateCommentNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { tokenId, creatorId, text } = req.body as UpdateCommentInput["data"]
    // Validate input.
    if (!uid || !tokenId || !creatorId || !text)
      throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Create comment
    await updateComment({
      key,
      data: {
        tokenId,
        creatorId,
        text,
      },
    })

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to delete a comment.
 */
export async function deleteCommentNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    const { commentId, creatorId } = req.body as {
      commentId: number
      creatorId: number
    }
    // Validate input.
    if (!uid || !commentId || !creatorId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    await deleteComment(key, Number(commentId), Number(creatorId))

    // TODO: add a check to verify if the address owns the given `creatorId`. To do so we need to query a profile by `creatorId` from the public APIs and compare the profile's address with the address above.

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to like a comment.
 */
export async function likeCommentNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    next(error)
  }
}

/**
 * The route to dislike a comment.
 */
export async function disLikeCommentNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    next(error)
  }
}

/**
 * The route to get one comment.
 */
export async function getComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

/**
 * The route to get the publish contract address.
 */
export async function getPublishContract(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = await getPublishContractAddress()

    res.status(200).json({ address })
  } catch (error) {
    next(error)
  }
}
