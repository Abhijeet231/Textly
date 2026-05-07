import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Camera, X } from "lucide-react";
import { useState, useRef } from "react";
import {
  registerSchema,
  type RegisterFormData,
} from "../../validations/auth.validations";
import { register as registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  error,
  showToggle,
  onToggle,
  visible,
  ...rest
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  visible?: boolean;
  [key: string]: any;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium text-zinc-500">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-zinc-800
          placeholder-zinc-300 outline-none transition-all duration-150
          ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          }
          ${showToggle ? "pr-11" : ""}`}
        {...rest}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
            hover:text-violet-600 transition-colors duration-150"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hand to RHF so Zod validates it
    setValue("avatar", file, { shouldValidate: true });

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setValue("avatar", undefined, { shouldValidate: false });
    clearErrors("avatar");
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await registerUser(payload);

      // save tokens
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      await login({ email: data.email, password: data.password });
      toast.success("Account created! Welcome to Textly.");
      navigate("/chat");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("User Registration Error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-zinc-50 font-[Sora,sans-serif] flex items-center
      justify-center px-4 py-12"
    >
      {/* Soft glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75
        bg-violet-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-end select-none">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              Text<span className="text-violet-600">ly</span>
            </span>
            <span className="w-1.75 h-1.75 rounded-full bg-violet-600 mb-3.5 ml-0.5" />
          </Link>
          <p className="text-sm text-zinc-400 mt-2">
            Create your account — it's free
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm px-8 py-8">
          <h1 className="text-lg font-bold text-zinc-900 mb-6">Get started</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-2 mb-1">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center
                    justify-center cursor-pointer overflow-hidden transition-all duration-200
                    ${
                      errors.avatar
                        ? "border-red-300 bg-red-50"
                        : avatarPreview
                          ? "border-violet-300"
                          : "border-zinc-200 bg-zinc-50 hover:border-violet-400 hover:bg-violet-50"
                    }`}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera
                      size={20}
                      className="text-zinc-400 group-hover:text-violet-500
                        transition-colors duration-150"
                    />
                  )}
                </div>

                {/* Remove button */}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-800 rounded-full
                      flex items-center justify-center hover:bg-red-500
                      transition-colors duration-150"
                  >
                    <X size={11} className="text-white" />
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-400">
                Profile photo <span className="text-zinc-300">— optional</span>
              </p>

              {errors.avatar && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.avatar.message as string}
                </p>
              )}

              {/* Hidden native file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <InputField
              label="Full name"
              id="name"
              type="text"
              placeholder="Alex Johnson"
              error={errors.name?.message}
              {...register("name")}
            />

            <InputField
              label="Email address"
              id="email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <InputField
              label="Password"
              id="password"
              placeholder="Min. 6 characters"
              error={errors.password?.message}
              showToggle
              visible={showPassword}
              onToggle={() => setShowPassword((p) => !p)}
              {...register("password")}
            />

            <InputField
              label="Confirm password"
              id="confirmPassword"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              showToggle
              visible={showConfirm}
              onToggle={() => setShowConfirm((p) => !p)}
              {...register("confirmPassword")}
            />

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
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-400 mt-5">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-violet-600 font-semibold hover:text-violet-700
              transition-colors duration-150"
          >
            Log in
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default Register;
