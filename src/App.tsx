import React, { useState, useEffect, useRef, useCallback } from 'react';
import { remonter } from './lib/scroll';
import { ROUTES, Section } from './lib/routes';
import { useRoute } from './lib/useRoute';
import { initialELCData } from './data/initialData';
import { ELCData } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PageAccueil } from './components/PageAccueil';
import { PageAPropos } from './components/PageAPropos';
import { PageSaison } from './components/PageSaison';
import { PageCalendrier } from './components/PageCalendrier';
import { PageClassements } from './components/PageClassements';
import { PageHallOfFame } from './components/PageHallOfFame';
import { PageJoueurs } from './components/PageJoueurs';
import { PageVideos } from './components/PageVideos';
import { PageInscription } from './components/PageInscription';
import { PageContact } from './components/PageContact';
import { PageIntrouvable } from './components/PageIntrouvable';
import { RegulationsModal } from './components/RegulationsModal';
import { DataManagementModal } from './components/DataManagementModal';
import { AdminPortal } from './components/AdminPortal';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';
import { jeuxActifs } from './components/Blocs';

export function App() {
  const [data, setData] = useState<ELCData>(initialELCData);

  // La vue affichée vient de l'URL : le bouton Retour, le partage de lien et
  // l'indexation en dépendent.
  const { section, jeu, naviguer } = useRoute();

  const [isRegulationsOpen, setIsRegulationsOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Données du site : le contenu embarqué s'affiche aussitôt, puis la version
  // publiée par l'admin le remplace dès que l'API répond.
  useEffect(() => {
    let actif = true;
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((distant) => {
        if (actif && distant && distant.meta) setData(distant);
      })
      .catch((err) => {
        console.warn('API indisponible, données embarquées utilisées :', err);
      });

    // Accès discret au portail d'administration (aucun bouton public).
    const verifierAdmin = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=1') ||
        window.location.search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
      }
    };
    verifierAdmin();
    window.addEventListener('hashchange', verifierAdmin);

    const auClavier = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', auClavier);

    return () => {
      actif = false;
      window.removeEventListener('hashchange', verifierAdmin);
      window.removeEventListener('keydown', auClavier);
    };
  }, []);

  // Un titre et une description par page.
  useEffect(() => {
    const nom = 'Ligue Esport Est Cameroun';
    const route = ROUTES[section];
    document.title = section === 'accueil' ? `ELC — ${nom}` : `${route.titre} — ELC`;
    const meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (meta) meta.content = route.description;

    if (data.meta?.favicon) {
      let lien = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!lien) {
        lien = document.createElement('link');
        lien.rel = 'icon';
        document.head.appendChild(lien);
      }
      lien.href = data.meta.favicon;
    }
  }, [data.meta, section]);

  // Annonce du changement de page aux lecteurs d'écran, et focus sur le
  // contenu principal (sinon il reste sur le lien cliqué).
  const [annonce, setAnnonce] = useState('');
  const premierRendu = useRef(true);
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    setAnnonce(ROUTES[section].titre);
    document.getElementById('contenu-principal')?.focus({ preventScroll: true });
  }, [section]);

  // Changer d'onglet de ranking ne remonte pas en haut de page : la barre
  // d'onglets reste sous le pointeur.
  const allerA = useCallback(
    (cible: Section, jeuCible?: string) => {
      const memeVue = cible === section && cible === 'classements';
      naviguer(cible, jeuCible);
      if (!memeVue) remonter();
    },
    [naviguer, section]
  );

  const ouvrirReglement = useCallback(() => setIsRegulationsOpen(true), []);
  const fermerReglement = useCallback(() => setIsRegulationsOpen(false), []);
  const fermerDonnees = useCallback(() => setIsDataModalOpen(false), []);

  const page = (() => {
    switch (section) {
      case 'accueil':
        return <PageAccueil data={data} onNaviguer={allerA} />;
      case 'apropos':
        return <PageAPropos data={data} onNaviguer={allerA} />;
      case 'saison':
        return <PageSaison data={data} onNaviguer={allerA} />;
      case 'competition':
        return <PageCalendrier data={data} onNaviguer={allerA} onOpenRegulations={ouvrirReglement} />;
      case 'classements': {
        // Un lien vers le ranking d'une discipline désactivée mène au premier
        // ranking actif plutôt qu'à une page vide.
        const actifs = jeuxActifs(data);
        const jeuAffiche = actifs.find((j) => j.id === jeu)?.id ?? actifs[0]?.id;
        if (!jeuAffiche) return <PageSaison data={data} onNaviguer={allerA} />;
        return <PageClassements key={jeuAffiche} data={data} jeu={jeuAffiche} onNaviguer={allerA} />;
      }
      case 'pantheon':
        return <PageHallOfFame data={data} onNaviguer={allerA} />;
      case 'joueurs':
        return <PageJoueurs data={data} onNaviguer={allerA} />;
      case 'videos':
        return <PageVideos data={data} onNaviguer={allerA} />;
      case 'inscription':
        return <PageInscription data={data} onNaviguer={allerA} onOpenRegulations={ouvrirReglement} />;
      case 'contact':
        return <PageContact data={data} onNaviguer={allerA} />;
      default:
        return <PageIntrouvable onNaviguer={allerA} />;
    }
  })();

  return (
    <div className="relative flex min-h-screen flex-col bg-nuit text-texte selection:bg-magenta-plein selection:text-white">
      {/* Lien d'évitement : invisible jusqu'au premier Tab. */}
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-magenta-plein focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Aller au contenu principal
      </a>

      <div aria-live="polite" role="status" className="sr-only">
        {annonce}
      </div>

      <Header data={data} activeSection={section} onNaviguer={allerA} />

      <main id="contenu-principal" tabIndex={-1} className="flex-1 focus:outline-none">
        {page}
      </main>

      <Footer data={data} onOpenRegulations={ouvrirReglement} onNaviguer={allerA} />

      <RegulationsModal isOpen={isRegulationsOpen} onClose={fermerReglement} data={data} />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={fermerDonnees}
        data={data}
        onResetData={() => setData(initialELCData)}
      />

      {isAdminOpen && <AdminPortal data={data} onUpdateData={setData} onClose={() => setIsAdminOpen(false)} />}

      <InstallPwaPrompt />
    </div>
  );
}

export default App;
