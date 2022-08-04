const _express = require('express')
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  addUser,
} = require('./user.controller')
const router = _express.Router()
const {
  requireAdmin,
  requireAuth,
} = require('../../middlewares/requireAuth.middleware')

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', requireAdmin, addUser)
router.put('/', requireAuth, updateUser)
router.delete('/:id', requireAdmin, deleteUser)

module.exports = router
