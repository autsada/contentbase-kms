/**
 * This file contains the functions for Profile Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import ProfileContract from "../abi/ProfileContract.json"
import { ProfileNFT } from "../typechain-types"
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
} from "../typechain-types/contracts/profile/ProfileNFT"
import {
  Role,
  CheckRoleParams,
  CreateProfileInput,
  UpdateProfileImageInput,
} from "../types"

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getProfileContractBySigner(key: string) {
  return getContractBySigner({
    address: ProfileContract.address,
    privateKey: key,
    contractInterface: ProfileContract.abi,
  }) as ProfileNFT
}

/**
 * Get contract without key
 */
export function getProfileContractByProvider() {
  return getContractByProvider({
    address: ProfileContract.address,
    contractInterface: ProfileContract.abi,
  }) as ProfileNFT
}

/**
 * The function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const profileContract = getProfileContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await profileContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * The function to set Follow contract.
 * @notice Profile contract needs to communicate with Follow contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Follow contract address
 */
export async function setFollowContract(key: string, address: string) {
  const profileContract = getProfileContractBySigner(key)
  await profileContract.setFollowContractAddress(address)
}

/**
 * The function to create Profile NFT.
 * @dev see CreateProfileInput
 * @return token {Profile object}
 */
export async function createProfile(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI },
  } = input

  // Validate the handle
  const isHandleValid = verifyHandle(handle)

  if (!isHandleValid) throw new Error("Handle is invalid or taken")

  const profileContract = getProfileContractBySigner(key)

  const transaction = await profileContract.createProfile({
    handle,
    imageURI,
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === "ProfileCreated"
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [{ tokenId, handle, imageURI, owner, following, followers }, _] =
          profileCreatedEvent.args as ProfileCreatedEvent["args"]

        token = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
          following: following.toNumber(),
          followers: followers.toNumber(),
        }
      }
    }
  }

  return token
}

/**
 * The function to update profile's image.
 * @dev see UpdateProfileImageInput
 * @return token {Profile object}
 */
export async function updateProfile(input: UpdateProfileImageInput) {
  const {
    key,
    data: { tokenId, imageURI },
  } = input

  const profileContract = getProfileContractBySigner(key)

  const transaction = await profileContract.updateProfileImage({
    tokenId,
    imageURI,
  })

  const tx = await transaction.wait()
  let updatedToken

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === "ProfileImageUpdated"
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [{ tokenId, owner, handle, imageURI, followers, following }, _] =
          profileCreatedEvent.args as ProfileImageUpdatedEvent["args"]

        updatedToken = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
          following: following.toNumber(),
          followers: followers.toNumber(),
        }
      }
    }
  }

  return updatedToken
}

/**
 * The function to set default profile.
 * @param key a wallet private key
 * @param tokenId an id of the profile token
 * @return token {Profile object}
 */
export async function setDefaultProfile(key: string, tokenId: number) {
  const profileContract = getProfileContractBySigner(key)

  const transaction = await profileContract.setDefaultProfile(tokenId)

  const tx = await transaction.wait()
  let token

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === "DefaultProfileUpdated"
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [{ tokenId, owner, handle, imageURI, following, followers }, _] =
          profileCreatedEvent.args as DefaultProfileUpdatedEvent["args"]

        token = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
          following: following.toNumber(),
          followers: followers.toNumber(),
        }
      }
    }
  }

  return token
}

/**
 * The function get user's default profile.
 * @param key a wallet private key
 * @return token {Profile object}
 */
export async function getDefaultProfile(key: string) {
  const profileContract = getProfileContractBySigner(key)
  const { owner, tokenId, handle, imageURI } =
    await profileContract.defaultProfile()

  return {
    owner,
    tokenId: tokenId.toNumber(),
    handle,
    imageURI,
  }
}

/**
 * The function to verify if handle is valid.
 * @param handle user's handle
 * @return valid {boolean}
 */
export async function verifyHandle(handle: string) {
  const profileContract = getProfileContractByProvider()
  const valid = await profileContract.validateHandle(handle)

  return valid
}

/**
 * The function to estimate gas used to create a profile token.
 * @dev see CreateProfileInput
 * @return gas {number} - amount in ether
 */
export async function estimateCreateProfileGas(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI },
  } = input
  const profileContract = getProfileContractBySigner(key)

  const gasInWei = await profileContract.estimateGas.createProfile({
    handle,
    imageURI,
  })

  return ethers.utils.formatEther(gasInWei)
}
