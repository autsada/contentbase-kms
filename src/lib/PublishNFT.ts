/**
 * This file contains the functions for Publish Contract.
 */

import { ethers, utils } from "ethers"

import { getContractBySigner, getContractByProvider } from "./ethers"
import PublishContract from "../abi/PublishContract.json"
import { PublishNFT } from "../typechain-types"
import {
  PublishCreatedEvent,
  PublishUpdatedEvent,
} from "../typechain-types/contracts/publish/PublishNFT"
import {
  Role,
  CheckRoleParams,
  Category,
  CreatePublishInput,
  UpdatePublishInput,
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
  }) as PublishNFT
}

/**
 * Get contract without key
 */
export function getPublishContractByProvider() {
  return getContractByProvider({
    address: PublishContract.address,
    contractInterface: PublishContract.abi,
  }) as PublishNFT
}

/**
 * The function to check caller's role.
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
 * The function to set Profile contract.
 * @notice Publish contract needs to communicate with Profile contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Profile contract address
 */
export async function setProfileContract(key: string, address: string) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.setProfileContract(address)
}

/**
 * The function to set Like contract.
 * @notice Publish contract needs to communicate with Like contract
 * @dev this function is for Admin only
 * @param key - wallet's key
 * @param address - Like contract address
 */
export async function setLikeContract(key: string, address: string) {
  const publishContract = getPublishContractBySigner(key)
  await publishContract.setLikeContractAddress(address)
}

/**
 * The function to create Publish NFT.
 * @param input - see CreatePublishInput
 * @return token {Publish object}
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
    description: description!,
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const publishCreatedEvent = tx.events.find(
      (e) => e.event === "PublishCreated"
    )

    if (publishCreatedEvent) {
      if (publishCreatedEvent.args) {
        const [
          {
            tokenId,
            creatorId,
            owner,
            imageURI,
            contentURI,
            metadataURI,
            likes,
          },
          tokenOwner,
          title,
          description,
          primaryCategory,
          secondaryCategory,
          tertiaryCategory,
        ] = publishCreatedEvent.args as PublishCreatedEvent["args"]

        token = {
          tokenId: tokenId.toNumber(),
          creatorId: creatorId.toNumber(),
          owner,
          imageURI,
          contentURI,
          metadataURI,
          likes: likes.toNumber(),
          title,
          description,
          primaryCategory: getKeyOfCategory(primaryCategory),
          secondaryCategory: getKeyOfCategory(secondaryCategory),
          tertiaryCategory: getKeyOfCategory(tertiaryCategory),
        }
      }
    }
  }

  return token
}

/**
 * The function to update Publish.
 * @param input - see UpdatePublishInput
 * @return token {Publish object}
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

  const transaction = await publishContract.updatePublish({
    tokenId,
    creatorId,
    imageURI: imageURI!,
    contentURI: contentURI!,
    metadataURI: metadataURI!,
    title: title!,
    description: description!,
    primaryCategory: getIndexOfCategory(primaryCategory!),
    secondaryCategory: getIndexOfCategory(secondaryCategory!),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory!),
  })

  const tx = await transaction.wait()
  let updatedToken

  if (tx.events) {
    const publishUpdatedEvent = tx.events.find(
      (e) => e.event === "PublishUpdated"
    )

    if (publishUpdatedEvent) {
      if (publishUpdatedEvent.args) {
        const [
          {
            owner,
            tokenId,
            creatorId,
            imageURI,
            contentURI,
            metadataURI,
            likes,
          },
          tokenOwner,
          title,
          description,
          primaryCategory,
          secondaryCategory,
          tertiaryCategory,
        ] = publishUpdatedEvent.args as PublishUpdatedEvent["args"]

        updatedToken = {
          owner,
          tokenId: tokenId.toNumber(),
          creatorId: creatorId.toNumber(),
          imageURI,
          contentURI,
          metadataURI,
          likes: likes.toNumber(),
          title,
          description,
          primaryCategory: getKeyOfCategory(primaryCategory),
          secondaryCategory: getKeyOfCategory(secondaryCategory),
          tertiaryCategory: getKeyOfCategory(tertiaryCategory),
        }
      }
    }
  }

  return updatedToken
}

/**
 * The function to burn a publish token.
 * @param key {string} - wallet's key
 * @param tokenId {number} - a token id
 */
export async function deletePublish(key: string, tokenId: number) {
  const publishContract = getPublishContractBySigner(key)

  await publishContract.burn(tokenId)
}

/**
 * The function to get user's publishes
 * @param key a wallet private key
 * @param tokenIds an array of profile token ids
 * @dev for owner to fetch their own publishes
 * @dev tokenIds array length must not greater than 40
 * @return tokens {array of Publish object}
 */
export async function fetchMyPublishes(key: string, tokenIds: number[]) {
  const profileContract = getPublishContractBySigner(key)
  const myPublishes = await profileContract.ownerPublishes(tokenIds)
  const publishes = myPublishes.map(
    ({
      owner,
      tokenId,
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      likes,
    }) => {
      return {
        owner,
        tokenId: tokenId.toNumber(),
        creatorId: creatorId.toNumber(),
        imageURI,
        contentURI,
        metadataURI,
        likes: likes.toNumber(),
      }
    }
  )

  return publishes
}

/**
 * The function to get publishes by provided ids.
 * @param tokenIds an array of profile token ids
 * @dev can call by anybody
 * @dev tokenIds array length must not greater than 40
 * @return tokens {array of Publish object}
 */
export async function fetchPublishes(tokenIds: number[]) {
  const publishContract = getPublishContractByProvider()
  const myPublishes = await publishContract.getPublishes(tokenIds)
  const publishes = myPublishes.map(
    ({
      owner,
      tokenId,
      creatorId,
      imageURI,
      contentURI,
      metadataURI,
      likes,
    }) => {
      return {
        owner,
        tokenId: tokenId.toNumber(),
        creatorId: creatorId.toNumber(),
        imageURI,
        contentURI,
        metadataURI,
        likes: likes.toNumber(),
      }
    }
  )

  return publishes
}

/**
 * The function to get Publish by provided id.
 * @param publishId a token id of the publish
 * @return token {Publish object}
 */
export async function fetchPublish(publishId: number) {
  const publishContract = getPublishContractByProvider()
  const {
    owner,
    tokenId,
    creatorId,
    imageURI,
    contentURI,
    metadataURI,
    likes,
  } = await publishContract.publishById(publishId)

  return {
    owner,
    tokenId: tokenId.toNumber(),
    creatorId: creatorId.toNumber(),
    imageURI,
    contentURI,
    metadataURI,
    likes: likes.toNumber(),
  }
}

/**
 * The function to get total publishes count.
 * @return count {number}
 */
export async function totalPublishesCount() {
  const publishContract = getPublishContractByProvider()
  const result = await publishContract.publishesCount()

  return result.toNumber()
}

/**
 * The function to estimate gas used to create a publish token.
 * @dev see CreatePublishInput
 * @return gas {number} - amount in ether
 */
export async function estimateCreatePublishGas(input: CreatePublishInput) {
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
    description: description || "",
    primaryCategory: getIndexOfCategory(primaryCategory),
    secondaryCategory: getIndexOfCategory(secondaryCategory),
    tertiaryCategory: getIndexOfCategory(tertiaryCategory),
  })

  return ethers.utils.formatEther(gasInWei)
}
