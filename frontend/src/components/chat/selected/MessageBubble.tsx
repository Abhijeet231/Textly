import { CheckCheck } from "lucide-react"
import type { Message } from "../../../types/chat"

interface Props {
  message: Message
  isOwn: boolean
  currentUserId: string
}

const MessageBubble = ({ message, isOwn, currentUserId }: Props) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const seen = Array.isArray(message.seenBy)
    && message.seenBy.some((id) => id !== currentUserId)

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[72%] flex flex-col gap-1
        ${isOwn ? "items-end" : "items-start"}`}>

        {/* Images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="attachment"
                className="max-w-50 rounded-xl object-cover border border-zinc-100"
              />
            ))}
          </div>
        )}

        {/* Text bubble */}
        {message.text && (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
              ${isOwn
                ? "bg-violet-600 text-white rounded-tr-sm"
                : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-sm shadow-sm"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Time + seen */}
        <div className={`flex items-center gap-1 px-1
          ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[11px] text-zinc-400">{time}</span>
          {isOwn && (
            <CheckCheck
              size={13}
              className={seen ? "text-violet-400" : "text-zinc-300"}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble