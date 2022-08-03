import { Request, Response } from 'express'

const friendService = require('./friend.service')
const logger = require('../../services/logger.service')

// GET LIST
async function getEntities(req: Request, res: Response) {
  try {
    logger.debug('Getting Entities')
    const { filterBy = '' } = req.query
    const entities = await friendService.query(filterBy)
    res.json(entities)
  } catch (err) {
    logger.error('Failed to get entities', err)
    res.status(500).send({ err: 'Failed to get entities' })
  }
}

// GET BY ID
async function getEntityById(req: Request, res: Response) {
  try {
    const entityId = req.params.id
    const entity = await friendService.getById(entityId)
    res.json(entity)
  } catch (err) {
    logger.error('Failed to get entity', err)
    res.status(500).send({ err: 'Failed to get entity' })
  }
}

// POST (add entity)
async function sendFriendRequest(req: Request, res: Response) {
  try {
    const friendRequest = req.body
    const addedEntity = await friendService.add(friendRequest)
    res.json(addedEntity)
  } catch (err) {
    logger.error('Failed to send friend request', err)
    res.status(500).send({ err: 'Failed to send friend request' })
  }
}

// DELETE (Remove entity)
async function removeEntity(req: Request, res: Response) {
  try {
    const entityId = req.params.id
    const removedId = await friendService.remove(entityId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove entity', err)
    res.status(500).send({ err: 'Failed to remove entity' })
  }
}

module.exports = {
  getEntities,
  getEntityById,
  sendFriendRequest,
  removeEntity,
}
