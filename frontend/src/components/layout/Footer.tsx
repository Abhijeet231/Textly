import { Link } from "react-router-dom"

const Footer = () => {
  const links = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy", to: "/" },
    { label: "Terms", to: "/" },
  ]

  return (
    <footer className="bg-white border-t border-violet-100 font-[Sora,sans-serif]">
      <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-3
        sm:flex-row flex-col text-center sm:text-left">

        {/* Logo */}
        <Link to="/" className="flex items-end select-none">
          <span className="text-base font-bold tracking-tight text-zinc-900">
            Text<span className="text-violet-600">ly</span>
          </span>
          <span className="w-1.25 h-1.25 rounded-full bg-violet-600 mb-2.25 ml-0.5" />
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-1 flex-wrap justify-center">
          {links.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-[13px] font-medium text-zinc-400 px-2.5 py-1 rounded-md
                  hover:text-violet-600 hover:bg-violet-50 transition-all duration-150"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-[12px] text-zinc-400 whitespace-nowrap">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-violet-600 font-medium">Textly</span>.{" "}
          All rights reserved.
        </p>

      </div>
    </footer>
  )
}

export default Footer