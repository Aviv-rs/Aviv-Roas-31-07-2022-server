import { Request, Response } from 'express'
import { Chat, Message } from './models'

const chatService = require('./chat.service')
const logger = require('../../services/logger.service')

async function getAllChats(req: Request, res: Response) {
  try {
    logger.debug('Getting Chats')
    const { filterBy = '' } = req.query
    const chats = await chatService.query(filterBy)
    res.json(chats)
  } catch (err) {
    logger.error('Failed to get chats', err)
    res.status(500).send({ err: 'Failed to get chats' })
  }
}

async function getChatById(req: Request, res: Response) {
  try {
    const chatId = req.params.id
    const chat = await chatService.getById(chatId)
    res.json(chat)
  } catch (err) {
    logger.error('Failed to get chat', err)
    res.status(500).send({ err: 'Failed to get chat' })
  }
}

async function addMessage(req: Request<Message>, res: Response) {
  try {
    const { content, fromUser }: Message = req.body
    const sentAt = new Date()
    const message = { content, fromUser, sentAt }
    const savedMessage: Message = await chatService.add(message)

    res.send(savedMessage)
  } catch (err) {
    logger.error('Failed to add message', err)
    res.status(500).send({ err: 'Failed to add message' })
  }
}

async function updateMessage(req: Request<Message>, res: Response) {
  try {
    const { content, fromUser, sentAt, _id }: Message = req.body
    const savedMessage: Message = await chatService.update(
      content,
      fromUser,
      sentAt,
      _id
    )

    res.send(savedMessage)
  } catch (err) {
    logger.error('Failed to add message', err)
    res.status(500).send({ err: 'Failed to add message' })
  }
}

async function removeChat(req: Request, res: Response) {
  try {
    const chatId = req.params.id
    const removedId = await chatService.remove(chatId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove chat', err)
    res.status(500).send({ err: 'Failed to remove chat' })
  }
}

module.exports = {
  getAllChats,
  getChatById,
  addMessage,
  updateMessage,
  removeChat,
}
