"use client";
import { FiSun, FiMoon, FiBell } from "react-icons/fi";
import { useTheme } from "@/Providers/ThemeProvider";
import { authClient } from "@/lib/auth-client";

export default function DashboardTopbar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--background)] transition-colors text-[var(--text-primary)]"
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        <button className="p-2 rounded-full hover:bg-[var(--background)] transition-colors text-[var(--text-primary)] relative">
          <FiBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full" />
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-semibold text-sm overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0)
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">
                {user.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
