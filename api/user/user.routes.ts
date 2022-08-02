const express = require('express')
const { getUser, getUsers, saveUser, deleteUser } = require('./user.controller')
const router = express.Router()
const { requireAdmin } = require('../../middlewares/requireAuth.middleware')

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', saveUser)
router.delete('/:id', requireAdmin, deleteUser)

module.exports = router
