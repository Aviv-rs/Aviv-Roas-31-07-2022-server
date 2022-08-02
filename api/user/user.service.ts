import { User, UserFilterBy } from './models'

const dbService = require('../../services/mongodb.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

async function query(filterBy: UserFilterBy) {
  try {
    const collection = await dbService.getCollection('user')
    const criteria = filterBy ? _buildCriteria(filterBy) : {}
    let users: User[] = await collection.find(criteria).toArray()

    users = users.map(user => {
      delete user.password

      // user.createdAt = ObjectId(user._id).getTimestamp()
      // Uncomment to return fake fresh data
      // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId: string) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password

    return user
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}
async function getByUsername(username: string) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    logger.error(`while finding user ${username}`, err)
    throw err
  }
}

async function remove(userId: string) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user: User) {
  try {
    // peek only updatable properties
    const userToSave = {
      _id: ObjectId(user._id), // needed for the returnd obj
      username: user.username,
      fullname: user.fullname,
      avatar: user.avatar,
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user: User) {
  try {
    // pick only updatable fields!
    const userToAdd = {
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      avatar: user.avatar,
      role: 'visitor',
    }
    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    logger.error('cannot insert user', err)
    throw err
  }
}

function _buildCriteria(filterBy: UserFilterBy) {
  const criteria = {} as any
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ]
  }

  return criteria
}
