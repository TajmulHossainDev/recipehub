"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiImage, FiPlus, FiX, FiLock } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getMyRecipes, getUserProfile, addRecipe } from "@/lib/api";
import { uploadImageToImgbb } from "@/lib/uploadImage";

const FREE_LIMIT = 2;
const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const difficultyLevels = ["Easy", "Medium", "Hard"];

export default function AddRecipePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);

  const [formData, setFormData] = useState({
    recipeName: "",
    recipeImage: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "",
    preparationTime: "",
    ingredients: [""],
    instructions: [""],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchLimitData() {
      if (!user) return;
      setIsCheckingLimit(true);
      const [userProfile, myRecipes] = await Promise.all([
        getUserProfile(user.email),
        getMyRecipes(user.email),
      ]);
      setProfile(userProfile);
      setRecipeCount(
        Array.isArray(myRecipes) ? myRecipes.filter(Boolean).length : 0,
      );
      setIsCheckingLimit(false);
    }
    fetchLimitData();
  }, [user]);

  const limitReached =
    profile && !profile.isPremium && recipeCount >= FREE_LIMIT;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleListChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.recipeName ||
      (!formData.recipeImage && !imageFile) ||
      !formData.category ||
      !formData.cuisineType ||
      !formData.difficultyLevel ||
      !formData.preparationTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = formData.recipeImage;

    if (imageFile) {
      try {
        setIsUploadingImage(true);
        imageUrl = await uploadImageToImgbb(imageFile);
        setIsUploadingImage(false);
      } catch (err) {
        setError("Image upload failed. Please try again.");
        setIsSubmitting(false);
        setIsUploadingImage(false);
        return;
      }
    }

    const payload = {
      ...formData,
      recipeImage: imageUrl,
      preparationTime: Number(formData.preparationTime),
      ingredients: formData.ingredients.filter((i) => i.trim() !== ""),
      instructions: formData.instructions.filter((i) => i.trim() !== ""),
      authorId: user.id,
      authorName: user.name,
      authorEmail: user.email,
    };

    const { ok, data } = await addRecipe(payload);

    if (!ok) {
      setError(data.message || "Failed to add recipe.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard/my-recipes");
  };

  if (isCheckingLimit) {
    return (
      <>
        <DashboardTopbar title="Add Recipe" />
        <Loader fullScreen={false} />
      </>
    );
  }

  if (limitReached) {
    return (
      <>
        <DashboardTopbar title="Add Recipe" />
        <div className="p-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-4">
              <FiLock size={22} className="text-[var(--primary)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Recipe Limit Reached
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Free accounts can add up to {FREE_LIMIT} recipes. Upgrade to
              Premium to unlock unlimited recipe uploads.
            </p>
            <Link href="/dashboard/profile">
              <button className="w-full py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                Upgrade to Premium
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Add Recipe" />

      <div className="p-6 max-w-3xl">
        {profile && !profile.isPremium && (
          <div className="mb-6 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg text-sm text-[var(--text-primary)]">
            You've used <strong>{recipeCount}</strong> of{" "}
            <strong>{FREE_LIMIT}</strong> free recipe slots.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Recipe Name
            </label>
            <input
              type="text"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              placeholder="e.g. Creamy Garlic Butter Pasta"
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Recipe Image
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--primary)] transition-colors bg-[var(--card)]">
                <FiImage size={16} className="text-[var(--text-secondary)]" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[var(--border)]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
              {!imageFile && (
                <div className="relative">
                  <FiImage
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    size={16}
                  />
                  <input
                    type="text"
                    name="recipeImage"
                    value={formData.recipeImage}
                    onChange={handleChange}
                    placeholder="Or paste image URL directly"
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Cuisine Type
              </label>
              <input
                type="text"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                placeholder="e.g. Italian"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Difficulty Level
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="">Select difficulty</option>
                {difficultyLevels.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="e.g. 30"
                min="1"
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Ingredients
            </label>
            <div className="flex flex-col gap-2">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) =>
                      handleListChange("ingredients", idx, e.target.value)
                    }
                    placeholder={`Ingredient ${idx + 1}`}
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("ingredients", idx)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem("ingredients")}
                className="flex items-center gap-1.5 text-sm text-[var(--primary)] font-medium mt-1 self-start"
              >
                <FiPlus size={14} />
                Add Ingredient
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Instructions
            </label>
            <div className="flex flex-col gap-2">
              {formData.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-8 h-8 mt-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold shrink-0">
                    {idx + 1}
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) =>
                      handleListChange("instructions", idx, e.target.value)
                    }
                    placeholder={`Step ${idx + 1}`}
                    rows={2}
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("instructions", idx)}
                      className="p-2 mt-1 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem("instructions")}
                className="flex items-center gap-1.5 text-sm text-[var(--primary)] font-medium mt-1 self-start"
              >
                <FiPlus size={14} />
                Add Step
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full sm:w-auto px-8 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
          >
            {isUploadingImage
              ? "Uploading image..."
              : isSubmitting
                ? "Publishing..."
                : "Publish Recipe"}
          </button>
        </form>
      </div>
    </>
  );
}
