const express = require('express')
const { getUser, getUsers, saveUser, deleteUser } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', saveUser)
router.delete('/:id', deleteUser)


module.exports = router