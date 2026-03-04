"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

const supabase = createClient();

interface Plan {
  productName: string;
  tagline: string;
  preview: {
    topIssues: string[];
    previewActions: string[];
  };
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("launch_plans")
        .select("plan")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setPlan(data.plan as Plan);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleUnlock() {
    setUnlocking(true);
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      // Already signed in — go straight to Stripe checkout
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: id }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } else {
      router.push(`/auth?plan_id=${id}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading your plan…</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-base font-semibold">Plan not found.</p>
        <Link href="/onboarding" className="text-sm text-gray-500 underline">
          Start over
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">LaunchAI</Link>
        <span className="text-sm text-gray-400">Your launch plan is ready</span>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Launch Plan Preview
          </p>
          <h1 className="text-3xl font-black tracking-tight">{plan.productName}</h1>
          <p className="text-gray-500 text-sm">{plan.tagline}</p>
        </div>

        {/* Top Issues — real data */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Top Issues We Found
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {plan.preview.topIssues.map((issue, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">{issue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Actions — real but teaser */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Preview Actions
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {plan.preview.previewActions.map((action, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-400 shrink-0">{i + 1}.</span>
                <p className="text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lock / Paywall */}
        <div className="relative">
          {/* Blurred teaser rows */}
          <div className="pointer-events-none select-none blur-sm opacity-40 flex flex-col gap-2 mb-[-60px]">
            {["Full positioning strategy", "Revenue channel breakdown", "Week-by-week execution plan", "Recommended tools stack"].map((item) => (
              <div key={item} className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
                <p className="text-sm text-gray-500">{item}</p>
              </div>
            ))}
          </div>

          {/* Lock card */}
          <div className="relative z-10 bg-white border border-gray-200 rounded-2xl px-8 py-10 flex flex-col items-center gap-6 text-center shadow-sm mt-0">
            <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-black">Unlock Your Full Launch Dashboard</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Get your complete launch plan — positioning strategy, revenue channels, week-by-week execution plan, and your custom tools stack.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              {["Full launch dashboard", "Complete action roadmap", "Revenue channel analysis", "Week-by-week execution plan", "Custom tools stack"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="bg-black text-white px-10 py-4 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {unlocking ? "Unlocking…" : "Unlock Dashboard — $19"}
              </button>
              <p className="text-xs text-gray-400">One-time payment · Instant access</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
