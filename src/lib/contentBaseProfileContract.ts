import { utils, ethers } from 'ethers'

import ContentBaseProfileContract from '../abi/ContentBaseProfileV2.json'
import { ContentBaseProfileV2 } from '../typechain-types'
import { getContractBySigner, getContractByProvider } from './ethers'

export interface CreateProfileInput {
  key: string
  data: {
    uid: string
    handle: string
    imageURI1: string
    imageURI2: string
    isDefault: boolean
  }
}

export enum Role {
  DEFAULT = 'DEFAULT_ADMIN_ROLE',
  ADMIN = 'ADMIN_ROLE',
  UPGRADER = 'UPGRADER_ROLE',
}

/**
 * @param key a wallet private key
 *
 */
export function getProfileContract(key: string) {
  return getContractBySigner({
    address: ContentBaseProfileContract.address,
    privateKey: key,
    contractInterface: ContentBaseProfileContract.abi,
  }) as ContentBaseProfileV2
}

/**
 * @param handle user's handle
 *
 */
export async function verifyHandle(handle: string) {
  const profileContract = getContractByProvider({
    address: ContentBaseProfileContract.address,
    contractInterface: ContentBaseProfileContract.abi,
  }) as ContentBaseProfileV2
  const isUnique = await profileContract.validateHandle(handle)

  return isUnique
}

export async function getTotalProfilesCount() {
  const profileContract = getContractByProvider({
    address: ContentBaseProfileContract.address,
    contractInterface: ContentBaseProfileContract.abi,
  }) as ContentBaseProfileV2
  const countBigNumber = await profileContract.totalProfiles()

  return countBigNumber.toNumber()
}

/**
 * @param address a wallet address
 * @param key a wallet private key
 *
 */
export async function fetchMyProfiles(address: string, key: string) {
  const profileContract = getProfileContract(key)
  const profiles = await profileContract.fetchMyProfiles(address)
  const formattedProfiles = profiles.map(
    ({ profileId, handle, imageURI1, imageURI2, isDefault, uid, owner }) => {
      return {
        profileId: profileId.toNumber(),
        uid,
        handle,
        imageURI1,
        imageURI2,
        owner,
        isDefault,
      }
    }
  )

  return formattedProfiles
}

/**
 * @param input.key a wallet private key
 * @param input.data.uid a uid of the user
 * @param input.data.handle a handle
 * @param input.data.imageURI1 a profile image uri saved on ipfs
 * @param input.data.imageURI2 a profile image uri save on cloud storage
 * @param input.data.isDefault a boolean to indicate the profile is default or not
 *
 */
export async function createProfile(input: CreateProfileInput) {
  const {
    key,
    data: { uid, handle, imageURI1, imageURI2, isDefault },
  } = input

  // Validate the handle
  const isHandleValid = verifyHandle(handle)

  if (!isHandleValid) throw new Error('Handle is invalid or taken')

  const profileContract = getProfileContract(key)

  const transaction = await profileContract.createProfile({
    uid,
    handle,
    imageURI1,
    imageURI2,
    isDefault,
  })

  const tx = await transaction.wait()
  let profileId

  if (tx.events) {
    const profileCreatedEvent = tx.events.find(
      (e) => e.event === 'ProfileCreated'
    )

    if (profileCreatedEvent) {
      if (profileCreatedEvent.args) {
        const [id, _] = profileCreatedEvent.args as [ethers.BigNumber, string]
        profileId = id.toNumber()
      }
    }
  }
  console.log('id -->', profileId)

  return profileId
}

/**
 * @param input.role a role name to check
 * @param input.address a wallet address
 * @param input.key a wallet private key
 *
 */
export async function checkUserRole({
  role,
  address,
  key,
}: {
  role: Role
  address: string
  key: string
}) {
  const profileContract = getProfileContract(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String('')
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await profileContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * @param input.key a wallet private key
 * @param input.data.uid a uid of the user
 * @param input.data.handle a handle
 * @param input.data.imageURI1 a profile image uri saved on ipfs
 * @param input.data.imageURI2 a profile image uri save on cloud storage
 * @param input.data.isDefault a boolean to indicate the profile is default or not
 *
 */
export async function estimateCreateProfileGas(input: CreateProfileInput) {
  const {
    key,
    data: { uid, handle, imageURI1, imageURI2, isDefault },
  } = input
  const profileContract = getProfileContract(key)

  const gasInWei = await profileContract.estimateGas.createProfile({
    uid,
    handle,
    imageURI1,
    imageURI2,
    isDefault,
  })

  return ethers.utils.formatEther(gasInWei)
}
