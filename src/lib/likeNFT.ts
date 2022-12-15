/**
 * This file contains the functions for Publish Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import DevLikeContract from "../abi/localhost/ContentBaseLikeV1.json"
import StagingLikeContract from "../abi/testnet/ContentBaseLikeV1.json"
import ProdLikeContract from "../abi/mainnet/ContentBaseLikeV1.json"
import { ContentBaseLikeV1 as Like } from "../typechain-types"
import { Role, CheckRoleParams, Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getLikeContractBySigner(key: string) {
  const contract = getContractBySigner({
    privateKey: key,
    address:
      env === "production"
        ? ProdLikeContract.address
        : env === "staging"
        ? StagingLikeContract.address
        : DevLikeContract.address,
    contractInterface:
      env === "production"
        ? ProdLikeContract.abi
        : env === "staging"
        ? StagingLikeContract.abi
        : DevLikeContract.abi,
  }) as Like

  return contract
}

/**
 * Get contract without key
 */
export function getLikeContractByProvider() {
  const contract = getContractByProvider({
    address:
      env === "production"
        ? ProdLikeContract.address
        : env === "staging"
        ? StagingLikeContract.address
        : DevLikeContract.address,
    contractInterface:
      env === "production"
        ? ProdLikeContract.abi
        : env === "staging"
        ? StagingLikeContract.abi
        : DevLikeContract.abi,
  }) as Like

  return contract
}

/**
 * A function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const likeContract = getLikeContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await likeContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * A function to update contract owner address stored on the Publish contract for use to withdraw fund to the owner.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param ownerAddress - The owner wallet address
 */
export async function updatePlatformOwner(key: string, ownerAddress: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.updatePlatformOwner(ownerAddress)
}

/**
 * A function to update Profile contract address stored on the Like contract in order for the Like contract to communicate with the Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Profile contract address
 */
export async function updateProfileContract(
  key: string,
  contractAddress: string
) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.updateProfileContract(contractAddress)
}

/**
 * A function to update Publish contract address stored on the Like contract in order for the Like contract to communicate with the Publish contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Profile contract address
 */
export async function updatePublishContract(
  key: string,
  contractAddress: string
) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.updateProfileContract(contractAddress)
}

/**
 * A function to update like fee stored on the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function updateLikeFee(key: string, fee: number) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.updateLikeFee(utils.parseEther(`${fee}`))
}

/**
 * A function to update platform fee stored on the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function updatePlatformFee(key: string, fee: number) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.updatePlatformFee(fee)
}

/**
 * A function to withdraw funds from the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 */
export async function withdrawFunds(key: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.withdraw()
}

/**
 * A function to like a publish.
 * @param key {string} - wallet's key
 * @param publishId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function likePublish(
  key: string,
  publishId: number,
  profileId: number
) {
  const likeContract = getLikeContractBySigner(key)

  // 1. Need to identify if the call is for `like` or `unlike`.
  const liked = await checkLikedPublish(profileId, publishId)

  if (!liked) {
    // A. The call is for `like`.
    // Need to send some ethers as a support money to the creator of the publish.
    const likeFee = await getLikeFee()

    const transaction = await likeContract.likePublish(publishId, profileId, {
      value: utils.parseEther(`${likeFee}`),
    })
    await transaction.wait()
  } else {
    // B. The call is for `unlike`.
    // No ethers sent.
    const transaction = await likeContract.likePublish(publishId, profileId)
    await transaction.wait()
  }
}

/**
 * A function to dislike a publish.
 * @param key {string} - wallet's key
 * @param publishId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function disLikePublish(
  key: string,
  publishId: number,
  profileId: number
) {
  const likeContract = getLikeContractBySigner(key)
  const transaction = await likeContract.disLikePublish(publishId, profileId)
  await transaction.wait()
}

/**
 * The function to estimate gas used to like a publish.
 * @param key {string} - wallet's key
 * @param publishId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function estimateGasForLikePublishTxn(
  key: string,
  publishId: number,
  profileId: number
) {
  const likeContract = getLikeContractBySigner(key)
  const gasInWei = await likeContract.estimateGas.likePublish(
    publishId,
    profileId
  )
  return ethers.utils.formatEther(gasInWei)
}

/**
 * A function to get the platform owner address.
 * @returns owner {string}
 */
export async function getPlatformOwnerAddress() {
  const likeContract = getLikeContractByProvider()
  const owner = await likeContract.platformOwner()
  return owner
}

/**
 * A function to get the profile contract address.
 * @returns address {string}
 */
export async function getProfileContractAddress() {
  const likeContract = getLikeContractByProvider()
  const address = await likeContract.getProfileContract()
  return address
}

/**
 * A function to get the publish contract address.
 * @returns address {string}
 */
export async function getPublishContractAddress() {
  const likeContract = getLikeContractByProvider()
  const address = await likeContract.getPublishContract()
  return address
}

/**
 * A function to get the like fee.
 * @returns fee {number}
 */
export async function getLikeFee() {
  const likeContract = getLikeContractByProvider()
  const fee = await likeContract.likeFee()
  return Number(utils.formatEther(fee))
}

/**
 * A function to get the platfrom fee.
 * @returns fee {number}
 */
export async function getPlatformFee() {
  const likeContract = getLikeContractByProvider()
  const fee = await likeContract.platformFee()
  return fee.toNumber()
}

/**
 * A function to check if a profile liked the publish.
 * @param profileId {number}
 * @param publishId {number}
 * @return boolean
 */
export async function checkLikedPublish(profileId: number, publishId: number) {
  const likeContract = getLikeContractByProvider()
  return likeContract.checkLikedPublish(profileId, publishId)
}
