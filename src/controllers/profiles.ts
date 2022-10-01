import { Request, Response } from 'express'

import {
  createProfile,
  updateProfile,
  setDefaultProfile,
  verifyHandle,
  fetchMyProfiles,
  getProfileById,
  estimateCreateProfileGas,
} from '../lib/contentBaseProfile'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'
import type {
  CreateProfileInput,
  UpdateProfileImageInput,
} from '../lib/contentBaseProfile'

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
 * @param req.params.key an encrypted key of the user saved in Firestore
 * @param req.params.address an address that own profiles
 *
 */
export async function getProfilesByAddress(req: Request, res: Response) {
  try {
    const { address, key } = req.params as { address: string; key: string }

    if (!address || !key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get profiles
    // const profiles = await fetchMyProfiles(address, decryptedKey)
    const profiles = await fetchMyProfiles(address, key)

    res.status(200).json({ profiles })
  } catch (error) {
    // In case NOT FOUND, fetchMyProfiles will throw so it's needed to return 200 - empty array so the process can continue
    res.status(200).json({ profiles: [] })
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.profileId an id of the profile
 *
 */
export async function getOneProfile(req: Request, res: Response) {
  try {
    const { profileId, key } = req.params as unknown as {
      profileId: number
      key: string
    }

    if (!profileId || !key) throw new Error('User input error.')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // // 3. Get profiles
    // const profile = await getProfileById(profileId, decryptedKey)
    const profile = await getProfileById(profileId, key)

    res.status(200).json({ profile })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.data.handle a handle of the user
 * @param req.body.data.imageURI a uri of the profile image
 * @param req.body.data.tokenURI a uri of the token's metadata file
 *
 */
export async function createProfileNft(req: Request, res: Response) {
  try {
    const {
      key,
      data: { handle, imageURI, tokenURI },
    } = req.body as CreateProfileInput

    if (!handle || !key) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Create profile
    const { profileId, isDefault } = await createProfile({
      // key: decryptedKey,
      key,
      data: {
        handle,
        imageURI,
        tokenURI,
      },
    })

    if (!profileId) throw new Error('Create profile failed.')

    res.status(200).json({ profileId, isDefault })
  } catch (error) {
    console.log('error -->', error)
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
    const updatedProfileId = await updateProfile({
      // key: decryptedKey,
      key,
      data: {
        profileId,
        imageURI,
        tokenURI,
      },
    })

    if (!updatedProfileId) throw new Error('Updated profile failed.')

    res.status(200).json({ profileId: updatedProfileId })
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
    const updatedProfileId = await setDefaultProfile({
      // key: decryptedKey,
      key,
      profileId,
    })

    if (!updatedProfileId) throw new Error('Updated profile failed.')

    res.status(200).json({ profileId: updatedProfileId })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * @param req.body.key an encrypted key of the user saved in Firestore
 * @param req.body.data.handle a handle of the user
 * @param req.body.data.imageURI a uri of the profile image
 * @param req.body.data.tokenURI a uri of the token's metadata file
 *
 *
 */
export async function estimateCreateProfileNftGas(req: Request, res: Response) {
  try {
    const {
      key,
      data: { handle, imageURI, tokenURI },
    } = req.body as CreateProfileInput

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
