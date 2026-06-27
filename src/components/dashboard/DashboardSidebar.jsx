"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBook,
  FiPlusCircle,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiHome,
  FiLogOut,
} from "react-icons/fi";
import logo from "../../../public/Image/logo.png";

const userLinks = [
  { label: "Overview", href: "/dashboard", icon: FiGrid },
  { label: "My Recipes", href: "/dashboard/my-recipes", icon: FiBook },
  { label: "Add Recipe", href: "/dashboard/add-recipe", icon: FiPlusCircle },
  { label: "My Favorites", href: "/dashboard/favorites", icon: FiHeart },
  {
    label: "Purchased Recipes",
    href: "/dashboard/purchased",
    icon: FiShoppingBag,
  },
  { label: "Profile", href: "/dashboard/profile", icon: FiUser },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col">
      <Link href="/" className="flex items-center gap-2">
        <div className="rounded-lg flex items-center justify-center">
          <Image src={logo} width={120} height={100} alt="logo"></Image>
        </div>
      </Link>
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {userLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border)] flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)] transition-colors"
        >
          <FiHome size={18} />
          Back to Site
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
