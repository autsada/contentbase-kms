import { Request, Response } from "express"
import axios from "axios"

import { generateWallet, generateWalletDev, getBalance } from "../lib/ethers"
import { walletsCollection } from "../config/firebase"
import { createDocWithId, getDocById } from "../lib/firebase"
import type { Wallet, Environment } from "../types"

const badRequestErrMessage = "Bad Request"
const forbiddenErrMessage = "Forbidden"
const { NODE_ENV, API_ACCESS_TOKEN, PUBLIC_API_URL } = process.env
const env = NODE_ENV as Environment

/**
 * @dev The function to generate blockchain wallet.
 * @dev Required user's auth uid
 */
export async function createWallet(req: Request, res: Response) {
  try {
    const { uid } = req
    if (!uid) throw new Error(badRequestErrMessage)

    const walletDoc = await getDocById<Wallet>({
      collectionName: walletsCollection,
      docId: uid,
    })

    // If user already has a wallet.
    if (walletDoc && walletDoc.address && walletDoc.key)
      throw new Error("You already have a wallet")

    const wallet =
      env === "development" ? await generateWalletDev() : await generateWallet()
    // Create a new doc in "wallets" collection.
    await createDocWithId<typeof wallet>({
      collectionName: walletsCollection,
      docId: uid,
      data: {
        address: wallet.address.toLowerCase(),
        key: wallet.key,
      },
    })

    // Create a new account in the public database.
    await axios({
      method: "post",
      url: `${PUBLIC_API_URL}/account/create`,
      headers: {
        authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
      data: {
        address: wallet.address,
        uid,
        accountType: "TRADITIONAL",
      },
    })

    res.status(200).json({ address: wallet.address })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @dev The function to get balance of the wallet
 */
export async function getWalletBalance(req: Request, res: Response) {
  try {
    const { address } = req.params as { address: string }
    const balance = await getBalance(address)

    res.status(200).json({ balance })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
