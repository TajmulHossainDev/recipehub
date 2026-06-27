import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiUser } from "react-icons/fi";
import { getPopularRecipes } from "@/lib/api";

export default async function PopularRecipes() {
  const popular = await getPopularRecipes();

  if (popular.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--card)] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Popular Recipes
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Most loved recipes by our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popular.map((recipe) => (
            <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-white/90 rounded-full text-xs font-semibold text-[var(--primary)]">
                    <FiHeart size={12} className="fill-[var(--primary)]" />
                    {recipe.likesCount}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                    {recipe.recipeName}
                  </h3>
                  <p className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
                    <FiUser size={12} />
                    {recipe.authorName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
