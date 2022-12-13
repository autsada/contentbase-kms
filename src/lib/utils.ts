import CryptoJs from "crypto-js"

import { Category, CommentType } from "../types"

const { KMS_ENCRYPT_KEY, KMS_ACCESS_KEY } = process.env

export function encryptString(text: string): string {
  console.time("string-encrypt")
  const encrypted = CryptoJs.AES.encrypt(text, KMS_ENCRYPT_KEY!).toString()

  console.timeEnd("string-encrypt")
  return encrypted
}

export function encryptObject(obj: object): string {
  const encrypted = CryptoJs.AES.encrypt(
    JSON.stringify(obj),
    KMS_ENCRYPT_KEY!
  ).toString()

  return encrypted
}

export function decryptString(text: string) {
  const bytes = CryptoJs.AES.decrypt(text, KMS_ENCRYPT_KEY!)

  return bytes.toString(CryptoJs.enc.Utf8)
}

export function decryptObject(text: string) {
  const bytes = CryptoJs.AES.decrypt(text, KMS_ENCRYPT_KEY!)

  return JSON.parse(bytes.toString(CryptoJs.enc.Utf8))
}

/**
 * @notice Verify if token is correct
 *
 */
export function checkAccessKey(token: string) {
  return token === KMS_ACCESS_KEY
}

// A helper function to get Category index.
export function getIndexOfCategory(cat: Category) {
  return Object.keys(Category).indexOf(cat)
}

// A helper function to get Category key.
export function getKeyOfCategory(index: number) {
  return Object.keys(Category)[index]
}

// A helper function to get CommentTYpe index.
export function getIndexOfCommentType(ct: CommentType) {
  return Object.keys(CommentType).indexOf(ct)
}

// A helper function to get CommentType key.
export function getKeyOfCommentType(index: number) {
  return Object.keys(CommentType)[index]
}
