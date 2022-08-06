import { Friend } from 'api/friend/models'

export interface Chat {
  _id: string
  messages: Message[]
  participants: Friend[]
}

export interface Message {
  _id: string
  fromUser: { fullname: string; _id: string }
  content: string
  sentAt: Date
}
