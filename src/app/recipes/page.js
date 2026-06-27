"use client";
import { useState, useEffect } from "react";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RecipeCard from "@/components/shared/RecipeCard";
import RecipeFilters from "@/components/recipes/RecipeFilters";
import Pagination from "@/components/shared/Pagination";
import Loader from "@/components/shared/Loader";
import { getRecipes } from "@/lib/api";

const ITEMS_PER_PAGE = 6;

export default function BrowseRecipesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      const data = await getRecipes({
        category: activeCategory,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setIsLoading(false);
    }
    fetchRecipes();
  }, [activeCategory, currentPage]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="max-w-7xl mx-auto px-4 py-12 w-full flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Browse Recipes
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Explore {total}+ delicious recipes from our community
          </p>
        </div>

        <RecipeFilters
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading ? (
          <Loader fullScreen={false} />
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, idx) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={idx} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-16">
            No recipes found in this category.
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>

      <Footer />
    </main>
  );
}
