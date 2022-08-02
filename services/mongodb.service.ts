import { Db } from 'mongodb'

const MongoClient = require('mongodb').MongoClient
const config = require('../db_config')
const logger = require('./logger.service')

module.exports = {
  getCollection,
}

// Database Name
const dbName = 'ey_db'

let dbConn: Db = null

async function getCollection(collectionName: string) {
  try {
    const db = await connect()
    const collection = await db.collection(collectionName)
    return collection
  } catch (err) {
    logger.error('Failed to get Mongo collection', err)
    throw err
  }
}

async function connect() {
  if (dbConn) return dbConn
  try {
    const client = await MongoClient.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const db = client.db(dbName)
    dbConn = db
    return db
  } catch (err) {
    logger.error('Cannot Connect to DB', err)
    throw err
  }
}
