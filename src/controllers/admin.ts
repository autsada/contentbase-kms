/**
 * These are handlers for the routes that only allow admin to access.
 * @dev All these route will be used in development only. In production connect to the blockchain directly from the UI.
 */

import { Request, Response } from "express"

import { setFollowContract as setFollowContractForProfileContract } from "../lib/ProfileNFT"
import {
  setProfileContract as setProfileContractForPublishContract,
  setLikeContract as setLikeContractForPublishContract,
} from "../lib/PublishNFT"
import { setProfileContract as setProfileContractForFollowContract } from "../lib/FollowNFT"
import {
  setProfileContract as setProfileContractForLikeContract,
  setPublishContract as setPublishContractForLikeContract,
  setOwnerAddress,
  getOwnerAddress,
  withdraw,
  setLikeFee,
  setPlatformFee,
  getContractBalance,
} from "../lib/LikeNFT"

const { ADMIN_PRIVATE_KEY } = process.env

export async function setFollowContractOnProfileContract(
  req: Request,
  res: Response
) {
  try {
    const { followContractAddress } = req.body as {
      followContractAddress: string
    }
    await setFollowContractForProfileContract(
      ADMIN_PRIVATE_KEY!,
      followContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set Profile contract interface in the Publish contract.
 */
export async function setProfileContractOnPublishContract(
  req: Request,
  res: Response
) {
  try {
    const { profileContractAddress } = req.body as {
      profileContractAddress: string
    }
    await setProfileContractForPublishContract(
      ADMIN_PRIVATE_KEY!,
      profileContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set Like contract interface in the Publish contract.
 */
export async function setLikeContractOnPublishContract(
  req: Request,
  res: Response
) {
  try {
    const { likeContractAddress } = req.body as {
      likeContractAddress: string
    }
    await setLikeContractForPublishContract(
      ADMIN_PRIVATE_KEY!,
      likeContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set Profile contract interface in the Publish contract.
 */
export async function setProfileContractOnFollowContract(
  req: Request,
  res: Response
) {
  try {
    const { profileContractAddress } = req.body as {
      profileContractAddress: string
    }
    await setProfileContractForFollowContract(
      ADMIN_PRIVATE_KEY!,
      profileContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set Profile contract interface in the Like contract.
 */
export async function setProfileContractOnLikeContract(
  req: Request,
  res: Response
) {
  try {
    const { profileContractAddress } = req.body as {
      profileContractAddress: string
    }
    await setProfileContractForLikeContract(
      ADMIN_PRIVATE_KEY!,
      profileContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set Publish contract interface in the Like contract.
 */
export async function setPublishContractOnLikeContract(
  req: Request,
  res: Response
) {
  try {
    const { publishContractAddress } = req.body as {
      publishContractAddress: string
    }
    await setPublishContractForLikeContract(
      ADMIN_PRIVATE_KEY!,
      publishContractAddress
    )

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to platform owner address in the Like contract.
 */
export async function setPlatformOwnerAddress(req: Request, res: Response) {
  try {
    const { ownerAddress } = req.body as {
      ownerAddress: string
    }
    await setOwnerAddress(ADMIN_PRIVATE_KEY!, ownerAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to withdraw funds from the Like contract.
 */
export async function withdrawFunds(req: Request, res: Response) {
  try {
    await withdraw(ADMIN_PRIVATE_KEY!)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set like fee.
 */
export async function setLikeSupportFee(req: Request, res: Response) {
  try {
    const { fee } = req.body as { fee: number }

    await setLikeFee(ADMIN_PRIVATE_KEY!, fee)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to set platform fee.
 */
export async function setFeeForPlatform(req: Request, res: Response) {
  try {
    const { fee } = req.body as { fee: number }

    await setPlatformFee(ADMIN_PRIVATE_KEY!, fee)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get contract owner address stored on the Like contract.
 */
export async function fetchOwnerAddress(req: Request, res: Response) {
  try {
    const address = await getOwnerAddress(ADMIN_PRIVATE_KEY!)

    res.status(200).json({ address })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get contract balance of the Like contract.
 */
export async function fetchContractBalance(req: Request, res: Response) {
  try {
    const balance = await getContractBalance(ADMIN_PRIVATE_KEY!)

    res.status(200).json({ balance })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
