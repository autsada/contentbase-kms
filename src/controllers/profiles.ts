import { Request, Response } from "express"

import { profilesCollection } from "../config/firebase"
import {
  getWallet,
  createDoc,
  searchDocByField,
  updateDocById,
} from "../lib/firebase"
import {
  checkUserRole,
  createProfile,
  updateProfile,
  setDefaultProfile,
  getDefaultProfile,
  verifyHandle,
  estimateCreateProfileGas,
} from "../lib/ProfileNFT"
import { decrypt } from "../lib/kms"
import {
  CreateProfileInput,
  UpdateProfileImageInput,
  CheckRoleParams,
  ProfileDoc,
} from "../types"

/**
 * The route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { uid } = req.params
    const { role } = req.body as Pick<CheckRoleParams, "role">

    if (!role) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey, address } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    const hasRole = await checkUserRole({ key, role, address })

    res.status(200).json({ hasRole })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to create Profile NFT.
 * @dev see CreateProfileInput
 */
export async function createProfileNft(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { handle, imageURI } = req.body as CreateProfileInput["data"]

    // Validate input.
    // imageURI can be empty.
    if (!uid || !handle) throw new Error("User input error")

    // Validate handle.
    // Make sure to lowercase the handle.
    const lowercasedHandle = handle.toLocaleLowerCase()
    const valid = await verifyHandle(lowercasedHandle)

    if (!valid) throw new Error("Handle is taken or invalid")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 3. Create profile
    const token = await createProfile({
      key,
      data: {
        handle: lowercasedHandle,
        imageURI,
      },
    })

    if (!token) throw new Error("Create profile failed.")

    // Create a new doc in "profiles" collection in Firestore.
    await createDoc<Partial<ProfileDoc>>({
      collectionName: profilesCollection,
      data: {
        ...token,
        uid,
        displayedHandle: handle, // also save the unlowercased handle.
      },
    })

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
    const { profileId, uid } = req.params as {
      profileId: string
      uid: string
    }

    const { imageURI } = req.body as Pick<
      UpdateProfileImageInput["data"],
      "imageURI"
    >

    // Validate input.
    if (!uid || !profileId || !imageURI) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 3. Update profile
    const token = await updateProfile({
      key,
      data: {
        tokenId: Number(profileId),
        imageURI,
      },
    })

    if (!token) throw new Error("Updated profile failed.")

    // Find and update a profile doc in Firestore.
    const docs = await searchDocByField<ProfileDoc>({
      collectionName: profilesCollection,
      fieldName: "tokenId",
      fieldValue: Number(profileId), // Must be a number
    })
    const profileDoc = docs[0]

    if (profileDoc) {
      await updateDocById<Partial<ProfileDoc>>({
        collectionName: profilesCollection,
        docId: profileDoc.id,
        data: token,
      })
    }

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
    const { profileId, uid } = req.params as {
      profileId: string
      uid: string
    }

    // Validate input
    if (!uid || !profileId) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Update profile
    const token = await setDefaultProfile(key, Number(profileId))

    if (!token) throw new Error("Updated profile failed.")

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to get user's default profile.
 */
export async function getUserDefaultProfile(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }

    // Validate input.
    if (!uid) throw new Error("User input error.")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    // 2. Get profiles
    const token = await getDefaultProfile(key)

    res.status(200).json({ token })
  } catch (error) {
    // In case NOT FOUND, getDefaultProfile will throw, it's needed to return 200 so the process can continue.
    res.status(200).json({ token: null })
    // res.status(500).send((error as any).message)
  }
}

/**
 * The route to validate handle.
 * @dev handle is required
 */
export async function verifyProfileHandle(req: Request, res: Response) {
  try {
    const { handle } = req.body as { handle: string }

    // Validate input.
    if (!handle) throw new Error("Handle is required.")

    const valid = await verifyHandle(handle.toLowerCase())

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
    const { uid } = req.params as { uid: string }
    const { handle, imageURI } = req.body as CreateProfileInput["data"]

    // Validate input.
    if (!uid || !handle) throw new Error("User input error")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)

    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)

    const estimatedGas = await estimateCreateProfileGas({
      key,
      data: { handle, imageURI },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
