import { User } from 'api/user/models'

const Cryptr = require('cryptr')
require('dotenv').config()

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.CRYPTER_KEY)

async function login(username: string, password: string) {
  logger.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  return user
}

async function signup(
  username: string,
  password: string,
  fullname: string,
  avatar: string
) {
  const saltRounds = 10

  logger.debug(
    `auth.service - signup with username: ${username}, fullname: ${fullname}`
  )
  if (!username || !password || !fullname)
    return Promise.reject('fullname, username and password are required!')

  const isUserTaken = !!(await userService.getByUsername(username))

  if (isUserTaken) return Promise.reject('Username already taken!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ username, password: hash, fullname, avatar })
}

function getLoginToken(user: User) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken: string) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
}
