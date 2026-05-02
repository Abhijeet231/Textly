import { Link } from "react-router-dom"
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"

const values = [
  {
    icon: <MessageCircle size={17} className="text-violet-600" />,
    title: "One conversation at a time",
    desc: "Textly is built for focused, direct communication. No group chats, no channels — just you and one other person.",
  },
  {
    icon: <ShieldCheck size={17} className="text-violet-600" />,
    title: "Privacy matters",
    desc: "We don't read your messages, sell your data, or show you ads. What you say stays between you and who you're talking to.",
  },
  {
    icon: <Sparkles size={17} className="text-violet-600" />,
    title: "Simplicity is the feature",
    desc: "Every design decision in Textly is about reducing friction. Less to learn, less to manage, more time to actually talk.",
  },
]

const About = () => {
  return (
    <div className="min-h-screen bg-white font-[Sora,sans-serif]">

      {/* Hero */}
      <section className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75
          bg-violet-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border
          border-violet-200 text-violet-700 text-xs font-semibold tracking-wide mb-6">
          About Textly
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900
          leading-tight mb-5">
          Built for real{" "}
          <span className="text-violet-600">conversations</span>
        </h1>

        <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Textly is a minimal 1-on-1 chat application. It exists because most
          messaging apps have become too complicated — and sometimes you just
          want to send a message to one person without all the noise.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-8">
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">The idea</h2>
          <div className="space-y-4 text-sm text-zinc-500 leading-relaxed">
            <p>
              Most chat tools are built around teams, threads, and notifications.
              They're great for work — but they're overkill for a simple conversation
              between two people.
            </p>
            <p>
              Textly strips it back. You sign up, you add someone, you talk.
              There's nothing else to configure, no workspace to set up, no settings to
              dig through. It's just messaging — the way it should feel.
            </p>
            <p>
              We believe good software disappears. You shouldn't notice Textly —
              you should just notice the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-8 text-center">
          What we stand for
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {values.map(({ icon, title, desc }) => (
            <div key={title}
              className="p-5 rounded-2xl border border-zinc-100 hover:border-violet-200
                hover:bg-violet-50/30 transition-all duration-200 group">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100
                flex items-center justify-center mb-4 group-hover:bg-violet-100
                transition-all duration-200">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5
          border-t border-zinc-100 pt-10">
          <div>
            <p className="text-sm font-semibold text-zinc-800 mb-1">Want to try it?</p>
            <p className="text-sm text-zinc-400">It's free and takes about 30 seconds.</p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white
              text-sm font-semibold rounded-xl hover:bg-violet-700 hover:-translate-y-0.5
              hover:shadow-[0_6px_18px_rgba(124,58,237,0.3)] transition-all duration-200
              whitespace-nowrap"
          >
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default About