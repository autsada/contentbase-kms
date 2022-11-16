/**
 * These are handlers for the routes that only allow admin to access.
 * @dev All these route will be used in development only. In production connect to the blockchain directly from the UI.
 */

import { Request, Response } from "express"

import {
  updatePlatformOwner,
  updateProfileContract,
  updateLikeFee,
  updatePlatformFee,
  withdrawFunds,
} from "../lib/PublishNFT"

const { ADMIN_PRIVATE_KEY } = process.env

export async function setPlatformOwner(req: Request, res: Response) {
  try {
    const { ownerAddress } = req.body as {
      ownerAddress: string
    }
    await updatePlatformOwner(ADMIN_PRIVATE_KEY!, ownerAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to store/update a profile contract address on the publish contract.
 */
export async function setProfileContract(req: Request, res: Response) {
  try {
    const { contractAddress } = req.body as {
      contractAddress: string
    }
    await updateProfileContract(ADMIN_PRIVATE_KEY!, contractAddress)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to store/update a like fee on the publish contract.
 */
export async function setLikeFee(req: Request, res: Response) {
  try {
    const { fee } = req.body as {
      fee: number
    }
    await updateLikeFee(ADMIN_PRIVATE_KEY!, fee)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to store/update a platform fee on the publish contract.
 */
export async function setPlatformFee(req: Request, res: Response) {
  try {
    const { fee } = req.body as {
      fee: number
    }
    await updatePlatformFee(ADMIN_PRIVATE_KEY!, fee)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to withdraw funds.
 */
export async function withdraw(req: Request, res: Response) {
  try {
    await withdrawFunds(ADMIN_PRIVATE_KEY!)
    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
