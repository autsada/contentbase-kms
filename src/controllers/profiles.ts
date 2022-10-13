import { Request, Response } from 'express'

import {
  checkUserRole,
  createProfile,
  updateProfile,
  setDefaultProfile,
  fetchMyProfiles,
  getDefaultProfile,
  getProfileById,
  totalProfilesCount,
  verifyHandle,
  estimateCreateProfileGas,
} from '../lib/ProfileNFT'
import { decrypt } from '../lib/kms'
import { decryptString } from '../lib/utils'
import type {
  CreateProfileInput,
  UpdateProfileImageInput,
} from '../lib/ProfileNFT'
import type { CheckRoleParams } from '../types'

/**
 * The route to check role.
 * @dev see CheckRoleParams
 * key received in params
 * other values received in body
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { role, address } = req.body as Pick<
      CheckRoleParams,
      'role' | 'address'
    >

    if (!key || !role || !address) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    const hasRole = await checkUserRole({ key, role, address })

    res.status(200).json({ hasRole })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to create Profile NFT.
 * @dev see CreateProfileInput
 * key received in params
 * other values receive in body
 */
export async function createProfileNft(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { handle, imageURI, tokenURI } =
      req.body as CreateProfileInput['data']

    // imageURI can be empty.
    if (!key || !handle || !tokenURI) throw new Error('User input error')

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
 * The route to update profile's image.
 * @dev see UpdateProfileImageInput
 */
export async function updateProfileImage(req: Request, res: Response) {
  try {
    const { profileId, key } = req.params as {
      profileId: string
      key: string
    }

    const { imageURI, tokenURI } = req.body as Pick<
      UpdateProfileImageInput['data'],
      'imageURI' | 'tokenURI'
    >

    // imageURI can be empty.
    if (!key || !profileId || !tokenURI) throw new Error('User input error')

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
        tokenId: Number(profileId),
        imageURI: imageURI || '',
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
 * The route to set default profile.
 * key, profileId received in params
 */
export async function setProfileAsDefault(req: Request, res: Response) {
  try {
    const { profileId, key } = req.params as {
      profileId: string
      key: string
    }

    if (!key || !profileId) throw new Error('User input error')

    // // 1. Decrypt the key
    // const kmsDecryptedKey = await decrypt(key)
    // if (!kmsDecryptedKey) throw new Error('Forbidden')

    // // 2. Decrypt the kms decrypted string
    // const decryptedKey = decryptString(kmsDecryptedKey)

    // 3. Update profile
    // const token = await setDefaultProfile(decryptedKey, Number(profileId))
    const token = await setDefaultProfile(key, Number(profileId))

    if (!token) throw new Error('Updated profile failed.')

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get user's profiles.
 * @dev token ids array is required
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
    // const tokens = await fetchMyProfiles(decryptedKey, tokenIds)
    const tokens = await fetchMyProfiles(key, tokenIds)

    res.status(200).json({ tokens })
  } catch (error) {
    // In case NOT FOUND, fetchMyProfiles will throw so it's needed to return 200 - empty array so the process can continue.
    res.status(200).json({ tokens: [] })
  }
}

/**
 * The route to get user's default profile.
 */
export async function getUserDefaultProfile(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }

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
    // In case NOT FOUND, getDefaultProfile will throw, it's needed to return 200 so the process can continue.
    res.status(200).json({ token: null })
    // res.status(500).send((error as any).message)
  }
}

/**
 * The route to get a profile by provided id.
 * @dev token id is required
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const { profileId } = req.params as { profileId: string }

    if (!profileId) throw new Error('User input error.')

    const token = await getProfileById(Number(profileId))

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get total profiles count.
 */
export async function totalProfiles(req: Request, res: Response) {
  try {
    const total = await totalProfilesCount()

    res.status(200).json({ total })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to validate handle.
 * @dev handle is required
 *
 */
export async function verifyProfileHandle(req: Request, res: Response) {
  try {
    const { handle } = req.body as { handle: string }
    if (!handle) throw new Error('Handle is required.')
    const valid = await verifyHandle(handle)

    res.status(200).json({ valid })
  } catch (error) {
    res.status(200).json({ valid: false })
  }
}

/**
 * The route to estimate gas used to create Profile NFT.
 * @dev see CreateProfileInput
 * key received in params
 * other values receive in body
 */
export async function estimateCreateProfileNftGas(req: Request, res: Response) {
  try {
    const { key } = req.params as { key: string }
    const { handle, imageURI, tokenURI } =
      req.body as CreateProfileInput['data']

    // Check if all required parameters are availble
    if (!key || !handle || !tokenURI) throw new Error('User input error')

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
