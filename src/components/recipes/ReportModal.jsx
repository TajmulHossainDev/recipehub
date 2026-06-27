"use client";
import { useState } from "react";
import { FiX, FiFlag } from "react-icons/fi";

const reasons = ["Spam", "Offensive Content", "Copyright Issue"];

export default function ReportModal({
  isOpen,
  onClose,
  recipeName,
  onSubmitReport,
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await onSubmitReport(selectedReason);
      setSubmitted(true);
    } catch (err) {
      console.error("Report submit failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--card)] rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <FiX size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <FiFlag className="text-red-500" size={20} />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Report Recipe
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Why are you reporting "{recipeName}"?
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting}
              className="w-full py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiFlag className="text-green-600" size={22} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)] mb-1">
              Report Submitted
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Our admin team will review this shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
