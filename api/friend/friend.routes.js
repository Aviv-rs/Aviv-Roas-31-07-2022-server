"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getEntities, getEntityById, sendFriendRequest, acceptFriendRequest, removeEntity, } = require('./friend.controller');
const { log } = require('../../middlewares/logger.middleware');
const router = express.Router();
router.get('/', log, getEntities);
router.get('/:id', getEntityById);
router.post('/', sendFriendRequest);
router.put('/', acceptFriendRequest);
router.delete('/:id', removeEntity);
module.exports = router;
//# sourceMappingURL=friend.routes.js.map