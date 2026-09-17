import React from 'react';
import { Trophy, Calendar, Swords, ExternalLink, ShieldCheck } from 'lucide-react';
import { ELCMobaGame } from '../types';
import { urlSure } from '../lib/urls';

interface MobaTournamentBracketProps {
  gameKey: 'hok' | 'mlbb';
  gameData: ELCMobaGame;
  startGgUrl?: string;
}

export const MobaTournamentBracket: React.FC<MobaTournamentBracketProps> = ({
  gameKey,
  gameData,
  startGgUrl,
}) => {
  const bracket = gameData.bracket || {
    equipes: [],
    quarts: [],
    demis: [],
    champion: ''
  };

  const teams = bracket.equipes || [];
  const quarts = bracket.quarts || Array(4).fill('');
  const demis = bracket.demis || Array(2).fill('');
  const champion = bracket.champion || '';

  return (
    <div id={`bracket-container-${gameKey}`} className="space-y-6">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Arbre Officiel Homologué · Vitrine ELC 2027
            </span>
            <span className="text-xs text-slate-400">
              Format BO3 · Qualifications Online
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Tableau Officiel des Équipes · {gameData.nom}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {startGgUrl && (
            <a
              href={urlSure(startGgUrl)}
              target="_blank"
              rel="noreferrer"
              id={`link-startgg-${gameKey}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-bold border border-red-800/60 transition-colors shadow-sm cursor-pointer"
              title="Voir l'arbre officiel en direct sur start.gg"
            >
              <span>Arbre officiel sur start.gg</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>
          )}
        </div>
      </div>

      {/* Bracket Visualizer Grid (Consultation Only) */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[860px] grid grid-cols-4 gap-4 items-stretch">
          
          {/* Column 1: Round of 16 (8 Matchups BO3) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 text-center">
              1. Huitièmes (BO3)
            </div>
            
            {Array.from({ length: 8 }).map((_, matchIdx) => {
              const team1Obj = teams[matchIdx * 2];
              const team2Obj = teams[matchIdx * 2 + 1];
              const team1Name = typeof team1Obj === 'string' ? team1Obj : (team1Obj?.nom || `Équipe ${matchIdx * 2 + 1}`);
              const team2Name = typeof team2Obj === 'string' ? team2Obj : (team2Obj?.nom || `Équipe ${matchIdx * 2 + 2}`);

              return (
                <div
                  key={matchIdx}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                    <span>MATCH {matchIdx + 1}</span>
                    <span className="text-slate-600">BO3</span>
                  </div>

                  {/* Team 1 */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-850 text-slate-200 text-xs font-medium">
                    <span className="truncate">{team1Name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-850 text-slate-200 text-xs font-medium">
                    <span className="truncate">{team2Name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Quarter Finals (4 Matchups) */}
          <div className="space-y-12 pt-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 text-center">
              2. Quarts de Finale
            </div>

            {Array.from({ length: 4 }).map((_, qfIdx) => {
              const team = quarts[qfIdx] || '';

              return (
                <div
                  key={qfIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md space-y-2"
                >
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">
                    QF {qfIdx + 1}
                  </div>
                  
                  {team ? (
                    <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      <span className="truncate">{team}</span>
                      <span className="text-[10px] text-amber-400 font-mono">Qualifié</span>
                    </div>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 text-[11px] text-slate-600 italic text-center">
                      En attente Huitièmes
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 3: Semi Finals (2 Matchups) */}
          <div className="space-y-36 pt-20">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 text-center">
              3. Demi-Finales
            </div>

            {Array.from({ length: 2 }).map((_, semiIdx) => {
              const team = demis[semiIdx] || '';

              return (
                <div
                  key={semiIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md space-y-2"
                >
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                    DEMI {semiIdx + 1}
                  </div>

                  {team ? (
                    <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                      <span className="truncate">{team}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Finaliste</span>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 px-3 rounded-lg bg-slate-950/60 border border-dashed border-slate-800 text-[11px] text-slate-600 italic text-center">
                      En attente Quarts
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 4: Grand Final & Champion */}
          <div className="flex flex-col justify-center space-y-6 pt-16">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800 text-center">
              4. Grande Finale (Novembre 2027)
            </div>

            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                CHAMPION ELC 2027
              </div>

              {champion ? (
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-display text-lg font-extrabold tracking-wide">
                  🏆 {champion}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-dashed border-slate-800 text-xs text-slate-500 italic">
                  [ Vainqueur ELC 2027 ]
                </div>
              )}

              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Titre décerné lors de la Grande Finale conjointe en présentiel en Novembre 2027 avec transmission officielle à la FECASES.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & Scoring Rules reminder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="font-bold text-white mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Phases de la discipline {gameData.nom}</span>
          </div>
          <div className="space-y-1.5 text-slate-400">
            {gameData.calendrier.map((c, i) => (
              <div key={i} className="flex justify-between border-b border-slate-800/50 pb-1">
                <span className="text-slate-300">{c.phase}</span>
                <span className="font-semibold text-emerald-400">{c.periode} ({c.lieu})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
          <div className="font-bold text-white mb-2 flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Barème MOBA officiel</span>
          </div>
          <p className="text-slate-400 mb-3">
            Comptabilisation des points en phase de groupes :
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
              <div className="text-base font-bold text-emerald-400">+{gameData.bareme.victoire} pts</div>
              <div className="text-[10px] text-slate-400">Victoire</div>
            </div>
            <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
              <div className="text-base font-bold text-amber-400">+{gameData.bareme.nul} pt</div>
              <div className="text-[10px] text-slate-400">Match Nul</div>
            </div>
            <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
              <div className="text-base font-bold text-slate-400">{gameData.bareme.defaite} pt</div>
              <div className="text-[10px] text-slate-500">Défaite</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
