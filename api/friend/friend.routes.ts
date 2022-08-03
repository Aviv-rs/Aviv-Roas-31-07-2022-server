const express = require('express')
const {
  getEntities,
  getEntityById,
  sendFriendRequest,
  removeEntity,
} = require('./friend.controller')
const { log } = require('../../middlewares/logger.middleware')
const router = express.Router()

router.get('/', log, getEntities)
router.get('/:id', getEntityById)
router.post('/', sendFriendRequest)
router.delete('/:id', removeEntity)

module.exports = router

export {}
