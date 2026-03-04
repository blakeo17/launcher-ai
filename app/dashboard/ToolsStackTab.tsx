interface ToolsStackData {
  tools: { name: string; purpose: string; tag: string; url?: string }[];
  whyItWorks: string[];
  stackPrinciple: string;
}

export default function ToolsStackTab({ data }: { data: ToolsStackData }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Tools Stack</h2>
        <p className="text-sm text-gray-500">Recommended tools based on your ICP and primary channel.</p>
      </div>

      {/* Tools list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {data.tools.map((tool, i) => (
          <div key={tool.name}>
            {i > 0 && <div className="border-t border-gray-100 mx-5" />}
            <div className="flex items-start justify-between px-6 py-5 gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="font-semibold text-sm">{tool.name}</p>
                <p className="text-sm text-gray-500">{tool.purpose}</p>
                <div className="flex gap-2 mt-1">
                  <span className="border border-gray-200 rounded-md px-2 py-0.5 text-xs text-gray-500">
                    {tool.tag}
                  </span>
                </div>
              </div>
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-black transition-colors shrink-0 mt-0.5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" />
                  </svg>
                  Open
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Why This Stack Works */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="font-semibold mb-4">Why This Stack Works</p>
        <ul className="flex flex-col gap-3">
          {data.whyItWorks.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Stack Principle */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="font-semibold mb-3">Stack Principle</p>
        <p className="text-sm text-gray-400 italic">&quot;{data.stackPrinciple}&quot;</p>
      </div>

    </div>
  );
}
