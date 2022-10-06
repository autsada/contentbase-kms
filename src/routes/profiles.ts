import express from 'express'

import {
  createProfileNft,
  updateProfileImage,
  setProfileAsDefault,
  getMyProfiles,
  getProfile,
  getUserDefaultProfile,
  verifyProfileHandle,
  estimateCreateProfileNftGas,
} from '../controllers/profiles'
import { authMiddleware } from '../middlewares/auth'

export const profilesRouter = express.Router()

profilesRouter.post('/create/key/:key', authMiddleware, createProfileNft)
profilesRouter.post(
  '/update/profileId/:profileId/key/:key',
  authMiddleware,
  updateProfileImage
)
profilesRouter.post(
  '/default/profileId/:profileId/key/:key',
  authMiddleware,
  setProfileAsDefault
)
// Has to be a post route as the route has to receive an array from request body
profilesRouter.post('/my-profiles/key/:key', authMiddleware, getMyProfiles)
profilesRouter.get('/profileId/:profileId', getProfile)
profilesRouter.get('/default/key/:key', getUserDefaultProfile)
profilesRouter.post('/verifyHandle', authMiddleware, verifyProfileHandle)
profilesRouter.post(
  '/estimateGas/key/:key',
  authMiddleware,
  estimateCreateProfileNftGas
)
