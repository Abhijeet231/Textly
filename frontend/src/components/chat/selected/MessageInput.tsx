import { useState, useRef, useCallback } from "react"
import { Send } from "lucide-react"

interface Props {
  conversationId: string
  onSend: (text: string) => void
  onTyping: () => void
  onTypingStop: () => void
}

const MessageInput = ({ conversationId, onSend, onTyping, onTypingStop }: Props) => {
  const [text, setText] = useState("")
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)

    if (!isTypingRef.current) {
      isTypingRef.current = true
      onTyping()
    }

    // Reset debounce timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      onTypingStop()
    }, 1500)
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    isTypingRef.current = false
    onTypingStop()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 py-3 bg-white border-t border-zinc-100">
      <div className="flex items-end gap-3 bg-zinc-50 border border-zinc-200
        rounded-2xl px-4 py-2.5 focus-within:border-violet-300
        focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-150">
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400
            outline-none resize-none max-h-32 leading-relaxed"
          style={{ height: "auto" }}
          onInput={(e) => {
            const t = e.target as HTMLTextAreaElement
            t.style.height = "auto"
            t.style.height = `${t.scrollHeight}px`
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="shrink-0 w-8 h-8 rounded-xl bg-violet-600 text-white
            flex items-center justify-center hover:bg-violet-700 transition-all
            duration-150 disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

export default MessageInput