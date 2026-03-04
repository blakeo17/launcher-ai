"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PositioningTab from "../PositioningTab";
import RevenueChannelsTab from "../RevenueChannelsTab";
import ExecutionPlanTab from "../ExecutionPlanTab";
import ToolsStackTab from "../ToolsStackTab";
import SettingsPanel from "../SettingsPanel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navItems = [
  {
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Positioning",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round" />
        <line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round" />
        <line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round" />
        <line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Revenue Channels",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 7 22 7 22 13" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Execution Plan",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Tools Stack",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Plan = Record<string, any>;

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("payment") === "success";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // poll up to ~15s after payment

    async function load() {
      const { data, error } = await supabase
        .from("launch_plans")
        .select("plan, unlocked, url")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      if (!data.unlocked) {
        // If the user just paid, webhook may still be in flight — poll
        if (justPaid && attempts < maxAttempts) {
          attempts++;
          setTimeout(load, 1000);
          return;
        }
        router.push(`/preview/${id}`);
        return;
      }

      setPlan(data.plan as Plan);
      setProductUrl(data.url ?? "");
      setLoading(false);
    }
    load();
  }, [id, router, justPaid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">
          {justPaid ? "Confirming your payment…" : "Loading your dashboard…"}
        </p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-base font-semibold">Dashboard not found.</p>
        <Link href="/onboarding" className="text-sm text-gray-500 underline">Start over</Link>
      </div>
    );
  }

  const o = plan.overview;

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Top header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-base">Launch plan for {plan.productName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveNav("Overview"); setShowSettings(false); }}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Overview"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`transition-colors ${showSettings ? "text-black" : "text-gray-400 hover:text-black"}`}
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-gray-100 flex flex-col py-3 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); setShowSettings(false); }}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors text-left ${
                activeNav === item.label && !showSettings
                  ? "bg-gray-100 text-black font-medium"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {showSettings && <SettingsPanel url={productUrl} productName={plan.productName} />}
          {!showSettings && activeNav === "Positioning" && <PositioningTab data={plan.positioning} />}
          {!showSettings && activeNav === "Revenue Channels" && <RevenueChannelsTab data={plan.revenueChannels} />}
          {!showSettings && activeNav === "Execution Plan" && <ExecutionPlanTab data={plan.executionPlan} />}
          {!showSettings && activeNav === "Tools Stack" && <ToolsStackTab data={plan.toolsStack} />}

          {/* Overview */}
          <div className={`max-w-5xl mx-auto flex flex-col gap-5 ${showSettings || activeNav !== "Overview" ? "hidden" : ""}`}>

            {/* Row 1: Launch Snapshot + #1 Focus */}
            <div className="grid grid-cols-2 gap-5">
              {/* Launch Snapshot */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-semibold text-base">Launch Snapshot</p>
                <div>
                  <p className="font-bold text-sm leading-snug mb-2">{o.launchSnapshot.biggestWin}</p>
                  <p className="text-sm text-gray-500">{o.launchSnapshot.criticalGap}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="border border-gray-200 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Readiness</p>
                    <p className="text-sm font-medium">{o.launchSnapshot.readinessScore}/100</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Time to First User</p>
                    <p className="text-sm font-medium">{o.launchSnapshot.timeToFirstUser}</p>
                  </div>
                </div>
              </div>

              {/* #1 Focus This Week */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-semibold text-base">Your #1 Focus This Week</p>
                <div>
                  <p className="font-bold text-sm leading-snug mb-2">{o.topFocus.title}</p>
                  <p className="text-sm text-gray-500">{o.topFocus.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className="border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-600">{o.topFocus.channel}</span>
                  <span className="border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-600">{o.topFocus.timeframe}</span>
                </div>
              </div>
            </div>

            {/* Row 2: Positioning Upgrade */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
              <p className="font-semibold text-base">Positioning Upgrade</p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Current Headline</p>
                  <p className="text-sm text-gray-500">&quot;{o.positioningUpgrade.current}&quot;</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Improved Headline</p>
                  <p className="text-sm font-semibold">&quot;{o.positioningUpgrade.improved}&quot;</p>
                </div>
              </div>
            </div>

            {/* Row 3: Ranked Channels + Immediate Actions */}
            <div className="grid grid-cols-2 gap-5">
              {/* Ranked Channels */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <p className="font-semibold text-base">Ranked Channels</p>
                <div className="flex flex-col gap-4">
                  {o.rankedChannels.map((ch: { name: string; potential: string; reason: string }, i: number) => (
                    <div key={ch.name}>
                      {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                      <p className="font-semibold text-sm mb-1">#{i + 1} {ch.name} <span className="text-gray-400 font-normal">· {ch.potential}</span></p>
                      <p className="text-sm text-gray-500">{ch.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Actions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-semibold text-base">Immediate Actions</p>
                <div className="flex flex-col gap-4">
                  {o.immediateActions.map((action: { action: string; priority: string; time: string }, i: number) => (
                    <div key={action.action}>
                      {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                      <p className="text-sm mb-2">{action.action}</p>
                      <div className="flex gap-2">
                        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600">{action.priority}</span>
                        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600">{action.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Recommended Stack */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <p className="font-semibold text-base mb-1">Recommended Stack For You</p>
                <p className="text-sm text-gray-400">Based on your ICP and primary channel.</p>
              </div>
              <div className="flex flex-col">
                {o.recommendedStack.map((tool: { tool: string; purpose: string; url?: string }, i: number) => (
                  <div key={tool.tool}>
                    {i > 0 && <div className="border-t border-gray-100" />}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-semibold text-sm mb-0.5">{tool.tool}</p>
                        <p className="text-sm text-gray-500">{tool.purpose}</p>
                      </div>
                      {tool.url && (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-black transition-colors shrink-0 ml-6"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
