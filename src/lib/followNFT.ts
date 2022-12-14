/**
 * This file contains the functions for Profile Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import DevFollowContract from "../abi/localhost/ContentBaseFollowV1.json"
import StagingFollowContract from "../abi/testnet/ContentBaseFollowV1.json"
import ProdFollowContract from "../abi/mainnet/ContentBaseFollowV1.json"
import { ContentBaseFollowV1 as Follow } from "../typechain-types"
import { Role, CheckRoleParams, CreateFollowInput, Environment } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getFollowContractBySigner(key: string) {
  const contract = getContractBySigner({
    privateKey: key,
    address:
      env === "production"
        ? ProdFollowContract.address
        : env === "staging"
        ? StagingFollowContract.address
        : DevFollowContract.address,
    contractInterface:
      env === "production"
        ? ProdFollowContract.abi
        : env === "staging"
        ? StagingFollowContract.abi
        : DevFollowContract.abi,
  }) as Follow

  return contract
}

/**
 * Get contract without key
 */
export function getFollowContractByProvider() {
  const contract = getContractByProvider({
    address:
      env === "production"
        ? ProdFollowContract.address
        : env === "staging"
        ? StagingFollowContract.address
        : DevFollowContract.address,
    contractInterface:
      env === "production"
        ? ProdFollowContract.abi
        : env === "staging"
        ? StagingFollowContract.abi
        : DevFollowContract.abi,
  }) as Follow

  return contract
}

/**
 * A function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const followContract = getFollowContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await followContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * A function to update Profile contract address stored on the Follow contract in order for the Follow contract to communicate with the Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Profile contract address
 */
export async function updateProfileContract(
  key: string,
  contractAddress: string
) {
  const followContract = getFollowContractBySigner(key)
  await followContract.updateProfileContract(contractAddress)
}

/**
 * A function to follow a Profile (and create Follow NFT).
 * @param input - see CreateFollowInput
 * @return token {Follow object}
 */
export async function follow(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input

  const followContract = getFollowContractBySigner(key)
  const transaction = await followContract.follow(followerId, followeeId)
  await transaction.wait()
}

/**
 * A function to get followers and following counts of a profile.
 * @param profileId {number}
 * @return followers {number}
 * @return following {number}
 */
export async function getFollowCounts(profileId: number) {
  const followContract = getFollowContractByProvider()
  const [followers, following] = await followContract.getFollowCounts(profileId)

  return { followers: followers.toNumber(), following: following.toNumber() }
}

/**
 * A function to estimate gas used to create a profile token.
 * @dev see CreateProfileInput
 * @return gas {number} - amount in ether
 */
export async function estimateGasForFollowTxn(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input
  const profileContract = getFollowContractBySigner(key)
  const gasInWei = await profileContract.estimateGas.follow(
    followerId,
    followeeId
  )

  return ethers.utils.formatEther(gasInWei)
}
