import { firestore } from "firebase-admin"

import { db } from "../config/firebase"

type Args<T = Record<string, any>> = {
  collectionName: string
  docId: string
  data: T
  fieldName: string
  fieldValue: any
}

export function snapshotToDoc<T extends Record<string, any>>(
  snapshot: firestore.DocumentSnapshot<firestore.DocumentData>
) {
  const data = snapshot.data() as T & {
    createdAt: firestore.Timestamp
    updatedAt?: firestore.Timestamp
  }

  const createdAt = data?.createdAt ? data.createdAt.toDate().toString() : null
  const updatedAt = data?.updatedAt ? data.updatedAt.toDate().toString() : null

  const doc: T = {
    ...data,
    id: snapshot.id,
    createdAt,
    updatedAt,
  }

  return doc
}

export async function getDocById<T extends Record<string, any>>({
  collectionName,
  docId,
}: Pick<Args, "collectionName" | "docId">) {
  const snapshot = await db.collection(collectionName).doc(docId).get()

  if (!snapshot.exists) return null

  return snapshotToDoc<T>(snapshot)
}

export async function getEncryptedKey(uid: string) {
  // Get user's wallet from Firestore.
  const wallet = await getDocById<{
    id: string
    key: string
    address: string
  }>({
    collectionName: "wallets",
    docId: uid,
  })
  if (!wallet) throw new Error("Forbidden")

  return wallet.key
}
