import { Request, Response } from 'express'

import {
  getTotalNFTsCount,
  getTokenURI,
  checkUserRole,
  Role,
  burnToken,
} from '../lib/contentBase'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'

/**
 * @param req.body.role user's role
 * @param req.body.address user's blockchain address
 * @param req.body.key blockchain address's encrypted key
 *
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { role, address } = req.body as {
      role: Role
      address: string
    }
    if (!role || !address || !key) throw new Error('User input error')
    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // const hasRole = await checkUserRole({ role, address, key: decryptedKey })
    const hasRole = await checkUserRole({ role, address, key })

    res.status(200).json({ hasRole })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @dev Get total NFTs count of the contract
 *
 */
export async function getTokensCount(req: Request, res: Response) {
  try {
    const tokensCount = await getTotalNFTsCount()

    res.status(200).json({ tokensCount })
  } catch (error) {
    console.log('error -->', error)
    res.status(500).send((error as any).message)
  }
}

/**
 * @dev Get tokenURI of a specific NFT
 * @param req.tokenId {number} - a token id
 *
 */
export async function tokenURI(req: Request, res: Response) {
  try {
    const { tokenId } = req.params as unknown as { tokenId: number }

    const uri = await getTokenURI(tokenId)

    res.status(200).json({ tokenURI: uri })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @dev Get tokenURI of a specific NFT
 * @param req.tokenId {number} - a token id
 *
 */
export async function burnNFT(req: Request, res: Response) {
  try {
    const { tokenId, key } = req.params as unknown as {
      tokenId: number
      key: string
    }

    if (!tokenId || !key) throw new Error('User input error')
    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // await burnToken(tokenId, decryptedKey)
    await burnToken(key, tokenId)

    res.status(200).json({ status: 'Ok' })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
