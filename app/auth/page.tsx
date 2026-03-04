"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan_id");
  const error = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // If already signed in, go straight to Stripe checkout
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && planId) {
        router.push(`/checkout/${planId}`);
      }
    });
  }, [planId]);

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${planId ? `?plan_id=${planId}` : ""}`,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback${planId ? `?plan_id=${planId}` : ""}`,
        },
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else if (data.user && planId) {
        // Associate plan with user, then go to Stripe checkout
        await supabase
          .from("launch_plans")
          .update({ user_id: data.user.id })
          .eq("id", planId);
        router.push(`/checkout/${planId}`);
        return;
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">LaunchAI</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black">
              {planId ? "Create your account to unlock" : mode === "signup" ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-gray-500">
              {planId
                ? "Your launch plan is ready. Sign up to access the full dashboard."
                : mode === "signup"
                ? "Join LaunchAI to save your launch plans."
                : "Sign in to access your dashboard."}
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              Google sign-in failed. Make sure you are added as a test user in Google Cloud Console, or use email/password below.
            </div>
          )}

          {message && (
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
              {message}
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-medium hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-900 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-900 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-gray-500">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setMessage(null); }}
              className="text-black font-medium hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
