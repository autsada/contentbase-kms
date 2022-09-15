import express from 'express'

import { createWallet, getWalletBalance } from '../controllers/wallet'
import { authMiddleware } from '../middlewares/auth'

export const walletRouter = express.Router()

walletRouter.get('/balance/:address', authMiddleware, getWalletBalance)
walletRouter.post('/create', authMiddleware, createWallet)
