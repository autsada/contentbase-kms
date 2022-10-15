/**
 * This file contains the functions for Like Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import LikeContract from "../abi/LikeContract.json"
import { LikeNFT } from "../typechain-types"
import {
  LikeEvent,
  UnLikeEvent,
} from "../typechain-types/contracts/like/LikeNFT"
import { Role, CheckRoleParams } from "../types"

/**
 * Input data required for creating a Like NFT.
 * @param key - a wallet's key
 * @param data.profileId - a profile id of the caller
 * @param data.publishId - a publish id that the caller likes
 */
export interface CreateLikeInput {
  key: string
  data: {
    profileId: number
    publishId: number
  }
}

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getLikeContractBySigner(key: string) {
  return getContractBySigner({
    address: LikeContract.address,
    privateKey: key,
    contractInterface: LikeContract.abi,
  }) as LikeNFT
}

/**
 * Get contract without key
 */
export function getLikeContractByProvider() {
  return getContractByProvider({
    address: LikeContract.address,
    contractInterface: LikeContract.abi,
  }) as LikeNFT
}

/**
 * The function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const publishContract = getLikeContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await publishContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * The function to set Profile contract.
 * @notice Like contract needs to communicate with Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Profile contract address
 */
export async function setProfileContract(key: string, address: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.setProfileContract(address)
}

/**
 * The function to set Publish contract.
 * @notice Like contract needs to communicate with Publish contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Publish contract address
 */
export async function setPublishContract(key: string, address: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.setPublishContract(address)
}

/**
 * The function to set contract owner address.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - contract owner address
 */
export async function setOwnerAddress(key: string, address: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.setOwnerAddress(address)
}

/**
 * The function to get contract owner address that has been set in the contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @return address {string}
 */
export async function getOwnerAddress(key: string) {
  const likeContract = getLikeContractBySigner(key)
  const address = await likeContract.getOwnerAddress()

  return address
}

/**
 * The function to withdraw funds from Like contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 */
export async function withdraw(key: string) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.withdraw()
}

/**
 * The function to set like fee.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function setLikeFee(key: string, fee: number) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.setLikeSupportFee(fee)
}

/**
 * The function to get like fee.
 * @return fee {number} - amount in ether
 */
export async function getLikeFee() {
  const likeContract = getLikeContractByProvider()
  const fee = await likeContract.getLikeSupportFee()

  return fee.toNumber()
}

/**
 * The function to set platform fee.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function setPlatformFee(key: string, fee: number) {
  const likeContract = getLikeContractBySigner(key)
  await likeContract.setPlatformFee(fee)
}

/**
 * The function to get platform fee.
 * @return fee {number} - amount in ether
 */
export async function getPlatformFee() {
  const likeContract = getLikeContractByProvider()
  const fee = await likeContract.getPlatformFee()

  // Divide by 100 to have it in percentage.
  return fee.toNumber() / 100
}

/**
 * The function to get contract balance.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @return balance {number} - amount in ether
 */
export async function getContractBalance(key: string) {
  const likeContract = getLikeContractBySigner(key)
  const balance = await likeContract.getContractBalance()

  return balance.toNumber()
}

/**
 * The function to like Publish (and create Like NFT).
 * @param input - see CreateLikeInput
 * @return token {Like object}
 */
export async function like(input: CreateLikeInput) {
  const {
    key,
    data: { profileId, publishId },
  } = input

  const likeContract = getLikeContractBySigner(key)

  const transaction = await likeContract.like({
    profileId,
    publishId,
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const LikeEvent = tx.events.find((e) => e.event === "Like")

    if (LikeEvent) {
      if (LikeEvent.args) {
        const [{ owner, tokenId, profileId, publishId }] =
          LikeEvent.args as LikeEvent["args"]

        token = {
          owner,
          tokenId: tokenId.toNumber(),
          profileId: profileId.toNumber(),
          publishId: publishId.toNumber(),
        }
      }
    }
  }

  return token
}

/**
 * The function to unlike.
 * @param key - wallet's key
 * @param tokenId - a Like token id
 * @return token {Like object}
 */
export async function unLike(key: string, tokenId: number) {
  const likeContract = getLikeContractBySigner(key)

  const transaction = await likeContract.burn(tokenId)

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const LikeEvent = tx.events.find((e) => e.event === "UnLike")

    if (LikeEvent) {
      if (LikeEvent.args) {
        const [{ owner, tokenId, profileId, publishId }] =
          LikeEvent.args as UnLikeEvent["args"]

        token = {
          owner,
          tokenId: tokenId.toNumber(),
          profileId: profileId.toNumber(),
          publishId: publishId.toNumber(),
        }
      }
    }
  }

  return token
}

/**
 * A function to estimate gas used to create a Like token.
 * @dev see CreateLikeInput
 * @return gas {number} - amount in ether
 */
export async function estimateCreateLikeGas(input: CreateLikeInput) {
  const {
    key,
    data: { profileId, publishId },
  } = input
  const likeContract = getLikeContractBySigner(key)

  const gasInWei = await likeContract.estimateGas.like({
    profileId,
    publishId,
  })

  return ethers.utils.formatEther(gasInWei)
}
