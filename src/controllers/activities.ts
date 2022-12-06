import type { Request, Response } from "express"

import { accountsCollection, activitiesCollection } from "../config/firebase"
import { searchDocByField, updateDocById } from "../lib/firebase"
import type { Account } from "../types"
import type { WebHookRequestBody, AddressActivity } from "../types"

export async function updateActivity(req: Request, res: Response) {
  try {
    const body = req.body as WebHookRequestBody
    const activity = body.event.activity[0]

    if (activity) {
      // Find users that relate to the activity
      const fromAddress = activity.fromAddress.toLowerCase()
      const toAddress = activity.toAddress.toLowerCase()

      // TODO: Remove connection to `accounts` collection instead connect to public APIs to query accounts (as we move `acounts` from Firestore to Cloud SQL).

      const fromUserDocs = await searchDocByField<Account>({
        collectionName: accountsCollection,
        fieldName: "address",
        fieldValue: fromAddress,
      })

      const toUserDocs = await searchDocByField<Account>({
        collectionName: accountsCollection,
        fieldName: "address",
        fieldValue: toAddress,
      })

      // Combine the users array
      const relatedUsers = [...fromUserDocs, ...toUserDocs]

      // Update activity of these users in Firestore
      // Use Promise.allSettled because if one item rejects it will not reject the rest
      await Promise.allSettled(
        relatedUsers.map((user) => {
          return updateDocById<Omit<AddressActivity, "id">>({
            collectionName: activitiesCollection,
            docId: user.id,
            data: {
              event: activity.category,
              fromAddress,
              toAddress,
              value: activity.value || 0,
              isAcknowledged: false,
            },
          })
        })
      )
    }

    res.status(200).end()
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
