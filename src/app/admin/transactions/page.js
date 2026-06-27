"use client";
import { useState, useEffect } from "react";
import { FiDollarSign, FiSearch } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { getAdminPayments } from "@/lib/api";

export default function TransactionsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await getAdminPayments();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const filtered = payments.filter(
    (p) =>
      p.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.userName?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Transactions" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Transactions" />

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <FiDollarSign size={22} className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {payments.length}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Transactions
              </p>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <FiDollarSign size={22} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                $
                {payments
                  .reduce((sum, p) => sum + (p.amount || 0), 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Revenue
              </p>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
              <FiDollarSign size={22} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {payments.filter((p) => p.type === "premium").length}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Premium Purchases
              </p>
            </div>
          </div>
        </div>
        <div className="relative max-w-sm mb-5">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, email or transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--background)] border-b border-[var(--border)]">
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  User
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Amount
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden lg:table-cell">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-[var(--text-primary)]">
                      {payment.userName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {payment.userEmail}
                    </p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        payment.type === "premium"
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      }`}
                    >
                      {payment.type === "premium" ? "Premium" : "Recipe"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                    ${payment.amount?.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-[var(--text-secondary)]">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-[var(--text-secondary)] font-mono text-xs truncate max-w-[160px]">
                    {payment.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-[var(--text-secondary)] py-10">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
