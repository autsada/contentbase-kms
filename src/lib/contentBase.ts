/**
 * This file contains the functions that aren't  specific to Profile, Publish, Follow, or Like
 */
import { utils } from 'ethers'

import ContentBaseContract from '../abi/ContentBase.json'
import { ContentBase } from '../typechain-types'
import { getContractBySigner, getContractByProvider } from './ethers'

export enum Role {
  DEFAULT = 'DEFAULT_ADMIN_ROLE',
  ADMIN = 'ADMIN_ROLE',
  UPGRADER = 'UPGRADER_ROLE',
}

/**
 * @param key a wallet private key
 *
 */
export function getContentBaseContract(key: string) {
  return getContractBySigner({
    address: ContentBaseContract.address,
    privateKey: key,
    contractInterface: ContentBaseContract.abi,
  }) as ContentBase
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
  const contentBaseContract = getContentBaseContract(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? utils.formatBytes32String('')
      : utils.keccak256(utils.toUtf8Bytes(role))
  const hasGivenRole = await contentBaseContract.hasRole(
    formattedBytes,
    address
  )

  return hasGivenRole
}

/**
 * A function to get total NFTs count of the contract
 *
 */
export async function getTotalNFTsCount() {
  const contentBaseContract = getContractByProvider({
    address: ContentBaseContract.address,
    contractInterface: ContentBaseContract.abi,
  }) as ContentBase
  const countBigNumber = await contentBaseContract.totalNFTs()

  return countBigNumber.toNumber()
}

/**
 * A function to get tokenURI of a specific token id
 * @param tokenId {number} - a token id
 *
 */
export async function getTokenURI(tokenId: number) {
  const contentBaseContract = getContractByProvider({
    address: ContentBaseContract.address,
    contractInterface: ContentBaseContract.abi,
  }) as ContentBase
  const tokenURI = await contentBaseContract.tokenURI(tokenId)

  return tokenURI
}

/**
 * A function to burn token
 * @param tokenId {number} - a token id
 *
 */
export async function burnToken(tokenId: number, key: string) {
  const contentBaseContract = getContentBaseContract(key)
  await contentBaseContract.burn(tokenId)
}
