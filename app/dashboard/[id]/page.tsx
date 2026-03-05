"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import PositioningTab from "../PositioningTab";
import RevenueChannelsTab from "../RevenueChannelsTab";
import ExecutionPlanTab from "../ExecutionPlanTab";
import SettingsPanel from "../SettingsPanel";
import ChannelIcon from "../ChannelIcon";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUILD_STEPS = [
  "Analyzing your positioning & messaging",
  "Identifying your best revenue channels",
  "Building your 4-week execution plan",
  "Putting it all together",
];

function BuildingDashboard({ onError }: { onError: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < BUILD_STEPS.length) {
        setStep(current);
      } else {
        clearInterval(interval);
      }
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  if (onError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base font-semibold">Something went wrong building your dashboard.</p>
        <p className="text-sm text-gray-400">Your payment was successful. Refresh the page to try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const progress = Math.min(95, Math.round(((step + 1) / BUILD_STEPS.length) * 100));

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">LaunchAI</p>
          <h2 className="text-2xl font-black tracking-tight">Building your custom dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">This takes about 30–60 seconds — crafted specifically for your product.</p>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{BUILD_STEPS[step]}</p>
            <p className="text-sm font-semibold tabular-nums">{progress}%</p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {BUILD_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : active ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  )}
                </div>
                <p className={`text-sm transition-colors ${done ? "text-black font-medium" : active ? "text-black font-semibold" : "text-gray-300"}`}>
                  {s}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Plan = Record<string, any>;

function potentialColor(p: string) {
  if (p === "High") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (p === "Medium") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-gray-100 text-gray-500 border border-gray-200";
}

function priorityColor(p: string) {
  if (p === "High") return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function ReadinessRing({ score }: { score: number }) {
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="4" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("payment") === "success";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [buildingPlan, setBuildingPlan] = useState(false);
  const [buildError, setBuildError] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;

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
        if (justPaid && attempts < maxAttempts) {
          attempts++;
          setTimeout(load, 1000);
          return;
        }
        router.push(`/preview/${id}`);
        return;
      }

      // Unlocked — check if full plan exists yet
      const planData = data.plan as Plan;
      if (!planData?.overview) {
        // Needs full generation
        setLoading(false);
        setBuildingPlan(true);
        return;
      }

      setPlan(planData);
      setProductUrl(data.url ?? "");
      setLoading(false);
    }
    load();
  }, [id, router, justPaid]);

  useEffect(() => {
    if (!buildingPlan) return;

    async function generate() {
      try {
        const analyzeUrl = process.env.NEXT_PUBLIC_ANALYZE_URL
          ? `${process.env.NEXT_PUBLIC_ANALYZE_URL}/analyze-full`
          : "https://launcher-ai-production.up.railway.app/analyze-full";

        const res = await fetch(analyzeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("Generation failed");

        const { data } = await supabase
          .from("launch_plans")
          .select("plan, url")
          .eq("id", id)
          .single();

        if (data?.plan) {
          setPlan(data.plan as Plan);
          setProductUrl(data.url ?? "");
        }
      } catch {
        setBuildError(true);
      } finally {
        setBuildingPlan(false);
      }
    }

    generate();
  }, [buildingPlan, id]);

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

  if (buildingPlan) {
    return <BuildingDashboard onError={buildError} />;
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
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 shrink-0 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-sm md:text-base truncate">Launch plan for {plan.productName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
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

      {/* Bottom tab bar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveNav(item.label); setShowSettings(false); }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeNav === item.label && !showSettings ? "text-black" : "text-gray-400"
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-medium">{item.label === "Revenue Channels" ? "Revenue" : item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex w-52 border-r border-gray-100 flex-col py-3 shrink-0">
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
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
          {showSettings && <SettingsPanel url={productUrl} productName={plan.productName} />}
          {!showSettings && activeNav === "Positioning" && <PositioningTab data={plan.positioning} />}
          {!showSettings && activeNav === "Revenue Channels" && <RevenueChannelsTab data={plan.revenueChannels} />}
          {!showSettings && activeNav === "Execution Plan" && <ExecutionPlanTab data={plan.executionPlan} />}


          {/* Overview */}
          <div className={`max-w-5xl mx-auto flex flex-col gap-5 ${showSettings || activeNav !== "Overview" ? "hidden" : ""}`}>

            {/* Row 1: Launch Snapshot + #1 Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Launch Snapshot */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
                <p className="font-semibold text-base">Launch Snapshot</p>
                <div className="flex items-start gap-4">
                  <ReadinessRing score={Number(o.launchSnapshot.readinessScore)} />
                  <div>
                    <p className="font-bold text-sm leading-snug mb-1.5">{o.launchSnapshot.biggestWin}</p>
                    <p className="text-sm text-gray-500">{o.launchSnapshot.criticalGap}</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg px-3 py-2 w-fit">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Time to First User</p>
                  <p className="text-sm font-medium">{o.launchSnapshot.timeToFirstUser}</p>
                </div>
              </div>

              {/* #1 Focus This Week */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-blue-500">
                <p className="font-semibold text-base">Your #1 Focus This Week</p>
                <div>
                  <p className="font-bold text-sm leading-snug mb-2">{o.topFocus.title}</p>
                  <p className="text-sm text-gray-500">{o.topFocus.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                    <ChannelIcon channel={o.topFocus.channel} size={14} />
                    {o.topFocus.channel}
                  </span>
                  <span className="border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-600">{o.topFocus.timeframe}</span>
                </div>
              </div>
            </div>

            {/* Row 2: Ranked Channels + Immediate Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Ranked Channels */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <p className="font-semibold text-base">Ranked Channels</p>
                <div className="flex flex-col gap-4">
                  {o.rankedChannels.map((ch: { name: string; potential: string; reason: string }, i: number) => (
                    <div key={ch.name}>
                      {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                      <div className="flex items-center gap-2 mb-1">
                        <ChannelIcon channel={ch.name} size={20} />
                        <p className="font-semibold text-sm">#{i + 1} {ch.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${potentialColor(ch.potential)}`}>{ch.potential}</span>
                      </div>
                      <p className="text-sm text-gray-500 pl-7">{ch.reason}</p>
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
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityColor(action.priority)}`}>{action.priority}</span>
                        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600">{action.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
