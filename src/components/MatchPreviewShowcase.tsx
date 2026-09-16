import React, { useState, useEffect } from 'react';
import { Gamepad2, Swords, Timer, Zap } from 'lucide-react';

export const MatchPreviewShowcase: React.FC = () => {
  const [matchTime, setMatchTime] = useState('14:32');
  const [scoreA, setScoreA] = useState(12);
  const [scoreB, setScoreB] = useState(9);

  // Subtle live simulation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setScoreA(prev => (Math.random() > 0.8 ? prev + 1 : prev));
      setScoreB(prev => (Math.random() > 0.85 ? prev + 1 : prev));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { val: '4', lbl: 'Disciplines officielles', color: '#14b8a6' },
    { val: '2', lbl: 'Formats compétitifs', color: '#22c55e' },
    { val: '16', lbl: 'Équipes par MOBA', color: '#3b82f6' }
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16">
      <div className="bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-teal-400">
              Aperçu — East League of Cameroon
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Serveur Officiel Régional
            </span>
            <span className="hidden sm:inline">100% Mobile Online</span>
          </div>
        </div>

        {/* Match preview content */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main MOBA Match ticker */}
          <div className="md:col-span-3 bg-[#0e1528]/80 border border-teal-500/20 rounded-xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <Swords className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="font-mono text-[10px] sm:text-xs text-teal-400 uppercase tracking-widest block font-bold">
                  Exemple de match · MOBA
                </span>
                <span className="text-xs text-white/50">
                  Honor of Kings · Phase de groupes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8 font-medium">
              <div className="text-right">
                <div className="text-base sm:text-lg font-semibold text-white">Équipe A</div>
                <div className="text-xs text-emerald-400 font-mono font-bold">{scoreA} kills</div>
              </div>

              <div className="flex flex-col items-center px-3 py-1 rounded-lg bg-black/40 border border-teal-500/30">
                <span className="font-mono text-base sm:text-lg text-teal-400 font-bold tracking-wider">
                  VS
                </span>
                <span className="font-mono text-[10px] text-white/40 flex items-center gap-1">
                  <Timer className="w-3 h-3 text-teal-400/70" />
                  {matchTime}
                </span>
              </div>

              <div className="text-left">
                <div className="text-base sm:text-lg font-semibold text-white">Équipe B</div>
                <div className="text-xs text-amber-400 font-mono font-bold">{scoreB} kills</div>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#151515] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-5 transition-all flex flex-col justify-between"
            >
              <div
                className="font-mono text-3xl sm:text-4xl font-bold mb-2 tracking-tight"
                style={{ color: s.color }}
              >
                {s.val}
              </div>
              <div className="text-xs sm:text-sm text-white/60 font-medium">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
