import { User } from 'api/user/models'
import { Collection } from 'mongodb'
import { FriendRequest } from './models'

const dbService = require('../../services/mongodb.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy: string) {
  const collection = await dbService.getCollection('friend_db')
  try {
    let filterCriteria
    if (filterBy) {
      filterCriteria = _buildCriteria(filterBy)
    } else filterCriteria = {}

    const friends = await collection.find(filterCriteria).toArray()

    return friends
  } catch (err) {
    logger.error('cannot find friends', err)
    throw err
  }
}

async function getById(friendId: string) {
  try {
    const collection = await dbService.getCollection('friend_db')
    const friend = collection.findOne({
      _id: ObjectId(friendId),
    })
    return friend
  } catch (err) {
    logger.error(`while finding friend ${friendId}`, err)
    throw err
  }
}

async function remove(friendId: string) {
  try {
    const collection = await dbService.getCollection('friend_db')
    await collection.deleteOne({ _id: ObjectId(friendId) })
    return friendId
  } catch (err) {
    logger.error(`cannot remove friend ${friendId}`, err)
    throw err
  }
}

async function add(friendRequest: FriendRequest) {
  try {
    const collection: Collection<User[]> = await dbService.getCollection('user')
    const sender: User = await userService.getById(friendRequest.fromUser._id)

    const isRequestAlreadySent =
      sender.friendRequests.findIndex(
        req => req.toUser._id === friendRequest.toUser._id
      ) > -1

    if (isRequestAlreadySent) throw Error('Request already sent!')

    await collection.updateMany(
      {
        $or: [
          { _id: ObjectId(friendRequest.fromUser._id) },
          { _id: ObjectId(friendRequest.toUser._id) },
        ],
      },
      { $push: { friendRequests: friendRequest } }
    )
  } catch (err) {
    logger.error('cannot send friend request', err)
    throw err
  }
}

// Accept friend request
async function update(friendRequest: FriendRequest) {
  try {
    // peek only updatable properties

    const collection: Collection = await dbService.getCollection('user')
    const sender: User = await userService.getById(friendRequest.fromUser._id)
    const reciever: User = await userService.getById(friendRequest.toUser._id)

    sender.friendRequests.forEach(async friendReq => {
      if (
        friendReq.fromUser._id === friendRequest.fromUser._id &&
        friendReq.toUser._id === friendRequest.toUser._id
      )
        friendReq.status = 'confirmed'
    })
    reciever.friendRequests.forEach(friendReq => {
      if (
        friendReq.fromUser._id === friendRequest.fromUser._id &&
        friendReq.toUser._id === friendRequest.toUser._id
      )
        friendReq.status = 'confirmed'
    })

    await collection.updateOne(
      { _id: ObjectId(friendRequest.fromUser._id) },

      {
        $set: { friendRequests: [...sender.friendRequests] },
        $push: { friends: { ...friendRequest.toUser } },
      }
    )

    await collection.updateOne(
      { _id: ObjectId(friendRequest.toUser._id) },

      {
        $set: { friendRequests: [...reciever.friendRequests] },
        $push: { friends: { ...friendRequest.fromUser } },
      }
    )
  } catch (err) {
    logger.error('Cannot update friend request', err)
    throw err
  }
}

function _buildCriteria(filterBy: string) {
  //   const { name, createdAt, tags, createdBy } = filterBy
  const filterCriteria = {}

  // Some examples for possible filters
  // if (name) filterCriteria.name = { $regex: name, $options: 'i' }
  // if (createdBy) filterCriteria['createdBy._id'] = createdBy._id
  // if (createdAt) filterCriteria.createdAt = JSON.parse(createdAt)
  // if (tags?.length) filterCriteria.tags = { $in: [...tags] }

  return filterCriteria
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}

export {}
