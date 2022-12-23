/**
 * This file contains the functions for Publish Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import DevPublishContract from "../abi/localhost/ContentBasePublishV1.json"
import StagingPublishContract from "../abi/testnet/ContentBasePublishV1.json"
import ProdPublishContract from "../abi/mainnet/ContentBasePublishV1.json"
import { ContentBasePublishV1 as Publish } from "../typechain-types"
import {
  Role,
  CheckRoleParams,
  CreatePublishInput,
  UpdatePublishInput,
  PublishToken,
  Environment,
} from "../types"
import { getIndexOfCategory, getIndexOfPublishKind } from "./utils"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getPublishContractBySigner(key: string) {
  const contract = getContractBySigner({
    privateKey: key,
    address:
      env === "production"
        ? ProdPublishContract.address
        : env === "staging"
        ? StagingPublishContract.address
        : DevPublishContract.address,
    contractInterface:
      env === "production"
        ? ProdPublishContract.abi
        : env === "staging"
        ? StagingPublishContract.abi
        : DevPublishContract.abi,
  }) as Publish

  return contract
}

/**
 * Get contract without key
 */
export function getPublishContractByProvider() {
  const contract = getContractByProvider({
    address:
      env === "production"
        ? ProdPublishContract.address
        : env === "staging"
        ? StagingPublishContract.address
        : DevPublishContract.address,
    contractInterface:
      env === "production"
        ? ProdPublishContract.abi
        : env === "staging"
        ? StagingPublishContract.abi
        : DevPublishContract.abi,
  }) as Publish

  return contract
}

/**
 * A function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const publishContract = getPublishContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await publishContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * A function to update Profile contract address stored on the Publish contract in order for the Publish contract to communicate with the Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Profile contract address
 */
export async function updateProfileContract(
  key: string,
  contractAddress: string
) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.updateProfileContract(contractAddress)
}

/**
 * A function to create a publish.
 * @param input - see CreatePublishInput
 */
export async function createPublish(input: CreatePublishInput) {
  const {
    key,
    data: {
      creatorId,
      contentURI,
      contentRef,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      kind,
    },
  } = input

  const publishContract = getPublishContractBySigner(key)
  // Make sure to pass down categories as numbers.
  const transaction = await publishContract.createPublish({
    creatorId,
    contentURI,
    contentRef,
    title,
    description,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
    kind: getIndexOfPublishKind(kind),
  })
  await transaction.wait()
}

/**
 * A function to update a Publish.
 * @param input - see UpdatePublishInput
 */
export async function updatePublish(input: UpdatePublishInput) {
  const {
    key,
    data: {
      tokenId,
      creatorId,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    },
  } = input

  const publishContract = getPublishContractBySigner(key)
  // Make sure to pass down categories as numbers.
  const transaction = await publishContract.updatePublish({
    tokenId,
    creatorId,
    title,
    description,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
  })
  await transaction.wait()
}

/**
 * A function to burn a publish token.
 * @param key {string} - wallet's key
 * @param tokenId {number} - a publish token id
 * @param creatorId {number} - a publish's creator id
 */
export async function deletePublish(
  key: string,
  tokenId: number,
  creatorId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.deletePublish(tokenId, creatorId)
  await transaction.wait()
}

/**
 * A function to get the profile contract address.
 * @returns address {string}
 */
export async function getProfileContractAddress() {
  const publishContract = getPublishContractByProvider()
  const address = await publishContract.getProfileContract()
  return address
}

/**
 * A function to get Publish struct by provided id.
 * @param publishId a token id of the publish
 * @return token {Publish object}
 */
export async function fetchPublish(publishId: number): Promise<PublishToken> {
  const publishContract = getPublishContractByProvider()
  const { owner, creatorId, contentURI } = await publishContract.getPublishById(
    publishId
  )

  return {
    tokenId: publishId,
    owner,
    creatorId: creatorId.toNumber(),
    contentURI,
  }
}

/**
 * A function to get token uri.
 * @param tokenId {number} a token id
 * @return uri {string}
 */
export async function getTokenURI(tokenId: number): Promise<string> {
  const publishContract = getPublishContractByProvider()
  const uri = await publishContract.tokenURI(tokenId)
  return uri
}

/**
 * The function to estimate gas used to create a publish token.
 * @dev see CreatePublishInput
 * @return gas {number} - amount in ether
 */
export async function estimateGasForCreatePublishTxn(
  input: CreatePublishInput
) {
  const {
    key,
    data: {
      creatorId,
      contentURI,
      contentRef,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
      kind,
    },
  } = input
  const publishContract = getPublishContractBySigner(key)

  const gasInWei = await publishContract.estimateGas.createPublish({
    creatorId,
    contentURI,
    contentRef,
    title,
    description,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
    kind: getIndexOfPublishKind(kind),
  })

  return ethers.utils.formatEther(gasInWei)
}
