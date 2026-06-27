"use client";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--primary)] transition-colors"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--primary)] transition-colors"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
