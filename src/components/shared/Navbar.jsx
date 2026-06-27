"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "@/Providers/ThemeProvider";
import { authClient } from "@/lib/auth-client";
import { clearAuthCookie } from "@/lib/api";
import logo from "../../../public/Image/logo.png";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    await clearAuthCookie();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--card)] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center">
            <Image src={logo} width={120} height={100} alt="logo"></Image>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--primary)] ${
                pathname === link.href
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text-primary)]"
          >
            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
          {isPending && (
            <div className="w-9 h-9 rounded-full bg-[var(--border)] animate-pulse" />
          )}
          {!isPending && !user && (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <button className="px-4 py-1.5 text-sm font-medium border border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-1.5 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                  Register
                </button>
              </Link>
            </div>
          )}
          {!isPending && user && (
            <div className="hidden md:flex items-center gap-4">
              <Avatar
                size="sm"
                src={user.image || undefined}
                name={user.name}
                className="ring-2 ring-[var(--primary)]"
              />

              <span className="text-sm font-medium text-[var(--text-primary)]">
                {user.name}
              </span>

              <Link
                href="/dashboard"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          <button
            className="md:hidden p-2 text-[var(--text-primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--card)] border-t border-[var(--border)] px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--primary)] ${
                pathname === link.href
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-secondary)]"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
              <Avatar
                size="sm"
                src={user.image || undefined}
                name={user.name}
                className="ring-2 ring-[var(--primary)]"
              />
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {!user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2 text-sm font-medium border border-[var(--primary)] text-[var(--primary)] rounded-lg">
                  Login
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg">
                  Register
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2 text-sm font-medium border border-[var(--primary)] text-[var(--primary)] rounded-lg">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
