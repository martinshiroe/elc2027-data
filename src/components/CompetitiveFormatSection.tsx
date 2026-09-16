import React from 'react';
import { Trophy, Target, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { ELCData } from '../types';
import { initialELCData } from '../data/initialData';

interface CompetitiveFormatSectionProps {
  data?: ELCData;
  onOpenRegister?: () => void;
}

export const CompetitiveFormatSection: React.FC<CompetitiveFormatSectionProps> = ({
  data = initialELCData,
  onOpenRegister,
}) => {
  const mobaBareme = data.competition.hok.bareme;
  const tpsPlaces = data.competition.pubgm.bareme.places || [15, 12, 10, 8, 6, 4, 2, 1];
  const tpsElim = data.competition.pubgm.bareme.elimination ?? 1;

  const mobaPoints = [
    { label: 'Victoire', pts: mobaBareme?.victoire ?? 3, note: 'Attribué à chaque manche remportée' },
    { label: 'Match nul', pts: mobaBareme?.nul ?? 1, note: 'Égalité en phase de poules' },
    { label: 'Défaite', pts: mobaBareme?.defaite ?? 0, note: '0 point comptabilisé' },
  ];

  return (
    <section id="format-competitif" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-mono text-teal-400 uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              Règles d'arbitrage officielles
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Format compétitif
            </h2>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8">
              Du barème à la remise des distinctions, chaque règle est transparente et appliquée sans exception — pour que le meilleur gagne, toujours.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-white block">Contrôle anti-triche & terminaux certifiés</span>
                  <span className="text-xs text-white/50">Smartphones personnels avec contrôle technique pré-match officiel FECASES.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-white block">Phases de poules en BO1 · Playoffs en BO3</span>
                  <span className="text-xs text-white/50">Formule éliminatoire directe et consolidation de classement en temps réel.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-white block">Grande Finale en présentiel à Bertoua</span>
                  <span className="text-xs text-white/50">Rassemblement des champions régionaux de l'Est en Novembre 2027.</span>
                </div>
              </div>
            </div>

            {data.meta.googleFormUrl ? (
              <a
                href={data.meta.googleFormUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm transition-all shadow-lg shadow-teal-950/40"
              >
                <span>S'inscrire à la compétition</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : onOpenRegister ? (
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm transition-all shadow-lg shadow-teal-950/40 cursor-pointer"
              >
                <span>S'inscrire à la compétition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Right Barèmes card matching Vercel version */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-b from-white/[0.07] to-transparent rounded-2xl border border-white/[0.08] p-6 sm:p-8 backdrop-blur-sm">
              <div className="font-mono text-xs text-teal-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-teal-400" />
                Barèmes officiels · Saison 2027
              </div>

              {/* MOBA Section */}
              <div className="mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3.5 py-2 mb-3 text-xs font-semibold text-blue-400 flex items-center justify-between">
                  <span>MOBA — Honor of Kings · Mobile Legends</span>
                  <span className="text-[10px] font-mono uppercase bg-blue-500/20 px-2 py-0.5 rounded">16 Équipes</span>
                </div>

                <div className="space-y-2">
                  {mobaPoints.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-white/[0.05] text-sm"
                    >
                      <span className="text-white/60 font-medium">{item.label}</span>
                      <span className="font-mono text-teal-400 font-bold">
                        {item.pts} pt{item.pts > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TPS Section */}
              <div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2 mb-3 text-xs font-semibold text-red-400 flex items-center justify-between">
                  <span>TPS Battle Royale — PUBG Mobile · Free Fire</span>
                  <span className="text-[10px] font-mono uppercase bg-red-500/20 px-2 py-0.5 rounded">32 Joueurs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {tpsPlaces.slice(0, 8).map((pts, idx) => (
                    <div
                      key={idx}
                      className="bg-black/40 border border-white/[0.06] rounded-lg p-2 text-center"
                    >
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        {idx === 0 ? 'Top 1' : `Top ${idx + 1}`}
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-400">
                        {pts} pts
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-sm">
                  <span className="text-white/70 font-medium flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-red-400" />
                    Chaque élimination (Kill)
                  </span>
                  <span className="font-mono text-teal-400 font-bold">
                    +{tpsElim} pt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
