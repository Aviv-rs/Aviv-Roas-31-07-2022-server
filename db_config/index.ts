require('dotenv').config()

let dbUrl = process.env.DBHOST

module.exports = { dbUrl }
