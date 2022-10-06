/**
 * This file contains the functions that are  specific to Publish token
 */

import {
  getContentBaseContract,
  getContentBaseContractByProvider,
  getTokenTypeString,
} from './contentBase'
import {
  DataTypes,
  PublishCreatedEvent,
  PublishUpdatedEvent,
} from '../typechain-types/contracts/ContentBasePublish'

/**
 * @param key - a wallet's key
 * @param data.tokenURI - a token's metadata uri
 * @param data.profileId - a token id of the creator's profile
 * @param data.imageURI - a thumbnail image uri of the publish
 * @param data.contentURI - a uri of the publish
 */
export interface CreatePublishInput {
  key: string
  data: {
    tokenURI: string
    profileId: number
    imageURI: string
    contentURI: string
  }
}

/**
 * @param key - a wallet's key
 * @param data.tokenURI - a token's metadata uri
 * @param data.tokenId - a token id of the publish to be updated
 * @param data.imageURI - a thumbnail image uri of the publish
 * @param data.contentURI - a uri of the publish
 */
export interface UpdatePublishInput {
  key: string
  data: {
    tokenURI: string
    tokenId: number
    imageURI: string
    contentURI: string
  }
}

/**
 *
 * @param input - refer to CreatePublishInput
 * @returns DataTypes.Token
 */
export async function createPublish(input: CreatePublishInput) {
  const {
    key,
    data: { tokenURI, profileId, imageURI, contentURI },
  } = input

  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.createPublish(tokenURI, {
    profileId,
    imageURI,
    contentURI,
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const publishCreatedEvent = tx.events.find(
      (e) => e.event === 'PublishCreated'
    )

    if (publishCreatedEvent) {
      if (publishCreatedEvent.args) {
        const [
          {
            tokenId,
            associatedId,
            owner,
            tokenType,
            handle,
            imageURI,
            contentURI,
          },
          _,
        ] = publishCreatedEvent.args as PublishCreatedEvent['args']

        token = {
          tokenId: tokenId.toNumber(),
          associatedId: associatedId.toNumber(),
          owner,
          tokenType: getTokenTypeString(tokenType),
          handle,
          imageURI,
          contentURI,
        }
      }
    }
  }

  return token
}

/**
 * @param input - refer to UpdatePublishInput
 *
 */
export async function updatePublish(input: UpdatePublishInput) {
  const {
    key,
    data: { tokenURI, tokenId, imageURI, contentURI },
  } = input

  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.updatePublish(
    tokenId,
    tokenURI,
    {
      imageURI,
      contentURI,
    }
  )

  const tx = await transaction.wait()
  let updatedToken

  if (tx.events) {
    const publishUpdatedEvent = tx.events.find(
      (e) => e.event === 'PublishUpdated'
    )

    if (publishUpdatedEvent) {
      if (publishUpdatedEvent.args) {
        const [
          {
            tokenId,
            associatedId,
            owner,
            tokenType,
            handle,
            imageURI,
            contentURI,
          },
          _,
        ] = publishUpdatedEvent.args as PublishUpdatedEvent['args']

        updatedToken = {
          tokenId: tokenId.toNumber(),
          associatedId: associatedId.toNumber(),
          owner,
          tokenType: getTokenTypeString(tokenType),
          handle,
          imageURI,
          contentURI,
        }
      }
    }
  }

  return updatedToken
}

/**
 * Get user's publishes
 * @param key a wallet private key
 * @param tokenIds an array of profile token ids
 * @dev for owner to fetch their own publishes
 * @dev tokenIds array length must not greater than 40
 *
 */
export async function fetchMyPublishes(key: string, tokenIds: number[]) {
  const contentBaseContract = getContentBaseContract(key)
  const myPublishes = await contentBaseContract.ownerPublishes(tokenIds)
  const publishes = myPublishes.map(
    ({
      tokenId,
      associatedId,
      owner,
      tokenType,
      handle,
      imageURI,
      contentURI,
    }) => {
      return {
        tokenId: tokenId.toNumber(),
        associatedId: associatedId.toNumber(),
        owner,
        tokenType: getTokenTypeString(tokenType),
        handle,
        imageURI,
        contentURI,
      }
    }
  )

  return publishes
}

/**
 * Get publishes
 * @param tokenIds an array of profile token ids
 * @dev can call by anybody
 * @dev tokenIds array length must not greater than 40
 *
 */
export async function fetchPublishes(tokenIds: number[]) {
  const contentBaseContract = getContentBaseContractByProvider()
  const myPublishes = await contentBaseContract.publishesByIds(tokenIds)
  const publishes = myPublishes.map(
    ({
      tokenId,
      associatedId,
      owner,
      tokenType,
      handle,
      imageURI,
      contentURI,
    }) => {
      return {
        tokenId: tokenId.toNumber(),
        associatedId: associatedId.toNumber(),
        owner,
        tokenType: getTokenTypeString(tokenType),
        handle,
        imageURI,
        contentURI,
      }
    }
  )

  return publishes
}

/**
 * Get publish
 * @param publishId a token id of the publish
 *
 */
export async function fetchPublish(publishId: number) {
  const contentBaseContract = getContentBaseContractByProvider()
  const {
    tokenId,
    associatedId,
    owner,
    tokenType,
    handle,
    imageURI,
    contentURI,
  } = await contentBaseContract.publishById(publishId)

  return {
    tokenId: tokenId.toNumber(),
    associatedId: associatedId.toNumber(),
    owner,
    tokenType: getTokenTypeString(tokenType),
    handle,
    imageURI,
    contentURI,
  }
}
