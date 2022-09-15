import express from 'express'

import {
  createProfileNft,
  verifyProfileHandle,
  getProfilesCount,
  getProfilesByAddress,
  checkRole,
  estimateCreateProfileNftGas,
} from '../controllers/profiles'
import { authMiddleware } from '../middlewares/auth'

export const profilesRouter = express.Router()

profilesRouter.get('/total', authMiddleware, getProfilesCount)
profilesRouter.get(
  '/my-profiles/address/:address/key/:key',
  authMiddleware,
  getProfilesByAddress
)
profilesRouter.post('/check-role', authMiddleware, checkRole)
profilesRouter.post('/verifyHandle', authMiddleware, verifyProfileHandle)
profilesRouter.post('/create', authMiddleware, createProfileNft)
profilesRouter.post('/estimateGas', authMiddleware, estimateCreateProfileNftGas)
