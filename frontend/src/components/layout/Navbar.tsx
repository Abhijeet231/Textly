import { useState, useEffect, useRef } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, MessageCircle, LogOut, User, ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { status, user, logout } = useAuth()
  const navigate = useNavigate()
  const isAuth = status === "authenticated"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setDropdownOpen(false)
    setIsOpen(false)
    await logout()
    navigate("/")
  }

  const navLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ]

  // Avatar circle — shows image or initials fallback
  const AvatarCircle = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm"
    const initials = user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "?"

    return user?.avatar?.url ? (
      <img
        src={user.avatar.url}
        alt={user.name}
        className={`${dim} rounded-full object-cover border-2 border-violet-100`}
      />
    ) : (
      <div className={`${dim} rounded-full bg-violet-100 border-2 border-violet-200
        flex items-center justify-center font-semibold text-violet-700`}>
        {initials}
      </div>
    )
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full font-[Sora,sans-serif] transition-all duration-300
        ${scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-violet-100/60 shadow-sm"
          : "bg-white/90 backdrop-blur-md border-b border-zinc-100"
        }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-15 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-end gap-0 select-none group">
          <span className="text-[22px] font-bold tracking-tight text-zinc-900">
            Text<span className="text-violet-600">ly</span>
          </span>
          <span className="w-1.75 h-1.75 rounded-full bg-violet-600 mb-3.25 ml-0.5
            group-hover:scale-125 transition-transform duration-200" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "text-violet-600"
                    : "text-zinc-500 hover:text-violet-600 hover:bg-violet-50"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop — right side */}
        <div className="hidden md:flex items-center gap-2">

          {status === "loading" ? (
            // Skeleton while checking auth
            <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />

          ) : isAuth ? (
            <>
              {/* Chat button */}
              <Link
                to="/chat"
                className="flex items-center gap-2 px-4 py-1.75 text-sm font-medium
                  text-zinc-500 border border-zinc-200 rounded-[9px]
                  hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50
                  transition-all duration-150"
              >
                <MessageCircle size={15} />
                Chat
              </Link>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-[9px]
                    border border-zinc-200 hover:border-violet-300 hover:bg-violet-50/40
                    transition-all duration-150"
                >
                  <AvatarCircle size="sm" />
                  <span className="text-sm font-medium text-zinc-700 max-w-22.5 truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-400 transition-transform duration-200
                      ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white
                    rounded-xl border border-zinc-100 shadow-lg shadow-zinc-100/80
                    overflow-hidden z-50 animate-fade-in">

                    {/* User info */}
                    <div className="px-4 py-3 border-b border-zinc-50">
                      <p className="text-xs font-semibold text-zinc-800 truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600
                          rounded-lg hover:bg-violet-50 hover:text-violet-600
                          transition-all duration-150"
                      >
                        <User size={14} />
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm
                          text-red-500 rounded-lg hover:bg-red-50
                          transition-all duration-150"
                      >
                        <LogOut size={14} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>

          ) : (
            <>
              <Link
                to="/auth/login"
                className="px-4.5 py-1.75 text-sm font-medium text-zinc-500
                  border border-zinc-200 rounded-[9px] hover:border-violet-400
                  hover:text-violet-600 hover:bg-violet-50/50 transition-all duration-150"
              >
                Log in
              </Link>
              <Link
                to="/auth/register"
                className="px-4.5 py-1.75 text-sm font-semibold text-white bg-violet-600
                  border border-violet-600 rounded-[9px] hover:bg-violet-700
                  hover:border-violet-700 hover:shadow-[0_4px_14px_rgba(124,58,237,0.3)]
                  hover:-translate-y-px transition-all duration-150"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-violet-50
            hover:text-violet-600 transition-all duration-150"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200
          ${isOpen ? "max-h-96 border-t border-violet-50" : "max-h-0"}`}
      >
        <div className="px-5 pt-3 pb-4 flex flex-col gap-1">

          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.25 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? "text-violet-600 bg-violet-50"
                  : "text-zinc-500 hover:text-violet-600 hover:bg-violet-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-col gap-2">
            {isAuth ? (
              <>
                {/* User info row */}
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <AvatarCircle size="md" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-zinc-800 truncate">
                      {user?.name}
                    </span>
                    <span className="text-xs text-zinc-400 truncate">{user?.email}</span>
                  </div>
                </div>

                <Link
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium
                    text-zinc-600 rounded-xl border border-zinc-100 hover:border-violet-200
                    hover:text-violet-600 hover:bg-violet-50 transition-all duration-150"
                >
                  <MessageCircle size={15} />
                  Go to Chat
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium
                    text-zinc-600 rounded-xl border border-zinc-100 hover:border-violet-200
                    hover:text-violet-600 hover:bg-violet-50 transition-all duration-150"
                >
                  <User size={15} />
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium
                    text-red-500 rounded-xl border border-red-100 hover:bg-red-50
                    transition-all duration-150"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-1.75 text-sm font-medium
                    text-zinc-500 border border-zinc-200 rounded-[9px]
                    hover:border-violet-400 hover:text-violet-600 transition-all duration-150"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-1.75 text-sm font-semibold
                    text-white bg-violet-600 rounded-[9px] hover:bg-violet-700
                    transition-all duration-150"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.15s ease both; }
      `}</style>
    </nav>
  )
}

export default Navbar