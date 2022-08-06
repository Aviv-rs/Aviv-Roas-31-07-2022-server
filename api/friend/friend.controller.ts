import { Request, Response } from 'express'
import { FriendRequest } from './models'

const friendService = require('./friend.service')
const logger = require('../../services/logger.service')

// GET LIST
async function getFriends(req: Request, res: Response) {
  try {
    logger.debug('Getting Friends')
    const { filterBy = '' } = req.query
    const friends = await friendService.query(filterBy)
    res.json(friends)
  } catch (err) {
    logger.error('Failed to get friends', err)
    res.status(500).send({ err: 'Failed to get friends' })
  }
}

// GET BY ID
async function getFriendById(req: Request, res: Response) {
  try {
    const friendId = req.params.id
    const friend = await friendService.getById(friendId)
    res.json(friend)
  } catch (err) {
    logger.error('Failed to get friend', err)
    res.status(500).send({ err: 'Failed to get friend' })
  }
}

// POST (add friend)
async function sendFriendRequest(req: Request, res: Response) {
  try {
    const friendRequest = req.body
    const addedFriend = await friendService.add(friendRequest)
    res.json(addedFriend)
  } catch (err) {
    logger.error('Failed to send friend request', err)
    res.status(500).send({ err: 'Failed to send friend request' })
  }
}

// PUT (Update friend)
async function acceptFriendRequest(req: Request<FriendRequest>, res: Response) {
  try {
    const friendRequest: FriendRequest = req.body
    if (friendRequest.status === 'confirmed')
      res.status(400).send('Request already confirmed!')
    const acceptedFriendRequest = await friendService.update(friendRequest)

    res.json(acceptedFriendRequest)
  } catch (err) {
    logger.error('Failed to accept friend request', err)
    res.status(500).send({ err: 'Failed to accept friend request' })
  }
}

// DELETE (Remove friend)
async function removeFriend(req: Request, res: Response) {
  try {
    const friendId = req.params.id
    const removedId = await friendService.remove(friendId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove friend', err)
    res.status(500).send({ err: 'Failed to remove friend' })
  }
}

module.exports = {
  getFriends,
  getFriendById,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
}
