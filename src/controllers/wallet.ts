import { Request, Response } from 'express'

import { generateWallet, getBalance } from '../lib/ethers'

/**
 * @dev The function to generate blockchain wallet
 */
export async function createWallet(req: Request, res: Response) {
  try {
    const wallet = await generateWallet()

    res.status(200).json({ ...wallet })
  } catch (error) {
    res.status(500).send(`Error occurred`)
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
    res.status(500).send(`Error occurred`)
  }
}
