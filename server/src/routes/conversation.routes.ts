import { Router } from 'express'
import * as convController from '../controllers/conversation.controller'
import { authenticate } from '../middleware/authenticate'
import { uploadMedia } from '../middleware/upload'

const router = Router()

router.get('/', authenticate, convController.getConversations)
router.post('/', authenticate, convController.startConversation)
router.get('/:id/messages', authenticate, convController.getMessages)
router.post('/:id/messages', authenticate, uploadMedia, convController.sendMessage)
router.patch('/:id/read', authenticate, convController.markRead)

export default router
