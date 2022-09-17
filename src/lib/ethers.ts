import { ethers } from 'ethers'
import crypto from 'crypto'

import { encrypt } from './kms'
import { encryptString } from './utils'

const { BLOCKHAIN_TESTNET_URL, NODE_ENV, ALCHEMY_API_KEY } = process.env

export function getJsonRpcProvider() {
  const url =
    NODE_ENV === 'development'
      ? BLOCKHAIN_TESTNET_URL!
      : NODE_ENV === 'production'
      ? ''
      : ''

  return new ethers.providers.JsonRpcProvider(url)
}

export function getDefaultProvider() {
  const url =
    NODE_ENV === 'development'
      ? BLOCKHAIN_TESTNET_URL!
      : NODE_ENV === 'production'
      ? ''
      : ''

  return ethers.providers.getDefaultProvider(url, { ALCHEMY_API_KEY })
}

export function getSigner(privateKey: string) {
  const provider = getDefaultProvider()

  return new ethers.Wallet(privateKey, provider)
}

export function getContractByProvider({
  address,
  contractInterface,
}: {
  address: string
  contractInterface: ethers.ContractInterface
}) {
  const provider = getDefaultProvider()

  return new ethers.Contract(address, contractInterface, provider)
}

export function getContractBySigner({
  address,
  privateKey,
  contractInterface,
}: {
  address: string
  privateKey: string
  contractInterface: ethers.ContractInterface
}) {
  const signer = getSigner(privateKey)

  return new ethers.Contract(address, contractInterface, signer)
}

/**
 * @dev get balance of a specific address
 *
 */
export async function getBalance(address: string) {
  const provider = getDefaultProvider()

  const balanceInWei = await provider.getBalance(address)

  return ethers.utils.formatEther(balanceInWei)
}

/**
 * @dev Generate wallet and return the encrypted key
 *
 */
export async function generateWallet() {
  const randomBytes = crypto.randomBytes(32).toString('hex')

  // Generate private key
  const key = `0x${randomBytes}`

  // Generate wallet from private key
  const wallet = new ethers.Wallet(key)

  // // Use this address/key for user1 for local blockchain
  // const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
  // const key =
  //   '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

  // // Use this address/key for user2 for local blockchain
  //  const address = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
  //  const key =
  //    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

  // First encrypt with internal key
  const firstEncryptedKey = encryptString(key)

  // Encrypt the encrypted key with GCP cloud kms
  const encryptedKey = await encrypt(firstEncryptedKey)

  return { key: encryptedKey, address: wallet.address }
}
