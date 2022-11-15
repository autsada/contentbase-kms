import { Request, Response } from "express"

import { getWallet } from "../lib/firebase"
import {
  checkUserRole,
  createProfile,
  updateProfileImage,
  setDefaultProfile,
  follow,
  verifyHandle,
  getDefaultProfile,
  getTokenURI,
  estimateGasForCreateProfileTxn,
  estimateGasForFollowTxn,
} from "../lib/ProfileNFT"
import { decrypt } from "../lib/kms"
import {
  CreateProfileInput,
  UpdateProfileImageInput,
  CreateFollowInput,
  Role,
} from "../types"

/**
 * A route to check role.
 * @dev see CheckRoleParams
 */
export async function checkRole(req: Request, res: Response) {
  try {
    const { uid } = req.params
    const { role } = req.body as { role: Role }
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
 * A route to create Profile NFT.
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
    await createProfile({
      key,
      data: {
        handle: lowercasedHandle,
        imageURI: imageURI || "",
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to set/update profile's image.
 * @dev see UpdateProfileImageInput
 */
export async function setProfileImage(req: Request, res: Response) {
  try {
    const { uid } = req.params as {
      uid: string
    }
    const { tokenId, imageURI } = req.body as UpdateProfileImageInput["data"]
    // Validate input.
    if (!uid || !tokenId || !imageURI) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Update profile
    await updateProfileImage({
      key,
      data: {
        tokenId,
        imageURI,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to set default profile.
 */
export async function setProfileAsDefault(req: Request, res: Response) {
  try {
    const { uid } = req.params as {
      uid: string
    }
    const { handle } = req.body as { handle: string }
    // Validate input
    if (!uid || !handle) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Update profile
    await setDefaultProfile(key, handle)

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to follow a profile.
 * @dev see CreateFollowInput
 */
export async function followProfile(req: Request, res: Response) {
  try {
    const { uid } = req.params as {
      uid: string
    }
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]
    // Validate input.
    if (!uid || !followerId || !followeeId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    // 2. Follow
    await follow({
      key,
      data: {
        followerId,
        followeeId,
      },
    })

    res.status(200).json({ status: "Ok" })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to verify handle.
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
 * The route to get a profile token uri.
 */
export async function getProfileTokenURI(req: Request, res: Response) {
  try {
    const { tokenId } = req.params as { tokenId: string }
    const uri = await getTokenURI(Number(tokenId))

    res.status(200).json({ uri })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * The route to estimate gas used to create Profile NFT.
 */
export async function estimateGasCreateProfileNft(req: Request, res: Response) {
  try {
    const { uid } = req.params as { uid: string }
    const { handle, imageURI } = req.body as CreateProfileInput["data"]
    // Validate input.
    if (!uid || !handle) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const estimatedGas = await estimateGasForCreateProfileTxn({
      key,
      data: { handle, imageURI },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

/**
 * A route to estimate gas used to follow a profile.
 * @dev see CreateFollowInput
 */
export async function estimateGasFollowProfile(req: Request, res: Response) {
  try {
    const { uid } = req.params as {
      uid: string
    }
    const { followerId, followeeId } = req.body as CreateFollowInput["data"]
    // Validate input.
    if (!uid || !followerId || !followeeId) throw new Error("User input error")
    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // 1. Decrypt the key
    const key = await decrypt(encryptedKey)
    const estimatedGas = await estimateGasForFollowTxn({
      key,
      data: { followerId, followeeId },
    })

    res.status(200).json({ gas: estimatedGas })
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
