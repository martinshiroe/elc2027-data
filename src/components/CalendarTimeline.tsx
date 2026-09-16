import React from 'react';
import { Calendar, CheckCircle2, Tv, Smartphone, ShieldCheck, Flame } from 'lucide-react';
import { ELCData, ELCPhase } from '../types';

interface CalendarTimelineProps {
  data: ELCData;
}

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ data }) => {
  const { visual2 } = data;

  return (
    <section id="calendar-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-850">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">
            <Calendar className="w-4 h-4" />
            <span>{visual2.calendrierLabel}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {visual2.calendrierPeriode}
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-md">
          {visual2.bandeauSousTitre}
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-12">
        {visual2.phases.map((phase: ELCPhase, index: number) => {
          const isFinal = Boolean(phase.tag && phase.tag.includes('PRÉSENTIEL'));

          return (
            <div
              key={index}
              id={`timeline-phase-${index + 1}`}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                isFinal
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 shadow-xl shadow-amber-950/30'
                  : 'bg-slate-900/80 border border-slate-800'
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                  isFinal
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}>
                  0{index + 1}
                </span>

                {isFinal ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {phase.tag}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 bg-slate-800/80 border border-slate-700/60">
                    ONLINE
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  {phase.periode}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  {phase.titre}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {phase.sousTitre}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phase officielle homologuée</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structural & Technical Conditions Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Plateformes Homologuées
              </div>
              <div className="text-sm font-medium text-slate-200">
                {visual2.plateformes}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Diffusion Régionale
              </div>
              <div className="text-sm font-medium text-slate-200">
                {visual2.diffusion} & réseaux partenaires
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Format d'arbitrage
              </div>
              <div className="text-sm font-medium text-slate-200">
                {visual2.structure.qualifsFinales} avec arbitres assermentés
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
