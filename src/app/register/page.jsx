"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { createUserInDB, setAuthCookie, getAuthToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
  };
  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasUppercase &&
    passwordChecks.hasLowercase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password doesn't meet the requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image || undefined,
      });

      if (signUpError) {
        setError(signUpError.message || "Registration failed.");
        setIsLoading(false);
        return;
      }
      await createUserInDB({
        name: formData.name,
        email: formData.email,
        image: formData.image || "",
      });
      const token = await getAuthToken();
      if (token) {
        await setAuthCookie(token);
      }

      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Create Account
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Join RecipeHub and start sharing your recipes
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
                Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>
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
                Profile Image URL{" "}
                <span className="text-[var(--text-secondary)] font-normal">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <FiImage
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
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
              {formData.password.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  <PasswordRule
                    met={passwordChecks.minLength}
                    label="At least 6 characters"
                  />
                  <PasswordRule
                    met={passwordChecks.hasUppercase}
                    label="One uppercase letter"
                  />
                  <PasswordRule
                    met={passwordChecks.hasLowercase}
                    label="One lowercase letter"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-secondary)]">OR</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] transition-colors"
          >
            <FcGoogle size={18} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PasswordRule({ met, label }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <FiCheck size={14} className="text-[var(--accent)]" />
      ) : (
        <FiX size={14} className="text-[var(--text-secondary)]" />
      )}
      <span
        className={
          met ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
        }
      >
        {label}
      </span>
    </div>
  );
}
