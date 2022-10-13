import { Request, Response } from 'express'

import {
  createPublish,
  updatePublish,
  fetchMyPublishes,
  fetchPublishes,
  fetchPublish,
} from '../lib/PublishNFT'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'
import type { CreatePublishInput, UpdatePublishInput } from '../lib/PublishNFT'

/**
 * @param req.params.key an encrypted key of the user's wallet
 * @param req.body.tokenURI a uri of the token's metadata file
 * @param req.body.profileId a token id of user's profile
 * @param req.body.imageURI a uri of the publish's thumbnail image
 * @param req.body.contentURI a uri of the publish's content
 *
 */
export async function createPublishNft(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { tokenURI, profileId, imageURI, contentURI } =
      req.body as CreatePublishInput['data']

    if (!key || !tokenURI || !profileId || !imageURI || !contentURI)
      throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Create profile
    const token = await createPublish({
      // key: decryptedKey,
      key,
      data: {
        tokenURI,
        profileId,
        imageURI,
        contentURI,
      },
    })

    if (!token) throw new Error('Create publish failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.params.key an encrypted key of the user's wallet
 * @param req.params.publishId a token id of the publish to be updated
 * @param req.body.tokenURI a uri of the token's metadata file
 * @param req.body.imageURI a uri of the publish's thumbnail image, can be empty
 * @param req.body.contentURI a uri of the publish's content, can be empty
 *
 */
export async function updatePublishNft(req: Request, res: Response) {
  try {
    const { key, publishId } = req.params as unknown as {
      key: string
      publishId: number
    }
    const { tokenURI, imageURI, contentURI } =
      req.body as UpdatePublishInput['data']

    if (!key || !publishId || !tokenURI) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Update publish
    const token = await updatePublish({
      // key: decryptedKey,
      key,
      data: {
        tokenId: publishId,
        tokenURI,
        imageURI: imageURI || '',
        contentURI: contentURI || '',
      },
    })

    if (!token) throw new Error('Update publish failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to get user's publishes
 * @dev token ids array is required and it's length must not more than 40
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.body.tokenIds a publish token ids array
 *
 */
export async function getMyPublishes(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { tokenIds } = req.body as { tokenIds: number[] }

    if (!key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get publishes
    // const publishes = await fetchMyPublishes(address, decryptedKey)
    const publishes = await fetchMyPublishes(key, tokenIds)

    res.status(200).json({ tokens: publishes })
  } catch (error) {
    res.status(200).json({ tokens: [] })
  }
}

/**
 * A route to get publishes
 * @dev token ids array is required and it's length must not more than 40
 * @param req.body.tokenIds a publish token ids array
 *
 */
export async function getPublishes(req: Request, res: Response) {
  try {
    const { tokenIds } = req.body as { tokenIds: number[] }
    const publishes = await fetchPublishes(tokenIds)

    res.status(200).json({ tokens: publishes })
  } catch (error) {
    res.status(200).json({ tokens: [] })
  }
}

/**
 * A route to get publishes
 * @param req.params.tokenId a publish token id
 *
 */
export async function getPublish(req: Request, res: Response) {
  try {
    const { publishId } = req.params as unknown as { publishId: number }
    const token = await fetchPublish(publishId)

    res.status(200).json({ token })
  } catch (error) {
    res.status(200).json({ token: null })
  }
}
