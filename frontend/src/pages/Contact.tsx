import { Mail, MapPin, X, GitBranch } from "lucide-react"

const contacts = [
  {
    icon: <Mail size={17} className="text-violet-600" />,
    label: "Email",
    value: "hello@textly.app",
    sub: "We reply within 24 hours",
  },
  {
    icon: <MapPin size={17} className="text-violet-600" />,
    label: "Location",
    value: "San Francisco, CA",
    sub: "Remote-first team",
  },
]

const socials = [
  {
    icon: <X size={16} />,
    label: "X",
    handle: "@textlyapp",
    href: "#",
  },
  {
    icon: <GitBranch size={16} />,
    label: "GitHub",
    handle: "github.com/textlyapp",
    href: "#",
  },
]

const Contact = () => {
  return (
    <div className="min-h-screen bg-white font-[Sora,sans-serif]">

      {/* Header */}
      <section className="relative max-w-3xl mx-auto px-6 pt-20 pb-12 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-62.5
          bg-violet-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border
          border-violet-200 text-violet-700 text-xs font-semibold tracking-wide mb-6">
          Contact
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900
          leading-tight mb-4">
          Get in{" "}
          <span className="text-violet-600">touch</span>
        </h1>

        <p className="text-zinc-500 text-base leading-relaxed max-w-md mx-auto">
          Have a question, feedback, or just want to say hi?
          We're a small team and we actually read everything.
        </p>
      </section>

      {/* Main layout */}
      <section className="max-w-3xl mx-auto px-6 pb-20 grid sm:grid-cols-5 gap-6">

        {/* Contact form */}
        <div className="sm:col-span-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
          <h2 className="text-sm font-semibold text-zinc-800 mb-5">Send a message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500">First name</label>
                <input
                  type="text"
                  placeholder="Alex"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white
                    text-sm text-zinc-800 placeholder-zinc-300 outline-none
                    focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                    transition-all duration-150"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500">Last name</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white
                    text-sm text-zinc-800 placeholder-zinc-300 outline-none
                    focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                    transition-all duration-150"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white
                  text-sm text-zinc-800 placeholder-zinc-300 outline-none
                  focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                  transition-all duration-150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">Message</label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white
                  text-sm text-zinc-800 placeholder-zinc-300 outline-none resize-none
                  focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                  transition-all duration-150"
              />
            </div>

            <button
              className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold
                rounded-xl hover:bg-violet-700 hover:shadow-[0_4px_14px_rgba(124,58,237,0.3)]
                hover:-translate-y-px transition-all duration-200"
            >
              Send message
            </button>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="sm:col-span-2 flex flex-col gap-4">

          {contacts.map(({ icon, label, value, sub }) => (
            <div key={label}
              className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50
                hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200">
              <div className="w-8 h-8 rounded-xl bg-white border border-zinc-100
                flex items-center justify-center mb-3">
                {icon}
              </div>
              <p className="text-xs text-zinc-400 font-medium mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-zinc-800">{value}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>
            </div>
          ))}

          {/* Socials */}
          <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50">
            <p className="text-xs text-zinc-400 font-medium mb-3">Follow us</p>
            <div className="flex flex-col gap-2">
              {socials.map(({ icon, label, handle, href }) => (
                <a key={label} href={href}
                  className="flex items-center gap-3 text-zinc-500 hover:text-violet-600
                    transition-colors duration-150 group">
                  <span className="w-7 h-7 rounded-lg bg-white border border-zinc-100
                    flex items-center justify-center group-hover:border-violet-200
                    group-hover:bg-violet-50 transition-all duration-150">
                    {icon}
                  </span>
                  <span className="text-xs font-medium">{handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default Contact