"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import Loader from "@/components/shared/Loader";
import { authClient } from "@/lib/auth-client";
import { getUserProfile } from "@/lib/api";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (isPending) return;
      if (!session?.user) {
        router.push("/login?redirect=/admin");
        return;
      }
      const profile = await getUserProfile(session.user.email);
      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }
      setIsChecking(false);
    }
    checkAdmin();
  }, [isPending, session, router]);

  if (isPending || isChecking) {
    return <Loader fullScreen={true} />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
