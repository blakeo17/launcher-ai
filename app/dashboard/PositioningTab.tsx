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

      {/* Positioning Strategy */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Positioning Strategy</h2>
          <p className="text-sm text-gray-500">
            Refined messaging, ICP clarity, and competitive angle based on your homepage analysis.
          </p>
        </div>

        <div className="border-t border-gray-200" />

        {/* Current vs Improved Headline */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Current Headline
            </p>
            <div className="border border-gray-200 rounded-xl px-5 py-6 bg-gray-50">
              <p className="text-sm text-gray-400">{data.currentHeadline}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Improved Headline
            </p>
            <div className="border border-gray-200 rounded-xl px-5 py-6 bg-white">
              <p className="text-sm font-semibold leading-snug">{data.improvedHeadline}</p>
            </div>
          </div>
        </div>

        {/* Why This Wins */}
        <div className="border border-gray-200 rounded-xl p-6">
          <p className="font-semibold mb-2">Why This Wins</p>
          <p className="text-sm text-gray-500 leading-relaxed">{data.whyItWins}</p>
        </div>
      </div>

      {/* Ideal Customer Profile */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="font-semibold">Ideal Customer Profile</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "Primary User Type", value: data.icp.primaryUserType, badge: false },
            { label: "Core Pain Point", value: data.icp.corePainPoint, badge: false },
            { label: "Buying Trigger", value: data.icp.buyingTrigger, badge: false },
            { label: "Urgency Level", value: data.icp.urgencyLevel, badge: true },
          ].map((row) => (
            <div key={row.label} className="px-6 py-4">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
                {row.label}
              </p>
              {row.badge ? (
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  row.value === "High" ? "bg-red-50 text-red-700 border-red-200" :
                  row.value === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-gray-100 text-gray-500 border-gray-200"
                }`}>{row.value}</span>
              ) : (
                <p className="text-sm">{row.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Messaging Angles */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Key Messaging Angles To Test</h3>
        {data.messagingAngles.map((angle) => (
          <div key={angle.angle} className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <p className="font-semibold mb-1">{angle.angle}</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4 bg-gray-50 rounded-r-lg py-3 pr-4">
              <p className="text-sm text-gray-600 italic">&quot;{angle.copy}&quot;</p>
            </div>
          </div>
        ))}
      </div>

      {/* Competitive Positioning Insight */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="font-semibold">Competitive Positioning Insight</p>
        </div>
        <div className="divide-y divide-gray-100">
          {data.competitiveInsight.map((row) => (
            <div key={row.label} className="px-6 py-4">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
                {row.label}
              </p>
              <p className="text-sm">{row.insight}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
