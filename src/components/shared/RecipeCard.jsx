"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiClock, FiHeart, FiUser } from "react-icons/fi";

export default function RecipeCard({ recipe, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full">
          {recipe.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1">
          {recipe.recipeName}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {recipe.cuisineType} Cuisine
        </p>

        <div className="flex items-center justify-between mt-4 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <FiClock size={14} />
            {recipe.preparationTime} min
          </span>
          {recipe.likesCount !== undefined && (
            <span className="flex items-center gap-1">
              <FiHeart size={14} className="text-[var(--primary)]" />
              {recipe.likesCount}
            </span>
          )}
        </div>

        {recipe.authorName && (
          <p className="flex items-center gap-1 mt-2 text-xs text-[var(--text-secondary)]">
            <FiUser size={12} />
            by {recipe.authorName}
          </p>
        )}

        <Link href={`/recipes/${recipe._id}`}>
          <button className="mt-4 w-full py-2 border border-[var(--primary)] text-[var(--primary)] font-medium rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors text-sm">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
