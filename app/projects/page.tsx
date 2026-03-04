"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Project {
  id: string;
  url: string;
  created_at: string;
  plan: { productName: string; tagline: string } | null;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      setUserEmail(user.email ?? null);

      const { data } = await supabase
        .from("launch_plans")
        .select("id, url, created_at, plan")
        .eq("user_id", user.id)
        .eq("unlocked", true)
        .order("created_at", { ascending: false });

      setProjects((data as Project[]) ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleDelete(id: string) {
    if (confirmInput.toLowerCase() !== "confirm") return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("launch_plans").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setConfirmingId(null);
    setConfirmInput("");
    setDeleting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">LaunchAI</Link>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-gray-400">{userEmail}</span>
          )}
          <Link
            href="/onboarding"
            className="bg-black text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Build My Launch Plan
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight">My Projects</h1>
            <p className="text-sm text-gray-500">Your saved launch plans.</p>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white rounded-xl px-5 py-3 hover:border-gray-400 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
            </svg>
            New Plan
          </Link>
        </div>

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-12 flex flex-col items-center gap-4 text-center">
            <p className="text-base font-semibold">No projects yet</p>
            <p className="text-sm text-gray-500">Build your first launch plan to get started.</p>
            <Link
              href="/onboarding"
              className="bg-black text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors mt-2"
            >
              Build My Launch Plan
            </Link>
          </div>
        ) : (
          <>
          {/* Confirm delete modal */}
          {confirmingId && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
              <div className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5 shadow-xl">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-base">Delete this project?</p>
                  <p className="text-sm text-gray-500">
                    This cannot be undone. Type <span className="font-semibold text-black">confirm</span> to delete.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="confirm"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setConfirmingId(null); setConfirmInput(""); }}
                    className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmingId)}
                    disabled={confirmInput.toLowerCase() !== "confirm" || deleting}
                    className="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-3">
                <Link
                  href={`/dashboard/${project.id}`}
                  className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:border-gray-400 transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-base">
                      {project.plan?.productName ?? "Untitled Project"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.plan?.tagline ?? project.url}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(project.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className="text-gray-300 group-hover:text-black transition-colors shrink-0 ml-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <button
                  onClick={() => { setConfirmingId(project.id); setConfirmInput(""); }}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Delete project"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          </>
        )}

      </div>
    </div>
  );
}
