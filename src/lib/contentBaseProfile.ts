/**
 * This file contains the functions that are  specific to Profile
 */

import { ethers } from 'ethers'

import { getContentBaseContract } from './contentBase'
import ContentBaseContract from '../abi/ContentBase.json'
import { ContentBase } from '../typechain-types'
import {
  ProfileCreatedEvent,
  ProfileImageUpdatedEvent,
  DefaultProfileUpdatedEvent,
} from '../typechain-types/contracts/ContentBaseProfile'
import { getContractByProvider } from './ethers'

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
    profileId: number
    imageURI: string
    tokenURI: string
  }
}

/**
 * @param handle user's handle
 *
 */
export async function verifyHandle(handle: string) {
  const contentBaseContract = getContractByProvider({
    address: ContentBaseContract.address,
    contractInterface: ContentBaseContract.abi,
  }) as ContentBase
  const isUnique = await contentBaseContract.validateHandle(handle)

  return isUnique
}

/**
 * @param address a wallet address
 * @param key a wallet private key
 *
 */
export async function fetchMyProfiles(address: string, key: string) {
  const contentBaseContract = getContentBaseContract(key)
  const profiles = await contentBaseContract.fetchProfilesByAddress(address)
  const formattedProfiles = profiles.map(
    ({ profileId, isDefault, handle, owner, imageURI }) => {
      return {
        profileId: profileId.toNumber(),
        handle,
        isDefault,
        imageURI,
        owner,
      }
    }
  )

  return formattedProfiles
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

  let profileId
  let isDefault

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'ProfileCreated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [tokenId, d, _] =
          profileCreatedEvent.args as ProfileCreatedEvent['args']

        profileId = tokenId.toNumber()
        isDefault = d
      }
    }
  }

  return { profileId, isDefault }
}

/**
 * @param input.key a wallet private key
 * @param input.data.profileId an id of the profile
 * @param input.data.imageURI a uri of the profile image
 * @param input.data.tokenURI a uri of the token's metadata file
 *
 */
export async function updateProfile(input: UpdateProfileImageInput) {
  const {
    key,
    data: { profileId, imageURI, tokenURI },
  } = input

  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.updateProfileImage({
    profileId,
    imageURI,
    tokenURI,
  })

  const tx = await transaction.wait()
  let updatedProfileId

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'ProfileImageUpdated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [tokenId, _] =
          profileCreatedEvent.args as ProfileImageUpdatedEvent['args']

        updatedProfileId = tokenId.toNumber()
      }
    }
  }

  return updatedProfileId
}

/**
 * @param input.key a wallet private key
 * @param input.data.profileId an id of the profile
 *
 */
export async function setDefaultProfile({
  key,
  profileId,
}: {
  key: string
  profileId: number
}) {
  const contentBaseContract = getContentBaseContract(key)

  const transaction = await contentBaseContract.setDefaultProfile(profileId)

  const tx = await transaction.wait()
  let id

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'DefaultProfileUpdated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [tokenId, _] =
          profileCreatedEvent.args as DefaultProfileUpdatedEvent['args']

        id = tokenId.toNumber()
      }
    }
  }

  return id
}

/**
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

/**
 * @param tokenId {number} a profile id
 * @param key {string} a wallet private key
 *
 */
export async function getProfileById(tokenId: number, key: string) {
  const contentBaseContract = getContentBaseContract(key)
  const profile = await contentBaseContract.getProfileById(tokenId)

  const { profileId, owner, handle, imageURI, isDefault } = profile

  return {
    profileId: profileId.toNumber(),
    owner,
    handle,
    imageURI,
    isDefault,
  }
}
