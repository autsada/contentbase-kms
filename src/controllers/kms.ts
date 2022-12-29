import type { Request, Response, NextFunction } from "express"

import { createCryptoKey } from "../lib/kms"

/**
 * @dev The function to generate blockchain wallet
 */
export async function generateCryptoKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key = await createCryptoKey()

    if (!key) throw new Error("Error in creating key")

    res.status(200).json({ keyName: key?.name })
  } catch (error) {
    next(error)
  }
}
