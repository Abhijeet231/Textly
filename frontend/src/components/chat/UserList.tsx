import { useState, useEffect, useCallback } from "react"
import { Search, Loader2, Users } from "lucide-react"
import { getAllUsers } from "../../services/user.service"
import type { ChatUser } from "../../types/chat"
import UserItem from "./UserItem"

interface Props {
  currentUserId: string
  onStartChat: (userId: string) => void
}

const UserList = ({ currentUserId, onStartChat }: Props) => {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchUsers = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true)
      const res = await getAllUsers(pageNum, 15)
      const fetched: ChatUser[] = res.data.users ?? res.data.data ?? []

      // Filter out current user
      const filtered = fetched.filter((u) => u._id !== currentUserId)

      setUsers((prev) => reset ? filtered : [...prev, ...filtered])
      setHasMore(res.data.hasMore ?? fetched.length === 15)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchUsers(1, true)
  }, [fetchUsers])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchUsers(next)
  }

  // Sort: online first
  const sorted = [...users].sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1
    return a.name.localeCompare(b.name)
  })

  const filtered = sorted.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const onlineUsers = filtered.filter((u) => u.isOnline)
  const offlineUsers = filtered.filter((u) => !u.isOnline)

  return (
    <div className="flex flex-col h-full">

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
            text-zinc-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-100
              rounded-xl outline-none focus:border-violet-300 focus:ring-2
              focus:ring-violet-100 text-zinc-700 placeholder-zinc-400
              transition-all duration-150"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={20} className="animate-spin text-violet-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Users size={24} className="text-zinc-200" />
            <p className="text-xs text-zinc-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Online section */}
            {onlineUsers.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase
                  tracking-widest px-4 py-2">
                  Online — {onlineUsers.length}
                </p>
                {onlineUsers.map((u) => (
                  <UserItem
                    key={u._id}
                    user={u}
                    onClick={() => onStartChat(u._id)}
                  />
                ))}
              </div>
            )}

            {/* Offline section */}
            {offlineUsers.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase
                  tracking-widest px-4 py-2 mt-2">
                  All users — {offlineUsers.length}
                </p>
                {offlineUsers.map((u) => (
                  <UserItem
                    key={u._id}
                    user={u}
                    onClick={() => onStartChat(u._id)}
                  />
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && !search && (
              <div className="flex justify-center py-3">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="text-xs text-violet-600 font-medium px-4 py-1.5
                    rounded-full bg-white border border-violet-200
                    hover:bg-violet-50 transition-all duration-150
                    disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading
                    ? <><Loader2 size={11} className="animate-spin" /> Loading...</>
                    : "Load more"
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserList