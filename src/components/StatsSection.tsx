import React from 'react';
import { NumberTicker } from './NumberTicker';

export const StatsSection: React.FC = () => {
  const stats = [
    { val: 4, label: 'Disciplines officielles', color: '#14b8a6' },
    { val: 2, label: 'Formats compétitifs', color: '#22c55e' },
    { val: 16, label: 'Équipes par discipline MOBA', color: '#3b82f6' },
    { val: 32, label: 'Joueurs par discipline TPS', color: '#f59e0b' },
    { val: 2027, label: 'Saison en cours', color: '#a78bfa' },
  ];

  return (
    <section className="bg-[#0f0f0f] py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Une compétition qui prend de l'ampleur
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-xl leading-relaxed">
            Chaque saison, l'ELC rassemble plus de joueurs, plus d'équipes, et des rencontres toujours plus serrées.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#151515] border border-white/[0.07] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-white/[0.15] transition-all group"
            >
              {/* Subtle top glow gradient */}
              <div
                className="absolute top-0 left-0 right-0 h-20 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity"
                style={{
                  background: `linear-gradient(to bottom, ${s.color}33, transparent)`,
                }}
              />

              <div
                className="font-mono text-4xl sm:text-5xl font-bold tracking-tight mb-3"
                style={{ color: s.color }}
              >
                <NumberTicker value={s.val} />
              </div>

              <div className="text-sm text-white/60 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
