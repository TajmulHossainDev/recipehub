"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingBag, FiClock, FiCalendar } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getPurchasedRecipes } from "@/lib/api";

export default function PurchasedRecipesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [purchased, setPurchased] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchased() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getPurchasedRecipes(user.email);
        setPurchased(data);
      } catch (err) {
        setPurchased([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPurchased();
  }, [user]);

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="My Purchased Recipes" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="My Purchased Recipes" />

      <div className="p-6">
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          You've purchased{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {purchased.length}
          </span>{" "}
          recipe{purchased.length !== 1 ? "s" : ""}
        </p>

        {purchased.length === 0 ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <FiShoppingBag
              size={32}
              className="mx-auto text-[var(--text-secondary)] mb-3"
            />
            <p className="text-[var(--text-secondary)]">
              You haven't purchased any recipes yet.
            </p>
            <Link href="/recipes">
              <button className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg">
                Browse Recipes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchased.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-[var(--accent)] text-white text-xs font-semibold rounded-full">
                    Purchased
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                    {recipe.recipeName}
                  </h3>

                  <div className="flex flex-col gap-1.5 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={13} />
                      {recipe.purchasedAt
                        ? new Date(recipe.purchasedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} />
                      {recipe.preparationTime} min prep
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]/70 truncate">
                      Txn: {recipe.transactionId}
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
