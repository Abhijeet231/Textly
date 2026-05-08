import { useState } from "react"
import { Search, X, MessageCirclePlus } from "lucide-react"
import type { Conversation } from "../../types/chat"
import ConversationItem from "./ConversationItem"
import UserList from "./UserList"

interface Props {
  conversations: Conversation[]
  currentUserId: string
  activeConversationId: string | null
  onSelectConversation: (c: Conversation) => void
  onStartChat: (userId: string) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

type Tab = "chats" | "people"

const Sidebar = ({
  conversations,
  currentUserId,
  activeConversationId,
  onSelectConversation,
  onStartChat,
  mobileOpen,
  onCloseMobile,
}: Props) => {
  const [tab, setTab] = useState<Tab>("chats")
  const [search, setSearch] = useState("")

  const filtered = conversations.filter((c) => {
    const other = c.participants.find((p) => p._id !== currentUserId)
    return other?.name.toLowerCase().includes(search.toLowerCase())
  })

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
          w-75 bg-white border-r border-zinc-100 flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-zinc-900">
              {tab === "chats" ? "Messages" : "People"}
            </h2>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-600
                hover:bg-zinc-50 transition-all duration-150"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-zinc-100 rounded-xl p-1 mb-4">
            {(["chats", "people"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize
                  transition-all duration-150
                  ${tab === t
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search — chats tab only */}
          {tab === "chats" && (
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
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {tab === "chats" ? (
            <div className="px-3 space-y-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                  <MessageCirclePlus size={28} className="text-zinc-200" />
                  <p className="text-xs text-zinc-400 text-center px-4">
                    {search
                      ? "No results found"
                      : "No conversations yet — go to People to start one"}
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
          ) : (
            <UserList
              currentUserId={currentUserId}
              onStartChat={(userId) => {
                onStartChat(userId)
                onCloseMobile()
                setTab("chats")
              }}
            />
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar