import React, { useState } from 'react';
import { Target, Search, Crosshair, Award, Trophy } from 'lucide-react';
import { ELCTpsGame, ELCTpsPlayer } from '../types';

interface TpsRosterLeaderboardProps {
  gameKey: 'pubgm' | 'ff';
  gameData: ELCTpsGame;
}

export const TpsRosterLeaderboard: React.FC<TpsRosterLeaderboardProps> = ({
  gameKey,
  gameData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const players: ELCTpsPlayer[] = React.useMemo(() => {
    return (gameData.roster || []).map((p, idx) => ({
      ...p,
      scoreTotal: p.scoreTotal ?? 0,
      kills: p.kills ?? 0
    }));
  }, [gameData]);

  const bareme = gameData.bareme;

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => (b.scoreTotal || 0) - (a.scoreTotal || 0));

  const filteredPlayers = sortedPlayers.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id={`tps-roster-${gameKey}`} className="space-y-6">
      {/* Overview & Quick Stats */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Roster & Classement Officiel · Vitrine ELC 2027
            </span>
            <span className="text-xs text-slate-400">
              32 Compétiteurs Qualifiés · Mode Individuel
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            {gameData.nom} · Classement Général Officiel
          </h3>
        </div>
      </div>

      {/* Barème & Points Rule Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
          <Award className="w-4 h-4" />
          <span>Barème Officiel des Points (ELC Battle Royale)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2 text-center text-xs">
          {bareme.places.map((pts, idx) => (
            <div key={idx} className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">
                {idx + 1}{idx === 0 ? 'er' : 'e'} Place
              </div>
              <div className="text-sm font-bold text-emerald-400">
                +{pts} pts
              </div>
            </div>
          ))}

          <div className="bg-slate-950/70 p-2 rounded-xl border border-amber-500/30">
            <div className="text-amber-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
              <Crosshair className="w-3 h-3" />
              1 Kill
            </div>
            <div className="text-sm font-bold text-amber-300">
              +{bareme.elimination} pt
            </div>
          </div>
        </div>
      </div>

      {/* Roster & Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Search header */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-sm text-white">
              Tableau des 32 Compétiteurs
            </span>
            <span className="text-xs text-slate-500">
              ({filteredPlayers.length} affichés)
            </span>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 w-16 text-center">Rang</th>
                <th className="py-2.5 px-4">Nom du Compétiteur</th>
                <th className="py-2.5 px-4 text-center">Éliminations</th>
                <th className="py-2.5 px-4 text-right">Points ELC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredPlayers.map((player, rankIdx) => {
                return (
                  <tr
                    key={player.id}
                    className={`hover:bg-slate-850/60 transition-colors ${
                      rankIdx === 0
                        ? 'bg-amber-500/5 font-medium'
                        : rankIdx === 1
                        ? 'bg-slate-400/5'
                        : rankIdx === 2
                        ? 'bg-amber-700/5'
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-4 text-center">
                      {rankIdx === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                          1
                        </span>
                      ) : rankIdx === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 font-bold text-xs border border-slate-400/30">
                          2
                        </span>
                      ) : rankIdx === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-bold text-xs border border-amber-700/40">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">
                          #{rankIdx + 1}
                        </span>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {player.nom}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({player.id})
                        </span>
                      </div>
                    </td>

                    {/* Kills */}
                    <td className="py-2.5 px-4 text-center font-mono text-slate-300">
                      {player.kills || 0}
                    </td>

                    {/* Score */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {player.scoreTotal || 0} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
