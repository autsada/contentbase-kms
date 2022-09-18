import { Request, Response, NextFunction } from 'express'

import { checkAuth } from '../lib/utils'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get x-access-key header
  const accessKey = req.headers['x-access-key']
  if (!accessKey) {
    res.status(401).send('Un Authorized')
  } else {
    const token = typeof accessKey === 'string' ? accessKey : accessKey[0]
    const hasAuth = checkAuth(token)

    if (hasAuth) {
      next()
    } else {
      res.status(401).send('Un Authorized')
    }
  }
}
