/**
 * These are handlers for the routes that only allow admin to access.
 * @dev All these route will be used in development only. In production connect to the blockchain directly from the UI.
 */

import type { Request, Response, NextFunction } from "express"

import { updateProfileContract as updateProfileForFollow } from "../lib/followNFT"
import { updateProfileContract as updateProfileForPublish } from "../lib/publishNFT"
import {
  updatePlatformOwner,
  updateProfileContract as updateProfileForLike,
  updatePublishContract as updatePublishForLike,
  updatePlatformFee,
  withdrawFunds,
} from "../lib/likeNFT"
import {
  updateProfileContract as updateProfileForComment,
  updatePublishContract as updatePublishForComment,
} from "../lib/commentNFT"

const { ADMIN_PRIVATE_KEY } = process.env

/**
 * The route to store/update a Profile contract address on the Follow contract.
 */
export async function setProfileForFollow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updateProfileForFollow(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a Profile contract address on the Publish contract.
 */
export async function setProfileForPublish(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updateProfileForPublish(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a platform owner address on the Like contract.
 */
export async function setPlatformOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerAddress } = req.body as {
      ownerAddress: string
    }
    await updatePlatformOwner(ADMIN_PRIVATE_KEY!, ownerAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a Profile contract address on the Like contract.
 */
export async function setProfileForLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updateProfileForLike(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a Publish contract address on the Like contract.
 */
export async function setPublishForLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updatePublishForLike(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a platform fee on the Like contract.
 */
export async function setPlatformFee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { fee } = req.body as {
      fee: number
    }
    await updatePlatformFee(ADMIN_PRIVATE_KEY!, fee)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to withdraw funds to the platform owner from the Like contract.
 */
export async function withdraw(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await withdrawFunds(ADMIN_PRIVATE_KEY!)
    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a Profile contract address on the Comment contract.
 */
export async function setProfileForComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updateProfileForComment(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}

/**
 * The route to store/update a Publish contract address on the Comment contract.
 */
export async function setPublishForComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updatePublishForComment(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    next(error)
  }
}
