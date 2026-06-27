"use client";
import { useState, useEffect } from "react";
import { FiUsers, FiBook, FiAward, FiFlag } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { getAdminStats } from "@/lib/api";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAdminStats();
        if (data && data.totalUsers !== undefined) {
          setStats(data);
        } else {
          setError("Failed to load stats.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Admin Overview" />
        <Loader fullScreen={false} />
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <DashboardTopbar title="Admin Overview" />
        <div className="p-6 text-red-500 font-medium">
          {error || "No data found."}
        </div>
      </>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: FiUsers },
    { label: "Total Recipes", value: stats.totalRecipes, icon: FiBook },
    {
      label: "Premium Members",
      value: stats.totalPremiumMembers,
      icon: FiAward,
    },
    { label: "Pending Reports", value: stats.totalReports, icon: FiFlag },
  ];

  return (
    <>
      <DashboardTopbar title="Admin Overview" />
      <div className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {card.value ?? 0}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {card.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-2">
            Welcome to Admin Panel
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage users, recipes, and reports from the sidebar.
          </p>
        </div>
      </div>
    </>
  );
}
