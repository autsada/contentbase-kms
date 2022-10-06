import express from 'express'

import {
  createPublishNft,
  updatePublishNft,
  getMyPublishes,
  getPublishes,
  getPublish,
} from '../controllers/publishes'
import { authMiddleware } from '../middlewares/auth'

export const publishesRouter = express.Router()

publishesRouter.post('/create/key/:key', authMiddleware, createPublishNft)
publishesRouter.post(
  '/update/publishId/:publishId/key/:key',
  authMiddleware,
  updatePublishNft
)
// Has to be a post route as the route has to receive an array from request body
publishesRouter.post('/my-publishes/key/:key', authMiddleware, getMyPublishes)
publishesRouter.post('/get', authMiddleware, getPublishes)
publishesRouter.get('/publishId/:publishId', authMiddleware, getPublish)
