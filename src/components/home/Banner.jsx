"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

export default function Banner() {
  return (
    <section className="relative bg-[var(--card)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium mb-6"
        >
          <GiKnifeFork className="" /> Join 10,000+ food lovers
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] leading-tight max-w-3xl"
        >
          Discover, Cook & Share
          <span className="text-[var(--primary)]"> Amazing Recipes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base md:text-lg text-[var(--text-secondary)] max-w-xl"
        >
          Your go-to platform for finding new recipes, sharing your culinary
          creations, and connecting with food lovers around the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Link href="/recipes">
            <button className="flex items-center gap-2 px-7 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors shadow-lg shadow-[var(--primary)]/20">
              Browse Recipes
              <FiArrowRight />
            </button>
          </Link>
        </motion.div>
      </div>
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl" />
    </section>
  );
}
