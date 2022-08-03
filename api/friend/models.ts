export interface Friend {
  _id: string
  fullname: string
  avatar: string
}

export interface FriendRequest {
  fromUser: Friend
  toUser: Friend
  toUserId: string
  sentAt: Date
  status: string
}
