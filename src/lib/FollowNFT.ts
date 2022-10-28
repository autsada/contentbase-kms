/**
 * This file contains the functions for Follow Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import FollowContract from "../abi/FollowContract.json"
import { FollowNFT } from "../typechain-types"
import { FollowEvent } from "../typechain-types/contracts/follow/FollowNFT"
import { Role, CheckRoleParams, CreateFollowInput } from "../types"

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getFollowContractBySigner(key: string) {
  return getContractBySigner({
    address: FollowContract.address,
    privateKey: key,
    contractInterface: FollowContract.abi,
  }) as FollowNFT
}

/**
 * Get contract without key
 */
export function getFollowContractByProvider() {
  return getContractByProvider({
    address: FollowContract.address,
    contractInterface: FollowContract.abi,
  }) as FollowNFT
}

/**
 * The function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const publishContract = getFollowContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await publishContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * The function to set Profile contract.
 * @notice Follow contract needs to communicate with Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Profile contract address
 */
export async function setProfileContract(key: string, address: string) {
  const followContract = getFollowContractBySigner(key)
  await followContract.setProfileContract(address)
}

/**
 * The function to follow Profile (and create Follow NFT).
 * @param input - see CreateFollowInput
 * @return token {Follow object}
 */
export async function follow(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input

  const followContract = getFollowContractBySigner(key)

  const transaction = await followContract.follow({
    followerId,
    followeeId,
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const followCreatedEvent = tx.events.find((e) => e.event === "Follow")

    if (followCreatedEvent) {
      if (followCreatedEvent.args) {
        const [{ owner, tokenId, followerId, followeeId }, follower, followee] =
          followCreatedEvent.args as FollowEvent["args"]

        token = {
          owner,
          tokenId: tokenId.toNumber(),
          followerId: followerId.toNumber(),
          followeeId: followeeId.toNumber(),
        }
      }
    }
  }

  return token
}

/**
 * The function to unfollow.
 * @param key - wallet's key
 * @param tokenId - a follow token id
 */
export async function unfollow(key: string, tokenId: number) {
  const followContract = getFollowContractBySigner(key)

  await followContract.burn(tokenId)
}

/**
 * The function to get follow tokens.
 * @param tokenIds an array of follow token ids
 * @dev can call by anybody
 * @dev tokenIds array length must not greater than 40
 * @return tokens {array of Follow object}
 */
export async function getFollows(tokenIds: number[]) {
  const followContract = getFollowContractByProvider()
  const follows = await followContract.getFollows(tokenIds)

  return follows.map(({ owner, tokenId, followerId, followeeId }) => ({
    owner,
    tokenId: tokenId.toNumber(),
    followerId: followerId.toNumber(),
    followeeId: followeeId.toNumber(),
  }))
}

/**
 * A function to estimate gas used to create a follow token.
 * @dev see CreateFollowInput
 * @return gas {number} - amount in ether
 */
export async function estimateCreateFollowGas(input: CreateFollowInput) {
  const {
    key,
    data: { followerId, followeeId },
  } = input
  const followContract = getFollowContractBySigner(key)

  const gasInWei = await followContract.estimateGas.follow({
    followerId,
    followeeId,
  })

  return ethers.utils.formatEther(gasInWei)
}
