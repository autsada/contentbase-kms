import express from 'express'

import { authMiddleware } from '../middlewares/auth'
import {
  getTokensCount,
  tokenURI,
  checkRole,
  burnNFT,
} from '../controllers/tokens'

export const tokensRouter = express.Router()

tokensRouter.post('/check-role/key/:key', authMiddleware, checkRole)
tokensRouter.get('/total', authMiddleware, getTokensCount)
tokensRouter.get('/tokenId/:tokenId', authMiddleware, tokenURI)
tokensRouter.delete('/burn/tokenId/:tokenId/key/:key', authMiddleware, burnNFT)
