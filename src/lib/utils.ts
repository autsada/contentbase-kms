import CryptoJs from 'crypto-js'

const { KMS_ENCRYPT_KEY, KMS_ACCESS_KEY } = process.env

export function encryptString(text: string): string {
  const encrypted = CryptoJs.AES.encrypt(text, KMS_ENCRYPT_KEY!).toString()

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
export function checkAuth(token: string) {
  return token === KMS_ACCESS_KEY
}
