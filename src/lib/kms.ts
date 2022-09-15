import { KeyManagementServiceClient } from '@google-cloud/kms'

const { KMS_PROJECT_ID, KMS_LOCATION_ID, KMS_KEYRING_ID, KMS_CRYPTOKEY_ID } =
  process.env

const client = new KeyManagementServiceClient()

export async function createKeyRing() {
  const locationName = client.locationPath(KMS_PROJECT_ID!, KMS_LOCATION_ID!)

  const [keyRing] = await client.createKeyRing({
    parent: locationName,
    keyRingId: KMS_KEYRING_ID,
  })

  return keyRing
}

export async function createCryptoKey() {
  const keyring = await createKeyRing()
  if (!keyring) return null

  const keyringName = keyring.name
  if (!keyringName) return null

  const [key] = await client.createCryptoKey({
    parent: keyringName,
    cryptoKeyId: KMS_CRYPTOKEY_ID,
    cryptoKey: {
      purpose: 'ENCRYPT_DECRYPT',
      versionTemplate: {
        algorithm: 'GOOGLE_SYMMETRIC_ENCRYPTION',
      },
      // Rotate the key every 10 days.
      rotationPeriod: {
        seconds: 60 * 60 * 24 * 10,
      },
      // Start the first rotation in 24 hours.
      nextRotationTime: {
        seconds: new Date().getTime() / 1000 + 60 * 60 * 24,
      },
    },
  })

  return key
}

export async function encrypt(text: string) {
  // Build the key name
  const keyName = client.cryptoKeyPath(
    KMS_PROJECT_ID!,
    KMS_LOCATION_ID!,
    KMS_KEYRING_ID!,
    KMS_CRYPTOKEY_ID!
  )

  const plaintextBuffer = Buffer.from(text)

  // Optional, but recommended: compute plaintext's CRC32C.
  const crc32c = require('fast-crc32c')
  const plaintextCrc32c = crc32c.calculate(plaintextBuffer)

  const [encryptResponse] = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  })

  const ciphertext = encryptResponse.ciphertext

  if (!ciphertext) throw new Error('No cipher text')

  // Optional, but recommended: perform integrity verification on encryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (!encryptResponse.verifiedPlaintextCrc32c) {
    throw new Error('Encrypt: request corrupted in-transit')
  }
  if (
    crc32c.calculate(ciphertext) !==
    Number(encryptResponse.ciphertextCrc32c?.value)
  ) {
    throw new Error('Encrypt: response corrupted in-transit')
  }

  return Buffer.from(ciphertext).toString('base64')
}

export async function decrypt(text: string) {
  // Build the key name
  const keyName = client.cryptoKeyPath(
    KMS_PROJECT_ID!,
    KMS_LOCATION_ID!,
    KMS_KEYRING_ID!,
    KMS_CRYPTOKEY_ID!
  )

  const ciphertext = Buffer.from(text, 'base64')

  // Optional, but recommended: compute ciphertext's CRC32C.
  const crc32c = require('fast-crc32c')
  const ciphertextCrc32c = crc32c.calculate(ciphertext)

  const [decryptResponse] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertext,
    ciphertextCrc32c: {
      value: ciphertextCrc32c,
    },
  })

  // Optional, but recommended: perform integrity verification on decryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (
    crc32c.calculate(decryptResponse.plaintext) !==
    Number(decryptResponse.plaintextCrc32c?.value)
  ) {
    throw new Error('Decrypt: response corrupted in-transit')
  }

  const plaintext = decryptResponse.plaintext?.toString()

  return plaintext
}
