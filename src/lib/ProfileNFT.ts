/**
 * This file contains the functions for Profile Contract.
 */

import { ethers, utils } from "ethers"

import {
  getContractBySigner,
  getContractByProvider,
  getContractForWs,
} from "./ethers"
import ProfileContract from "../abi/ContentBaseProfileV1.json"
import { ContentBaseProfileV1 as Profile } from "../typechain-types"
import {
  Role,
  CheckRoleParams,
  CreateProfileInput,
  UpdateProfileImageInput,
  CreateFollowInput,
  ProfileToken,
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
  }) as Profile
}

/**
 * Get contract without key
 */
export function getProfileContractByProvider() {
  return getContractByProvider({
    address: ProfileContract.address,
    contractInterface: ProfileContract.abi,
  }) as Profile
}

/**
 * Get contract for listening to events
 */
export function getProfileContractForWs() {
  return getContractForWs({
    address: ProfileContract.address,
    contractInterface: ProfileContract.abi,
  }) as Profile
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
 */
export async function createProfile(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI, originalHandle },
  } = input

  // Validate the handle.
  const isHandleValid = verifyHandle(handle)
  if (!isHandleValid) throw new Error("Handle is invalid or taken")

  const profileContract = getProfileContractBySigner(key)
  const transaction = await profileContract.createProfile(
    handle,
    imageURI,
    originalHandle
  )
  await transaction.wait()
}

/**
 * The function to update profile's image.
 * @dev see UpdateProfileImageInput
 */
export async function updateProfileImage(input: UpdateProfileImageInput) {
  const {
    key,
    data: { tokenId, imageURI },
  } = input

  const profileContract = getProfileContractBySigner(key)
  const transaction = await profileContract.updateProfileImage(
    tokenId,
    imageURI
  )
  await transaction.wait()
}

/**
 * The function to set default profile.
 * @param key a wallet private key
 * @param handle {string} a handle of the profile to be set.
 */
export async function setDefaultProfile(key: string, handle: string) {
  const profileContract = getProfileContractBySigner(key)
  const transaction = await profileContract.setDefaultProfile(handle)
  await transaction.wait()
}

/**
 * The function to follow a Profile (and create Follow NFT).
 * @param input - see CreateFollowInput
 * @return token {Follow object}
 */
export async function follow(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input

  const profileContract = getProfileContractBySigner(key)
  const transaction = await profileContract.follow(followerId, followeeId)
  await transaction.wait()
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
 * The function get user's default profile.
 * @param key a wallet private key
 * @return token {Profile object}
 */
export async function getDefaultProfile(key: string): Promise<ProfileToken> {
  const profileContract = getProfileContractBySigner(key)
  const [profileId, { owner, handle, imageURI, followers, following }] =
    await profileContract.getDefaultProfile()

  return {
    tokenId: profileId.toNumber(),
    owner,
    handle,
    imageURI,
    followers,
    following,
  }
}

/**
 * A function to get token uri.
 * @param tokenId {number} a token id
 * @return uri {string}
 */
export async function getTokenURI(tokenId: number): Promise<string> {
  const profileContract = getProfileContractByProvider()
  const uri = await profileContract.tokenURI(tokenId)
  return uri
}

/**
 * The function to estimate gas used to create a profile token.
 * @dev see CreateProfileInput
 * @return gas {number} - amount in ether
 */
export async function estimateGasForCreateProfileTxn(
  input: CreateProfileInput
) {
  const {
    key,
    data: { handle, imageURI, originalHandle },
  } = input
  const profileContract = getProfileContractBySigner(key)
  const gasInWei = await profileContract.estimateGas.createProfile(
    handle,
    imageURI,
    originalHandle
  )

  return ethers.utils.formatEther(gasInWei)
}

/**
 * The function to estimate gas used to create a profile token.
 * @dev see CreateProfileInput
 * @return gas {number} - amount in ether
 */
export async function estimateGasForFollowTxn(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input
  const profileContract = getProfileContractBySigner(key)
  const gasInWei = await profileContract.estimateGas.follow(
    followerId,
    followeeId
  )

  return ethers.utils.formatEther(gasInWei)
}
