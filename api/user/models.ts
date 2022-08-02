export interface User {
  _id?: string
  fullname: string
  username: string
  password: string
  avatar?: string
}

export interface UserFilterBy {
  txt: string
  [key: string]: any
}
