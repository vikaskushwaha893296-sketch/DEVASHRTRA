import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Music,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Search,
  MapPin,
  Dna,
  Send,
  Loader2,
  Play,
  Pause,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { signInWithGoogle, auth } from '../../firebase.ts';

interface MultimodalStudioProps {
  onBackToApp: () => void;
  onOpenGame?: () => void;
}

export const DevashtraMultimodalStudio: React.FC<MultimodalStudioProps> = ({
  onBackToApp,
  onOpenGame,
}) => {
  // Active Tab: 'copilot' | 'bioscience' | 'music' | 'image' | 'video' | 'transcribe' | 'grounding'
  const [activeTab, setActiveTab] = useState<
    'copilot' | 'bioscience' | 'music' | 'image' | 'video' | 'transcribe' | 'grounding'
  >('copilot');

  // Firebase auth state
  const [firebaseUser, setFirebaseUser] = useState<any>(auth.currentUser);

  // 1. Chatbot state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: 'Greetings! I am the Devashtra Socratic Copilot. I help you master algorithmic problem-solving and systems architecture through guided hints and mental models rather than copy-paste spoilers. What are you building today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatRole, setChatRole] = useState<'copilot' | 'junior' | 'biotech'>('copilot');

  // 2. Bioscience state
  const [bioQuery, setBioQuery] = useState('TP53');
  const [bioResults, setBioResults] = useState<any[]>([]);
  const [bioLoading, setBioLoading] = useState(false);

  // 3. Music state
  const [musicPrompt, setMusicPrompt] = useState('Uplifting synthwave coding beat with warm arpeggios');
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState('');
  const [musicLoading, setMusicLoading] = useState(false);

  // 4. Image state
  const [imagePrompt, setImagePrompt] = useState('Cyberpunk coding laboratory with glowing holographic code and a robotic assistant');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // 5. Video state
  const [videoPrompt, setVideoPrompt] = useState('Autonomous space rover rolling across a glowing planetary terrain at twilight');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // 6. Audio Transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 7. Grounding state
  const [groundingQuery, setGroundingQuery] = useState('Latest quantum computing breakthroughs in 2026');
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const [groundingResult, setGroundingResult] = useState<{ text?: string; sources?: any[]; places?: any[] } | null>(null);
  const [groundingLoading, setGroundingLoading] = useState(false);

  // Handlers
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setFirebaseUser(user);
    } catch (err) {
      console.error('Google Sign In failed:', err);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userText = chatInput.trim();
    setChatInput('');
    const newHistory = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(newHistory);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          role: chatRole,
          model: 'gemini-3.8-flash',
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setChatMessages([...newHistory, { role: 'model', text: data.text }]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error during AI response';
      setChatMessages([...newHistory, { role: 'model', text: `[Error: ${msg}]` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSearchBio = async (queryToUse?: string) => {
    const q = (queryToUse || bioQuery).trim();
    if (!q) return;
    setBioLoading(true);
    try {
      const res = await fetch(`/api/ai/bio/protein/${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setBioResults(data.results || []);
      }
    } catch (err) {
      console.error('Bio fetch error:', err);
    } finally {
      setBioLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    setMusicLoading(true);
    setMusicAudioUrl(null);
    try {
      const res = await fetch('/api/ai/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, trackType: 'clip' }),
      });
      const data = await res.json();
      if (data.success && data.audioUrl) {
        setMusicAudioUrl(data.audioUrl);
        setMusicLyrics(data.lyrics || '');
      } else {
        throw new Error(data.error || 'Failed to generate music');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to generate music');
    } finally {
      setMusicLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    setImageUrl(null);
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio: '16:9' }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    setVideoUrl(null);
    try {
      const res = await fetch('/api/ai/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio: '16:9' }),
      });
      const data = await res.json();
      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error(data.error || 'Failed to generate video');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGroundingSearch = async () => {
    setGroundingLoading(true);
    setGroundingResult(null);
    try {
      const endpoint = groundingMode === 'maps' ? '/api/ai/maps-grounded' : '/api/ai/search-grounded';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: groundingQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setGroundingResult(data);
      } else {
        throw new Error(data.error || 'Failed to perform grounding search');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Grounding error');
    } finally {
      setGroundingLoading(false);
    }
  };

  // Microphone recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setTranscribeLoading(true);
          try {
            const res = await fetch('/api/ai/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
            });
            const data = await res.json();
            if (data.success) {
              setTranscript(data.transcript);
            }
          } catch (e) {
            console.error('Transcription error:', e);
          } finally {
            setTranscribeLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable in this environment.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070e1b]/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            &larr; Workspace
          </button>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2 font-heading font-bold text-white">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Devashtra Multimodal AI Studio</span>
          </div>
        </div>

        {/* Firebase User Status & 3D Game Shortcut */}
        <div className="flex items-center gap-3">
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-200 transition-colors shadow-sm"
            >
              Play 3D Cyber Rover
            </button>
          )}

          {firebaseUser ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{firebaseUser.displayName || firebaseUser.email} (Firebase Auth)</span>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>Google Sign-In (Firebase)</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport with Side Tab Navigation */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-3 space-y-2">
          <div className="text-[11px] font-mono uppercase text-slate-500 mb-2">Capabilities</div>

          {[
            { id: 'copilot', label: 'Gemini Copilot Chat', icon: Bot, color: 'text-cyan-400' },
            { id: 'bioscience', label: 'Bioscience & AlphaFold', icon: Dna, color: 'text-teal-400' },
            { id: 'music', label: 'Music Gen (Lyria)', icon: Music, color: 'text-amber-400' },
            { id: 'image', label: 'Image Gen (Nano Banana)', icon: ImageIcon, color: 'text-cyan-300' },
            { id: 'video', label: 'Video Gen (Omni Flash)', icon: Video, color: 'text-indigo-400' },
            { id: 'transcribe', label: 'Speech to Text', icon: Mic, color: 'text-rose-400' },
            { id: 'grounding', label: 'Search & Maps Grounding', icon: Search, color: 'text-teal-300' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Capability Workspace */}
        <main className="md:col-span-9 rounded-2xl border border-slate-800 bg-[#091122] p-6 sm:p-8 flex flex-col justify-between min-h-[560px]">
          {/* TAB 1: COPILOT CHAT */}
          {activeTab === 'copilot' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-heading text-base font-bold text-white">Socratic AI Copilot</h3>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setChatRole('copilot')}
                    className={`px-2.5 py-1 rounded ${chatRole === 'copilot' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'}`}
                  >
                    Tech Mentor
                  </button>
                  <button
                    onClick={() => setChatRole('junior')}
                    className={`px-2.5 py-1 rounded ${chatRole === 'junior' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
                  >
                    Junior Buddy
                  </button>
                  <button
                    onClick={() => setChatRole('biotech')}
                    className={`px-2.5 py-1 rounded ${chatRole === 'biotech' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'}`}
                  >
                    Bio Mentor
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2 font-sans text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl max-w-[85%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'ml-auto bg-cyan-600/30 text-white border border-cyan-500/30'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400 mb-1">
                      {msg.role === 'user' ? 'You' : 'Devashtra AI'}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
                {chatLoading && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-400 flex items-center gap-2 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing code reasoning &amp; formulating Socratic hints...</span>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask a question about Python, algorithms, or ask for a hint..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BIOSCIENCE SKILLS */}
          {activeTab === 'bioscience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-teal-400" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Bioinformatics &amp; Protein Structural Explorer
                  </h3>
                </div>
                <span className="text-xs font-mono text-teal-300">DeepMind Science Skills</span>
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Quick Try Targets:</span>
                {['TP53', 'BRCA1', 'EGFR', 'PCSK9', 'INS'].map((target) => (
                  <button
                    key={target}
                    onClick={() => {
                      setBioQuery(target);
                      handleSearchBio(target);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-300"
                  >
                    {target}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bioQuery}
                  onChange={(e) => setBioQuery(e.target.value)}
                  placeholder="Search UniProt protein gene, e.g. TP53..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <button
                  onClick={() => handleSearchBio()}
                  disabled={bioLoading}
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  {bioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Query UniProt & AlphaFold'}
                </button>
              </div>

              {/* Results & AlphaFold pLDDT Legend */}
              <div className="rounded-xl border border-slate-800 bg-[#060a14] p-4 text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-slate-400">Canonical 4-Band AlphaFold pLDDT Confidence</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" /> Very High (&gt;90)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" /> Confident (70-90)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" /> Low (50-70)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" /> Very Low (&lt;50)</span>
                  </div>
                </div>

                {bioResults.length > 0 ? (
                  <div className="space-y-3">
                    {bioResults.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-teal-300">{item.primaryAccession}</span>
                          <span className="text-[10px] font-mono text-slate-500">{item.organism?.scientificName}</span>
                        </div>
                        <div className="text-white font-medium">{item.proteinDescription?.recommendedName?.fullName?.value || item.uniProtkbId}</div>
                        <div className="text-slate-400 text-[11px]">
                          Length: {item.sequence?.length} amino acids · Mass: {item.sequence?.molWeight} Da
                        </div>
                        <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-cyan-400">
                          <a
                            href={`https://alphafold.ebi.ac.uk/entry/${item.primaryAccession}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <span>AlphaFold 3D Structure</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href={`https://www.uniprot.org/uniprotkb/${item.primaryAccession}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <span>UniProtKB Reference</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-center py-6">
                    Enter a gene or protein symbol to retrieve real biological sequences and AlphaFold predictions.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MUSIC (LYRIA) */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-amber-400" />
                  <h3 className="font-heading text-base font-bold text-white">Music Generation with Lyria</h3>
                </div>
                <span className="text-xs font-mono text-amber-300">lyria-3-clip-preview</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Describe the track vibe:</label>
                <textarea
                  rows={2}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                onClick={handleGenerateMusic}
                disabled={musicLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {musicLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{musicLoading ? 'Synthesizing with Lyria...' : 'Generate 30s Audio Clip'}</span>
              </button>

              {musicAudioUrl && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Volume2 className="h-4 w-4" />
                    <span>Generated Audio Track</span>
                  </div>
                  <audio controls src={musicAudioUrl} className="w-full" autoPlay />
                  <p className="text-slate-300 text-xs">{musicLyrics}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IMAGE (NANO BANANA 2.1) */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-heading text-base font-bold text-white">Image Creation with Nano Banana 2.1</h3>
                </div>
                <span className="text-xs font-mono text-cyan-300">gemini-nano-banana-2.1</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Image Description Prompt:</label>
                <textarea
                  rows={2}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={imageLoading}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-colors disabled:opacity-50"
              >
                {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>{imageLoading ? 'Rendering 1K Image...' : 'Generate High-Quality Image'}</span>
              </button>

              {imageUrl && (
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#060a14] p-2">
                  <img src={imageUrl} alt="Generated visual" className="w-full max-h-[340px] object-cover rounded-lg" />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VIDEO (OMNI FLASH) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-heading text-base font-bold text-white">Video Generation with Omni Flash</h3>
                </div>
                <span className="text-xs font-mono text-indigo-300">gemini-omni-1.1-flash</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Video Scene Prompt (16:9):</label>
                <textarea
                  rows={2}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={videoLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-indigo-300 transition-colors disabled:opacity-50"
              >
                {videoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{videoLoading ? 'Synthesizing Video via Interactions API...' : 'Generate 16:9 Video'}</span>
              </button>

              {videoUrl && (
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#060a14] p-2">
                  <video controls src={videoUrl} className="w-full max-h-[340px] rounded-lg" autoPlay loop />
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIO TRANSCRIBE */}
          {activeTab === 'transcribe' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-rose-400" />
                  <h3 className="font-heading text-base font-bold text-white">Microphone Speech to Text</h3>
                </div>
                <span className="text-xs font-mono text-rose-300">gemini-3.5-transcribe</span>
              </div>

              <p className="text-xs text-slate-300">
                Record your voice describing code logic or questions. The audio is transcribed verbatim by Gemini.
              </p>

              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 animate-pulse transition-colors"
                  >
                    <MicOff className="h-4 w-4" />
                    <span>Stop &amp; Transcribe</span>
                  </button>
                )}

                {transcribeLoading && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Transcribing with gemini-3.5-transcribe...</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#060a14] p-4 text-xs space-y-2">
                <div className="text-slate-500 font-mono">TRANSCRIPT OUTPUT:</div>
                <div className="text-slate-200 text-sm whitespace-pre-wrap">
                  {transcript || (isRecording ? 'Listening... Speak into microphone.' : 'No transcript recorded yet.')}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SEARCH & MAPS GROUNDING */}
          {activeTab === 'grounding' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-teal-400" />
                  <h3 className="font-heading text-base font-bold text-white">Search &amp; Maps Grounding</h3>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setGroundingMode('search')}
                    className={`px-3 py-1 rounded ${groundingMode === 'search' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'}`}
                  >
                    Web Search
                  </button>
                  <button
                    onClick={() => setGroundingMode('maps')}
                    className={`px-3 py-1 rounded ${groundingMode === 'maps' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'}`}
                  >
                    Google Maps
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={groundingQuery}
                  onChange={(e) => setGroundingQuery(e.target.value)}
                  placeholder={groundingMode === 'maps' ? 'Find STEM robotics labs or tech hubs near San Francisco...' : 'Search recent 2026 tech documentation...'}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <button
                  onClick={handleGroundingSearch}
                  disabled={groundingLoading}
                  className="px-5 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  {groundingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Execute Grounded Query'}
                </button>
              </div>

              {groundingResult && (
                <div className="rounded-xl border border-slate-800 bg-[#060a14] p-5 text-xs space-y-4">
                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {groundingResult.text}
                  </div>

                  {/* Sources / Place Links */}
                  {(groundingResult.sources?.length || 0) > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="font-mono text-slate-400 text-[11px]">Cited Web Sources:</div>
                      <div className="flex flex-wrap gap-2">
                        {groundingResult.sources?.map((chunk: any, i: number) => (
                          <a
                            key={i}
                            href={chunk.web?.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 hover:text-cyan-200"
                          >
                            <span>{chunk.web?.title || chunk.web?.uri}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {(groundingResult.places?.length || 0) > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="font-mono text-slate-400 text-[11px]">Google Maps Locations:</div>
                      <div className="flex flex-wrap gap-2">
                        {groundingResult.places?.map((place: any, i: number) => (
                          <a
                            key={i}
                            href={place.maps?.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300"
                          >
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                            <span>{place.maps?.title || 'Open Location in Google Maps'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
