import type { ChatUser } from "../../types/chat"

interface Props {
  user: ChatUser
  onClick: () => void
}

const UserItem = ({ user, onClick }: Props) => {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
        hover:bg-zinc-50 border border-transparent hover:border-zinc-100
        transition-all duration-150 text-left group"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center
            justify-center text-sm font-bold text-violet-700">
            {initials}
          </div>
        )}
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500
            rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-800 truncate group-hover:text-violet-700
          transition-colors duration-150">
          {user.name}
        </p>
        <p className={`text-xs font-medium mt-0.5
          ${user.isOnline ? "text-green-500" : "text-zinc-400"}`}>
          {user.isOnline ? "Online" : "Offline"}
        </p>
      </div>

      {/* Chat arrow */}
      <span className="text-zinc-300 group-hover:text-violet-400 text-lg leading-none
        transition-colors duration-150">
        →
      </span>
    </button>
  )
}

export default UserItem