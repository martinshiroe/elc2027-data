import React, { useState, useEffect, useRef } from 'react';
import { remonter } from './lib/scroll';
import { ROUTES, Section } from './lib/routes';
import { useRoute, jeuDepuisUrl } from './lib/useRoute';
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
import { PageInscription } from './components/PageInscription';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';
import { GameBadgeLogo } from './components/GameLogos';
import { Trophy, Swords, Target, Crosshair, Users, ChevronRight, FileCheck, ExternalLink, ImageIcon } from 'lucide-react';

export function App() {
  const [data, setData] = useState<ELCData>(initialELCData);

  // La vue affichée vient désormais de l'URL, et non d'un état local : le
  // bouton Retour, le partage de lien et l'indexation en dépendent.
  const { section: activeSection, jeu: jeuUrl, naviguer } = useRoute();
  const setActiveSection = naviguer;

  const [selectedGame, setSelectedGame] = useState<'hok' | 'mlbb' | 'pubgm' | 'ff'>(
    () => jeuDepuisUrl() ?? 'hok'
  );

  // Un Retour vers `/classements?jeu=pubgm` doit rouvrir l'onglet PUBG Mobile,
  // pas laisser celui qui était affiché avant.
  useEffect(() => {
    if (jeuUrl) setSelectedGame(jeuUrl);
  }, [jeuUrl]);
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

  // Synchronize document title and favicon with meta state
  useEffect(() => {
    if (data.meta) {
      // Un titre par vue : les sept pages partageaient le même, ce qui les
      // rendait indistinguables dans un onglet, un favori ou un résultat de
      // recherche.
      const nom = data.meta.competitionNom || 'ELC 2027';
      const route = ROUTES[activeSection];
      document.title =
        activeSection === 'accueil'
          ? `${nom} — ${data.meta.organisateur || 'East League of Cameroon'}`
          : `${route.titre} — ${nom}`;

      const meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
      if (meta) meta.content = route.description;

      if (data.meta.favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.type = 'image/png';
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = data.meta.favicon;
      }
    }
  }, [data.meta, activeSection]);

  // Annonce du changement de vue.
  //
  // Sans routage de page, rien ne signalait à un lecteur d'écran que le
  // contenu avait changé : le focus restait sur le lien cliqué et la nouvelle
  // vue passait inaperçue. On déplace donc le focus sur le contenu principal
  // et on annonce le nom de la vue dans une région live.
  const [annonce, setAnnonce] = useState<string>('');
  const premierRendu = useRef(true);

  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    setAnnonce(ROUTES[activeSection].titre);
    document.getElementById('contenu-principal')?.focus({ preventScroll: true });
  }, [activeSection]);

  const handleSelectGame = (gameId: 'hok' | 'mlbb' | 'pubgm' | 'ff') => {
    setSelectedGame(gameId);
    naviguer('classements', gameId);
    remonter();
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
      {/* Lien d'évitement. Sans lui, un utilisateur au clavier retraverse les
          sept entrées de navigation à chaque changement de vue. Invisible
          jusqu'au premier Tab, où il devient le premier élément atteint. */}
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-md focus:bg-[#14b8a6] focus:text-[#0e0e0e] focus:text-sm focus:font-medium"
      >
        Aller au contenu principal
      </a>

      {/* Région live : annonce la vue atteinte après une navigation. */}
      <div aria-live="polite" role="status" className="sr-only">
        {annonce}
      </div>

      {/* Global Header */}
      <Header
        data={data}
        onOpenRegulations={() => setIsRegulationsOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          remonter();
        }}
      />

      <main id="contenu-principal" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* PAGE 1: ACCUEIL */}
        {activeSection === 'accueil' && (
          <div>
            {/* Hero Section */}
            <Hero
              data={data}
              onSelectSection={(sec) => {
                setActiveSection(sec);
                remonter();
              }}
              onOpenRegulations={() => setIsRegulationsOpen(true)}
            />

            {/* Live Match Preview Ticker Widget */}
            <MatchPreviewShowcase />

            {/* Competitive Format & Baremes */}
            <CompetitiveFormatSection
              data={data}
              onOpenRegister={() => {
                setActiveSection('inscription');
                remonter();
              }}
            />

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
                remonter();
              }}
            />

            {/* Bottom Call to Action Banner */}
            <CtaBanner
              data={data}
              onOpenRegister={() => {
                setActiveSection('inscription');
                remonter();
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
            <CompetitiveFormatSection
              data={data}
              onOpenRegister={() => {
                setActiveSection('inscription');
                remonter();
              }}
            />

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
                {/* h1 et non h2 : c'est le titre de la vue. Les six autres
                    vues en ont un, celle-ci démarrait au niveau 2. */}
                <h1 className="font-audiowide text-3xl sm:text-4xl font-normal text-white tracking-wide">
                  Tableaux des Rencontres & Classements
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-white/50 max-w-md font-light">
                Consultez l'avancement des arbres BO3 (Honor of Kings & Mobile Legends) ou le classement par manche des 32 joueurs de Battle Royale (PUBG Mobile & Free Fire).
              </p>
            </div>

            {/* Game Selector Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-2 rounded-2xl bg-[#141414] border border-white/[0.08] mb-8">
              {/* Tab HOK */}
              <button
                id="tab-hok"
                onClick={() => setSelectedGame('hok')}
                title="Honor of Kings (MOBA)"
                className={`min-h-[64px] flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  selectedGame === 'hok'
                    ? 'bg-amber-500/20 border-2 border-amber-500/80 shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/30'
                    : 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <img
                  src={data.competition?.hok?.logoImage || '/img/logo-hok.svg'}
                  alt="Honor of Kings"
                  className="h-8 sm:h-9 max-w-[150px] w-auto object-contain"
                />
              </button>

              {/* Tab MLBB */}
              <button
                id="tab-mlbb"
                onClick={() => setSelectedGame('mlbb')}
                title="Mobile Legends: Bang Bang (MOBA)"
                className={`min-h-[64px] flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  selectedGame === 'mlbb'
                    ? 'bg-blue-500/20 border-2 border-blue-500/80 shadow-lg shadow-blue-950/60 ring-2 ring-blue-500/30'
                    : 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <img
                  src={data.competition?.mlbb?.logoImage || '/img/logo-mlbb.svg'}
                  alt="Mobile Legends"
                  className="h-8 sm:h-9 max-w-[150px] w-auto object-contain"
                />
              </button>

              {/* Tab PUBGM */}
              <button
                id="tab-pubgm"
                onClick={() => setSelectedGame('pubgm')}
                title="PUBG Mobile (TPS)"
                className={`min-h-[64px] flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  selectedGame === 'pubgm'
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/80 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/30'
                    : 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <img
                  src={data.competition?.pubgm?.logoImage || '/img/logo-pubgm.svg'}
                  alt="PUBG Mobile"
                  className="h-8 sm:h-9 max-w-[150px] w-auto object-contain"
                />
              </button>

              {/* Tab FF */}
              <button
                id="tab-ff"
                onClick={() => setSelectedGame('ff')}
                title="Free Fire (TPS)"
                className={`min-h-[64px] flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  selectedGame === 'ff'
                    ? 'bg-orange-500/20 border-2 border-orange-500/80 shadow-lg shadow-orange-950/60 ring-2 ring-orange-500/30'
                    : 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <img
                  src={data.competition?.ff?.logoImage || '/img/logo-ff.svg'}
                  alt="Free Fire"
                  className="h-8 sm:h-9 max-w-[150px] w-auto object-contain"
                />
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

        {/* PAGE 7: INSCRIPTION & GOOGLE FORM */}
        {activeSection === 'inscription' && (
          <PageInscription
            data={data}
            onOpenRegulations={() => setIsRegulationsOpen(true)}
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
          remonter();
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

      {/* PWA Install Prompt Banner */}
      <InstallPwaPrompt />
    </div>
  );
}

export default App;

