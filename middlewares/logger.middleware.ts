import { NextFunction } from 'express'

const logger = require('../services/logger.service')

async function log(req: Request, res: Response, next: NextFunction) {
  logger.info('Req was made to ', req.url)
  next()
}

module.exports = {
  log,
}
