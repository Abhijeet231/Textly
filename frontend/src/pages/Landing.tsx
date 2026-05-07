import { Link } from "react-router-dom"
import { ArrowRight, MessageCircle, Lock, Zap, Users } from "lucide-react"

const features = [
  {
    icon: <MessageCircle size={18} className="text-violet-600" />,
    title: "Real-time messaging",
    desc: "Messages delivered instantly. No lag, no delays — just fluid conversation.",
  },
  {
    icon: <Lock size={18} className="text-violet-600" />,
    title: "Private by default",
    desc: "Every conversation is between you and one other person. Nothing more.",
  },
  {
    icon: <Zap size={18} className="text-violet-600" />,
    title: "Lightweight & fast",
    desc: "Built lean. Opens in a second, works on any device, no bloat.",
  },
  {
    icon: <Users size={18} className="text-violet-600" />,
    title: "Simple contacts",
    desc: "Add people you know. Start talking. That's it — no groups, no noise.",
  },
]

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-[Sora,sans-serif]">

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center overflow-hidden">

        {/* Soft radial glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100
          bg-violet-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Pill badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold
          tracking-wide mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Now available — free to use
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900
          leading-[1.08] max-w-2xl mb-6 animate-slide-up">
          Chat that gets{" "}
          <span className="text-violet-600 relative">
            out of the way
            <span className="absolute -bottom-1 left-0 w-full h-0.75 bg-violet-200 rounded-full" />
          </span>
        </h1>

        <p className="text-zinc-500 text-lg max-w-xl leading-relaxed mb-10 animate-slide-up delay-100">
          Textly is a clean, distraction-free 1-on-1 chat app.
          No groups, no threads, no clutter — just you and the person you're talking to.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center animate-slide-up delay-200">
          <Link
            to="auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white
              text-sm font-semibold rounded-xl hover:bg-violet-700
              hover:shadow-[0_6px_20px_rgba(124,58,237,0.35)] hover:-translate-y-0.5
              transition-all duration-200"
          >
            Start for free <ArrowRight size={16} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 text-zinc-500 text-sm
              font-medium border border-zinc-200 rounded-xl hover:border-violet-300
              hover:text-violet-600 hover:bg-violet-50/50 transition-all duration-200"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Mock chat UI */}
      <section className="max-w-lg mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 overflow-hidden shadow-sm">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center
              text-violet-700 text-xs font-bold">AJ</div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 leading-none">Alex J.</p>
              <p className="text-xs text-green-500 font-medium mt-0.5">Online</p>
            </div>
          </div>
          {/* Messages */}
          <div className="flex flex-col gap-3 px-4 py-5">
            <div className="flex justify-start">
              <span className="bg-white text-zinc-700 text-sm px-4 py-2.5 rounded-2xl
                rounded-tl-sm border border-zinc-100 max-w-[75%] leading-relaxed shadow-sm">
                Hey! Did you see the designs?
              </span>
            </div>
            <div className="flex justify-end">
              <span className="bg-violet-600 text-white text-sm px-4 py-2.5 rounded-2xl
                rounded-tr-sm max-w-[75%] leading-relaxed">
                Just did — they look great 🔥
              </span>
            </div>
            <div className="flex justify-start">
              <span className="bg-white text-zinc-700 text-sm px-4 py-2.5 rounded-2xl
                rounded-tl-sm border border-zinc-100 max-w-[75%] leading-relaxed shadow-sm">
                Ship it?
              </span>
            </div>
            <div className="flex justify-end">
              <span className="bg-violet-600 text-white text-sm px-4 py-2.5 rounded-2xl
                rounded-tr-sm max-w-[75%] leading-relaxed">
                Ship it. 🚀
              </span>
            </div>
          </div>
          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-zinc-100 flex items-center gap-3">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2
              text-sm text-zinc-300 select-none">
              Type a message...
            </div>
            <button className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center
              text-white shrink-0">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <p className="text-center text-xs font-semibold tracking-widest text-zinc-400
          uppercase mb-10">
          Why Textly
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon, title, desc }) => (
            <div key={title}
              className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50
                hover:border-violet-200 hover:bg-violet-50/40 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-zinc-100
                flex items-center justify-center mb-4 group-hover:border-violet-200
                group-hover:bg-violet-50 transition-all duration-200">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-violet-600 px-8 py-10 flex flex-col sm:flex-row
          items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ready to start talking?</h2>
            <p className="text-violet-200 text-sm">Free forever. No credit card needed.</p>
          </div>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700
              text-sm font-semibold rounded-xl hover:bg-violet-50 transition-all duration-200
              whitespace-nowrap shrink-0"
          >
            Create your account <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease both; }
        .animate-slide-up { animation: slide-up 0.55s ease both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  )
}

export default Landing