import { Request, Response } from "express"

import { generateWallet, getBalance } from "../lib/ethers"
import { walletsCollection } from "../config/firebase"
import { createDocWithId } from "../lib/firebase"

/**
 * @dev The function to generate blockchain wallet.
 * @dev Required user's auth uid
 */
export async function createWallet(req: Request, res: Response) {
  try {
    const { uid } = req.body as { uid: string }
    if (!uid) throw new Error("Bad request")

    const wallet = await generateWallet()

    // Save wallet to Firestore.
    await createDocWithId<typeof wallet>({
      collectionName: walletsCollection,
      docId: uid,
      data: {
        address: wallet.address,
        key: wallet.key,
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
