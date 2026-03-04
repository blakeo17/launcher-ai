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

export default function ExecutionPlanTab({ data }: { data: ExecutionPlanData }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Execution Plan</h2>
        <p className="text-sm text-gray-500">Your step-by-step plan to reach your revenue goal.</p>
      </div>

      {/* Primary Focus card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-2">
        <p className="font-bold text-base">Primary Focus: {data.primaryFocus.channels}</p>
        <p className="text-sm text-gray-700">30-Day Revenue Goal: {data.primaryFocus.revenueGoal}</p>
        <p className="text-sm text-gray-400">{data.primaryFocus.tagline}</p>
      </div>

      {/* Week cards */}
      {data.weeks.map((week) => (
        <div key={week.week} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3">
          <p className="font-bold text-base">Week {week.week} — {week.theme}</p>
          <ul className="flex flex-col gap-2">
            {week.actions.map((action) => (
              <li key={action} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 text-gray-300 shrink-0">·</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
}
