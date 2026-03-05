"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

const faqs = [
  {
    q: "Is this just generic AI output?",
    a: "No. We analyze your actual homepage, positioning, competitors, and audience to create a personalized launch plan specific to your product.",
  },
  {
    q: "What if my site is pre-launch?",
    a: "That's fine. You can paste a landing page URL, Notion doc, or any page that describes your product. We'll work with what you have.",
  },
  {
    q: "How long does it take?",
    a: "About 12 seconds to generate your free preview. Your full dashboard is built after checkout — takes around 60 seconds.",
  },
  {
    q: "Do I need an account?",
    a: "No sign-up required for the free preview. For the full plan, you'll create a simple account to save your results.",
  },
];

const CYCLING_WORDS = ["launch plan", "growth strategy", "positioning upgrade", "revenue roadmap"];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordFading, setWordFading] = useState(false);

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Cycling word in hero
  useEffect(() => {
    const interval = setInterval(() => {
      setWordFading(true);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % CYCLING_WORDS.length);
        setWordFading(false);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Scroll-triggered fade-ups
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">LaunchAI</span>
        <div className="flex items-center gap-8">
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            FAQ
          </button>
          {userEmail ? (
            <div className="flex items-center gap-4">
              <Link href="/projects" className="text-sm text-gray-500 hover:text-black transition-colors font-medium">
                My Projects
              </Link>
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  setUserEmail(null);
                }}
                className="text-sm text-gray-500 hover:text-black transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-sm text-gray-500 hover:text-black transition-colors font-medium">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative flex flex-col items-center text-center px-6 pt-20 pb-28 overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, white 100%)" }} />

        <div className="relative flex flex-col items-center">
          <p className="animate-fade-in-up text-xs font-semibold tracking-widest text-gray-400 uppercase mb-10" style={{ animationDelay: "0ms" }}>
            For AI Builders &amp; Vibe Coders
          </p>
          <h1 className="animate-fade-in-up text-6xl font-black leading-[1.1] max-w-2xl mb-8" style={{ animationDelay: "100ms" }}>
            You built the product. We build the launch.
          </h1>
          <p className="animate-fade-in-up text-lg text-gray-500 max-w-sm mb-12" style={{ animationDelay: "200ms" }}>
            Get a personalized{" "}
            <span
              className="text-black font-semibold inline-block transition-all duration-300"
              style={{ opacity: wordFading ? 0 : 1, transform: wordFading ? "translateY(6px)" : "translateY(0)" }}
            >
              {CYCLING_WORDS[wordIdx]}
            </span>{" "}
            built specifically for your app.
          </p>
          <Link
            href="/onboarding"
            className="animate-fade-in-up bg-black text-white px-16 py-5 rounded-xl font-semibold text-base hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ animationDelay: "300ms" }}
          >
            Build My Launch Plan
          </Link>

          {/* Trust stats */}
          <div className="animate-fade-in-up flex items-center gap-6 mt-7 text-xs text-gray-400" style={{ animationDelay: "450ms" }}>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ~12 second preview
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Personalized to your product
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              $19 one-time
            </span>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="bg-gray-50 px-6 py-20">
        <div className="fade-up">
          <h2 className="text-3xl font-bold text-center mb-10">Your Launch Command Center (Preview)</h2>
        </div>

        {/* Dashboard mockup */}
        <div className="fade-up max-w-6xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-md" style={{ transitionDelay: "100ms" }}>
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Launch plan for TaskFlow Pro</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" /><polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
            </div>
          </div>

          {/* Body */}
          <div className="flex bg-gray-50" style={{ height: "560px" }}>
            {/* Sidebar */}
            <div className="w-52 bg-white border-r border-gray-100 py-3 shrink-0">
              {[
                { label: "Overview", active: true },
                { label: "Positioning", active: false },
                { label: "Revenue Channels", active: false },
                { label: "Execution Plan", active: false },
              ].map((item) => (
                <div key={item.label} className={`mx-2 px-4 py-2.5 rounded-lg text-sm mb-1 ${item.active ? "bg-gray-100 font-medium text-black" : "text-gray-400"}`}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-sm mb-2">Launch Snapshot</p>
                  <p className="text-sm font-bold leading-snug mb-3">Position TaskFlow Pro as the fastest path to first customer.</p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="border border-gray-200 rounded-lg px-3 py-1.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Readiness</p>
                      <p className="text-xs font-medium">74 / 100</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg px-3 py-1.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">First User</p>
                      <p className="text-xs font-medium">7–14 days</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-blue-500">
                  <p className="font-semibold text-sm mb-2">Your #1 Focus This Week</p>
                  <p className="text-sm font-bold leading-snug mb-3">Ship public demo + 7-day Twitter thread series</p>
                  <div className="flex gap-2">
                    <span className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-3 py-1 text-xs">Twitter/X</span>
                    <span className="border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500">This week</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-sm mb-3">Ranked Channels</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: "#1 Twitter/X", badge: "High", color: "bg-emerald-50 text-emerald-700" },
                      { name: "#2 Product Hunt", badge: "High", color: "bg-emerald-50 text-emerald-700" },
                      { name: "#3 Reddit", badge: "Medium", color: "bg-amber-50 text-amber-700" },
                    ].map(ch => (
                      <div key={ch.name} className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-700">{ch.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ch.color}`}>{ch.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-sm mb-3">Immediate Actions</p>
                  <div className="flex flex-col gap-2">
                    {["Polish demo landing page", "Write thread #1: Why I'm building this", "Set up Twitter engagement routine"].map((a, i) => (
                      <div key={a} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${i === 0 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                        <p className="text-xs text-gray-600">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fade-up flex justify-center mt-10" style={{ transitionDelay: "200ms" }}>
          <Link href="/onboarding" className="bg-black text-white px-16 py-5 rounded-xl font-semibold text-base hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200">
            Build My Launch Plan
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative px-6 py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative">
          <div className="fade-up">
            <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          </div>
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              {
                delay: "100ms",
                icon: <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" strokeLinecap="round" strokeLinejoin="round" />,
                label: "Paste your URL",
                floatDelay: "0s",
              },
              {
                delay: "200ms",
                icon: <path d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />,
                label: "We scan positioning + audience",
                floatDelay: "1.3s",
              },
              {
                delay: "300ms",
                icon: <path d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c0 .621.504 1.125 1.125 1.125h15c.621 0 1.125-.504 1.125-1.125m-19.5 0v6.75m0-6.75c0-.621.504-1.125 1.125-1.125h15c.621 0 1.125-.504 1.125-1.125M3.375 8.25V12" strokeLinecap="round" strokeLinejoin="round" />,
                label: "Get your custom Launch Command Center",
                floatDelay: "2.6s",
              },
            ].map((step, i) => (
              <div key={i} className="fade-up flex flex-col items-center gap-5" style={{ transitionDelay: step.delay }}>
                <div className="animate-float w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500" style={{ animationDelay: step.floatDelay }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">{step.icon}</svg>
                </div>
                <p className="text-sm text-gray-500">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="px-6 py-20">
        <div className="fade-up text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Your Personalized Launch Plan Includes</h2>
          <p className="text-sm text-gray-400">Based on your product and answers, LaunchAI generates a custom launch strategy.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
          {[
            {
              title: "🎯 Positioning Upgrade",
              sub: "headline clarity · value prop · ideal customer",
              lines: ["Before: Generic AI tool", "After: Precise value prop", "ICP: Who needs this most"],
              delay: "0ms",
            },
            {
              title: "🚀 Fastest Path to Revenue",
              sub: "3 launch channels ranked by potential",
              lines: ["1. Product Hunt", "2. Reddit communities", "3. Direct outreach"],
              delay: "100ms",
            },
            {
              title: "✅ Immediate Actions",
              sub: "highest-impact tasks with time estimates",
              lines: ["Rewrite hero copy · 2h", "Post on PH · 30m", "Reach out to 10 users · 1h"],
              delay: "200ms",
            },
            {
              title: "📅 4-Week Execution Plan",
              sub: "week-by-week roadmap for your stage",
              lines: ["Week 1: Validate", "Week 2: Build audience", "Week 3: Convert"],
              delay: "300ms",
            },
          ].map((card) => (
            <div key={card.title} className="fade-up border border-gray-200 rounded-2xl p-7 flex flex-col gap-3" style={{ transitionDelay: card.delay }}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{card.title}</p>
                <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 shrink-0">Generated for your product</span>
              </div>
              <p className="text-xs text-gray-400">{card.sub}</p>
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                {card.lines.map(l => <p key={l} className="text-sm text-gray-400 font-mono">{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built Specifically */}
      <section className="relative bg-gray-50 px-6 py-24 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-48 opacity-40" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute right-0 top-0 h-full w-48 opacity-40" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative max-w-3xl mx-auto">
          <div className="fade-up text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Built around your product</h2>
            <p className="text-sm text-gray-400">LaunchAI analyzes your product and generates a strategy tailored to it.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Uses your app name + homepage copy", detail: "No generic advice — every output references your actual product.", delay: "0ms" },
              { title: "Detects weak messaging and rewrites it", detail: "Spots vague headlines and replaces them with specific, compelling copy.", delay: "100ms" },
              { title: "Finds where your audience actually hangs out", detail: "Identifies the exact communities and channels your ICP uses.", delay: "150ms" },
              { title: "Ranks channels by speed to first revenue", detail: "Tells you exactly which channels to focus on first and why.", delay: "200ms" },
              { title: "Prioritizes actions based on your time + budget", detail: null, delay: "250ms" },
              { title: "Creates a clear 4-week launch roadmap", detail: "Breaks your launch into simple, step-by-step actions you can follow.", delay: "300ms" },
            ].map((item) => (
              <div key={item.title} className="fade-up bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-3" style={{ transitionDelay: item.delay }}>
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.detail && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 px-6 py-20">
        <div className="fade-up">
          <h2 className="text-4xl font-bold text-center mb-12">FAQ</h2>
        </div>
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="fade-up bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="font-medium text-sm">{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gray-100 px-6 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative fade-up">
          <h2 className="text-5xl font-black text-black mb-4">Stop guessing your launch.</h2>
          <p className="text-lg text-gray-500 mb-12">Get clarity, direction, and a plan built for your product.</p>
          <Link href="/onboarding" className="bg-black text-white px-28 py-4 rounded-xl font-medium text-sm hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200">
            Build My Launch Plan
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-8 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-lg tracking-tight">LaunchAI</p>
            <p className="text-sm text-gray-400 leading-relaxed">Launch strategy for founders and builders.</p>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-xs text-gray-400">© 2026 LaunchAI</p>
              <p className="text-xs text-gray-400">Built by Newbury AI</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Product</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-gray-500 hover:text-black transition-colors text-left">Preview</button>
              <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="text-sm text-gray-500 hover:text-black transition-colors text-left">How It Works</button>
              <Link href="/onboarding" className="text-sm text-gray-500 hover:text-black transition-colors text-left">Build My Launch Plan</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Legal</p>
            <div className="flex flex-col gap-3">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
