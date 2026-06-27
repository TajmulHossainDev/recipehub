import RecipeCard from "@/components/shared/RecipeCard";
import { getFeaturedRecipes } from "@/lib/api";

export default async function FeaturedRecipes() {
  const featured = await getFeaturedRecipes();

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          Featured Recipes
        </h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Hand-picked recipes our editors love
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((recipe, idx) => (
          <RecipeCard key={recipe._id} recipe={recipe} index={idx} />
        ))}
      </div>
    </section>
  );
}
