"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiClock,
  FiHeart,
  FiUser,
  FiFlag,
  FiBookmark,
  FiShoppingCart,
  FiArrowLeft,
  FiBarChart2,
} from "react-icons/fi";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Loader from "@/components/shared/Loader";
import ReportModal from "@/components/recipes/ReportModal";
import { authClient } from "@/lib/auth-client";
import {
  getRecipeById,
  toggleLikeRecipe,
  checkFavorite,
  addFavorite,
  removeFavorite,
  submitReport,
} from "@/lib/api";
import { createRecipeCheckout } from "@/lib/api";
export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    async function fetchRecipe() {
      setIsLoading(true);
      const data = await getRecipeById(id);
      setRecipe(data);
      if (data) setLikesCount(data.likesCount || 0);
      setIsLoading(false);
    }
    fetchRecipe();
  }, [id]);
  useEffect(() => {
    async function fetchFavoriteStatus() {
      if (!user) return;
      const result = await checkFavorite(user.email, id);
      setIsFavorite(result.isFavorite);
    }
    fetchFavoriteStatus();
  }, [user, id]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <AppNavbar />
        <Loader fullScreen={false} />
        <Footer />
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="min-h-screen flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Recipe Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            The recipe you're looking for doesn't exist.
          </p>
          <Link
            href="/recipes"
            className="mt-6 px-6 py-2 bg-[var(--primary)] text-white rounded-lg"
          >
            Browse Recipes
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const requireAuth = () => {
    if (!user) {
      setActionError("Please login to continue.");
      setTimeout(() => router.push("/login"), 1200);
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    setActionError("");
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    try {
      await toggleLikeRecipe(id, nextLiked);
    } catch (err) {
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? prev - 1 : prev + 1));
    }
  };

  const handleFavorite = async () => {
    if (!requireAuth()) return;
    setActionError("");

    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(user.email, id);
        setIsFavorite(true);
      }
    } catch (err) {
      setActionError("Something went wrong. Please try again.");
    }
  };

  const handleReportSubmit = async (reason) => {
    if (!requireAuth()) return;
    await submitReport(id, reason);
  };

  const handlePurchase = async () => {
    if (!requireAuth()) return;
    try {
      const { url } = await createRecipeCheckout(
        user.email,
        user.name,
        recipe._id,
        recipe.recipeName,
        recipe.price || 5,
      );
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Stripe checkout failed:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="max-w-5xl mx-auto px-4 py-10 w-full flex-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6 transition-colors"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {actionError}
          </div>
        )}

        <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden mb-6">
          <Image
            src={recipe.recipeImage}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            priority
          />
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-full">
            {recipe.category}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {recipe.recipeName}
            </h1>
            <p className="flex items-center gap-1 mt-2 text-sm text-[var(--text-secondary)]">
              <FiUser size={14} />
              by {recipe.authorName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                isLiked
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]"
              }`}
            >
              <FiHeart className={isLiked ? "fill-white" : ""} size={16} />
              {likesCount}
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                isFavorite
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
              }`}
            >
              <FiBookmark
                className={isFavorite ? "fill-white" : ""}
                size={16}
              />
              {isFavorite ? "Saved" : "Favorite"}
            </button>

            <button
              onClick={() => (requireAuth() ? setIsReportOpen(true) : null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-red-400 hover:text-red-500 font-medium text-sm transition-colors"
            >
              <FiFlag size={16} />
              Report
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl mb-8">
          <div className="flex items-center gap-2 text-sm">
            <FiClock className="text-[var(--primary)]" size={16} />
            <span className="text-[var(--text-secondary)]">Prep Time:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {recipe.preparationTime} min
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiBarChart2 className="text-[var(--primary)]" size={16} />
            <span className="text-[var(--text-secondary)]">Difficulty:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {recipe.difficultyLevel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-secondary)]">Cuisine:</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {recipe.cuisineType}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl mb-10">
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              Get the full recipe access
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              ${recipe.price || 5} — one-time purchase
            </p>
          </div>
          <button
            onClick={handlePurchase}
            disabled={isPurchased}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <FiShoppingCart size={16} />
            {isPurchased ? "Purchased ✓" : "Purchase with Stripe"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Ingredients
            </h2>
            <ul className="flex flex-col gap-2">
              {recipe.ingredients?.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Instructions
            </h2>
            <ol className="flex flex-col gap-4">
              {recipe.instructions?.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)] text-white text-sm font-semibold shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        recipeName={recipe.recipeName}
        onSubmitReport={handleReportSubmit}
      />

      <Footer />
    </main>
  );
}
