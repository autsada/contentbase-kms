/**
 * This file contains the functions for Publish Contract.
 */

import { utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import DevCommentContract from "../abi/localhost/ContentBaseCommentV1.json"
import StagingCommentContract from "../abi/testnet/ContentBaseCommentV1.json"
import ProdCommentContract from "../abi/mainnet/ContentBaseCommentV1.json"
import { ContentBaseCommentV1 as Comment } from "../typechain-types"
import {
  Role,
  CheckRoleParams,
  Category,
  CommentInput,
  UpdateCommentInput,
  CommentToken,
  CommentType,
  Environment,
} from "../types"
import { getKeyOfCommentType } from "./utils"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

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
export function getCommentContractBySigner(key: string) {
  const contract = getContractBySigner({
    privateKey: key,
    address:
      env === "production"
        ? ProdCommentContract.address
        : env === "staging"
        ? StagingCommentContract.address
        : DevCommentContract.address,
    contractInterface:
      env === "production"
        ? ProdCommentContract.abi
        : env === "staging"
        ? StagingCommentContract.abi
        : DevCommentContract.abi,
  }) as Comment

  return contract
}

/**
 * Get contract without key
 */
export function getCommentContractByProvider() {
  const contract = getContractByProvider({
    address:
      env === "production"
        ? ProdCommentContract.address
        : env === "staging"
        ? StagingCommentContract.address
        : DevCommentContract.address,
    contractInterface:
      env === "production"
        ? ProdCommentContract.abi
        : env === "staging"
        ? StagingCommentContract.abi
        : DevCommentContract.abi,
  }) as Comment

  return contract
}

/**
 * A function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const commentContract = getCommentContractBySigner(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String("")
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await commentContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * A function to update Profile contract address stored on the Comment contract in order for the Comment contract to communicate with the Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Profile contract address
 */
export async function updateProfileContract(
  key: string,
  contractAddress: string
) {
  const commentContract = getCommentContractBySigner(key)
  await commentContract.updateProfileContract(contractAddress)
}

/**
 * A function to update Publish contract address stored on the Comment contract in order for the Comment contract to communicate with the Publish contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param contractAddress - Publish contract address
 */
export async function updatePublishContract(
  key: string,
  contractAddress: string
) {
  const commentContract = getCommentContractBySigner(key)
  await commentContract.updatePublishContract(contractAddress)
}

/**
 * A function to comment on a publish.
 * @param input - see CommentInput
 */
export async function commentOnPublish(input: CommentInput) {
  const {
    key,
    data: { parentId, creatorId, contentURI, text },
  } = input

  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.commentOnPublish({
    parentId,
    creatorId,
    contentURI: contentURI.toLowerCase(),
    text,
  })
  await transaction.wait()
}

/**
 * A function to comment on a comment.
 * @param input - see CommentOnCommentInput
 */
export async function commentOnComment(input: CommentInput) {
  const {
    key,
    data: { parentId, creatorId, contentURI, text },
  } = input

  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.commentOnComment({
    parentId,
    creatorId,
    contentURI: contentURI.toLowerCase(),
    text,
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
    data: { tokenId, creatorId, contentURI, text },
  } = input

  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.updateComment({
    tokenId,
    creatorId,
    contentURI: contentURI.toLowerCase(),
    text,
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
  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.deleteComment(tokenId, creatorId)
  await transaction.wait()
}

/**
 * A function to like/unLike a comment.
 * @param key {string} - wallet's key
 * @param commentId {number} - a comment token id
 * @param profileId {number} - a profile token id
 */
export async function likeComment(
  key: string,
  commentId: number,
  profileId: number
) {
  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.likeComment(commentId, profileId)
  await transaction.wait()
}

/**
 * A function to dis disLike/undoDisLike a comment.
 * @param key {string} - wallet's key
 * @param commentId {number} - a comment token id
 * @param profileId {number} - a profile token id
 */
export async function disLikeComment(
  key: string,
  commentId: number,
  profileId: number
) {
  const commentContract = getCommentContractBySigner(key)
  const transaction = await commentContract.disLikeComment(commentId, profileId)
  await transaction.wait()
}

/**
 * A function to get Comment struct by provided id.
 * @param commentId a token id of the publish
 * @return token {Comment object}
 */
export async function fetchComment(commentId: number): Promise<CommentToken> {
  const commentContract = getCommentContractByProvider()
  const { owner, creatorId, parentId, commentType, contentURI } =
    await commentContract.getCommentById(commentId)

  return {
    tokenId: commentId,
    owner,
    creatorId: creatorId.toNumber(),
    parentId: parentId.toNumber(),
    commentType: getKeyOfCommentType(commentType) as CommentType,
    contentURI,
  }
}

/**
 * A function to get token uri.
 * @param tokenId {number} a token id
 * @return uri {string}
 */
export async function getTokenURI(tokenId: number): Promise<string> {
  const commentContract = getCommentContractByProvider()
  const uri = await commentContract.tokenURI(tokenId)
  return uri
}

/**
 * A function to get the profile contract address.
 * @returns address {string}
 */
export async function getProfileContractAddress() {
  const commentContract = getCommentContractByProvider()
  const address = await commentContract.getProfileContract()
  return address
}

/**
 * A function to get the publish contract address.
 * @returns address {string}
 */
export async function getPublishContractAddress() {
  const commentContract = getCommentContractByProvider()
  const address = await commentContract.getPublishContract()
  return address
}
