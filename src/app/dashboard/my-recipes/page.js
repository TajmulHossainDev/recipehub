"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiPlus, FiClock } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getMyRecipes, deleteRecipe } from "@/lib/api";

export default function MyRecipesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    async function fetchMyRecipes() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getMyRecipes(user.email);
        const validRecipes = Array.isArray(data)
          ? data.filter((r) => r && r._id)
          : [];
        setRecipes(validRecipes);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyRecipes();
  }, [user]);

  const handleDeleteConfirm = async () => {
    await deleteRecipe(deleteTarget._id);
    setRecipes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="My Recipes" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="My Recipes" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--text-secondary)]">
            You have{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {recipes.length}
            </span>{" "}
            recipe{recipes.length !== 1 ? "s" : ""}
          </p>
          <Link href="/dashboard/add-recipe">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
              <FiPlus size={16} />
              Add Recipe
            </button>
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <p className="text-[var(--text-secondary)]">
              You haven't added any recipes yet.
            </p>
            <Link href="/dashboard/add-recipe">
              <button className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg">
                Add Your First Recipe
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--background)] border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                    Recipe
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">
                    Prep Time
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                    Likes
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-[var(--text-secondary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipes.filter(Boolean).map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={recipe.recipeImage}
                            alt={recipe.recipeName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                          {recipe.recipeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium rounded-full">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <FiClock size={13} />
                        {recipe.preparationTime} min
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">
                      {recipe.likesCount}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/my-recipes/edit/${recipe._id}`}>
                          <button className="p-2 rounded-lg hover:bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                            <FiEdit2 size={15} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(recipe)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">
              Delete Recipe
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete "{deleteTarget.recipeName}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
