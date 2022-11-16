import { getProfileContractForWs } from "../lib/ProfileNFT"

/**
 * For testing listen to events
 */
export function main() {
  const profileContract = getProfileContractForWs()

  profileContract.on(
    "ProfileCreated",
    (
      tokenId,
      owner,
      handle,
      imageURI,
      originalHandle,
      isDefault,
      timestamp,
      event
    ) => {
      console.log("id -->", tokenId)
      console.log("owner -->", owner)
      console.log("handle -->", handle)
      console.log("imageURI -->", imageURI)
      console.log("originalHandle -->", originalHandle)
      console.log("isDefault -->", isDefault)
      console.log("timestamp -->", timestamp)
      console.log("event -->", event)
    }
  )
}
