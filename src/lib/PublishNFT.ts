/**
 * This file contains the functions for Publish Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import PublishContract from "../abi/ContentBasePublishV1.json"
import { ContentBasePublishV1 as Publish } from "../typechain-types"
import {
  Role,
  CheckRoleParams,
  Category,
  CreatePublishInput,
  UpdatePublishInput,
  PublishToken,
  CommentInput,
  UpdateCommentInput,
  CommentToken,
} from "../types"

// A helper function to get Category index.
export function getIndexOfCategory(cat: Category) {
  return Object.keys(Category).indexOf(cat)
}

// A helper function to get Category key.
export function getKeyOfCategory(index: number) {
  return Object.keys(Category)[index]
}

/**
 * Get conract using signer.
 * @param key a wallet private key
 */
export function getPublishContractBySigner(key: string) {
  return getContractBySigner({
    address: PublishContract.address,
    privateKey: key,
    contractInterface: PublishContract.abi,
  }) as Publish
}

/**
 * Get contract without key
 */
export function getPublishContractByProvider() {
  return getContractByProvider({
    address: PublishContract.address,
    contractInterface: PublishContract.abi,
  }) as Publish
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
 * A function to update contract owner address stored on the Publish contract for use to withdraw fund to the owner.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param ownerAddress - The owner wallet address
 */
export async function updatePlatformOwner(key: string, ownerAddress: string) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.updatePlatformOwner(ownerAddress)
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
 * A function to update like fee stored on the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function updateLikeFee(key: string, fee: number) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.updateLikeFee(fee)
}

/**
 * A function to update platform fee stored on the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param fee {number}
 */
export async function updatePlatformFee(key: string, fee: number) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.updatePlatformFee(fee)
}

/**
 * A function to withdraw funds from the Publish contract.
 * @dev this function is for Admin only
 * @param key - wallet's key
 */
export async function withdrawFunds(key: string) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.withdraw()
}

/**
 * A function to create Publish NFT.
 * @param input - see CreatePublishInput
 */
export async function createPublish(input: CreatePublishInput) {
  const {
    key,
    data: {
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    },
  } = input

  const publishContract = getPublishContractBySigner(key)
  // Make sure to pass down categories as numbers.
  const transaction = await publishContract.createPublish({
    creatorId,
    imageURI,
    contentURI,
    metadataURI,
    title,
    description,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
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
      imageURI,
      contentURI,
      metadataURI,
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
    imageURI,
    contentURI,
    metadataURI,
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
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.likePublish(publishId, profileId)
  await transaction.wait()
}

/**
 * A function to dis like a publish.
 * @param key {string} - wallet's key
 * @param publishId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function disLikePublish(
  key: string,
  publishId: number,
  profileId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.disLikePublish(publishId, profileId)
  await transaction.wait()
}

/**
 * A function to get Publish struct by provided id.
 * @param publishId a token id of the publish
 * @return token {Publish object}
 */
export async function fetchPublish(publishId: number): Promise<PublishToken> {
  const publishContract = getPublishContractByProvider()
  const {
    owner,
    creatorId,
    imageURI,
    contentURI,
    metadataURI,
    likes,
    disLikes,
  } = await publishContract.getPublishById(publishId)

  return {
    tokenId: publishId,
    owner,
    creatorId: creatorId.toNumber(),
    imageURI,
    contentURI,
    metadataURI,
    likes,
    disLikes,
  }
}

/**
 * A function to create a comment.
 * @param input - see CommentInput
 */
export async function createComment(input: CommentInput) {
  const {
    key,
    data: { targetId, creatorId, contentURI },
  } = input

  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.createComment({
    targetId,
    creatorId,
    contentURI,
  })
  await transaction.wait()
}

/**
 * A function to update a comment.
 * @param input - see UpdateCommentInput
 */
export async function updateComment(input: UpdateCommentInput) {
  const {
    key,
    data: { tokenId, creatorId, contentURI },
  } = input

  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.updateComment({
    tokenId,
    creatorId,
    newContentURI: contentURI,
  })
  await transaction.wait()
}

/**
 * A function to delete a comment.
 * @param key {string} - wallet's key
 * @param tokenId {number} - an id of the comment to be deleted.
 * @param creatorId {number} - an id of the profile that created the comment.
 */
export async function deleteComment(
  key: string,
  tokenId: number,
  creatorId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.deleteComment(tokenId, creatorId)
  await transaction.wait()
}

/**
 * A function to like a comment.
 * @param key {string} - wallet's key
 * @param commentId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function likeComment(
  key: string,
  commentId: number,
  profileId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.likeComment(commentId, profileId)
  await transaction.wait()
}

/**
 * A function to dis like a comment.
 * @param key {string} - wallet's key
 * @param commentId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function disLikeComment(
  key: string,
  commentId: number,
  profileId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const transaction = await publishContract.disLikeComment(commentId, profileId)
  await transaction.wait()
}

/**
 * A function to get Comment struct by provided id.
 * @param commentId a token id of the publish
 * @return token {Comment object}
 */
export async function fetchComment(commentId: number): Promise<CommentToken> {
  const publishContract = getPublishContractByProvider()
  const { owner, creatorId, targetId, contentURI, likes, disLikes } =
    await publishContract.getCommentById(commentId)

  return {
    tokenId: commentId,
    owner,
    creatorId: creatorId.toNumber(),
    targetId: targetId.toNumber(),
    contentURI,
    likes,
    disLikes,
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
      imageURI,
      contentURI,
      metadataURI,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      tertiaryCategory,
    },
  } = input
  const publishContract = getPublishContractBySigner(key)

  const gasInWei = await publishContract.estimateGas.createPublish({
    creatorId,
    imageURI,
    contentURI,
    metadataURI,
    title,
    description,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
  })

  return ethers.utils.formatEther(gasInWei)
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
  const publishContract = getPublishContractBySigner(key)
  const gasInWei = await publishContract.estimateGas.likePublish(
    publishId,
    profileId
  )
  return ethers.utils.formatEther(gasInWei)
}

/**
 * The function to estimate gas used to like a comment.
 * @param key {string} - wallet's key
 * @param commentId {number} - a publish token id
 * @param profileId {number} - a profile token id
 */
export async function estimateGasForLikeCommentTxn(
  key: string,
  commentId: number,
  profileId: number
) {
  const publishContract = getPublishContractBySigner(key)
  const gasInWei = await publishContract.estimateGas.likeComment(
    commentId,
    profileId
  )
  return ethers.utils.formatEther(gasInWei)
}

/**
 * A function to get the platform owner address.
 * @returns owner {string}
 */
export async function getPlatformOwnerAddress() {
  const publishContract = getPublishContractByProvider()
  const owner = await publishContract.platformOwner()
  return owner
}

/**
 * A function to get the profile contract address.
 * @returns address {string}
 */
export async function getProfileContractAddress() {
  const publishContract = getPublishContractByProvider()
  const address = await publishContract.profileContract()
  return address
}

/**
 * A function to get the like fee.
 * @returns fee {number}
 */
export async function getLikeFee() {
  const publishContract = getPublishContractByProvider()
  const fee = await publishContract.likeFee()
  return fee.toNumber()
}

/**
 * A function to get the platfrom fee.
 * @returns fee {number}
 */
export async function getPlatformFee() {
  const publishContract = getPublishContractByProvider()
  const fee = await publishContract.platformFee()
  return fee.toNumber()
}
