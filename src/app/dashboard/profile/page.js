"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiUser, FiImage, FiMail, FiAward, FiCheck } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { createPremiumCheckout } from "@/lib/api";
const premiumPerks = [
  "Unlimited recipe uploads",
  "Premium profile badge",
  "Priority support",
];

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getUserProfile(user.email);
        setProfile(data);
        setFormData({
          name: data?.name || user.name || "",
          image: data?.image || user.image || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await updateUserProfile(user.email, {
        name: formData.name,
        image: formData.image,
      });
      setProfile((prev) => ({ ...prev, ...formData }));
      setSaved(true);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const { url } = await createPremiumCheckout(user.email, user.name);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Stripe checkout failed:", err);
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Profile" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Profile" />
      <div className="p-6 max-w-2xl flex flex-col gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5">
            Profile Information
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--primary)]/10 shrink-0">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--primary)] font-bold text-xl">
                  {formData.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                {formData.name}
              </p>
              <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                <FiMail size={13} />
                {user?.email}
              </p>
              {profile?.isPremium && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                  <FiAward size={11} />
                  Premium
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Profile Image URL
              </label>
              <div className="relative">
                <FiImage
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  size={16}
                />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--border)]/20 text-[var(--text-secondary)] text-sm cursor-not-allowed"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Email cannot be changed
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="self-start px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
            >
              {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>
        </div>
        <div
          className={`rounded-2xl p-6 border ${
            profile?.isPremium
              ? "bg-[var(--accent)]/10 border-[var(--accent)]/30"
              : "bg-[var(--card)] border-[var(--border)]"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <FiAward
              size={20}
              className={
                profile?.isPremium
                  ? "text-[var(--accent)]"
                  : "text-[var(--primary)]"
              }
            />
            <h2 className="font-semibold text-[var(--text-primary)]">
              {profile?.isPremium
                ? "You're a Premium Member"
                : "Upgrade to Premium"}
            </h2>
          </div>

          {!profile?.isPremium ? (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Unlock these benefits with a one-time premium upgrade:
              </p>
              <ul className="flex flex-col gap-2 mb-5">
                {premiumPerks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-sm text-[var(--text-primary)]"
                  >
                    <FiCheck size={15} className="text-[var(--accent)]" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                className="px-6 py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
              >
                Upgrade with Stripe Checkout
              </button>
            </>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              Thank you for being a premium member! You have unlimited recipe
              uploads and a premium badge on your profile.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
