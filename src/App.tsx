import React, { useState, useEffect } from 'react';
import { initialELCData } from './data/initialData';
import { ELCData } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MatchPreviewShowcase } from './components/MatchPreviewShowcase';
import { CompetitiveFormatSection } from './components/CompetitiveFormatSection';
import { StatsSection } from './components/StatsSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { CalendarTimeline } from './components/CalendarTimeline';
import { HomeVideosTeaser } from './components/HomeVideosTeaser';
import { CtaBanner } from './components/CtaBanner';
import { MobaTournamentBracket } from './components/MobaTournamentBracket';
import { TpsRosterLeaderboard } from './components/TpsRosterLeaderboard';
import { RegulationsModal } from './components/RegulationsModal';
import { DataManagementModal } from './components/DataManagementModal';
import { PagePantheon } from './components/PagePantheon';
import { PageJoueurs } from './components/PageJoueurs';
import { PageVideos } from './components/PageVideos';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { Trophy, Swords, Target, Crosshair, Users, ChevronRight, FileCheck, ExternalLink } from 'lucide-react';

export function App() {
  const [data, setData] = useState<ELCData>(initialELCData);
  const [activeSection, setActiveSection] = useState<string>('accueil');
  const [selectedGame, setSelectedGame] = useState<'hok' | 'mlbb' | 'pubgm' | 'ff'>('hok');
  const [isRegulationsOpen, setIsRegulationsOpen] = useState<boolean>(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  // Fetch initial data from backend API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((remoteData) => {
        if (isMounted && remoteData && remoteData.meta) {
          setData(remoteData);
        }
      })
      .catch((err) => {
        console.warn('Backend unavailable, using bundled initial data:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingApi(false);
      });

    // Discreet admin access for league managers (no public UI buttons)
    const checkAdminQuery = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=1') ||
        window.location.search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
      }
    };
    checkAdminQuery();
    window.addEventListener('hashchange', checkAdminQuery);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('hashchange', checkAdminQuery);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectGame = (gameId: 'hok' | 'mlbb' | 'pubgm' | 'ff') => {
    setSelectedGame(gameId);
    setActiveSection('classements');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetData = () => {
    setData(initialELCData);
  };

  const handleUpdateData = (newData: ELCData) => {
    setData(newData);
  };

  const handleUpdateVideos = (newVideos: any[]) => {
    setData((prev) => ({
      ...prev,
      videos: newVideos,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col selection:bg-teal-500 selection:text-black font-sans">
      {/* Global Header */}
      <Header
        data={data}
        onOpenRegulations={() => setIsRegulationsOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* PAGE 1: ACCUEIL */}
        {activeSection === 'accueil' && (
          <div>
            {/* Hero Section */}
            <Hero
              data={data}
              onSelectSection={(sec) => {
                if (sec === 'disciplines') setActiveSection('competition');
                else if (sec === 'calendar') setActiveSection('competition');
                else if (sec === 'tournaments') setActiveSection('classements');
                else setActiveSection(sec);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRegulations={() => setIsRegulationsOpen(true)}
            />

            {/* Live Match Preview Ticker Widget */}
            <MatchPreviewShowcase />

            {/* Competitive Format & Baremes */}
            <CompetitiveFormatSection data={data} />

            {/* Scale & Community Statistics */}
            <StatsSection />

            {/* Official Disciplines with tabs */}
            <DisciplinesSection
              data={data}
              onSelectGame={handleSelectGame}
            />

            {/* Calendar & Roadmap Preview */}
            <CalendarTimeline data={data} />

            {/* Videos & Media Showcase Preview */}
            <HomeVideosTeaser
              data={data}
              onNavigateToVideos={() => {
                setActiveSection('videos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Bottom Call to Action Banner */}
            <CtaBanner
              data={data}
              onOpenRegister={() => {
                if (data.meta.googleFormUrl) {
                  window.open(data.meta.googleFormUrl, '_blank');
                } else {
                  setActiveSection('joueurs');
                }
              }}
            />
          </div>
        )}

        {/* PAGE 2: COMPETITION & CALENDRIER */}
        {activeSection === 'competition' && (
          <div className="py-8 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25 inline-block mb-3">
                    Structure & Roadmap
                  </span>
                  <h1 className="font-audiowide text-3xl sm:text-4xl font-normal text-white mb-2">
                    Format de Compétition ELC 2027
                  </h1>
                  <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed font-light">
                    Toutes les informations sur le déroulement des 4 phases, les 4 titres homologués, 
                    les qualifications en ligne et le grand rassemblement en présentiel.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {data.meta.startGgUrl && (
                    <a
                      href={data.meta.startGgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                    >
                      <span>Voir le bracket sur start.gg</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setIsRegulationsOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-mono text-xs border border-white/[0.1] transition-colors cursor-pointer"
                  >
                    <span>Règlement FECASES</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Competitive Format & Baremes */}
            <CompetitiveFormatSection />

            <DisciplinesSection
              data={data}
              onSelectGame={handleSelectGame}
            />

            <CalendarTimeline data={data} />
          </div>
        )}

        {/* PAGE 3: CLASSEMENTS & BRACKETS */}
        {activeSection === 'classements' && (
          <section id="tournaments-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-400 tracking-wider uppercase mb-2">
                  <Trophy className="w-4 h-4" />
                  <span>ESPACE COMPÉTITIONS OFFICIELLES</span>
                </div>
                <h2 className="font-audiowide text-3xl sm:text-4xl font-normal text-white tracking-wide">
                  Tableaux des Rencontres & Classements
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/50 max-w-md font-light">
                Consultez l'avancement des arbres BO3 (Honor of Kings & Mobile Legends) ou le classement par manche des 32 joueurs de Battle Royale (PUBG Mobile & Free Fire).
              </p>
            </div>

            {/* Game Selector Tabs */}
            <div className="flex flex-wrap gap-2.5 p-1.5 rounded-2xl bg-[#141414] border border-white/[0.08] mb-8">
              <button
                id="tab-hok"
                onClick={() => setSelectedGame('hok')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedGame === 'hok'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>Honor of Kings (MOBA)</span>
              </button>

              <button
                id="tab-mlbb"
                onClick={() => setSelectedGame('mlbb')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedGame === 'mlbb'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-950/40'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Swords className="w-4 h-4 text-blue-400" />
                <span>Mobile Legends (MOBA)</span>
              </button>

              <button
                id="tab-pubgm"
                onClick={() => setSelectedGame('pubgm')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedGame === 'pubgm'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>PUBG Mobile (TPS)</span>
              </button>

              <button
                id="tab-ff"
                onClick={() => setSelectedGame('ff')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedGame === 'ff'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-lg shadow-orange-950/40'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Crosshair className="w-4 h-4 text-orange-400" />
                <span>Free Fire (TPS)</span>
              </button>
            </div>

            {/* Active Tournament View */}
            {selectedGame === 'hok' && (
              <MobaTournamentBracket
                key="hok"
                gameKey="hok"
                gameData={data.competition.hok}
                startGgUrl={data.meta.startGgUrl}
              />
            )}

            {selectedGame === 'mlbb' && (
              <MobaTournamentBracket
                key="mlbb"
                gameKey="mlbb"
                gameData={data.competition.mlbb}
              />
            )}

            {selectedGame === 'pubgm' && (
              <TpsRosterLeaderboard
                key="pubgm"
                gameKey="pubgm"
                gameData={data.competition.pubgm}
              />
            )}

            {selectedGame === 'ff' && (
              <TpsRosterLeaderboard
                key="ff"
                gameKey="ff"
                gameData={data.competition.ff}
              />
            )}
          </section>
        )}

        {/* PAGE 4: JOUEURS & ROSTERS */}
        {activeSection === 'joueurs' && (
          <PageJoueurs
            data={data}
            onSelectGame={handleSelectGame}
          />
        )}

        {/* PAGE 5: PANTHEON */}
        {activeSection === 'pantheon' && (
          <PagePantheon
            data={data}
          />
        )}

        {/* PAGE 6: VIDÉOS & MÉDIAS SHOWCASE */}
        {activeSection === 'videos' && (
          <PageVideos
            data={data}
            onUpdateVideos={handleUpdateVideos}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        data={data}
        onOpenRegulations={() => setIsRegulationsOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Regulations & FECASES Modal */}
      <RegulationsModal
        isOpen={isRegulationsOpen}
        onClose={() => setIsRegulationsOpen(false)}
        data={data}
      />

      {/* Data Management JSON Viewer & Export Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        data={data}
        onResetData={handleResetData}
      />

      {/* Full No-Code Admin Portal Modal */}
      {isAdminOpen && (
        <AdminPortal
          data={data}
          onUpdateData={handleUpdateData}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

