import Link from "next/link";
import { FiHome, FiSearch } from "react-icons/fi";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="relative w-64 h-64 mb-2">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="var(--primary)"
              opacity="0.08"
            />
            <circle
              cx="100"
              cy="80"
              r="45"
              fill="var(--primary)"
              opacity="0.15"
            />
            <ellipse cx="100" cy="135" rx="55" ry="14" fill="var(--border)" />
            <ellipse
              cx="100"
              cy="130"
              rx="55"
              ry="14"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <path
              d="M65 95 L65 125 M61 95 L61 105 M65 95 L65 105 M69 95 L69 105"
              stroke="var(--secondary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="135" cy="98" rx="6" ry="9" fill="var(--secondary)" />
            <path
              d="M135 107 L135 125"
              stroke="var(--secondary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="100"
              y="118"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill="var(--primary)"
            >
              404
            </text>
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
          Recipe Not Found
        </h1>
        <p className="text-[var(--text-secondary)] mt-3 max-w-md">
          Looks like this page got lost in the kitchen. The recipe or page
          you're looking for doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link href="/">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors w-full">
              <FiHome size={16} />
              Back to Home
            </button>
          </Link>
          <Link href="/recipes">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[var(--primary)] text-[var(--primary)] font-medium rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors w-full">
              <FiSearch size={16} />
              Browse Recipes
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
