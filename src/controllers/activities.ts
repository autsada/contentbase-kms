import type { Request, Response } from "express"

import { activitiesCollection } from "../config/firebase"
import { updateDocById } from "../lib/firebase"
import type { WebHookRequestBody, AddressActivity } from "../types"

export async function updateActivity(req: Request, res: Response) {
  try {
    const body = req.body as WebHookRequestBody
    const activity = body.event.activity[0]

    if (activity && activity.value && activity.value > 0) {
      // Find users that relate to the activity
      const fromAddress = activity.fromAddress.toLowerCase()
      const toAddress = activity.toAddress.toLowerCase()

      // Update sender's activity
      await updateDocById<Omit<AddressActivity, "id">>({
        collectionName: activitiesCollection,
        docId: fromAddress,
        data: {
          event: activity.category,
          fromAddress,
          toAddress,
          value: activity.value,
          isAcknowledged: false,
        },
      })

      // Update receiver's activity
      await updateDocById<Omit<AddressActivity, "id">>({
        collectionName: activitiesCollection,
        docId: toAddress,
        data: {
          event: activity.category,
          fromAddress,
          toAddress,
          value: activity.value,
          isAcknowledged: false,
        },
      })
    }

    res.status(200).end()
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}
