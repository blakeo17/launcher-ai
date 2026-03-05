"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Launcher AI
        </Link>
        <Link
          href="/onboarding"
          className="bg-black text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Build My Launch Plan
        </Link>
      </nav>

      {/* Page content */}
      <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black tracking-tight">Contact</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Have a question, partnership inquiry, or need support? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Support card */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex flex-col gap-2">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Support
            </p>
            <p className="text-base font-bold">General &amp; Technical</p>
            <a
              href="mailto:support@newburyai.com"
              className="text-sm text-gray-500 hover:text-black transition-colors mt-1"
            >
              support@newburyai.com
            </a>
          </div>

          {/* Business card */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex flex-col gap-2">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Business
            </p>
            <p className="text-base font-bold">Partnerships &amp; Press</p>
            <a
              href="mailto:hello@newburyai.com"
              className="text-sm text-gray-500 hover:text-black transition-colors mt-1"
            >
              hello@newburyai.com
            </a>
          </div>
        </div>

        {/* Divider + form section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-sm font-semibold text-gray-400 whitespace-nowrap">Send a Message</p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {submitted ? (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-10 flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-base font-bold">Message sent</p>
              <p className="text-sm text-gray-500">We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  placeholder="Tell us what's on your mind..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors mt-2"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
