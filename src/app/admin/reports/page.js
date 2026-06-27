"use client";
import { useState, useEffect } from "react";
import { FiFlag, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { getAllReports, dismissReport, removeReportedRecipe } from "@/lib/api";

const reasonColors = {
  Spam: "bg-amber-50 text-amber-600",
  "Offensive Content": "bg-red-50 text-red-600",
  "Copyright Issue": "bg-purple-50 text-purple-600",
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      const data = await getAllReports();
      setReports(Array.isArray(data) ? data : []);
      setIsLoading(false);
    }
    fetchReports();
  }, []);

  const pendingReports = reports.filter((r) => r.status === "pending");

  const handleConfirmAction = async () => {
    const { report, action } = actionTarget;
    if (action === "remove") {
      await removeReportedRecipe(report._id);
    } else {
      await dismissReport(report._id);
    }
    setReports((prev) =>
      prev.map((r) =>
        r._id === report._id
          ? { ...r, status: action === "remove" ? "removed" : "dismissed" }
          : r,
      ),
    );
    setActionTarget(null);
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Recipe Reports" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Recipe Reports" />

      <div className="p-6">
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          <span className="font-semibold text-[var(--text-primary)]">
            {pendingReports.length}
          </span>{" "}
          pending report{pendingReports.length !== 1 ? "s" : ""} need review
        </p>

        {pendingReports.length === 0 ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <FiFlag
              size={32}
              className="mx-auto text-[var(--text-secondary)] mb-3"
            />
            <p className="text-[var(--text-secondary)]">
              No pending reports. All clear!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingReports.map((report) => (
              <div
                key={report._id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <FiAlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      {report.recipeName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Reported by {report.reporterEmail} •{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full ${
                        reasonColors[report.reason] ||
                        "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {report.reason}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setActionTarget({ report, action: "dismiss" })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-lg hover:bg-[var(--background)] transition-colors"
                  >
                    <FiX size={14} />
                    Dismiss
                  </button>
                  <button
                    onClick={() =>
                      setActionTarget({ report, action: "remove" })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 size={14} />
                    Remove Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {reports.some((r) => r.status !== "pending") && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
              Resolved Reports
            </h2>
            <div className="flex flex-col gap-2">
              {reports
                .filter((r) => r.status !== "pending")
                .map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg text-sm"
                  >
                    <span className="text-[var(--text-primary)]">
                      {report.recipeName}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        report.status === "removed"
                          ? "bg-red-50 text-red-600"
                          : "bg-[var(--accent)]/10 text-[var(--accent)]"
                      }`}
                    >
                      {report.status === "removed"
                        ? "Recipe Removed"
                        : "Dismissed"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {actionTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">
              {actionTarget.action === "remove"
                ? "Remove Recipe"
                : "Dismiss Report"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {actionTarget.action === "remove"
                ? `This will permanently delete "${actionTarget.report.recipeName}" from the platform.`
                : `This report on "${actionTarget.report.recipeName}" will be marked as dismissed.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActionTarget(null)}
                className="flex-1 py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-2.5 text-white font-medium rounded-lg transition-colors ${
                  actionTarget.action === "remove"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-[var(--accent)] hover:opacity-90"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
