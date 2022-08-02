import { Server, Socket } from 'socket.io'

interface ServerToClientEvents {
  noArg: () => void
  withAck: (d: string, callback: (e: number) => void) => void
  basicEmit: (type: string, data: any) => void
}

interface ClientToServerEvents {
  'set-user-socket': (userId: string) => void
  'unset-user-socket': () => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  userId: string
  id: string
}

const logger = require('./logger.service')
let gIo!: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

function setupSocketAPI(http: Server) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', socket => {
    logger.info(`New connected socket [id: ${socket.id}]`)

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected [${socket.id}]`)
    })
    socket.on('set-user-socket', userId => {
      logger.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      )
      socket.data.userId = userId
    })
    socket.on('unset-user-socket', () => {
      logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
      delete socket.data.userId
    })
  })
}

function emitTo({
  type,
  data,
  label,
}: {
  type: string
  data: any
  label: string | null
}) {
  if (label) gIo.to('watching:' + label).emit('basicEmit', type, data)
  else gIo.emit('basicEmit', type, data)
}

async function emitToUser({
  type,
  data,
  userId,
}: {
  type: string
  data: any
  userId: string
}) {
  const socket = await _getUserSocket(userId)

  if (socket) {
    logger.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    )
    socket.emit('basicEmit', type, data)
  } else {
    logger.info(`No active socket for user: ${userId}`)
    // _printSockets()
  }
}

async function _getUserSocket(userId: string) {
  const sockets = await _getAllSockets()
  const socket = sockets.find(s => s.data.userId === userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

module.exports = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
}
