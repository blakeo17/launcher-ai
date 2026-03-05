"use client";

import { useState } from "react";

interface ChannelBreakdown {
  channel: string;
  contentAngles: string[];
  cadence: string;
  conversionMechanism: string;
}

interface RevenueChannelsData {
  channelTable: { channel: string; timeToFirstDollar: string; rationale: string }[];
  channelBreakdowns: ChannelBreakdown[];
  operatorRecommendation: string;
}

const medals = ["🥇", "🥈", "🥉"];

export default function RevenueChannelsTab({ data }: { data: RevenueChannelsData }) {
  const [openChannel, setOpenChannel] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">

      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Launch Priority Analysis
        </p>
        <h2 className="text-3xl font-bold mb-2">Revenue Channels &amp; Execution Plan</h2>
        <p className="text-sm text-gray-500">Where your first revenue is most likely to come from.</p>
      </div>

      {/* Channel table */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
          <div className="px-5 py-3 text-sm font-semibold">Channel</div>
          <div className="px-5 py-3 text-sm font-semibold border-l border-gray-200">⚡ Time to First $1</div>
          <div className="px-5 py-3 text-sm font-semibold border-l border-gray-200">Strategic Rationale</div>
        </div>
        {data.channelTable.map((ch, i) => (
          <div
            key={ch.channel}
            className={`grid grid-cols-3 ${i < data.channelTable.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className="px-5 py-5 text-sm">{medals[i] ?? ""} {ch.channel}</div>
            <div className="px-5 py-5 text-sm text-gray-600 border-l border-gray-200">{ch.timeToFirstDollar}</div>
            <div className="px-5 py-5 text-sm text-gray-600 border-l border-gray-200">{ch.rationale}</div>
          </div>
        ))}
      </div>

      {/* Channel Breakdown */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold">Channel Breakdown</h3>
        <div className="flex flex-col gap-3">
          {data.channelBreakdowns.map((ch) => {
            const isOpen = openChannel === ch.channel;
            return (
              <div key={ch.channel} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenChannel(isOpen ? null : ch.channel)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-sm">{ch.channel}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 flex flex-col gap-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="font-semibold text-sm mb-2">Content Angle Strategy</p>
                      <ul className="flex flex-col gap-1">
                        {ch.contentAngles.map((angle) => (
                          <li key={angle} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1.5 shrink-0">·</span>
                            {angle}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Posting Cadence Recommendation</p>
                      <p className="text-sm text-gray-600">{ch.cadence}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Conversion Mechanism</p>
                      <p className="text-sm text-gray-600">{ch.conversionMechanism}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Operator Recommendation */}
      <div className="border border-gray-200 rounded-2xl p-6">
        <p className="font-bold text-base mb-4">🔥 Operator Recommendation</p>
        <div className="border-l-4 border-gray-900 pl-5 bg-gray-50 rounded-r-xl py-4 pr-4">
          <p className="text-sm text-gray-700">{data.operatorRecommendation}</p>
        </div>
      </div>

    </div>
  );
}
