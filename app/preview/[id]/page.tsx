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
      await supabase
        .from("launch_plans")
        .update({ user_id: data.session.user.id })
        .eq("id", id);

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
        <span className="text-sm text-gray-400 hidden sm:block">Your launch plan is ready</span>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Header — personalized, tight */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700">Analysis complete</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            Your {plan.productName} launch plan is ready.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">{plan.tagline}</p>
        </div>

        {/* Top Issues */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Top Issues We Found
            </p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex flex-col gap-2">
            {plan.preview.topIssues.map((issue, i) => (
              <div key={i} className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-white border border-red-200 flex items-center justify-center shrink-0">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm text-red-900 leading-relaxed">{issue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Preview Actions
            </p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex flex-col gap-2">
            {plan.preview.previewActions.map((action, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="text-xs font-bold text-gray-300 shrink-0 mt-0.5 tabular-nums">
                  0{i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Paywall */}
        <div className="relative">
          {/* Blurred teaser */}
          <div className="pointer-events-none select-none blur-sm opacity-30 flex flex-col gap-2 mb-[-80px]">
            {[
              "Your #1 positioning upgrade (with exact copy rewrite)",
              "The 3 channels most likely to get you paying users this week",
              "Week-by-week execution plan built for your stage",
              "5-tool stack picked specifically for your product type",
            ].map((item) => (
              <div key={item} className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
                <p className="text-sm text-gray-600">{item}</p>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="relative z-10 bg-black text-white rounded-2xl px-8 py-10 flex flex-col items-center gap-6 text-center shadow-xl">

            {/* Icon */}
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black leading-tight">
                Get your full {plan.productName} strategy — $19
              </h2>
              <p className="text-sm text-white/60 max-w-xs">
                Built specifically for your product. Not a template — a complete, actionable launch plan ready to execute today.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-2 w-full max-w-xs text-left">
              {[
                "Exact positioning rewrite for your landing page",
                "Top channels ranked by speed to first revenue",
                "Week-by-week execution plan for your stage",
                "Custom 5-tool stack for your product type",
                "Instant access — yours to keep forever",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-2 w-full">
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {unlocking ? "Setting up…" : `Get My Full Launch Plan — $19`}
              </button>
              <p className="text-xs text-white/40">One-time payment · Instant access · No subscription</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
