import React, { useState } from 'react';
import { Target, Search, Crosshair, Award, Plus, RefreshCw, Trophy, Edit2, Check } from 'lucide-react';
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
  const [players, setPlayers] = useState<ELCTpsPlayer[]>(() => {
    return gameData.roster.map((p, idx) => ({
      ...p,
      scoreTotal: p.scoreTotal ?? (idx === 0 ? 32 : idx === 1 ? 26 : idx === 2 ? 21 : 0),
      kills: p.kills ?? (idx === 0 ? 12 : idx === 1 ? 9 : idx === 2 ? 6 : 0)
    }));
  });

  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Simulator state
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [simPlacement, setSimPlacement] = useState<number>(1);
  const [simKills, setSimKills] = useState<number>(3);

  const bareme = gameData.bareme;

  const calculatePoints = (placement: number, kills: number): number => {
    let placePoints = 0;
    if (placement >= 1 && placement <= bareme.places.length) {
      placePoints = bareme.places[placement - 1];
    }
    const killPoints = kills * bareme.elimination;
    return placePoints + killPoints;
  };

  const handleApplySimulation = () => {
    const pts = calculatePoints(simPlacement, simKills);
    setPlayers(prev =>
      prev.map(p => {
        if (p.id === selectedPlayerId) {
          return {
            ...p,
            scoreTotal: (p.scoreTotal || 0) + pts,
            kills: (p.kills || 0) + simKills
          };
        }
        return p;
      })
    );
  };

  const handleResetPoints = () => {
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        scoreTotal: 0,
        kills: 0
      }))
    );
  };

  const handleSavePlayerName = (id: string) => {
    if (!editName.trim()) {
      setEditingPlayerId(null);
      return;
    }
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, nom: editName.trim() } : p))
    );
    setEditingPlayerId(null);
  };

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
              Roster & Classement Officiel
            </span>
            <span className="text-xs text-slate-400">
              32 Compétiteurs Qualifiés · Mode Individuel
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            {gameData.nom} · Classement Général & Simulateur
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPoints}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser les scores</span>
          </button>
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

      {/* Simulator Card & Quick Scoring */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Crosshair className="w-4 h-4 text-amber-400" />
            <span>Simulateur de Manche / Ajout de Score</span>
          </div>
          <span className="text-xs text-slate-400">Calcul automatique selon barème ELC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Compétiteur
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {sortedPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom} ({p.scoreTotal || 0} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Position finale (1-32)
            </label>
            <input
              type="number"
              min={1}
              max={32}
              value={simPlacement}
              onChange={(e) => setSimPlacement(Math.max(1, Math.min(32, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Éliminations (Kills)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={simKills}
              onChange={(e) => setSimKills(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <button
              onClick={handleApplySimulation}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                Valider (+{calculatePoints(simPlacement, simKills)} pts)
              </span>
            </button>
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
                <th className="py-2.5 px-4 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredPlayers.map((player, rankIdx) => {
                const isEditing = editingPlayerId === player.id;
                const isTop3 = rankIdx < 3;

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
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-800 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePlayerName(player.id)}
                            className="p-1 rounded bg-emerald-600 text-white cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {player.nom}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({player.id})
                          </span>
                        </div>
                      )}
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

                    {/* Edit button */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditingPlayerId(player.id);
                          setEditName(player.nom);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        title="Renommer le joueur"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
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
