"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiUsers,
  FiBook,
  FiFlag,
  FiHome,
  FiLogOut,
  FiDollarSign,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clearAuthCookie } from "@/lib/api";
import Image from "next/image";
import logo from "../../../public/Image/logo.png";

const adminLinks = [
  { label: "Overview", href: "/admin", icon: FiGrid },
  { label: "Manage Users", href: "/admin/users", icon: FiUsers },
  { label: "Manage Recipes", href: "/admin/recipes", icon: FiBook },
  { label: "Reports", href: "/admin/reports", icon: FiFlag },
  { label: "Transactions", href: "/admin/transactions", icon: FiDollarSign },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    await clearAuthCookie();
    router.push("/");
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[var(--secondary)] flex flex-col">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-white m-2 rounded-lg flex items-center justify-center">
          <Image src={logo} width={120} height={100} alt="logo"></Image>
        </div>
      </Link>
      <div className="px-6 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
        Admin Panel
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FiHome size={18} />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
