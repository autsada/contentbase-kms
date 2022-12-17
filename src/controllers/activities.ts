import type { Request, Response } from "express"
import axios from "axios"

import { activitiesCollection } from "../config/firebase"
import { updateDocById } from "../lib/firebase"
import type { WebHookRequestBody, AddressActivity } from "../types"

const { PUBLIC_API_URL } = process.env

export async function updateActivity(req: Request, res: Response) {
  try {
    const body = req.body as WebHookRequestBody
    const activity = body.event.activity[0]

    if (activity && activity.value && activity.value > 0) {
      // Find users that relate to the activity
      const fromAddress = activity.fromAddress.toLowerCase()
      const toAddress = activity.toAddress.toLowerCase()

      // Get the sender account.
      const sender = await getAccount(fromAddress)
      if (sender) {
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
      }

      // Get the receiver account.
      const receiver = await getAccount(toAddress)
      if (receiver) {
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
    }

    res.status(200).end()
  } catch (error) {
    res.status(500).send((error as any).message)
  }
}

async function getAccount(address: string): Promise<{ id: number } | null> {
  const ressult = await axios({
    url: `${PUBLIC_API_URL}/graphql`,
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    data: {
      query: `
        query GetAccount($address: String!) {
          getAccount(address: $address) {
            id
          }
        }
      `,
      variables: {
        address,
      },
    },
  })

  return ressult.data.data?.getAccount
}
