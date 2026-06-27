"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiBook, FiHeart, FiThumbsUp, FiAward } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getMyRecipes, getMyFavorites, getUserProfile } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      setIsLoading(true);
      try {
        const [profile, myRecipes, myFavorites] = await Promise.all([
          getUserProfile(user.email),
          getMyRecipes(user.email),
          getMyFavorites(user.email),
        ]);

        const validRecipes = Array.isArray(myRecipes)
          ? myRecipes.filter(Boolean)
          : [];
        const validFavorites = Array.isArray(myFavorites)
          ? myFavorites.filter(Boolean)
          : [];

        const totalLikesReceived = validRecipes.reduce(
          (sum, r) => sum + (r.likesCount || 0),
          0,
        );

        setStats({
          totalRecipes: validRecipes.length,
          totalFavorites: validFavorites.length,
          totalLikesReceived,
          isPremium: profile?.isPremium || false,
        });

        setRecentRecipes(validRecipes.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Dashboard Overview" />
        <Loader fullScreen={false} />
      </>
    );
  }

  const statCards = [
    {
      label: "Total Recipes",
      value: stats?.totalRecipes || 0,
      icon: FiBook,
    },
    {
      label: "Total Favorites",
      value: stats?.totalFavorites || 0,
      icon: FiHeart,
    },
    {
      label: "Likes Received",
      value: stats?.totalLikesReceived || 0,
      icon: FiThumbsUp,
    },
  ];

  return (
    <>
      <DashboardTopbar title="Dashboard Overview" />

      <div className="p-6 flex flex-col gap-6">
        <div
          className={`flex items-center justify-between p-5 rounded-xl border ${
            stats?.isPremium
              ? "bg-[var(--accent)]/10 border-[var(--accent)]/30"
              : "bg-[var(--primary)]/10 border-[var(--primary)]/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <FiAward
              size={24}
              className={
                stats?.isPremium
                  ? "text-[var(--accent)]"
                  : "text-[var(--primary)]"
              }
            />
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                {stats?.isPremium ? "You're a Premium Member 🎉" : "Free Plan"}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {stats?.isPremium
                  ? "You can add unlimited recipes."
                  : "You can add up to 2 recipes. Upgrade for unlimited access."}
              </p>
            </div>
          </div>
          {!stats?.isPremium && (
            <Link href="/dashboard/profile">
              <button className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors shrink-0">
                Upgrade to Premium
              </button>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {card.value}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {card.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">
              Your Recent Recipes
            </h2>
            <Link
              href="/dashboard/my-recipes"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentRecipes.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-6">
              No recipes yet.{" "}
              <Link
                href="/dashboard/add-recipe"
                className="text-[var(--primary)] hover:underline"
              >
                Add your first recipe
              </Link>
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                        {recipe.recipeName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {recipe.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1 shrink-0">
                    <FiThumbsUp size={12} />
                    {recipe.likesCount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
