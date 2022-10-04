import { Request, Response } from 'express'

import {
  createProfile,
  updateProfile,
  setDefaultProfile,
  verifyHandle,
  fetchMyProfiles,
  getProfileById,
  getDefaultProfile,
  estimateCreateProfileGas,
} from '../lib/contentBaseProfile'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'
import type { CreateProfileInput } from '../lib/contentBaseProfile'

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.data.handle a handle of the user
 * @param req.body.data.imageURI a uri of the profile image
 * @param req.body.data.tokenURI a uri of the token's metadata file
 *
 */
export async function createProfileNft(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { handle, imageURI, tokenURI } =
      req.body as CreateProfileInput['data']

    if (!handle || !key) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Create profile
    const token = await createProfile({
      // key: decryptedKey,
      key,
      data: {
        handle,
        imageURI,
        tokenURI,
      },
    })

    if (!token) throw new Error('Create profile failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.params.profileId an id of the profile
 * @param req.body.data.imageURI a uri of the profile image
 * @param req.body.data.tokenURI a uri of the token's metadata file
 *
 */
export async function updateProfileImage(req: Request, res: Response) {
  try {
    const { profileId, key } = req.params as unknown as {
      profileId: number
      key: string
    }

    const { imageURI, tokenURI } = req.body as {
      imageURI: string
      tokenURI: string
    }

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Update profile
    const token = await updateProfile({
      // key: decryptedKey,
      key,
      data: {
        tokenId: profileId,
        imageURI,
        tokenURI,
      },
    })

    if (!token) throw new Error('Updated profile failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.params.profileId an id of the profile
 *
 */
export async function setProfileAsDefault(req: Request, res: Response) {
  try {
    const { profileId, key } = req.params as unknown as {
      profileId: number
      key: string
    }

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Update profile
    const token = await setDefaultProfile({
      // key: decryptedKey,
      key,
      tokenId: profileId,
    })

    if (!token) throw new Error('Updated profile failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to get user's profiles
 * @dev token ids array is required
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.body.tokenIds an encrypted key of the user saved in Firestore
 *
 */
export async function getMyProfiles(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { tokenIds } = req.body as { tokenIds: number[] }

    if (!key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get profiles
    // const profiles = await fetchMyProfiles(address, decryptedKey)
    const profiles = await fetchMyProfiles(key, tokenIds)

    res.status(200).json({ tokens: profiles })
  } catch (error) {
    console.log('error -->', error)
    // In case NOT FOUND, fetchMyProfiles will throw so it's needed to return 200 - empty array so the process can continue
    res.status(200).json({ tokens: [] })
  }
}

/**
 * A route to get one profile token
 * @dev token id is required
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.params.tokenId an id of the profile token
 *
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const { key, profileId } = req.params as unknown as {
      key: string
      profileId: number
    }

    if (!profileId || !key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get profiles
    // const token = await getProfileById(profileId, decryptedKey)
    const token = await getProfileById(key, profileId)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to get user's default profile
 * @param req.params.key an encrypted key of the user saved in Firestore
 *
 */
export async function getUserDefaultProfile(req: Request, res: Response) {
  try {
    const { key } = req.params as unknown as { key: string }

    if (!key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get profiles
    // const token = await getDefaultProfile(decryptedKey)
    const token = await getDefaultProfile(key)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to validate handle
 * @param req.body.handle a handle
 *
 */
export async function verifyProfileHandle(req: Request, res: Response) {
  try {
    const { handle } = req.body as { handle: string }
    if (!handle) throw new Error('Handle is required.')
    const isHandleUnique = await verifyHandle(handle)

    res.status(200).json({ isHandleUnique })
  } catch (error) {
    res.status(200).json({ isHandleUnique: false })
  }
}

/**
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.body.data.handle a handle of the user
 * @param req.body.data.imageURI a uri of the profile image
 * @param req.body.data.tokenURI a uri of the token's metadata file
 *
 *
 */
export async function estimateCreateProfileNftGas(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { handle, imageURI, tokenURI } =
      req.body as CreateProfileInput['data']

    // Check if all required parameters are availble
    if (!key || !handle) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    const estimatedGas = await estimateCreateProfileGas({
      // key: decryptedKey,
      key,
      data: { handle, imageURI, tokenURI },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
