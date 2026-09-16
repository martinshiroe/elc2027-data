import React, { useState } from 'react';
import { Users, Search, ShieldCheck, User, Sparkles } from 'lucide-react';
import { ELCData, ELCJoueurProfil } from '../types';
import { GameBadgeLogo } from './GameLogos';

interface PageJoueursProps {
  data: ELCData;
  onSelectGame?: (gameId: 'hok' | 'mlbb' | 'pubgm' | 'ff') => void;
}

export const PageJoueurs: React.FC<PageJoueursProps> = ({ data, onSelectGame }) => {
  const [search, setSearch] = useState('');
  const [filterGame, setFilterGame] = useState<string>('all');

  // Extract players strictly from explicit registered list (no mock/test players)
  const allPlayers: ELCJoueurProfil[] = React.useMemo(() => {
    const list: ELCJoueurProfil[] = [];

    if (data.joueurs && data.joueurs.length > 0) {
      data.joueurs.forEach(j => {
        list.push({
          id: j.id || String(Math.random()),
          pseudo: j.pseudo || j.nom || 'Joueur',
          nomReel: j.nomReel,
          discipline: j.discipline || 'Esport',
          equipe: j.equipe,
          role: j.role,
          ville: j.ville,
          photo: j.photo,
          statut: j.statut || 'Inscrit',
          kills: j.kills,
          points: j.points
        });
      });
    }

    return list;
  }, [data]);

  const filteredList = allPlayers.filter(p => {
    const matchesSearch =
      p.pseudo.toLowerCase().includes(search.toLowerCase()) ||
      (p.equipe && p.equipe.toLowerCase().includes(search.toLowerCase())) ||
      (p.discipline && p.discipline.toLowerCase().includes(search.toLowerCase()));

    const matchesGame =
      filterGame === 'all' ||
      (filterGame === 'hok' && p.discipline === 'Honor of Kings') ||
      (filterGame === 'mlbb' && p.discipline === 'Mobile Legends') ||
      (filterGame === 'pubgm' && p.discipline === 'PUBG Mobile') ||
      (filterGame === 'ff' && p.discipline === 'Free Fire');

    return matchesSearch && matchesGame;
  });

  return (
    <div id="page-joueurs" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">
            <Users className="w-4 h-4" />
            <span>ANNUAIRE DES COMPÉTITEURS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Joueurs & Rosters ELC 2027
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Retrouvez l'ensemble des joueurs et équipes officiellement engagés dans les 4 disciplines de la Ligue Esport Est Cameroun.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterGame('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterGame === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Tous ({allPlayers.length})
          </button>

          <button
            onClick={() => setFilterGame('hok')}
            title="Honor of Kings"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterGame === 'hok'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {data.competition?.hok?.logoImage ? (
              <img src={data.competition.hok.logoImage} alt="HOK" className="h-4 w-auto max-w-[80px] object-contain" />
            ) : (
              <span className="font-mono text-[11px]">[ Image HOK ]</span>
            )}
          </button>

          <button
            onClick={() => setFilterGame('mlbb')}
            title="Mobile Legends"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterGame === 'mlbb'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {data.competition?.mlbb?.logoImage ? (
              <img src={data.competition.mlbb.logoImage} alt="MLBB" className="h-4 w-auto max-w-[80px] object-contain" />
            ) : (
              <span className="font-mono text-[11px]">[ Image MLBB ]</span>
            )}
          </button>

          <button
            onClick={() => setFilterGame('pubgm')}
            title="PUBG Mobile"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterGame === 'pubgm'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {data.competition?.pubgm?.logoImage ? (
              <img src={data.competition.pubgm.logoImage} alt="PUBGM" className="h-4 w-auto max-w-[80px] object-contain" />
            ) : (
              <span className="font-mono text-[11px]">[ Image PUBGM ]</span>
            )}
          </button>

          <button
            onClick={() => setFilterGame('ff')}
            title="Free Fire"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterGame === 'ff'
                ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-950/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {data.competition?.ff?.logoImage ? (
              <img src={data.competition.ff.logoImage} alt="FF" className="h-4 w-auto max-w-[80px] object-contain" />
            ) : (
              <span className="font-mono text-[11px]">[ Image FF ]</span>
            )}
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par pseudo ou équipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Players Grid or Empty Professional State */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredList.map((player) => (
            <div
              key={player.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    {player.discipline}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    {player.statut}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 group-hover:border-emerald-500/40 transition-colors">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.pseudo}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base text-white truncate group-hover:text-emerald-300 transition-colors">
                      {player.pseudo}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {player.equipe || player.role || 'Compétiteur'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                  {player.points !== undefined && (
                    <div className="flex justify-between text-slate-400">
                      <span>Points ELC :</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {player.points} pts
                      </span>
                    </div>
                  )}
                  {player.kills !== undefined && (
                    <div className="flex justify-between text-slate-400">
                      <span>Kills / Éliminations :</span>
                      <span className="font-mono text-amber-300">
                        {player.kills}
                      </span>
                    </div>
                  )}
                  {player.ville && (
                    <div className="flex justify-between text-slate-400">
                      <span>Zone :</span>
                      <span className="text-slate-300">{player.ville}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Homologué
                </span>
                <span className="font-mono text-[10px]">ID: {player.id.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 max-w-2xl mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">
            Aucun compétiteur enregistré pour l'instant
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
            La saison 2027 n'a pas encore débuté et les listes officielles des rosters et joueurs s'afficheront ici au fur et à mesure des validations par le comité de la ligue et la FECASES.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            <span>Statut : Inscriptions ouvertes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageJoueurs;
