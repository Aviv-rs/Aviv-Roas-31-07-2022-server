import { Response } from 'express'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const cors = require('cors')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const { log } = require('./middlewares/logger.middleware')
const PORT = 3030

// replace entities with whatever data model you'd like
const friendRouts = require('./api/friend/friend.routes')
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')
const { setupSocketAPI } = require('./services/socket.service')
setupSocketAPI(http)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(log)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/friend', friendRouts)

app.get('/**', (req: Request, res: Response) => {
  res.status(404).sendFile(path.resolve(__dirname, 'public/404.html'))
})

http.listen(PORT, () => {
  console.log('Server is running at port', PORT)
})
