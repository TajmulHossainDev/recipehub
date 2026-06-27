"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { authClient } from "@/lib/auth-client";
import { setAuthCookie, getAuthToken } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      const token = await getAuthToken();
      if (token) {
        await setAuthCookie(token);
      }

      router.push(redirectTo);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Welcome Back
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Login to continue exploring recipes
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-secondary)]">OR</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] transition-colors"
          >
            <FcGoogle size={18} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
