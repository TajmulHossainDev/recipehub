const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createUserInDB(userData) {
  const res = await fetch(`${SERVER_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function setAuthCookie(token) {
  const res = await fetch(`${SERVER_URL}/auth/set-cookie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function clearAuthCookie() {
  const res = await fetch(`${SERVER_URL}/auth/clear-cookie`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function getAuthToken() {
  const res = await fetch("/api/auth/token", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.token;
}

export async function getFeaturedRecipes() {
  const res = await fetch(`${SERVER_URL}/recipes/featured`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getPopularRecipes() {
  const res = await fetch(`${SERVER_URL}/recipes/popular`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getRecipes({
  category = "All",
  page = 1,
  limit = 6,
} = {}) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  params.set("page", page);
  params.set("limit", limit);

  const res = await fetch(`${SERVER_URL}/recipes?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { recipes: [], total: 0, totalPages: 0, currentPage: 1 };
  }
  return res.json();
}

export async function getRecipeById(id) {
  const res = await fetch(`${SERVER_URL}/recipes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function toggleLikeRecipe(id, liked) {
  const res = await fetch(`${SERVER_URL}/recipes/like/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ liked }),
  });
  return res.json();
}

export async function checkFavorite(email, recipeId) {
  const res = await fetch(
    `${SERVER_URL}/favorites/check/${email}/${recipeId}`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) return { isFavorite: false };
  return res.json();
}

export async function addFavorite(userEmail, recipeId) {
  const res = await fetch(`${SERVER_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userEmail, recipeId }),
  });
  return res.json();
}

export async function removeFavorite(recipeId) {
  const res = await fetch(`${SERVER_URL}/favorites/${recipeId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function submitReport(recipeId, reason) {
  const res = await fetch(`${SERVER_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipeId, reason }),
  });
  return res.json();
}

export async function getMyRecipes(email) {
  const res = await fetch(`${SERVER_URL}/my-recipes/${email}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function addRecipe(recipeData) {
  const res = await fetch(`${SERVER_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(recipeData),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function deleteRecipe(id) {
  const res = await fetch(`${SERVER_URL}/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function getMyFavorites(email) {
  const res = await fetch(`${SERVER_URL}/favorites/${email}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getUserProfile(email) {
  const res = await fetch(`${SERVER_URL}/users/${email}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateUserProfile(email, profileData) {
  const res = await fetch(`${SERVER_URL}/users/profile/${email}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileData),
  });
  return res.json();
}

export async function getAdminStats() {
  const [usersRes, recipesRes, reportsRes] = await Promise.all([
    fetch(`${SERVER_URL}/users`, { credentials: "include", cache: "no-store" }),
    fetch(`${SERVER_URL}/admin/recipes`, {
      credentials: "include",
      cache: "no-store",
    }),
    fetch(`${SERVER_URL}/admin/reports`, {
      credentials: "include",
      cache: "no-store",
    }),
  ]);

  const users = usersRes.ok ? await usersRes.json() : [];
  const recipes = recipesRes.ok ? await recipesRes.json() : [];
  const reports = reportsRes.ok ? await reportsRes.json() : [];

  return {
    totalUsers: users.length,
    totalRecipes: recipes.length,
    totalPremiumMembers: users.filter((u) => u.isPremium).length,
    totalReports: reports.filter((r) => r.status === "pending").length,
  };
}

export async function getAllUsers() {
  const res = await fetch(`${SERVER_URL}/users`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function toggleBlockUser(id, isBlocked) {
  const res = await fetch(`${SERVER_URL}/users/block/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isBlocked }),
  });
  return res.json();
}

export async function getAllRecipesAdmin() {
  const res = await fetch(`${SERVER_URL}/admin/recipes`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function toggleFeatureRecipe(id, isFeatured) {
  const res = await fetch(`${SERVER_URL}/admin/recipes/feature/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isFeatured }),
  });
  return res.json();
}

export async function deleteRecipeAdmin(id) {
  const res = await fetch(`${SERVER_URL}/admin/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function updateRecipeAdmin(id, updates) {
  const res = await fetch(`${SERVER_URL}/admin/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function getAdminPayments() {
  const res = await fetch(`${SERVER_URL}/admin/payments`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getAllReports() {
  const res = await fetch(`${SERVER_URL}/admin/reports`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function dismissReport(id) {
  const res = await fetch(`${SERVER_URL}/admin/reports/dismiss/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
  return res.json();
}

export async function removeReportedRecipe(id) {
  const res = await fetch(`${SERVER_URL}/admin/reports/remove/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function getPurchasedRecipes(email) {
  const res = await fetch(`${SERVER_URL}/payments/${email}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export async function createPremiumCheckout(email, name) {
  const res = await fetch(`${SERVER_URL}/create-payment-intent/premium`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, name }),
  });
  return res.json();
}

export async function createRecipeCheckout(
  email,
  name,
  recipeId,
  recipeName,
  price,
) {
  const res = await fetch(`${SERVER_URL}/create-payment-intent/recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, name, recipeId, recipeName, price }),
  });
  return res.json();
}

export async function verifyPayment(sessionId) {
  const res = await fetch(`${SERVER_URL}/verify-payment/${sessionId}`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function savePaymentToDB(paymentData) {
  const res = await fetch(`${SERVER_URL}/payments/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(paymentData),
  });
  return res.json();
}

export async function getRecipeCategories() {
  const res = await fetch(`${SERVER_URL}/recipes/categories`, {
    cache: "no-store",
  });
  return res.json();
}
