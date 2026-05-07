import type { Conversation } from "../../types/chat"

interface Props {
  conversation: Conversation
  currentUserId: string
  isActive: boolean
  onClick: () => void
}

const ConversationItem = ({ conversation, currentUserId, isActive, onClick }: Props) => {
  const other = conversation.participants.find((p) => p._id !== currentUserId)
  if (!other) return null

  const initials = other.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const lastText = conversation.lastMessage?.text ?? "No messages yet"

  const timeLabel = conversation.lastMessage?.createdAt
    ? (() => {
        const d = new Date(conversation.lastMessage.createdAt)
        const now = new Date()
        const isToday = d.toDateString() === now.toDateString()
        return isToday
          ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : d.toLocaleDateString([], { month: "short", day: "numeric" })
      })()
    : ""

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        duration-150 text-left group
        ${isActive
          ? "bg-violet-50 border border-violet-200/70"
          : "hover:bg-zinc-50 border border-transparent"
        }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {other.avatar?.url ? (
          <img
            src={other.avatar.url}
            alt={other.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center
            justify-center text-sm font-bold text-violet-700">
            {initials}
          </div>
        )}
        {other.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full
            border-2 border-white" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm font-semibold truncate
            ${isActive ? "text-violet-700" : "text-zinc-800"}`}>
            {other.name}
          </p>
          <span className="text-[11px] text-zinc-400 flex-shrink-0 ml-2">{timeLabel}</span>
        </div>
        <p className="text-xs text-zinc-400 truncate">{lastText}</p>
      </div>
    </button>
  )
}

export default ConversationItem