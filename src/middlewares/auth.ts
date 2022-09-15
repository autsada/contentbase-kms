import { Request, Response, NextFunction } from 'express'

import { checkAuth } from '../lib/utils'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get authorization header
  const token = req.headers['authorization']

  if (!token) {
    res.status(401).send('Un Authorized')
  } else {
    const hasAuth = checkAuth(token)

    if (hasAuth) {
      next()
    } else {
      res.status(401).send('Un Authorized')
    }
  }
}
