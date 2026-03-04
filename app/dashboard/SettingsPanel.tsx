"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface SettingsPanelProps {
  url: string;
  productName: string;
}

export default function SettingsPanel({ url, productName }: SettingsPanelProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
  }, []);
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Your Project */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Your Project
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Product
            </p>
            <p className="text-sm font-medium text-gray-800">{productName}</p>
          </div>
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Product Link
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-black underline underline-offset-2 transition-colors break-all"
            >
              {url}
            </a>
          </div>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 bg-white rounded-xl px-5 py-3.5 hover:border-gray-400 transition-colors w-fit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
          </svg>
          Analyze New Product
        </Link>
      </div>

      {/* Billing */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Billing
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button className="w-full text-left px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Manage Billing
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Account
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {userEmail ? (
            <>
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm text-gray-700">{userEmail}</p>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full text-left px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
                <button className="w-full text-left px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  Account
                </p>
                <p className="text-sm text-gray-400 italic">Sign in to save your plan</p>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                <Link
                  href="/auth"
                  className="w-full text-left px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
