"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function redirectToStripe() {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: id }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    }

    if (id) redirectToStripe();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-base font-semibold">Something went wrong setting up payment.</p>
        <Link href={`/preview/${id}`} className="text-sm text-gray-500 underline">
          Go back and try again
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Setting up your payment…</p>
    </div>
  );
}
