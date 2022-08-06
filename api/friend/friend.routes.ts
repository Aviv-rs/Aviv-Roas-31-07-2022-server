const express = require('express')
const {
  getFriends,
  getFriendById,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} = require('./friend.controller')
const { log } = require('../../middlewares/logger.middleware')
const router = express.Router()

// router.get('/', log, getFriends)
// router.get('/:id', getFriendById)
router.post('/', sendFriendRequest)
router.put('/', acceptFriendRequest)
// router.delete('/:id', removeFriend)

module.exports = router

export {}
