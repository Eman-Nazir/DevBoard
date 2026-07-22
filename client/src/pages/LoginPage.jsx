import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useAuth.js";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({ email: "", password: "" });
  }, [reset]);

  const onSubmit = (data) => login(data);

  return (
    <div className="w-full">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-white text-xl sm:text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm">Sign in to your workspace</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            autoComplete="off"
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            style={{ fontSize: "16px" }}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1 break-words">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 pr-11 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              style={{ fontSize: "16px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 active:text-gray-300 transition-colors p-2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 break-words">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 sm:py-2.5 text-sm transition-colors mt-2"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-center text-gray-500 text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;