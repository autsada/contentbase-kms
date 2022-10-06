/**
 * This file contains the functions that are  specific to Profile token
 */

import { ethers } from 'ethers'

import {
  getContentBaseContract,
  getContentBaseContractByProvider,
  getTokenTypeString,
} from './contentBase'
import ContentBaseContract from '../abi/ContentBase.json'
import { ContentBase } from '../typechain-types'
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
} from '../typechain-types/contracts/ContentBaseProfile'
import { DataTypes } from '../typechain-types/contracts/ContentBaseProfile'

export interface CreateProfileInput {
  key: string
  data: {
    handle: string
    imageURI: string
    tokenURI: string
  }
}

export interface UpdateProfileImageInput {
  key: string
  data: {
    tokenId: number
    imageURI: string
    tokenURI: string
  }
}

/**
 * @param input.key a wallet private key
 * @param input.data.handle a handle
 * @param input.data.imageURI a uri of the profile image
 * @param input.data.tokenURI a uri of the token's metadata file
 *
 */
export async function createProfile(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI, tokenURI },
  } = input

  // Validate the handle
  const isHandleValid = verifyHandle(handle)

  if (!isHandleValid) throw new Error('Handle is invalid or taken')

  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.createProfile(tokenURI, {
    handle,
    imageURI,
  })

  const tx = await transaction.wait()

  let token

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'ProfileCreated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
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
        ] = profileCreatedEvent.args as ProfileCreatedEvent['args']

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
 * @param input.key a wallet private key
 * @param input.data.tokenId an id of the profile token
 * @param input.data.imageURI a uri of the profile image
 * @param input.data.tokenURI a uri of the token's metadata file
 *
 */
export async function updateProfile(input: UpdateProfileImageInput) {
  const {
    key,
    data: { tokenId, imageURI, tokenURI },
  } = input

  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.updateProfileImage(
    tokenId,
    tokenURI,
    imageURI
  )

  const tx = await transaction.wait()
  let updatedToken

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'ProfileImageUpdated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
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
        ] = profileCreatedEvent.args as ProfileImageUpdatedEvent['args']

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
 * @param input.key a wallet private key
 * @param input.data.tokenId an id of the profile token
 *
 */
export async function setDefaultProfile({
  key,
  tokenId,
}: {
  key: string
  tokenId: number
}) {
  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.setDefaultProfile(tokenId)

  const tx = await transaction.wait()
  let token

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'DefaultProfileUpdated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
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
        ] = profileCreatedEvent.args as DefaultProfileUpdatedEvent['args']

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
 * @param key a wallet private key
 * @param tokenIds an array of profile token ids
 * @dev tokenIds array length must not greater than 40
 *
 */
export async function fetchMyProfiles(key: string, tokenIds: number[]) {
  const contentBaseContract = getContentBaseContract(key)
  const profiles = await contentBaseContract.ownerProfiles(tokenIds)
  const formattedProfiles = profiles.map(
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

  return formattedProfiles
}

/**
 * @param profileId {number} a token id of the profile token
 *
 */
export async function getProfileById(profileId: number) {
  const contentBaseContract = getContentBaseContractByProvider()
  const {
    tokenId,
    associatedId,
    owner,
    tokenType,
    handle,
    imageURI,
    contentURI,
  } = await contentBaseContract.profileById(profileId)

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

/**
 * A function get user's default profile
 * @param key a wallet private key
 *
 */
export async function getDefaultProfile(key: string) {
  const contentBaseContract = getContentBaseContract(key)
  const {
    tokenId,
    associatedId,
    owner,
    tokenType,
    handle,
    imageURI,
    contentURI,
  } = await contentBaseContract.defaultProfile()

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

/**
 * A function to verify if handle is valid
 * @param handle user's handle
 *
 */
export async function verifyHandle(handle: string) {
  const contentBaseContract = getContentBaseContractByProvider()
  const isUnique = await contentBaseContract.validateHandle(handle)

  return isUnique
}

/**
 * A function to estimate gas used to create a profile token
 * @param input.key a wallet private key
 * @param input.data.handle a handle
 * @param input.data.imageURI a uri of the profile image
 * @param input.data.tokenURI a uri of the token's metadata file
 *
 */
export async function estimateCreateProfileGas(input: CreateProfileInput) {
  const {
    key,
    data: { handle, imageURI, tokenURI },
  } = input
  const contentBaseContract = getContentBaseContract(key)

  const gasInWei = await contentBaseContract.estimateGas.createProfile(
    tokenURI,
    {
      handle,
      imageURI,
    }
  )

  return ethers.utils.formatEther(gasInWei)
}
