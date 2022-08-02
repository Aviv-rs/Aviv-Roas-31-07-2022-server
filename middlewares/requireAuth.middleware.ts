import { User } from 'api/user/models'
import { NextFunction, Request, Response } from 'express'

const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  next()
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  console.log(req.cookies)
  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedinUser: User = authService.validateToken(req.cookies.loginToken)
  if (loggedinUser.role !== 'admin') {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin,
}
