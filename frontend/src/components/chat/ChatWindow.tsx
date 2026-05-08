import { useEffect, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import type { Conversation, Message } from "../../types/chat"
import MessageBubble from "./selected/MessageBubble"
import MessageInput from "./selected/MessageInput"
import TypingIndicator from "./selected/TypingIndicator"

interface Props {
  conversation: Conversation
  messages: Message[]
  hasMore: boolean
  typingUsers: Record<string, boolean>
  currentUserId: string
  onSend: (text: string) => void
  onTyping: () => void
  onTypingStop: () => void
  onLoadMore: () => void
  onBack: () => void  // mobile back
}

const ChatWindow = ({
  conversation,
  messages,
  hasMore,
  typingUsers,
  currentUserId,
  onSend,
  onTyping,
  onTypingStop,
  onLoadMore,
  onBack,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const other = conversation.participants.find((p) => p._id !== currentUserId)
  const isOtherTyping = other ? !!typingUsers[other._id] : false

  const initials = other?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOtherTyping])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() === d.toDateString()
    if (isToday) return "Today"
    if (isYesterday) return "Yesterday"
    return d.toLocaleDateString([], { month: "long", day: "numeric" })
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const dateLabel = formatDate(msg.createdAt)
    const last = groupedMessages[groupedMessages.length - 1]
    if (last && last.date === dateLabel) {
      last.messages.push(msg)
    } else {
      groupedMessages.push({ date: dateLabel, messages: [msg] })
    }
  })

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b
        border-zinc-100 shrink-0">
        {/* Mobile back */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 rounded-lg text-zinc-400 hover:text-violet-600
            hover:bg-violet-50 transition-all duration-150"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Avatar */}
        <div className="relative">
          {other?.avatar?.url ? (
            <img
              src={other.avatar.url}
              alt={other.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center
              justify-center text-xs font-bold text-violet-700">
              {initials}
            </div>
          )}
          {other?.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500
              rounded-full border-2 border-white" />
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">{other?.name}</p>
          <p className="text-xs text-zinc-400">
            {other?.isOnline ? (
              <span className="text-green-500 font-medium">Online</span>
            ) : other?.lastSeen ? (
              `Last seen ${new Date(other.lastSeen).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2
        bg-zinc-50/50">

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center pb-2">
            <button
              onClick={onLoadMore}
              className="text-xs text-violet-600 font-medium px-4 py-1.5 rounded-full
                bg-white border border-violet-200 hover:bg-violet-50
                transition-all duration-150"
            >
              Load earlier messages
            </button>
          </div>
        )}

        {/* Message groups */}
        {groupedMessages.map(({ date, messages: msgs }) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-[11px] font-medium text-zinc-400 px-2 whitespace-nowrap">
                {date}
              </span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            <div className="space-y-2">
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={
                    typeof msg.senderId === "string"
                      ? msg.senderId === currentUserId
                      : msg.senderId._id === currentUserId
                  }
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isOtherTyping && (
          <div className="pt-1">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0">
        <MessageInput
          conversationId={conversation._id}
          onSend={onSend}
          onTyping={onTyping}
          onTypingStop={onTypingStop}
        />
      </div>
    </div>
  )
}

export default ChatWindow