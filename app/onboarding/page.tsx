"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const steps = [
  { type: "input" as const },
  {
    type: "radio" as const,
    question: "What budget are you working with for launch?",
    helper: "This helps us prioritize strategies that actually fit your resources.",
    options: ["$0 – $500", "$500 – $2,000", "$2,000 – $5,000", "$5,000+"],
  },
  {
    type: "choice" as const,
    question: "What are you building?",
    options: ["Mobile App", "Web App", "SaaS", "AI Tool", "Chrome Extension"],
  },
  {
    type: "choice" as const,
    question: "What stage are you at?",
    options: [
      "Just an idea (landing page only)",
      "MVP in progress",
      "MVP built",
      "Already launched",
      "Making revenue",
    ],
  },
  {
    type: "choice" as const,
    question: "What's your main goal right now?",
    options: [
      "Launch faster",
      "Get first users",
      "Improve conversion",
      "Fix product issues",
      "Grow revenue",
    ],
  },
];

function generateSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const ANALYZE_STEPS = [
  "Scanning your landing page",
  "Analyzing positioning & messaging",
  "Identifying growth channels",
  "Building your execution plan",
  "Constructing your dashboard",
  "Finalizing your launch strategy",
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analyzing) return;
    setAnalyzeStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < ANALYZE_STEPS.length - 1) {
        setAnalyzeStep(current);
      } else {
        setAnalyzeStep(ANALYZE_STEPS.length - 1);
        clearInterval(interval);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [analyzing]);

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const selectedAnswer = answers[step] ?? null;
  const canAdvance =
    current.type === "input" ? url.trim().length > 0 : selectedAnswer !== null;

  async function handleNext() {
    if (!canAdvance) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Validate URL before submitting
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        setError("Please enter a valid URL starting with https://");
        return;
      }

      setAnalyzing(true);
      setError(null);
      try {
        const sessionId = generateSessionId();
        const analyzeUrl = process.env.NEXT_PUBLIC_ANALYZE_URL
          ? `${process.env.NEXT_PUBLIC_ANALYZE_URL}/analyze`
          : "/api/analyze";
        const res = await fetch(analyzeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, answers, sessionId }),
        });
        const data = await res.json();
        if (!res.ok || !data.id) {
          throw new Error(data.error ?? "Something went wrong");
        }
        router.push(`/preview/${data.id}`);
      } catch (err) {
        setAnalyzing(false);
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function selectOption(option: string) {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  }

  if (analyzing) {
    const progress = Math.min(95, Math.round(((analyzeStep + 1) / ANALYZE_STEPS.length) * 100));
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col gap-8">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">LaunchAI</p>
            <h2 className="text-2xl font-black tracking-tight">Building your launch plan</h2>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{ANALYZE_STEPS[analyzeStep]}</p>
              <p className="text-sm font-semibold tabular-nums">{progress}%</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="flex flex-col gap-3">
            {ANALYZE_STEPS.map((s, i) => {
              const done = i < analyzeStep;
              const active = i === analyzeStep;
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <Link href="/" className="text-gray-400 hover:text-black transition-colors" aria-label="Go home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          <span className="font-bold text-lg tracking-tight">LaunchAI</span>
        </div>
        <span className="text-sm text-gray-400">
          {step + 1} of {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {error && (
          <div className="w-full max-w-lg mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {current.type === "radio" ? (
          <div className="w-full max-w-lg flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Question {step + 1}
              </p>
              <h2 className="text-3xl font-black">{current.question}</h2>
              <p className="text-sm text-gray-400">{current.helper}</p>
            </div>
            <div className="flex flex-col gap-3">
              {current.options.map((option) => {
                const selected = answers[step] === option;
                return (
                  <button
                    key={option}
                    onClick={() => selectOption(option)}
                    className={`w-full text-left px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-150 ${
                      selected ? "border-black bg-white" : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? "border-black" : "border-gray-300"
                    }`}>
                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        ) : current.type === "input" ? (
          <div className="w-full max-w-lg flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Question 1
              </p>
              <h2 className="text-3xl font-black">Enter your product link</h2>
              <p className="text-sm text-gray-400">
                We'll analyze this to personalize your dashboard.
              </p>
            </div>
            <input
              type="url"
              placeholder="Landing page or App Store listing"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm outline-none focus:border-gray-900 transition-colors"
            />
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Question {step + 1}
              </p>
              <h2 className="text-3xl font-black">{current.question}</h2>
            </div>
            <div className="flex flex-col gap-3">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => selectOption(option)}
                  className={`w-full text-left px-6 py-4 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    answers[step] === option
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === steps.length - 1 ? "Build My Launch Plan" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
