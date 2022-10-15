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
import { Role, CheckRoleParams } from "../types"

/**
 * Input data required for creating a Profile NFT.
 * @param key {string} - wallet's key
 * @param data.handle {string} - a handle of the profile
 * @param data.imageURI {string} - a profile image uri
 * @param data.tokenURI {string} - a token's metadata uri
 */
export interface CreateProfileInput {
  key: string
  data: {
    handle: string
    imageURI: string
    tokenURI: string
  }
}

/**
 * Input data required for creating update Profile image.
 * @param key {string} - wallet's key
 * @param data.tokenId {number} - an id of a Profile NFT
 * @param data.imageURI {string} - a profile image uri
 * @param data.tokenURI {string} - a token's metadata uri
 */
export interface UpdateProfileImageInput {
  key: string
  data: {
    tokenId: number
    imageURI: string
    tokenURI: string
  }
}

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
 * The function to create Profile NFT.
 * @dev see CreateProfileInput
 * @return token {Profile object}
 */
export async function createProfile(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI, tokenURI },
  } = input

  // Validate the handle
  const isHandleValid = verifyHandle(handle)

  if (!isHandleValid) throw new Error("Handle is invalid or taken")

  const profileContract = getProfileContractBySigner(key)

  const transaction = await profileContract.createProfile({
    tokenURI,
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
        const [{ tokenId, handle, imageURI, owner }, _] =
          profileCreatedEvent.args as ProfileCreatedEvent["args"]

        token = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
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
    data: { tokenId, imageURI, tokenURI },
  } = input

  const profileContract = getProfileContractBySigner(key)

  const transaction = await profileContract.updateProfileImage({
    tokenId,
    tokenURI,
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
        const [{ tokenId, owner, handle, imageURI }, _] =
          profileCreatedEvent.args as ProfileImageUpdatedEvent["args"]

        updatedToken = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
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
        const [{ tokenId, owner, handle, imageURI }, _] =
          profileCreatedEvent.args as DefaultProfileUpdatedEvent["args"]

        token = {
          tokenId: tokenId.toNumber(),
          owner,
          handle,
          imageURI,
        }
      }
    }
  }

  return token
}

/**
 * The function to get caller's profiles.
 * @param key a wallet private key
 * @param tokenIds an array of profile token ids
 * @dev tokenIds array length must not greater than 40
 * @return tokens {array of Profile object}
 */
export async function fetchMyProfiles(key: string, tokenIds: number[]) {
  const profileContract = getProfileContractBySigner(key)
  const profiles = await profileContract.ownerProfiles(tokenIds)

  return profiles.map(({ tokenId, owner, handle, imageURI }) => ({
    owner,
    tokenId: tokenId.toNumber(),
    handle,
    imageURI,
  }))
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
 * The function to get profile from provided id.
 * @param profileId {number} a token id of the profile token
 * @return token {Profile object}
 */
export async function getProfileById(profileId: number) {
  const profileContract = getProfileContractByProvider()
  const { owner, tokenId, handle, imageURI } =
    await profileContract.profileById(profileId)

  return {
    owner,
    tokenId: tokenId.toNumber(),
    handle,
    imageURI,
  }
}

/**
 * The function to get total profiles count.
 * @return count {number}
 */
export async function totalProfilesCount() {
  const profileContract = getProfileContractByProvider()
  const result = await profileContract.totalProfiles()

  return result.toNumber()
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
 * The function to get tokenURI of a profile.
 * @param tokenId {number} - a token id
 * @return tokenURI {string}
 */
export async function getTokenURI(tokenId: number) {
  const profileContract = getProfileContractByProvider()
  const tokenURI = await profileContract.tokenURI(tokenId)

  return tokenURI
}

/**
 * The function to estimate gas used to create a profile token.
 * @dev see CreateProfileInput
 * @return gas {number} - amount in ether
 */
export async function estimateCreateProfileGas(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI, tokenURI },
  } = input
  const profileContract = getProfileContractBySigner(key)

  const gasInWei = await profileContract.estimateGas.createProfile({
    tokenURI,
    handle,
    imageURI,
  })

  return ethers.utils.formatEther(gasInWei)
}
