import { Request, Response, NextFunction } from "express"

import { checkAccessKey } from "../lib/utils"
import { verifyIdToken } from "../lib/firebase"

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get x-access-key header.
    const accessKey = req.headers["x-access-key"]
    // Get Firebase auth id token.
    const idToken = req.headers["id-token"]

    if (!accessKey) {
      res.status(401).send("Un Authorized")
    } else {
      // Verify access key.
      const key = typeof accessKey === "string" ? accessKey : accessKey[0]
      const hasAccesskey = checkAccessKey(key)

      // Verify id token.
      const token = typeof idToken === "string" ? idToken : accessKey[0]
      const user = await verifyIdToken(token)

      if (hasAccesskey) {
        req.uid = user?.uid
        next()
      } else {
        res.status(401).send("Un Authorized")
      }
    }
  } catch (error) {
    console.log("error -->", error)
    res.status(500).send("Server Error")
  }
}
