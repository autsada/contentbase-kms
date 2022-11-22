import { Request, Response } from "express"

import { generateWallet, getBalance } from "../lib/ethers"
import { walletsCollection, accountsCollection } from "../config/firebase"
import { createDocWithId, getDocById } from "../lib/firebase"
import type { Account, Wallet } from "../types"

const badRequestErrMessage = "Bad Request"
const forbiddenErrMessage = "Forbidden"

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

    const wallet = await generateWallet()
    // Create a new doc in "wallets" collection.
    await createDocWithId<typeof wallet>({
      collectionName: walletsCollection,
      docId: uid,
      data: {
        address: wallet.address.toLowerCase(),
        key: wallet.key,
      },
    })

    // // Create a new doc (or update if it already exists) in "accounts" colleciton
    // await createDocWithId<Partial<Account>>({
    //   collectionName: accountsCollection,
    //   docId: uid,
    //   data: {
    //     address: wallet.address.toLowerCase(),
    //     type: "traditional",
    //   },
    // })

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
