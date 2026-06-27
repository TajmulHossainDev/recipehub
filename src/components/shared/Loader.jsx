export default function Loader({ fullScreen = true }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-screen" : "py-20"
      }`}
    >
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-[var(--border)] rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] font-medium">
        Loading...
      </p>
    </div>
  );
}
