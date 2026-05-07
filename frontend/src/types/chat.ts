export interface ChatUser {
  _id: string
  name: string
  avatar?: { url: string; public_id: string }
  isOnline: boolean
  lastSeen?: string
}

export interface LastMessage {
  text: string
  senderId: string
  createdAt: string
}

export interface Conversation {
  _id: string
  participants: ChatUser[]
  lastMessage?: LastMessage
  updatedAt: string
}

export interface MessageImage {
  url: string
  public_id: string
}

export interface Message {
  _id: string
  conversationId: string
  senderId: ChatUser | string
  text?: string
  images?: MessageImage[]
  seenBy: string[]
  createdAt: string
}