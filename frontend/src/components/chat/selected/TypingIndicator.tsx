const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-zinc-100 shadow-sm px-4 py-3 rounded-2xl
      rounded-tl-sm flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </div>
)

export default TypingIndicator