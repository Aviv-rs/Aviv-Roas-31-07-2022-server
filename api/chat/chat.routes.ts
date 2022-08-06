const express = require('express')
const {
  getAllChats,
  getChatById,
  addMessage,
  updateMessage,
  removeChat,
} = require('./chat.controller')
const { log } = require('../../middlewares/logger.middleware')
const router = express.Router()

router.get('/', log, getAllChats)
router.get('/:id', getChatById)
router.post('/:id', addMessage)
router.put('/:id', updateMessage)
router.delete('/:id', requireAdmin, removeChat)

module.exports = router

export {}
