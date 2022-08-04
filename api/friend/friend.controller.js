"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friendService = require('./friend.service');
const logger = require('../../services/logger.service');
// GET LIST
async function getEntities(req, res) {
    try {
        logger.debug('Getting Entities');
        const { filterBy = '' } = req.query;
        const entities = await friendService.query(filterBy);
        res.json(entities);
    }
    catch (err) {
        logger.error('Failed to get entities', err);
        res.status(500).send({ err: 'Failed to get entities' });
    }
}
// GET BY ID
async function getEntityById(req, res) {
    try {
        const entityId = req.params.id;
        const entity = await friendService.getById(entityId);
        res.json(entity);
    }
    catch (err) {
        logger.error('Failed to get entity', err);
        res.status(500).send({ err: 'Failed to get entity' });
    }
}
// POST (add entity)
async function sendFriendRequest(req, res) {
    try {
        const friendRequest = req.body;
        const addedEntity = await friendService.add(friendRequest);
        res.json(addedEntity);
    }
    catch (err) {
        logger.error('Failed to send friend request', err);
        res.status(500).send({ err: 'Failed to send friend request' });
    }
}
// PUT (Update entity)
async function acceptFriendRequest(req, res) {
    try {
        const friendRequest = req.body;
        if (friendRequest.status === 'confirmed')
            res.status(400).send('Request already confirmed!');
        const acceptedFriendRequest = await friendService.update(friendRequest);
        res.json(acceptedFriendRequest);
    }
    catch (err) {
        logger.error('Failed to accept friend request', err);
        res.status(500).send({ err: 'Failed to accept friend request' });
    }
}
// DELETE (Remove entity)
async function removeEntity(req, res) {
    try {
        const entityId = req.params.id;
        const removedId = await friendService.remove(entityId);
        res.send(removedId);
    }
    catch (err) {
        logger.error('Failed to remove entity', err);
        res.status(500).send({ err: 'Failed to remove entity' });
    }
}
module.exports = {
    getEntities,
    getEntityById,
    sendFriendRequest,
    acceptFriendRequest,
    removeEntity,
};
//# sourceMappingURL=friend.controller.js.map