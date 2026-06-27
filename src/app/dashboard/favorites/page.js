"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiClock, FiTrash2 } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getMyFavorites, removeFavorite } from "@/lib/api";

export default function FavoritesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getMyFavorites(user.email);
        setFavorites(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFavorites();
  }, [user]);

  const handleRemove = async (recipeId) => {
    await removeFavorite(recipeId);
    setFavorites((prev) => prev.filter((r) => r._id !== recipeId));
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="My Favorites" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="My Favorites" />

      <div className="p-6">
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          You have{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {favorites.length}
          </span>{" "}
          favorite recipe{favorites.length !== 1 ? "s" : ""}
        </p>

        {favorites.length === 0 ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <FiHeart
              size={32}
              className="mx-auto text-[var(--text-secondary)] mb-3"
            />
            <p className="text-[var(--text-secondary)]">
              You haven't saved any favorite recipes yet.
            </p>
            <Link href="/recipes">
              <button className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg">
                Browse Recipes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden group"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemove(recipe._id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full">
                    {recipe.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                    {recipe.recipeName}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <FiClock size={13} />
                      {recipe.preparationTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FiHeart size={13} className="text-[var(--primary)]" />
                      {recipe.likesCount}
                    </span>
                  </div>
                  <Link href={`/recipes/${recipe._id}`}>
                    <button className="mt-4 w-full py-2 border border-[var(--primary)] text-[var(--primary)] text-sm font-medium rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
