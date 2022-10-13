import { KeyManagementServiceClient } from "@google-cloud/kms"

import { decryptString } from "./utils"
import { getDocById } from "./firebase"

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
      purpose: "ENCRYPT_DECRYPT",
      versionTemplate: {
        algorithm: "GOOGLE_SYMMETRIC_ENCRYPTION",
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

  const [encryptResponse] = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
  })

  const ciphertext = encryptResponse.ciphertext

  if (!ciphertext) throw new Error("No cipher text")

  return Buffer.from(ciphertext).toString("base64")
}

export async function decrypt(uid: string) {
  // Build the key name
  const keyName = client.cryptoKeyPath(
    KMS_PROJECT_ID!,
    KMS_LOCATION_ID!,
    KMS_KEYRING_ID!,
    KMS_CRYPTOKEY_ID!
  )

  // Get user's wallet from Firestore.
  const wallet = await getDocById<{ id: string; key: string; address: string }>(
    {
      collectionName: "wallets",
      docId: uid,
    }
  )
  if (!wallet) throw new Error("Forbidden")
  const key = wallet.key

  const ciphertext = Buffer.from(key, "base64")

  const [decryptResponse] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertext,
  })

  // const plaintext = decryptResponse.plaintext?.toString()
  const kmsDecrypted = decryptResponse.plaintext?.toString()
  if (!kmsDecrypted) throw new Error("Forbidden")

  const plaintext = decryptString(kmsDecrypted)

  return plaintext
}
