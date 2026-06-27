"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiSlash, FiCheckCircle, FiAward } from "react-icons/fi";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import Loader from "@/components/shared/Loader";
import { getAllUsers, toggleBlockUser } from "@/lib/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setIsLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggleBlock = async () => {
    const { user, action } = confirmTarget;
    await toggleBlockUser(user._id, action === "block");
    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isBlocked: action === "block" } : u,
      ),
    );
    setConfirmTarget(null);
  };

  if (isLoading) {
    return (
      <>
        <DashboardTopbar title="Manage Users" />
        <Loader fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Manage Users" />

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
            placeholder="Search by name or email..."
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
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">
                  Joined
                </th>
                <th className="text-left px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="text-right px-5 py-3 font-medium text-[var(--text-secondary)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[var(--primary)]/10">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--primary)] font-semibold text-sm">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                          {user.name}
                          {user.isPremium && (
                            <FiAward
                              size={13}
                              className="text-[var(--accent)]"
                            />
                          )}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-[var(--text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {user.isBlocked ? (
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() =>
                        setConfirmTarget({
                          user,
                          action: user.isBlocked ? "unblock" : "block",
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        user.isBlocked
                          ? "text-[var(--accent)] hover:bg-[var(--accent)]/10"
                          : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      {user.isBlocked ? (
                        <FiCheckCircle size={14} />
                      ) : (
                        <FiSlash size={14} />
                      )}
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-center text-sm text-[var(--text-secondary)] py-10">
              No users found.
            </p>
          )}
        </div>
      </div>

      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">
              {confirmTarget.action === "block" ? "Block User" : "Unblock User"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to {confirmTarget.action} "
              {confirmTarget.user.name}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleBlock}
                className={`flex-1 py-2.5 text-white font-medium rounded-lg transition-colors ${
                  confirmTarget.action === "block"
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
