import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { loginSchema, type LoginFormData } from "../../validations/auth.validations"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data)
      toast.success("Welcome back!")
      console.log("Logged in user:", result)
      navigate("/chat")
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
      console.log("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-[Sora,sans-serif] flex items-center
      justify-center px-4 py-12">

      {/* Soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]
        bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-end select-none">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              Text<span className="text-violet-600">ly</span>
            </span>
            <span className="w-[7px] h-[7px] rounded-full bg-violet-600 mb-[14px] ml-[2px]" />
          </Link>
          <p className="text-sm text-zinc-400 mt-2">Welcome back — sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-8 py-8">
          <h1 className="text-lg font-bold text-zinc-900 mb-6">Log in</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-500">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-zinc-800
                  placeholder-zinc-300 outline-none transition-all duration-150
                  ${errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-zinc-500">
                  Password
                </label>
                
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl border bg-white text-sm
                    text-zinc-800 placeholder-zinc-300 outline-none transition-all duration-150
                    ${errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                    hover:text-violet-600 transition-colors duration-150"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5
                bg-violet-600 text-white text-sm font-semibold rounded-xl
                hover:bg-violet-700 hover:shadow-[0_4px_14px_rgba(124,58,237,0.3)]
                hover:-translate-y-px transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                disabled:shadow-none"
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                : "Log in"
              }
            </button>

          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-400 mt-5">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-violet-600 font-semibold hover:text-violet-700
              transition-colors duration-150"
          >
            Sign up free
          </Link>
        </p>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default Login