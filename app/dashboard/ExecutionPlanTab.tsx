interface ExecutionPlanData {
  primaryFocus: {
    channels: string;
    revenueGoal: string;
    tagline: string;
  };
  weeks: {
    week: number;
    theme: string;
    actions: string[];
  }[];
}

const WEEK_STYLES = [
  { badge: "bg-blue-100 text-blue-700", border: "border-l-blue-500", num: "bg-blue-100 text-blue-700" },
  { badge: "bg-sky-100 text-sky-700", border: "border-l-sky-500", num: "bg-sky-100 text-sky-700" },
  { badge: "bg-emerald-100 text-emerald-700", border: "border-l-emerald-500", num: "bg-emerald-100 text-emerald-700" },
  { badge: "bg-amber-100 text-amber-700", border: "border-l-amber-500", num: "bg-amber-100 text-amber-700" },
];

export default function ExecutionPlanTab({ data }: { data: ExecutionPlanData }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">30-Day Strategy</p>
        <h2 className="text-3xl font-bold mb-1">Execution Plan</h2>
        <p className="text-sm text-gray-500">Your week-by-week plan to reach your revenue goal.</p>
      </div>

      {/* Primary Focus — dark premium card */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-7 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Primary Focus</p>
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900 mb-1">{data.primaryFocus.channels}</p>
          <p className="text-sm text-gray-400 italic">&ldquo;{data.primaryFocus.tagline}&rdquo;</p>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
          <span className="text-xs text-gray-400 font-medium">30-day goal</span>
          <span className="bg-white border border-gray-200 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
            {data.primaryFocus.revenueGoal}
          </span>
        </div>
      </div>

      {/* Week cards */}
      {data.weeks.map((week, i) => {
        const style = WEEK_STYLES[i] ?? WEEK_STYLES[0];
        return (
          <div key={week.week} className={`bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5 border-l-4 ${style.border}`}>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
                Week {week.week}
              </span>
              <p className="font-bold text-base">{week.theme}</p>
            </div>
            <ul className="flex flex-col gap-3.5">
              {week.actions.map((action, j) => (
                <li key={action} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${style.num}`}>
                    {j + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

    </div>
  );
}
