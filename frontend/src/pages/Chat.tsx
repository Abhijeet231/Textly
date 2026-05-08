import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../hooks/useSocket"
import Sidebar from "../components/chat/Sidebar"
import ChatWindow from "../components/chat/ChatWindow"
import type { Conversation } from "../types/chat"
import { MessageCircle, Loader2 } from "lucide-react"

const Chat = () => {
  const { user } = useAuth()
  const accessToken = localStorage.getItem("accessToken")

  const {
    connected,
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    hasMore,
    typingUsers,
    openConversation,
    loadMessages,
    sendMessage,
    markSeen,
    emitTyping,
    emitTypingStop,
  } = useSocket(accessToken)

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)

  // When a conversation is selected — load messages + mark seen
  const handleSelectConversation = async (conversation: Conversation) => {
    setActiveConversation(conversation)
    setPage(1)
    loadMessages(conversation._id, 1)
    markSeen(conversation._id)
  }

  // New chat by userId
  const handleNewChat = async (participantId: string) => {
    try {
      const conversation = await openConversation(participantId)
      handleSelectConversation(conversation)
    } catch {
      // openConversation rejects with error string
    }
  }

  // Send message
  const handleSend = async (text: string) => {
    if (!activeConversation) return
    try {
      await sendMessage(activeConversation._id, text)
    } catch {
      // error handled inside hook
    }
  }

  // Load more (pagination)
  const handleLoadMore = () => {
    if (!activeConversation) return
    const nextPage = page + 1
    setPage(nextPage)
    loadMessages(activeConversation._id, nextPage)
  }

  // Typing
  const handleTyping = () => {
    if (activeConversation) emitTyping(activeConversation._id)
  }

  const handleTypingStop = () => {
    if (activeConversation) emitTypingStop(activeConversation._id)
  }

  // Mark seen when new messages arrive in active conversation
  useEffect(() => {
    if (activeConversation && messages.length > 0) {
      markSeen(activeConversation._id)
    }
  }, [messages])

  if (!user) return null

  return (
    <div className="h-[calc(100vh-60px)] bg-zinc-50 font-[Sora,sans-serif] flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentUserId={user._id}
        activeConversationId={activeConversation?._id ?? null}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">

        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            hasMore={hasMore}
            typingUsers={typingUsers}
            currentUserId={user._id}
            onSend={handleSend}
            onTyping={handleTyping}
            onTypingStop={handleTypingStop}
            onLoadMore={handleLoadMore}
            onBack={() => {
              setMobileSidebarOpen(true)
              setActiveConversation(null)
            }}
          />
        ) : (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">

            {/* Mobile — show sidebar button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden mb-2 flex items-center gap-2 px-4 py-2 text-sm
                font-medium text-violet-600 bg-violet-50 border border-violet-200
                rounded-xl hover:bg-violet-100 transition-all duration-150"
            >
              View conversations
            </button>

            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100
              flex items-center justify-center">
              <MessageCircle size={28} className="text-violet-400" />
            </div>

            <div className="text-center">
              <h2 className="text-base font-semibold text-zinc-800 mb-1">
                No conversation selected
              </h2>
              <p className="text-sm text-zinc-400 max-w-xs">
                Pick a conversation from the sidebar or start a new one by pasting a user ID.
              </p>
            </div>

            {/* Connection status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs
              font-medium border mt-2
              ${connected
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-zinc-100 border-zinc-200 text-zinc-500"
              }`}>
              {connected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </>
              ) : (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Connecting...
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default Chat