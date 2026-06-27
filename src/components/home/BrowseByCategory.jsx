import Link from "next/link";
import { FiSunrise, FiCoffee, FiSun, FiMoon, FiGift } from "react-icons/fi";

import { getRecipeCategories } from "@/lib/api";

const iconMap = {
  Breakfast: FiSunrise,
  Lunch: FiSun,
  Dinner: FiMoon,
  Snack: FiCoffee,
  Dessert: FiGift,
};

export default async function BrowseByCategory() {
  const categories = await getRecipeCategories();

  return (
    <section className="bg-[var(--card)] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Browse by Category
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Find recipes that match your mood and meal time
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.name] || FiCoffee;

            return (
              <Link
                key={cat.name}
                href={`/recipes?category=${cat.name}`}
                className="flex flex-col items-center gap-3 p-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--primary)]/10 group-hover:bg-[var(--primary)] transition-colors">
                  <Icon
                    size={22}
                    className="text-[var(--primary)] group-hover:text-white transition-colors"
                  />
                </div>

                <div className="text-center">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">
                    {cat.name}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {cat.count} recipes
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
