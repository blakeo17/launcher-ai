interface PositioningData {
  currentHeadline: string;
  improvedHeadline: string;
  whyItWins: string;
  icp: {
    primaryUserType: string;
    corePainPoint: string;
    buyingTrigger: string;
    urgencyLevel: string;
  };
  messagingAngles: { angle: string; copy: string }[];
  competitiveInsight: { label: string; insight: string }[];
}

export default function PositioningTab({ data }: { data: PositioningData }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">Messaging Intelligence</p>
        <h2 className="text-2xl font-bold mb-1">Positioning Strategy</h2>
        <p className="text-sm text-gray-500">Refined messaging, ICP clarity, and competitive angle based on your homepage analysis.</p>
      </div>

      {/* Before / After Headline */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Before</p>
          </div>
          <div className="border border-gray-200 rounded-xl px-5 py-6 bg-gray-50 h-full">
            <p className="text-sm text-gray-400">{data.currentHeadline}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-emerald-600 uppercase">After</p>
          </div>
          <div className="border border-emerald-200 rounded-xl px-5 py-6 bg-emerald-50 h-full">
            <p className="text-sm font-semibold leading-snug text-emerald-900">{data.improvedHeadline}</p>
          </div>
        </div>
      </div>

      {/* Why This Wins */}
      <div className="border border-violet-200 rounded-xl p-6 bg-violet-50">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-6 h-6 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-semibold text-violet-900">Why This Wins</p>
        </div>
        <p className="text-sm text-violet-800 leading-relaxed">{data.whyItWins}</p>
      </div>

      {/* ICP — 2x2 colored grid */}
      <div>
        <h3 className="text-lg font-bold mb-4">Ideal Customer Profile</h3>
        <div className="grid grid-cols-2 gap-3">

          <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">User Type</p>
            </div>
            <p className="text-sm font-medium text-blue-900">{data.icp.primaryUserType}</p>
          </div>

          <div className="border border-red-200 bg-red-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase">Pain Point</p>
            </div>
            <p className="text-sm font-medium text-red-900">{data.icp.corePainPoint}</p>
          </div>

          <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">Buying Trigger</p>
            </div>
            <p className="text-sm font-medium text-amber-900">{data.icp.buyingTrigger}</p>
          </div>

          <div className="border border-gray-200 bg-white rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Urgency</p>
            </div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${
              data.icp.urgencyLevel === "High" ? "bg-red-50 text-red-700 border-red-200" :
              data.icp.urgencyLevel === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-gray-100 text-gray-500 border-gray-200"
            }`}>{data.icp.urgencyLevel}</span>
          </div>

        </div>
      </div>

      {/* Messaging Angles */}
      <div>
        <h3 className="text-lg font-bold mb-4">Key Messaging Angles</h3>
        <div className="flex flex-col gap-3">
          {data.messagingAngles.map((angle, i) => (
            <div key={angle.angle} className={`rounded-xl overflow-hidden border ${i % 2 === 0 ? "border-indigo-200" : "border-violet-200"}`}>
              <div className={`px-5 py-3 flex items-center gap-2 ${i % 2 === 0 ? "bg-indigo-500" : "bg-violet-500"}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-xs font-bold text-white uppercase tracking-widest">{angle.angle}</p>
              </div>
              <div className={`px-5 py-4 ${i % 2 === 0 ? "bg-indigo-50" : "bg-violet-50"}`}>
                <p className={`text-sm font-semibold leading-snug ${i % 2 === 0 ? "text-indigo-900" : "text-violet-900"}`}>
                  &ldquo;{angle.copy}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Insight */}
      <div>
        <h3 className="text-lg font-bold mb-4">Competitive Insight</h3>
        <div className="flex flex-col gap-3">
          {data.competitiveInsight.map((row, i) => (
            <div key={row.label} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${i % 2 === 0 ? "bg-emerald-100" : "bg-blue-100"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "#10b981" : "#3b82f6"} strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">{row.label}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{row.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
