import React, { useState } from 'react';
import { Sparkles, Gamepad2, ShieldAlert, KeyRound, Bot, Award, Check } from 'lucide-react';

interface DevashtraJuniorProps {
  onJoinWaitlist: () => void;
}

export const DevashtraJuniorSection: React.FC<DevashtraJuniorProps> = ({ onJoinWaitlist }) => {
  // Interactive mini Caesar cipher decoder game for kids
  const [shiftInput, setShiftInput] = useState<number>(3);
  const encodedWord = 'KHOOR'; // "HELLO" shifted by 3

  const decodeWord = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        }
        return char;
      })
      .join('');
  };

  const currentDecoded = decodeWord(encodedWord, shiftInput);
  const isSolved = currentDecoded === 'HELLO';

  return (
    <section id="junior" className="py-24 border-t border-slate-800/80 bg-gradient-to-b from-[#070c18] via-[#091122] to-[#070c18]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Ages 6 to 12 Special Track</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-balance">
              Devashtra Junior:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Where Young Minds Become Digital Creators
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Coding isn&apos;t just memorizing syntax; it&apos;s supercharging problem-solving and critical thinking. Through story-driven space missions, cyber-safety puzzles, and kid-safe AI play, children master computational logic naturally.
            </p>
          </div>

          <button
            onClick={onJoinWaitlist}
            className="px-5 py-3 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto whitespace-nowrap shrink-0"
          >
            Enroll in Junior Cohort
          </button>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pillar 1: Story-Based Missions */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Story-Driven Space Missions
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Kids command space rovers, rescue satellites, and navigate virtual labyrinths using Python statements and block logic. Every victory earns XP and mission badges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs text-amber-300 font-medium">
              Mission 1: The Mars Rover Reboot
            </div>
          </div>

          {/* Pillar 2: Cyber-Safety & Ciphers */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Cyber-Safety &amp; Password Shields
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We teach kids to be safe digital citizens: spotting phishing traps, cracking secret codes, and designing unbreakable passphrases through interactive escape rooms.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs text-amber-300 font-medium">
              Certified Cyber Defender Badge
            </div>
          </div>

          {/* Pillar 3: AI for Kids Mini-Bot */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                AI Explained for Kids
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Children train a friendly AI companion by giving it examples, learning firsthand how pattern recognition, computer vision, and machine learning models actually think.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs text-amber-300 font-medium">
              100% Safe, Moderated &amp; Private
            </div>
          </div>
        </div>

        {/* Interactive Cyber Puzzle Demo Box */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#0a1222] p-8 max-w-4xl mx-auto shadow-2xl shadow-amber-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-5 w-5 text-amber-400" />
              <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                Interactive Junior Challenge: Crack the Secret Secret Cipher
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md self-start sm:self-auto">
              Level 1 Puzzle
            </span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm mb-6">
            An encrypted radio transmission was intercepted: <strong className="text-amber-300 font-mono text-sm">{encodedWord}</strong>. Rotate the secret dial to find the Caesar cipher key that reveals the secret message!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Control */}
            <div className="space-y-2">
              <label htmlFor="shift-dial" className="block text-xs font-mono text-slate-400">
                Shift Key Dial: <span className="text-amber-400 font-bold tabular-nums">{shiftInput}</span>
              </label>
              <input
                id="shift-dial"
                type="range"
                min="0"
                max="10"
                value={shiftInput}
                onChange={(e) => setShiftInput(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0</span>
                <span>3 (Hint)</span>
                <span>10</span>
              </div>
            </div>

            {/* Decoded Output */}
            <div className="sm:col-span-2 rounded-xl border border-slate-800 bg-[#05080f] p-4 font-mono text-center">
              <div className="text-[11px] text-slate-500 mb-1">Decrypted Transmission:</div>
              <div className="text-2xl font-bold tracking-widest text-white my-1">
                {currentDecoded}
              </div>
              {isSolved ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/50 mt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Mission Accomplished! You decoded &quot;HELLO&quot; (+50 XP)</span>
                </div>
              ) : (
                <div className="text-xs text-amber-400/80 mt-1">
                  Rotate the dial until the letters form a real greeting!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
