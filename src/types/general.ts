/**
 * @param id {string} - a document id
 * @param key {string} - a blockchain wallet key (encrypted)
 * @param address {string} - a blockchain wallet address
 */
export type Wallet = {
  id: string
  key: string
  address: string
}

/**
 * @param id - a document id
 * @param address - a blockchain wallet address
 */
export type Account = {
  id: string
  address: string
  type: "traditional" | "wallet"
  createdAt: string
  updatedAt?: string | null
}

export type Environment = "production" | "development"

/**
 * Alchemy webhooks types
 */

export type WebHookEventCategory = "external" | "internal" | "token"
export type AddressActivity = {
  event: WebHookEventCategory
  fromAddress: string
  id: string
  isAcknowledged: boolean
  toAddress: string
  value?: number | null
}
export type WebHookAddressActivity = {
  asset: string
  category: WebHookEventCategory
  erc721TokenId?: string | null
  fromAddress: string
  toAddress: string
  hash: string
  rawContract: WebHookRawContract
  value?: number | null
}
export type WebHookEvent = {
  activity: WebHookAddressActivity[]
  network: string
}
export type WebHookRawContract = {
  address?: string | null
  decimal?: number | null
  rawValue?: string | null
}
export type WebHookRequestBody = {
  createdAt: string
  event: WebHookEvent
  id: string
  type: string
  webhookId: string
}
