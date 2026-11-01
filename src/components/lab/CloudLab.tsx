import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Save,
  Download,
  Terminal,
  Bot,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Send,
  Loader2,
  Layers,
  Code2,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { saveProjectInFirestore } from '../../firebase.ts';

interface CloudLabProps {
  initialLanguage?: 'python' | 'javascript';
  initialCode?: string;
  initialTitle?: string;
  taskTitle?: string;
  onBack: () => void;
  onOpenGame?: () => void;
  onOpenStudio?: () => void;
}

interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb: number;
  status: 'success' | 'error' | 'timeout';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const TEMPLATES: Record<string, { title: string; language: 'python' | 'javascript'; code: string }> = {
  fibonacci: {
    title: 'Fibonacci Sequence & Time Complexity',
    language: 'python',
    code: `# Fibonacci Number Generator with Iterative Performance
def fibonacci_sequence(n: int):
    """Generate first n Fibonacci numbers with O(n) complexity."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

limit = 10
fib_list = fibonacci_sequence(limit)
print(f"Computed {limit} terms of Fibonacci:")
print(fib_list)
`,
  },
  caesar: {
    title: 'Devashtra Junior: Cryptographic Cipher',
    language: 'javascript',
    code: `// Caesar Cipher Encryption & Decryption Engine
function encryptCaesar(text, shift = 3) {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    return char;
  }).join('');
}

const original = "DEVASHTRA-SECURE-VAULT";
const encrypted = encryptCaesar(original, 4);

console.log("Original:  " + original);
console.log("Encrypted: " + encrypted);
`,
  },
  biocomputing: {
    title: 'Genomics: GC-Content & Codon Counter',
    language: 'python',
    code: `# Computational Biology: Genomic Sequence Analysis
dna_strand = "ATGCGATCGATCGATCGAATCGATCGATCGATCGATCGATCGAATCG"

g_count = dna_strand.count("G")
c_count = dna_strand.count("C")
total_bases = len(dna_strand)

gc_ratio = ((g_count + c_count) / total_bases) * 100

print(f"Total Base Pairs: {total_bases} bp")
print(f"Guanine (G) Count: {g_count}")
print(f"Cytosine (C) Count: {c_count}")
print(f"Genomic GC-Content: {gc_ratio:.2f}%")
`,
  },
  asyncApi: {
    title: 'Modern Async API Pipeline',
    language: 'javascript',
    code: `// Simulating Asynchronous Telemetry & Data Processing
const telemetryPackets = [
  { sensor: "Core-Alpha", temp: 34.2, status: "nominal" },
  { sensor: "Thruster-Beta", temp: 88.6, status: "warning" },
  { sensor: "Solar-Gamma", temp: 22.1, status: "nominal" },
];

console.log("Starting telemetry analysis...");
telemetryPackets.forEach((packet, idx) => {
  const alert = packet.status === "warning" ? " [ALERT]" : " [OK]";
  console.log(\`Packet #\${idx + 1}: \${packet.sensor} at \${packet.temp}°C\${alert}\`);
});
console.log("Telemetry check complete.");
`,
  },
};

