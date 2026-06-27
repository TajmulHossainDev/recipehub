"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiTrash2, FiStar, FiEdit2, FiX } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import {
  getAllRecipesAdmin,
  toggleFeatureRecipe,
  deleteRecipeAdmin,
  updateRecipeAdmin,
} from "@/lib/api";

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const difficultyLevels = ["Easy", "Medium", "Hard"];

export default function ManageRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      const data = await getAllRecipesAdmin();
      setRecipes(Array.isArray(data) ? data.filter(Boolean) : []);
      setIsLoading(false);
    }
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (r) =>
      r.recipeName?.toLowerCase().includes(search.toLowerCase()) ||
      r.authorName?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleFeature = async (id, current) => {
    await toggleFeatureRecipe(id, !current);
    setRecipes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isFeatured: !current } : r)),
    );
  };

  const handleDeleteConfirm = async () => {
    await deleteRecipeAdmin(deleteTarget._id);
    setRecipes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  const openEdit = (recipe) => {
    setEditTarget(recipe);
    setEditForm({
      recipeName: recipe.recipeName || "",
      category: recipe.category || "",
      cuisineType: recipe.cuisineType || "",
      difficultyLevel: recipe.difficultyLevel || "",
      preparationTime: recipe.preparationTime || "",
    });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editForm.recipeName || !editForm.category) {
      setEditError("Recipe name and category are required.");
      return;
    }
    setIsSaving(true);
    setEditError("");
    try {
      await updateRecipeAdmin(editTarget._id, editForm);
      setRecipes((prev) =>
        prev.map((r) => (r._id === editTarget._id ? { ...r, ...editForm } : r)),
      );
      setEditTarget(null);
    } catch (err) {
      setEditError("Failed to update recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Manage Recipes" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Manage Recipes" />

      <div className="p-6">
        <div className="relative max-w-sm mb-6">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipe or author..."
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--background)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Recipe
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                  Author
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Likes
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Featured
                </th>
                <th className="text-right px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr
                  key={recipe._id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
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
                  <td className="px-5 py-3 hidden sm:table-cell text-[var(--text-secondary)]">
                    {recipe.authorName}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium rounded-full">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">
                    {recipe.likesCount}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() =>
                        handleToggleFeature(recipe._id, recipe.isFeatured)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        recipe.isFeatured
                          ? "text-[var(--accent)] bg-[var(--accent)]/10"
                          : "text-[var(--text-secondary)] hover:bg-[var(--background)]"
                      }`}
                    >
                      <FiStar
                        size={15}
                        className={
                          recipe.isFeatured ? "fill-[var(--accent)]" : ""
                        }
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(recipe)}
                        className="p-2 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                        title="Edit recipe"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(recipe)}
                        className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                        title="Delete recipe"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecipes.length === 0 && (
            <p className="text-center text-sm text-[var(--text-secondary)] py-10">
              No recipes found.
            </p>
          )}
        </div>
      </div>
      {editTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[var(--text-primary)]">
                Edit Recipe
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--background)] text-[var(--text-secondary)] transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {editError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Recipe Name
                </label>
                <input
                  type="text"
                  name="recipeName"
                  value={editForm.recipeName}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  value={editForm.cuisineType}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Difficulty
                  </label>
                  <select
                    name="difficultyLevel"
                    value={editForm.difficultyLevel}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  >
                    <option value="">Select</option>
                    {difficultyLevels.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={editForm.preparationTime}
                    onChange={handleEditChange}
                    min="1"
                    className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">
              Delete Recipe
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete "{deleteTarget.recipeName}"? This
              cannot be undone.
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
