"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('./logger.service');
let gIo;
function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        },
    });
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`);
        socket.on('friend-request-sent', (friendRequest) => {
            const userId = friendRequest.toUser._id;
            emitToUser({ type: 'user-recieved-new-request', data: '', userId });
        });
        socket.on('friend-request-confirmed', (friendRequest) => {
            const userId = friendRequest.fromUser._id;
            emitToUser({
                type: 'user-confirmed-my-request',
                data: friendRequest,
                userId,
            });
        });
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected [${socket.id}]`);
        });
        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`);
            socket.data.userId = userId;
        });
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`);
            delete socket.data.userId;
        });
    });
}
function emitTo({ type, data, label, }) {
    if (label)
        gIo.to('watching:' + label).emit(type, data);
    else
        gIo.emit(type, data);
}
async function emitToUser({ type, data, userId, }) {
    const socket = await _getUserSocket(userId);
    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`);
        socket.emit(type, data);
    }
    else {
        logger.info(`No active socket for user: ${userId}`);
        // _printSockets()
    }
}
async function _getUserSocket(userId) {
    const sockets = await _getAllSockets();
    const socket = sockets.find(s => s.data.userId === userId);
    return socket;
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets();
    return sockets;
}
module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
};
//# sourceMappingURL=socket.service.js.map