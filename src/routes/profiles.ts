import express from 'express'

import {
  createProfileNft,
  updateProfileImage,
  verifyProfileHandle,
  getProfilesByAddress,
  setProfileAsDefault,
  getOneProfile,
  estimateCreateProfileNftGas,
} from '../controllers/profiles'
import { authMiddleware } from '../middlewares/auth'

export const profilesRouter = express.Router()

profilesRouter.post('/verifyHandle', authMiddleware, verifyProfileHandle)
profilesRouter.get(
  '/my-profiles/address/:address/key/:key',
  authMiddleware,
  getProfilesByAddress
)
profilesRouter.get('/profileId/:profileId/key/:key', getOneProfile)
profilesRouter.post('/create', authMiddleware, createProfileNft)
profilesRouter.post(
  '/update/profileId/:profileId/key/:key',
  authMiddleware,
  updateProfileImage
)
profilesRouter.post(
  '/set-default/profileId/:profileId/key/:key',
  authMiddleware,
  setProfileAsDefault
)
profilesRouter.post('/estimateGas', authMiddleware, estimateCreateProfileNftGas)
