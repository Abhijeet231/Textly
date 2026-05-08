import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import type { Conversation, Message } from "../types/chat"

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL

export const useSocket = (accessToken: string | null) => {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})

  // ── Connect ───────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      withCredentials: true,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setConnected(true)

      // Rejoin all rooms + load conversation list
      socket.emit("conversation:rejoin_all")
      socket.emit("conversation:list", (res: { conversations?: Conversation[]; error?: string }) => {
        if (res.conversations) setConversations(res.conversations)
      })
    })

    socket.on("disconnect", () => setConnected(false))

    // ── Incoming message ──────────────────────────────────────
    socket.on("message:new", ({ message }: { message: Message }) => {
      setMessages((prev) => {
        // Avoid duplicates (sender already has it via callback)
        if (prev.find((m) => m._id === message._id)) return prev
        return [...prev, message]
      })

      // Update conversation preview
      setConversations((prev) =>
        prev
          .map((c) =>
            c._id === message.conversationId
              ? {
                  ...c,
                  lastMessage: {
                    text: message.text ?? "📷 Image",
                    senderId: typeof message.senderId === "string"
                      ? message.senderId
                      : message.senderId._id,
                    createdAt: message.createdAt,
                  },
                  updatedAt: message.createdAt,
                }
              : c
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      )
    })

    // ── Typing ────────────────────────────────────────────────
    socket.on("message:typing", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: true }))
    })

    socket.on("message:typing_stop", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
    })

    // ── User offline ──────────────────────────────────────────
    socket.on("user:offline", ({ userId, lastSeen }: { userId: string; lastSeen: string }) => {
      setConversations((prev) =>
        prev.map((c) => ({
          ...c,
          participants: c.participants.map((p) =>
            p._id === userId ? { ...p, isOnline: false, lastSeen } : p
          ),
        }))
      )
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [accessToken])

  // ── Open conversation ─────────────────────────────────────────
const openConversation = useCallback(
  (participantId: string): Promise<Conversation> => {
    return new Promise((resolve, reject) => {
      socketRef.current?.emit(
        "conversation:open",
        { participantId },
        (res: { conversation?: Conversation; error?: string }) => {
          if (res.error) return reject(res.error)
          if (res.conversation) {
            setActiveConversation(res.conversation)

            // If participants aren't populated (just IDs), patch them
            // by re-fetching the conversation list which does populate
            socketRef.current?.emit(
              "conversation:list",
              (listRes: { conversations?: Conversation[] }) => {
                if (listRes.conversations) {
                  setConversations(listRes.conversations)
                  // Find the fully populated version of this conversation
                  const populated = listRes.conversations.find(
                    (c) => c._id === res.conversation!._id
                  )
                  if (populated) {
                    setActiveConversation(populated)
                    resolve(populated)
                  } else {
                    resolve(res.conversation!)
                  }
                } else {
                  resolve(res.conversation!)
                }
              }
            )
          }
        }
      )
    })
  },
  []
)

  // ── Load messages ─────────────────────────────────────────────
  const loadMessages = useCallback(
    (conversationId: string, page = 1) => {
      socketRef.current?.emit(
        "message:history",
        { conversationId, page, limit: 30 },
        (res: { messages?: Message[]; hasMore?: boolean; error?: string }) => {
          if (res.messages) {
            if (page === 1) {
              setMessages(res.messages)
            } else {
              setMessages((prev) => [...res.messages!, ...prev])
            }
            setHasMore(res.hasMore ?? false)
          }
        }
      )
    },
    []
  )

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = useCallback(
    (conversationId: string, text: string): Promise<Message> => {
      return new Promise((resolve, reject) => {
        socketRef.current?.emit(
          "message:send",
          { conversationId, text },
          (res: { message?: Message; error?: string }) => {
            if (res.error) return reject(res.error)
            if (res.message) {
              setMessages((prev) => {
                if (prev.find((m) => m._id === res.message!._id)) return prev
                return [...prev, res.message!]
              })
              resolve(res.message)
            }
          }
        )
      })
    },
    []
  )

  // ── Mark seen ─────────────────────────────────────────────────
  const markSeen = useCallback((conversationId: string) => {
    socketRef.current?.emit("message:seen", { conversationId })
  }, [])

  // ── Typing ────────────────────────────────────────────────────
  const emitTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("message:typing", { conversationId })
  }, [])

  const emitTypingStop = useCallback((conversationId: string) => {
    socketRef.current?.emit("message:typing_stop", { conversationId })
  }, [])

  return {
    connected,
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    setMessages,
    hasMore,
    typingUsers,
    openConversation,
    loadMessages,
    sendMessage,
    markSeen,
    emitTyping,
    emitTypingStop,
  }
}