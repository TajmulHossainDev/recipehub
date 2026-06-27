"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "@/Providers/ThemeProvider";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <Loader fullScreen={true} />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-[var(--background)]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </ThemeProvider>
  );
}
