import React, { useState } from 'react';
import { Trophy, RefreshCw, Edit2, Check, Shield, Award, Calendar, Swords, ExternalLink } from 'lucide-react';
import { ELCMobaGame } from '../types';

interface MobaTournamentBracketProps {
  gameKey: 'hok' | 'mlbb';
  gameData: ELCMobaGame;
  startGgUrl?: string;
  onUpdateGameBracket?: (updated: ELCMobaGame) => void;
}

export const MobaTournamentBracket: React.FC<MobaTournamentBracketProps> = ({
  gameKey,
  gameData,
  startGgUrl,
  onUpdateGameBracket
}) => {
  // Local bracket state allowing interactivity
  const [teams, setTeams] = useState<string[]>(
    gameData.bracket.equipes.map((t) => t.nom || 'Équipe')
  );
  const [quarts, setQuarts] = useState<string[]>(
    gameData.bracket.quarts.some(q => q) ? gameData.bracket.quarts : Array(4).fill('')
  );
  const [demis, setDemis] = useState<string[]>(
    gameData.bracket.demis.some(d => d) ? gameData.bracket.demis : Array(2).fill('')
  );
  const [champion, setChampion] = useState<string>(
    gameData.bracket.champion || ''
  );

  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const handleAdvanceToQuarter = (matchIndex: number, winningTeam: string) => {
    const nextQuarts = [...quarts];
    nextQuarts[matchIndex] = winningTeam;
    setQuarts(nextQuarts);

    // Also cascade reset any later rounds if that team changes
    if (matchIndex < 2 && demis[0] && !nextQuarts.slice(0, 2).includes(demis[0])) {
      const nextDemis = [...demis];
      nextDemis[0] = '';
      setDemis(nextDemis);
      if (champion === demis[0]) setChampion('');
    } else if (matchIndex >= 2 && demis[1] && !nextQuarts.slice(2, 4).includes(demis[1])) {
      const nextDemis = [...demis];
      nextDemis[1] = '';
      setDemis(nextDemis);
      if (champion === demis[1]) setChampion('');
    }
  };

  const handleAdvanceToSemi = (semiIndex: number, winningTeam: string) => {
    const nextDemis = [...demis];
    nextDemis[semiIndex] = winningTeam;
    setDemis(nextDemis);

    if (champion && !nextDemis.includes(champion)) {
      setChampion('');
    }
  };

  const handleSetChampion = (winningTeam: string) => {
    setChampion(winningTeam);
  };

  const handleReset = () => {
    setQuarts(Array(4).fill(''));
    setDemis(Array(2).fill(''));
    setChampion('');
  };

  const handleSaveTeamName = (index: number) => {
    if (!editingName.trim()) {
      setEditingTeamIndex(null);
      return;
    }
    const nextTeams = [...teams];
    const oldName = nextTeams[index];
    nextTeams[index] = editingName.trim();
    setTeams(nextTeams);

    // Update if already advanced
    setQuarts(quarts.map(q => q === oldName ? editingName.trim() : q));
    setDemis(demis.map(d => d === oldName ? editingName.trim() : d));
    if (champion === oldName) setChampion(editingName.trim());

    setEditingTeamIndex(null);
  };

  return (
    <div id={`bracket-container-${gameKey}`} className="space-y-6">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Arbre Officiel Homologué
            </span>
            <span className="text-xs text-slate-400">
              Format BO3 · Qualifications Online
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Tableau des 16 Équipes · {gameData.nom}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {startGgUrl && (
            <a
              href={startGgUrl}
              target="_blank"
              rel="noreferrer"
              id={`link-startgg-${gameKey}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-bold border border-red-800/60 transition-colors shadow-sm cursor-pointer"
              title="Voir l'arbre officiel en direct sur start.gg"
            >
              <span>Voir le bracket en direct sur start.gg</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="Réinitialiser l'arbre"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Bracket Visualizer Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[860px] grid grid-cols-4 gap-4 items-stretch">
          
          {/* Column 1: Round of 16 (8 Matchups BO3) */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 text-center">
              1. Huitièmes (BO3)
            </div>
            
            {Array.from({ length: 8 }).map((_, matchIdx) => {
              const team1 = teams[matchIdx * 2] || `Équipe ${matchIdx * 2 + 1}`;
              const team2 = teams[matchIdx * 2 + 1] || `Équipe ${matchIdx * 2 + 2}`;
              const qfIndex = Math.floor(matchIdx / 2);
              const isSelected1 = quarts[qfIndex] === team1;
              const isSelected2 = quarts[qfIndex] === team2;

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
                  <div className="flex items-center justify-between gap-1">
                    {editingTeamIndex === matchIdx * 2 ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full text-xs bg-slate-800 border border-emerald-500 rounded px-1.5 py-0.5 text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTeamName(matchIdx * 2)}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAdvanceToQuarter(qfIndex, team1)}
                          className={`flex-1 flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                            isSelected1
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                              : 'bg-slate-850 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="truncate max-w-[110px]">{team1}</span>
                          <span className="text-[10px] text-slate-400 ml-1">✓</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTeamIndex(matchIdx * 2);
                            setEditingName(team1);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                          title="Modifier le nom de l'équipe"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between gap-1">
                    {editingTeamIndex === matchIdx * 2 + 1 ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full text-xs bg-slate-800 border border-emerald-500 rounded px-1.5 py-0.5 text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTeamName(matchIdx * 2 + 1)}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAdvanceToQuarter(qfIndex, team2)}
                          className={`flex-1 flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                            isSelected2
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                              : 'bg-slate-850 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="truncate max-w-[110px]">{team2}</span>
                          <span className="text-[10px] text-slate-400 ml-1">✓</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTeamIndex(matchIdx * 2 + 1);
                            setEditingName(team2);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                          title="Modifier le nom de l'équipe"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
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
              const team = quarts[qfIdx];
              const semiIndex = Math.floor(qfIdx / 2);
              const isSelected = demis[semiIndex] === team && team !== '';

              return (
                <div
                  key={qfIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md space-y-2"
                >
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">
                    QF {qfIdx + 1}
                  </div>
                  
                  {team ? (
                    <button
                      onClick={() => handleAdvanceToSemi(semiIndex, team)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 hover:bg-slate-750 text-white'
                      }`}
                    >
                      <span className="truncate">{team}</span>
                      <span className="text-[10px] text-amber-400">Qualifié Demi</span>
                    </button>
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
              const team = demis[semiIdx];
              const isChamp = champion === team && team !== '';

              return (
                <div
                  key={semiIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md space-y-2"
                >
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                    DEMI {semiIdx + 1}
                  </div>

                  {team ? (
                    <button
                      onClick={() => handleSetChampion(team)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                        isChamp
                          ? 'bg-gradient-to-r from-amber-500/30 to-emerald-500/30 text-amber-300 border border-amber-400'
                          : 'bg-slate-800 hover:bg-slate-750 text-white'
                      }`}
                    >
                      <span className="truncate">{team}</span>
                      <span className="text-[10px] text-emerald-400">Vers Finale</span>
                    </button>
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
                <Trophy className="w-6 h-6 animate-pulse" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                CHAMPION ELC 2027
              </div>

              {champion ? (
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-display text-lg font-extrabold tracking-wide animate-bounce">
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
