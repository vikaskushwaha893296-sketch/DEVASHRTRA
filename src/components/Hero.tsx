import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ArrowRight, Code2, Bot, Cpu } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
  onExploreJunior: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinWaitlist, onExploreJunior }) => {
  const [selectedLang, setSelectedLang] = useState<'python' | 'javascript'>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const sampleCodes = {
    python: `# Task: Compute distributed server load balancing
def balance_clusters(nodes, traffic_units):
    allocated = {n: 0 for n in nodes}
    for unit in traffic_units:
        target = min(allocated, key=allocated.get)
        allocated[target] += unit
    return allocated

nodes = ["us-east-1", "eu-central-1", "ap-south-1"]
requests = [12, 45, 18, 30, 22]
print(balance_clusters(nodes, requests))`,
    javascript: `// Task: Stream processing for real-time telemetry
function aggregateMetrics(telemetryStream) {
  return telemetryStream.reduce((acc, point) => {
    acc[point.service] = (acc[point.service] || 0) + point.latencyMs;
    return acc;
  }, {});
}

const stream = [
  { service: "auth", latencyMs: 24 },
  { service: "db", latencyMs: 82 },
  { service: "auth", latencyMs: 19 }
];
console.log(aggregateMetrics(stream));`,
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 450);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top Kicker Label */}
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-cyan-400 mb-4 tracking-wide uppercase">
          <span>Devashtra Platform</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Next-Generation Technical Education</span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.1]">
              Bridging the gap between{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-300 to-slate-100">
                passive learning
              </span>{' '}
              and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
                real-world execution.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Stop endlessly watching passive video tutorials and hitting local setup walls.
              Devashtra gives learners an in-browser Cloud Lab, structured mentor cohorts, and a Socratic AI Copilot that coaches logic rather than handing out spoilers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onJoinWaitlist}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-xl hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request Early Access</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreJunior}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 rounded-xl hover:border-amber-400/50 hover:text-amber-300 transition-all"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Devashtra Junior (Ages 6-12)</span>
              </button>
            </div>

            {/* Adjacent Proof Strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-mono text-base font-bold text-white tabular-nums">0s</p>
                <p className="text-slate-400 mt-0.5">Local setup time</p>
              </div>
              <div>
                <p className="font-mono text-base font-bold text-cyan-400 tabular-nums">100%</p>
                <p className="text-slate-400 mt-0.5">Browser sandboxed</p>
              </div>
              <div>
                <p className="font-mono text-base font-bold text-teal-300 tabular-nums">Socratic</p>
                <p className="text-slate-400 mt-0.5">Gemini AI guidance</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Cloud Lab & AI Copilot Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0c1322] shadow-2xl shadow-cyan-950/40 overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#080e1a] border-b border-slate-800/90 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="ml-2 font-mono text-[11px] text-slate-300">
                    cloud_lab/{selectedLang === 'python' ? 'cluster_allocator.py' : 'telemetry_stream.js'}
                  </span>
                </div>

                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedLang('python');
                      setHasRun(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      selectedLang === 'python'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Python 3.12
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLang('javascript');
                      setHasRun(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      selectedLang === 'javascript'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Node.js 22
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <div className="p-4 font-mono text-xs text-slate-200 bg-[#070c17] overflow-x-auto leading-relaxed border-b border-slate-800/70">
                <pre className="text-slate-300 whitespace-pre">
                  {sampleCodes[selectedLang]}
                </pre>
              </div>

              {/* Action Bar + Output */}
              <div className="p-4 bg-[#0a1120] space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 disabled:opacity-50 transition-colors shadow-sm shadow-cyan-400/20"
                  >
                    <Play className={`h-3 w-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Compiling Sandbox...' : 'Run in Sandbox'}</span>
                  </button>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <Cpu className="h-3.5 w-3.5 text-teal-400" />
                    <span>Isolated Container · vCPU 1.0</span>
                  </div>
                </div>

                {/* Console Output Area */}
                <div className="rounded-lg bg-[#05080f] p-3 border border-slate-800/80 font-mono text-xs">
                  <div className="text-slate-500 text-[11px] mb-1">STDOUT / TERMINAL OUTPUT:</div>
                  {isRunning ? (
                    <div className="text-cyan-400 animate-pulse">
                      &gt; Executing inside secure sandbox worker...
                    </div>
                  ) : hasRun ? (
                    <div className="space-y-1 text-emerald-400">
                      <div className="flex items-center gap-1.5 text-teal-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Execution Success (184ms)</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        {selectedLang === 'python'
                          ? `{'us-east-1': 42, 'eu-central-1': 45, 'ap-south-1': 40}`
                          : `{ auth: 43, db: 82 }`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[11px]">
                      Press &quot;Run in Sandbox&quot; to compile and execute code instantly.
                    </div>
                  )}
                </div>

                {/* Socratic Copilot Card */}
                <div className="rounded-lg bg-cyan-950/30 border border-cyan-800/40 p-3 flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-300 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-cyan-200">Devashtra AI Copilot</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      &quot;Great start! Notice how the greedy approach finds the current minimum in O(N). How would you optimize this for 100,000 nodes using a min-heap?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
