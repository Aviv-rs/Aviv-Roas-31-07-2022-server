import { Friend, FriendRequest } from 'api/friend/models'

export interface User {
  _id: string
  fullname: string
  username: string
  password: string
  avatar: string
  role: string
  friends: Friend[]
  friendRequests: FriendRequest[]
}
export interface UserCredAdd {
  fullname: string
  username: string
  password: string
  avatar: string
}

export interface UserFilterBy {
  txt: string
  [key: string]: any
}
