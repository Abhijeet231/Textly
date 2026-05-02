import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ]

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

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4.5 py-1.75 text-sm font-medium text-zinc-500 border border-zinc-200
              rounded-[9px] hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50
              transition-all duration-150"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4.5 py-1.75 text-sm font-semibold text-white bg-violet-600 border
              border-violet-600 rounded-[9px] hover:bg-violet-700 hover:border-violet-700
              hover:shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:-translate-y-px
              transition-all duration-150"
          >
            Get started
          </Link>
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
        className={`md:hidden overflow-hidden transition-all duration-250
          ${isOpen ? "max-h-72 border-t border-violet-50" : "max-h-0"}`}
      >
        <div className="px-5 pt-3 pb-4 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? "text-violet-600 bg-violet-50"
                  : "text-zinc-500 hover:text-violet-600 hover:bg-violet-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center px-4 py-1.75 text-sm font-medium text-zinc-500
                border border-zinc-200 rounded-[9px] hover:border-violet-400
                hover:text-violet-600 transition-all duration-150"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center px-4 py-1.75 text-sm font-semibold text-white
                bg-violet-600 rounded-[9px] hover:bg-violet-700 transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar