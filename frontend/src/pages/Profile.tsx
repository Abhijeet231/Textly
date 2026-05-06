import { useAuth } from "../context/AuthContext"
import { Mail, Clock, Calendar, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  const isOnline = user.isOnline

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const formatLastSeen = (lastSeen: string | undefined) => {
    if (!lastSeen) return "Unknown"
    const date = new Date(lastSeen)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-zinc-50 font-[Sora,sans-serif] px-4 py-12">

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-150 h-75
        bg-violet-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-lg mx-auto">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">

          {/* Banner */}
          <div className={`h-28 w-full relative
            ${isOnline
              ? "bg-linear-to-br from-violet-500 via-violet-600 to-purple-700"
              : "bg-linear-to-br from-zinc-200 via-zinc-300 to-zinc-400"
            }`}
          >
            {/* Online animated particles */}
            {isOnline && (
              <>
                <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/20
                  animate-ping" />
                <div className="absolute top-10 right-16 w-1.5 h-1.5 rounded-full
                  bg-white/15 animate-ping delay-300" />
                <div className="absolute bottom-5 left-1/3 w-1 h-1 rounded-full
                  bg-white/20 animate-ping delay-700" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,
                  rgba(255,255,255,0.12),transparent_60%)]" />
              </>
            )}
          </div>

          {/* Avatar + status */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-5">

              {/* Avatar */}
              <div className="relative">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white
                      shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md
                    bg-linear-to-br from-violet-100 to-violet-200 flex items-center
                    justify-center">
                    <span className="text-2xl font-bold text-violet-600">{initials}</span>
                  </div>
                )}

                {/* Online dot */}
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full
                        rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4
                        bg-green-500 border-2 border-white" />
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              {isOnline ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-green-50 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-600">Online now</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-zinc-100 border border-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span className="text-xs font-medium text-zinc-500">Offline</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-0.5">
              {user.name}
            </h1>

            {isOnline && (
              <p className="text-xs text-violet-500 font-medium mb-5">
                ✦ Active right now
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-zinc-100 my-5" />

            {/* Details */}
            <div className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100
                  flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm font-medium text-zinc-700">{user.email}</p>
                </div>
              </div>

              {/* Last seen */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100
                  flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                    Last seen
                  </p>
                  <p className="text-sm font-medium text-zinc-700">
                    {isOnline ? "Right now" : formatLastSeen(user.lastSeen)}
                  </p>
                </div>
              </div>

              {/* Joined */}
              {joinedDate && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100
                    flex items-center justify-center shrink-0">
                    <Calendar size={15} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                      Member since
                    </p>
                    <p className="text-sm font-medium text-zinc-700">{joinedDate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-100 my-5" />

            {/* CTA */}
            <Link
              to="/chat"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600
                text-white text-sm font-semibold rounded-xl hover:bg-violet-700
                hover:shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:-translate-y-px
                transition-all duration-200"
            >
              <MessageCircle size={15} />
              Go to Chat
            </Link>
          </div>
        </div>

        {/* Bottom label */}
        <p className="text-center text-xs text-zinc-400 mt-5">
          Signed in as{" "}
          <span className="text-violet-600 font-medium">{user.email}</span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default Profile