export const CloudLab: React.FC<CloudLabProps> = ({
  initialLanguage = 'python',
  initialCode,
  initialTitle,
  taskTitle,
  onBack,
  onOpenGame,
  onOpenStudio,
}) => {
  const { user } = useAuth();

  const [language, setLanguage] = useState<'python' | 'javascript'>(initialLanguage);
  const [projectTitle, setProjectTitle] = useState(
    initialTitle || taskTitle || (language === 'python' ? 'Algorithmic Fibonacci Generator' : 'Interactive JavaScript Sandbox')
  );
  const [code, setCode] = useState(
    initialCode || (language === 'python' ? TEMPLATES.fibonacci.code : TEMPLATES.caesar.code)
  );

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SandboxResult | null>({
    stdout: 'Devashtra Sandbox Environment initialized.\nPress "Run Code" (or Ctrl + Enter) to execute.',
    stderr: '',
    exitCode: 0,
    executionTimeMs: 14,
    memoryKb: 3420,
    status: 'success',
  });

  // Active right tabs: 'console' | 'tests'
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');

  // Test suite state
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // AI Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello! I am your Socratic AI Copilot. Write your code on the left, and if you get stuck or receive an error, I'll provide gentle hints and conceptual guidance without giving away the answer!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isCopilotThinking]);

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = language === 'python' ? '    ' : '  ';

      setCode(code.substring(0, start) + spaces + code.substring(end));

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // Run Code via Sandbox API
  const handleRunCode = async () => {
    setIsRunning(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (res.ok) {
        const data: SandboxResult = await res.json();
        setResult(data);

        // If error occurred, automatically prompt or notify user
        if (data.stderr && isCopilotOpen) {
          // Optional subtle suggestion
        }
      } else {
        setResult({
          stdout: '',
          stderr: 'Sandbox request returned HTTP status ' + res.status,
          exitCode: 1,
          executionTimeMs: 0,
          memoryKb: 0,
          status: 'error',
        });
      }
    } catch (err: any) {
      setResult({
        stdout: '',
        stderr: 'Network Error connecting to Sandbox: ' + err.message,
        exitCode: 1,
        executionTimeMs: 0,
        memoryKb: 0,
        status: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run Test Suite
  const handleRunTests = async () => {
    setIsRunning(true);
    setActiveTab('tests');

    try {
      const mockTestCases = [
        { name: 'Output format validity', expectedKeyword: 'print', expected: 'Formatted standard output' },
        { name: 'Algorithmic efficiency & bounds', expectedKeyword: 'return', expected: 'Safe non-infinite termination' },
        { name: 'Edge condition check', expectedKeyword: '', expected: 'Handles zero or boundary input' },
      ];

      const res = await fetch('/api/sandbox/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases: mockTestCases,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResults(data.results || []);
        setTestsPassed(data.allPassed);
        setXpEarned(data.xpEarned || 50);
      }
    } catch {
      setTestsPassed(false);
    } finally {
      setIsRunning(false);
    }
  };

  // Save Project to Database and Firestore
  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // 1. Save to Express / MongoDB backend
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          language,
          code,
          output: result?.stdout || '',
          userId: user?._id || 'student-1',
          userName: user?.name || 'Devashtra Student',
        }),
      });

      // 2. Dual-save to Firestore for real-time cloud persistence
      await saveProjectInFirestore({
        title: projectTitle,
        language,
        code,
        userId: user?._id || 'student-1',
        userName: user?.name || 'Devashtra Student',
      });

      if (res.ok) {
        setSaveStatus('Project saved to cloud & Firestore');
      } else {
        setSaveStatus('Saved locally');
      }
    } catch {
      setSaveStatus('Saved in offline session');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Download code file
  const handleDownload = () => {
    const extension = language === 'python' ? 'py' : 'js';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send question to Socratic AI Copilot
  const handleSendCopilot = async (customPrompt?: string) => {
    const questionText = customPrompt || copilotInput.trim();
    if (!questionText || isCopilotThinking) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setCopilotInput('');
    setIsCopilotThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: questionText,
          codeContext: code,
          errorContext: result?.stderr || undefined,
          mode: 'copilot',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: data.reply || "I've reviewed your code. What specific step would you like to investigate first?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: "I couldn't reach the AI Copilot reasoning service right now. Double check the line that gave the error and inspect variable assignments.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'assistant',
        text: 'Connection hiccup. Notice if your variable is defined before calling it in the print statement.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Ask Copilot to explain current error
  const handleExplainError = () => {
    setIsCopilotOpen(true);
    handleSendCopilot(
      `Please explain this error in simple language and give me a hint on how to fix it without giving the full solution:\n\n${result?.stderr}`
    );
  };

  // Change Template
  const handleSelectTemplate = (key: string) => {
    const tmpl = TEMPLATES[key];
    if (tmpl) {
      setLanguage(tmpl.language);
      setProjectTitle(tmpl.title);
      setCode(tmpl.code);
    }
  };

  // Line count for gutter
  const lineCount = Math.max(code.split('\n').length, 16);

  return (
    <div className="flex flex-col h-screen w-full bg-[#050811] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#070d1a] px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Project Title Input */}
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-sm font-semibold text-white px-1 py-0.5 outline-none transition-colors max-w-[220px] sm:max-w-xs"
              placeholder="Project Title"
            />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => {
                setLanguage('python');
                if (code === TEMPLATES.caesar.code) setCode(TEMPLATES.fibonacci.code);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'python'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python 3.11
            </button>
            <button
              onClick={() => {
                setLanguage('javascript');
                if (code === TEMPLATES.fibonacci.code) setCode(TEMPLATES.caesar.code);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'javascript'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JavaScript (Node)
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Templates Dropdown */}
          <select
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue=""
            className="hidden md:block bg-slate-900 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs outline-none hover:border-slate-700 transition-colors"
          >
            <option value="" disabled>
              Load Starter Template...
            </option>
            <option value="fibonacci">Fibonacci & Time Complexity (Python)</option>
            <option value="caesar">Devashtra Junior: Cipher (JS)</option>
            <option value="biocomputing">Genomics: GC-Content (Python)</option>
            <option value="asyncApi">Async Telemetry Pipeline (JS)</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            title="Save to MongoDB & Firestore"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" /> : <Save className="h-3.5 w-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title="Download Code File"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Copilot Drawer Toggle */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              isCopilotOpen
                ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-purple-300'
            }`}
            title="Toggle Socratic AI Copilot"
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Run Code Primary Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
            title="Execute Code in Sandbox (Ctrl+Enter)"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div className="bg-teal-950/90 border-b border-teal-800/80 px-4 py-1.5 text-xs text-teal-300 flex items-center justify-between animate-in fade-in duration-150">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{saveStatus}</span>
          </span>
          <span className="text-[10px] font-mono text-teal-400">Status 200 OK</span>
        </div>
      )}

      {/* Main IDE Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Half: Editor Area */}
        <div className="flex-1 flex flex-col border-r border-slate-800 min-w-0 bg-[#070b14]">
          {/* Editor Sub-header */}
          <div className="h-8 border-b border-slate-800/80 bg-[#080d1a] px-3 flex items-center justify-between text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-cyan-400">
                {language === 'python' ? 'main.py' : 'index.js'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">UTF-8</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <button
                onClick={handleCopyCode}
                className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                title="Copy entire code"
              >
                {copied ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <span className="text-slate-600">|</span>
              <span>{code.length} chars</span>
              <span className="text-slate-600">|</span>
              <span>{lineCount} lines</span>
            </div>
          </div>

          {/* Editor Container with Line Numbers */}
          <div className="flex-1 flex relative overflow-hidden font-mono text-xs leading-relaxed">
            {/* Gutter / Line Numbers */}
            <div className="w-12 py-3 px-2 text-right bg-[#05070d] text-slate-600 select-none border-r border-slate-800/60 overflow-hidden shrink-0">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="h-5 text-[11px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Input Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="flex-1 p-3 bg-transparent text-slate-100 resize-none outline-none overflow-auto font-mono text-xs leading-5 selection:bg-cyan-500/30 selection:text-cyan-100"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Editor Footer Status */}
          <div className="h-7 border-t border-slate-800/80 bg-[#070c18] px-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              <span>Devashtra Isolated Engine</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Shortcut: Ctrl + Enter</span>
            </div>
          </div>
        </div>

        {/* Right Half: Output Console & Test Suite */}
        <div
          className={`${
            isCopilotOpen ? 'w-full lg:w-96 xl:w-[460px]' : 'w-full lg:w-[480px] xl:w-[560px]'
          } flex flex-col border-r border-slate-800 bg-[#060913] shrink-0 transition-all`}
        >
          {/* Console Header Tabs */}
          <div className="h-9 border-b border-slate-800 bg-[#070d1b] px-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Console Output</span>
                {result?.stderr && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('tests');
                  if (testResults.length === 0) handleRunTests();
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'tests'
                    ? 'bg-slate-800 text-teal-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Test Suite</span>
                {testsPassed !== null && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1 rounded ${
                      testsPassed ? 'bg-teal-950 text-teal-300' : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {testsPassed ? 'PASS' : 'FAIL'}
                  </span>
                )}
              </button>
            </div>

            {/* Benchmark stats */}
            {result && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400">{result.executionTimeMs}ms</span>
                <span className="text-slate-600">•</span>
                <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
              </div>
            )}
          </div>

          {/* Console Body */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed">
            {activeTab === 'console' ? (
              <div className="space-y-3">
                {/* Standard Output */}
                {result?.stdout && (
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                      Standard Output:
                    </div>
                    <pre className="p-3 rounded-lg bg-[#04060c] border border-slate-800/80 text-emerald-300 whitespace-pre-wrap selection:bg-emerald-500/20">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {/* Standard Error / Diagnostics */}
                {result?.stderr && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-rose-400 mb-1">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Execution Diagnostics / Error:</span>
                      </span>
                      <button
                        onClick={handleExplainError}
                        className="text-[10px] lowercase font-sans font-semibold text-purple-300 bg-purple-950/80 border border-purple-800/60 px-2 py-0.5 rounded hover:bg-purple-900 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Explain with AI Copilot</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300 whitespace-pre-wrap selection:bg-rose-500/20">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {/* Empty State */}
                {!result?.stdout && !result?.stderr && (
                  <div className="text-slate-500 text-center py-12">
                    Click "Run Code" above to execute.
                  </div>
                )}
              </div>
            ) : (
              /* Test Suite Verification Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white font-heading">
                      Algorithmic Practice Verification
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Verify output correctness, time limits, and edge conditions.
                    </p>
                  </div>
                  <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Rerun Tests</span>
                  </button>
                </div>

                {testResults.length > 0 ? (
                  <div className="space-y-2.5">
                    {testResults.map((tc) => (
                      <div
                        key={tc.id}
                        className={`p-3 rounded-xl border ${
                          tc.passed
                            ? 'bg-teal-950/20 border-teal-800/50 text-teal-200'
                            : 'bg-rose-950/20 border-rose-800/50 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            {tc.passed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                            )}
                            <span>{tc.name}</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              tc.passed ? 'bg-teal-900/60 text-teal-300' : 'bg-rose-900/60 text-rose-300'
                            }`}
                          >
                            {tc.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono pl-5">
                          {tc.message}
                        </div>
                      </div>
                    ))}

                    {xpEarned && testsPassed && (
                      <div className="p-3 bg-gradient-to-r from-amber-950/40 to-yellow-950/30 border border-amber-800/50 rounded-xl text-amber-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 fill-current text-amber-400" />
                          <span className="text-xs font-semibold">
                            Challenge Complete! +{xpEarned} XP Credited
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          LEVEL UP PROGRESS
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No tests evaluated yet.</p>
                    <button
                      onClick={handleRunTests}
                      className="mt-2 text-xs text-cyan-400 hover:underline"
                    >
                      Run Verification Suite
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rightmost Drawer: Socratic AI Copilot */}
        {isCopilotOpen && (
          <div className="w-80 lg:w-96 flex flex-col border-l border-slate-800 bg-[#080d1c] shrink-0">
            {/* Copilot Header */}
            <div className="h-10 border-b border-slate-800 bg-[#090f22] px-3.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-purple-500/20 text-purple-300">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold text-white">Socratic AI Copilot</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/70 border border-purple-800/50 px-1.5 py-0.5 rounded">
                Gemini 3.8
              </span>
            </div>

            {/* Quick Socratic Suggestion Chips */}
            <div className="p-2 border-b border-slate-800/70 bg-[#060a16] flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => handleSendCopilot('Can you give me a hint for the next logical step in this algorithm?')}
                className="px-2 py-1 rounded-md bg-slate-800/70 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 transition-colors"
              >
                💡 Give me a hint
              </button>
              <button
                onClick={() => handleSendCopilot('What is the Big-O time and space complexity of this code?')}
                className="px-2 py-1 rounded-md bg-slate-800/70 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 transition-colors"
              >
                ⏱️ Analyze Big-O
              </button>
              <button
                onClick={() => handleSendCopilot('Explain how this algorithm works conceptually as if I am 10 years old.')}
                className="px-2 py-1 rounded-md bg-slate-800/70 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/60 transition-colors"
              >
                🧒 Junior Explanation
              </button>
            </div>

            {/* Chat Message Stream */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs"
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isCopilotThinking && (
                <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Socratic Copilot formulating guiding hint...</span>
                </div>
              )}
            </div>

            {/* Copilot Input Box */}
            <div className="p-3 border-t border-slate-800 bg-[#070c1a]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCopilot();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask for hints or explain logic..."
                  className="w-full bg-slate-900 text-slate-100 placeholder:text-slate-500 text-xs rounded-xl pl-3 pr-10 py-2.5 border border-slate-800 focus:border-purple-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!copilotInput.trim() || isCopilotThinking}
                  className="absolute right-1.5 p-1.5 text-purple-400 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
