import { useState } from "react"
import { Search, MessageCirclePlus, X } from "lucide-react"
import type { Conversation } from "../../types/chat"
import ConversationItem from "./ConversationItem"

interface Props {
  conversations: Conversation[]
  currentUserId: string
  activeConversationId: string | null
  onSelectConversation: (c: Conversation) => void
  onNewChat: (userId: string) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

const Sidebar = ({
  conversations,
  currentUserId,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  mobileOpen,
  onCloseMobile,
}: Props) => {
  const [search, setSearch] = useState("")
  const [newChatInput, setNewChatInput] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)

  const filtered = conversations.filter((c) => {
    const other = c.participants.find((p) => p._id !== currentUserId)
    return other?.name.toLowerCase().includes(search.toLowerCase())
  })

  const handleNewChat = () => {
    const trimmed = newChatInput.trim()
    if (!trimmed) return
    onNewChat(trimmed)
    setNewChatInput("")
    setShowNewChat(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:relative top-0 left-0 h-full z-30 md:z-auto
          w-[300px] bg-white border-r border-zinc-100 flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-zinc-900">Messages</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNewChat((p) => !p)}
                className="p-2 rounded-lg text-zinc-400 hover:text-violet-600
                  hover:bg-violet-50 transition-all duration-150"
                title="New chat"
              >
                {showNewChat ? <X size={18} /> : <MessageCirclePlus size={18} />}
              </button>
              <button
                onClick={onCloseMobile}
                className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-600
                  hover:bg-zinc-50 transition-all duration-150"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* New chat input */}
          {showNewChat && (
            <div className="mb-3 flex gap-2">
              <input
                value={newChatInput}
                onChange={(e) => setNewChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewChat()}
                placeholder="Paste user ID..."
                className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-lg
                  outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                  text-zinc-800 placeholder-zinc-300 transition-all duration-150"
              />
              <button
                onClick={handleNewChat}
                className="px-3 py-2 text-xs font-semibold bg-violet-600 text-white
                  rounded-lg hover:bg-violet-700 transition-all duration-150"
              >
                Open
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
              text-zinc-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-100
                rounded-xl outline-none focus:border-violet-300 focus:ring-2
                focus:ring-violet-100 text-zinc-700 placeholder-zinc-400
                transition-all duration-150"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <MessageCirclePlus size={28} className="text-zinc-200" />
              <p className="text-xs text-zinc-400 text-center">
                {search ? "No results found" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filtered.map((c) => (
              <ConversationItem
                key={c._id}
                conversation={c}
                currentUserId={currentUserId}
                isActive={c._id === activeConversationId}
                onClick={() => {
                  onSelectConversation(c)
                  onCloseMobile()
                }}
              />
            ))
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar