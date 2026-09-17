import React, { useState } from 'react';
import { Swords, Target, Calendar, Smartphone, Users, ChevronRight, Shield, Flame } from 'lucide-react';
import { ELCData, ELCTitre } from '../types';

interface DisciplinesSectionProps {
  data: ELCData;
  onSelectGame: (gameId: 'hok' | 'mlbb' | 'pubgm' | 'ff') => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ data, onSelectGame }) => {
  const { visual1, competition } = data;
  const [activeTab, setActiveTab] = useState<'all' | 'hok' | 'mlbb' | 'pubgm' | 'ff'>('all');

  const getGameImage = (id: string) => {
    switch (id) {
      case 'hok':
        return competition.hok.heroImage;
      case 'mlbb':
        return competition.mlbb.heroImage;
      case 'pubgm':
        return competition.pubgm.heroImage;
      case 'ff':
        return competition.ff.heroImage;
      default:
        return '';
    }
  };

  const getGameColor = (id: string) => {
    switch (id) {
      case 'hok':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/60',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          accent: 'text-amber-400',
          gradient: 'from-amber-500/10 to-transparent'
        };
      case 'mlbb':
        return {
          border: 'border-blue-500/30 hover:border-blue-500/60',
          badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          accent: 'text-blue-400',
          gradient: 'from-blue-500/10 to-transparent'
        };
      case 'pubgm':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400',
          gradient: 'from-emerald-500/10 to-transparent'
        };
      case 'ff':
        return {
          border: 'border-orange-500/30 hover:border-orange-500/60',
          badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
          accent: 'text-orange-400',
          gradient: 'from-orange-500/10 to-transparent'
        };
      default:
        return {
          border: 'border-white/[0.08]',
          badge: 'bg-white/10 text-white/80 border-white/20',
          accent: 'text-white',
          gradient: 'from-white/5 to-transparent'
        };
    }
  };

  const displayedTitres = visual1.titres.filter(t => activeTab === 'all' || t.id === activeTab);

  return (
    <section id="disciplines-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="font-mono text-[11px] text-teal-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            {visual1.sousTitreCentral || 'Quatre titres homologués'}
          </div>
          <h2 className="font-audiowide text-3xl sm:text-4xl font-normal text-white tracking-wide">
            {visual1.titreCentral || 'Disciplines officielles'}
          </h2>
          <p className="text-sm sm:text-base text-white/50 mt-2 max-w-xl font-light">
            Quatre jeux, deux genres, un seul objectif : dominer la compétition.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-white/[0.08] rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Tous (4)
          </button>
          <button
            onClick={() => setActiveTab('hok')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hok'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Honor of Kings
          </button>
          <button
            onClick={() => setActiveTab('mlbb')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mlbb'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            MLBB
          </button>
          <button
            onClick={() => setActiveTab('pubgm')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pubgm'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            PUBG Mobile
          </button>
          <button
            onClick={() => setActiveTab('ff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ff'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Free Fire
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedTitres.map((titre: ELCTitre) => {
          const styling = getGameColor(titre.id);
          const bgImg = getGameImage(titre.id);

          return (
            <div
              key={titre.id}
              id={`card-game-${titre.id}`}
              className={`group relative rounded-2xl bg-[#131313] border ${styling.border} overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                {bgImg ? (
                  <img
                    src={bgImg}
                    alt={titre.nom}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <Target className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent" />
                
                {/* Category & Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-white/80 border border-white/10">
                    {titre.discipline}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase border backdrop-blur-md ${styling.badge}`}>
                    {titre.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-audiowide text-lg text-white mb-1.5 group-hover:text-teal-300 transition-colors">
                    {titre.nom}
                  </h3>
                  <p className="text-xs text-white/50 mb-5 line-clamp-2 font-light">
                    {titre.sousTitre}
                  </p>

                  <div className="space-y-2.5 py-3 border-t border-white/[0.06] text-xs">
                    <div className="flex items-center justify-between text-white/60 font-mono">
                      <span className="text-white/55 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/55" />
                        Lancement :
                      </span>
                      <span className="font-semibold text-white">{titre.lancement}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/60 font-mono">
                      <span className="text-white/55 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-white/55" />
                        Plateforme :
                      </span>
                      <span className="font-semibold text-teal-400">{titre.plateforme}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/60 font-mono">
                      <span className="text-white/55 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-white/55" />
                        Format :
                      </span>
                      <span className="text-white/80">
                        {titre.id === 'hok' || titre.id === 'mlbb' ? '16 Teams (BO3)' : '32 Joueurs Battle Royale'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectGame(titre.id as 'hok' | 'mlbb' | 'pubgm' | 'ff')}
                  id={`btn-inspect-${titre.id}`}
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-teal-500 hover:text-black text-white/80 text-xs font-mono font-medium border border-white/[0.08] hover:border-teal-500 transition-all cursor-pointer group/btn"
                >
                  <span>Voir le tournoi</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DisciplinesSection;
