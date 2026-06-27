"use client";
import { FiFilter } from "react-icons/fi";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

export default function RecipeFilters({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
      <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium shrink-0">
        <FiFilter size={16} />
        Filter:
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "bg-[var(--card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
