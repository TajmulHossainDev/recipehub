"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiAward, FiShoppingBag } from "react-icons/fi";
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Loader from "@/components/shared/Loader";
import { verifyPayment, savePaymentToDB } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        router.push("/");
        return;
      }
      try {
        const data = await verifyPayment(sessionId);
        if (!data?.success) {
          setError("Payment verification failed.");
        } else {
          setPayment(data);
          if (user?.email) {
            await savePaymentToDB({
              sessionId,
              userEmail: user.email,
              type: data.type,
              recipeId: data.recipeId || null,
            });
          }
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    verify();
  }, [sessionId, router, user]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <AppNavbar />
        <Loader fullScreen={false} />
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <Link href="/">
              <button className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg">
                Go Home
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const isPremium = payment?.type === "premium";

  return (
    <main className="min-h-screen flex flex-col">
      <AppNavbar />

      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-5">
            <FiCheckCircle size={32} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Payment Successful!
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            {isPremium
              ? "You're now a Premium member! Enjoy unlimited recipe uploads."
              : "You now have full access to this recipe."}
          </p>

          <div className="flex flex-col gap-2 p-4 bg-[var(--background)] rounded-xl mb-6 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Type</span>
              <span className="font-medium text-[var(--text-primary)] flex items-center gap-1">
                {isPremium ? (
                  <>
                    <FiAward size={14} className="text-[var(--accent)]" />
                    Premium Membership
                  </>
                ) : (
                  <>
                    <FiShoppingBag
                      size={14}
                      className="text-[var(--primary)]"
                    />
                    Recipe Purchase
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Amount</span>
              <span className="font-medium text-[var(--text-primary)]">
                ${payment?.amount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">
                Transaction ID
              </span>
              <span className="font-medium text-[var(--text-primary)] text-xs truncate max-w-[180px]">
                {payment?.transactionId}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isPremium ? (
              <Link href="/dashboard">
                <button className="w-full py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/dashboard/purchased">
                <button className="w-full py-2.5 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                  View Purchased Recipes
                </button>
              </Link>
            )}
            <Link href="/">
              <button className="w-full py-2.5 border border-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--background)] transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
