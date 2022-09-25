import { Request, Response } from 'express'

import {
  createProfile,
  verifyHandle,
  getTotalProfilesCount,
  fetchMyProfiles,
  checkUserRole,
  Role,
  estimateCreateProfileGas,
} from '../lib/contentBaseProfileContract'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'
import type { CreateProfileInput } from '../lib/contentBaseProfileContract'

/**
 * @param req.body.handle a handle of the user
 *
 */
export async function verifyProfileHandle(req: Request, res: Response) {
  try {
    const { handle } = req.body as {
      handle: string
    }
    if (!handle) throw new Error('Handle is required.')
    const isHandleUnique = await verifyHandle(handle)

    res.status(200).json({ isHandleUnique })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @dev Get total profiles count of the contract
 *
 */
export async function getProfilesCount(req: Request, res: Response) {
  try {
    const profilesCount = await getTotalProfilesCount()

    res.status(200).json({ profilesCount })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.address an address that own profiles
 *
 */
export async function getProfilesByAddress(req: Request, res: Response) {
  try {
    const { address, key } = req.params as { address: string; key: string }

    if (!address || !key) throw new Error('User input error.')

    // 1. Decrypt the key
    const kmsDecryptedKey = await decrypt(key)
    if (!kmsDecryptedKey) throw new Error('Forbidden')

    // 2. Decrypt the kms decrypted string
    const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Get profiles
    const profiles = await fetchMyProfiles(address, decryptedKey)

    res.status(200).json({ profiles })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.uid an auth uid of the user
 * @param req.body.handle a handle of the user
 * @param req.body.imageURL a imageURL
 * @param req.body.isDefault whether or not the profile is default
 *
 */
export async function createProfileNft(req: Request, res: Response) {
  try {
    const {
      key,
      data: { uid, handle, imageURI1, imageURI2, isDefault },
    } = req.body as CreateProfileInput

    if (!handle || !key || !uid || typeof isDefault !== 'boolean')
      throw new Error('User input error')

    // 1. Decrypt the key
    const kmsDecryptedKey = await decrypt(key)
    if (!kmsDecryptedKey) throw new Error('Forbidden')

    // 2. Decrypt the kms decrypted string
    const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Create profile
    const profileId = await createProfile({
      key: decryptedKey,
      data: {
        uid,
        handle,
        imageURI1,
        imageURI2,
        isDefault,
      },
    })

    console.log('created id -->', profileId)
    if (!profileId) throw new Error('Create profile failed.')

    res.status(200).json({ profileId })
  } catch (error) {
    console.log('create profile error -->', error)
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.role user's role
 * @param req.body.address user's blockchain address
 * @param req.body.key blockchain address's encrypted key
 *
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { role, address, key } = req.body as {
      role: Role
      address: string
      key: string
    }
    if (!role || !address || !key) throw new Error('User input error')
    // 1. Decrypt the key
    const kmsDecryptedKey = await decrypt(key)
    if (!kmsDecryptedKey) throw new Error('Forbidden')

    // 2. Decrypt the kms decrypted string
    const decryptedKey = decryptString(kmsDecryptedKey)

    const hasRole = await checkUserRole({ role, address, key: decryptedKey })

    res.status(200).json({ hasRole })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.params.key user's wallet encrypted key
 * @param req.body.uid an auth uid of the user
 * @param req.body.handle a handle of the user
 * @param req.body.imageURL a imageURL
 * @param req.body.isDefault whether or not the profile is default
 *
 */
export async function estimateCreateProfileNftGas(req: Request, res: Response) {
  try {
    const {
      key,
      data: { uid, handle, imageURI1, imageURI2, isDefault },
    } = req.body as CreateProfileInput

    // Check if all required parameters are availble
    if (!key || !uid || !handle || typeof isDefault !== 'boolean')
      throw new Error('User input error')

    // 1. Decrypt the key
    const kmsDecryptedKey = await decrypt(key)
    if (!kmsDecryptedKey) throw new Error('Forbidden')

    // 2. Decrypt the kms decrypted string
    const decryptedKey = decryptString(kmsDecryptedKey)

    const estimatedGas = await estimateCreateProfileGas({
      key: decryptedKey,
      data: { uid, handle, imageURI1, imageURI2, isDefault },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
