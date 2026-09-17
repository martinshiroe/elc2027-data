import { useCallback, useEffect, useState } from 'react';
import { Section, cheminDe, sectionDepuisChemin } from './routes';

export type Jeu = 'hok' | 'mlbb' | 'pubgm' | 'ff';

/**
 * Navigation adossée à l'historique du navigateur.
 *
 * `naviguer()` remplace l'ancien `setActiveSection` : même signature côté
 * appelant, mais l'URL suit, donc le bouton Retour, le partage de lien et
 * l'ouverture dans un nouvel onglet fonctionnent enfin.
 */
export function useRoute(): {
  section: Section;
  jeu: Jeu | null;
  naviguer: (section: Section, jeu?: string) => void;
} {
  const [section, setSection] = useState<Section>(() =>
    typeof window === 'undefined' ? 'accueil' : sectionDepuisChemin(window.location.pathname)
  );
  // Suivi séparément de la section : un Retour vers `/classements?jeu=pubgm`
  // doit restaurer l'onglet du jeu, pas seulement la vue.
  const [jeu, setJeu] = useState<Jeu | null>(() => jeuDepuisUrl());

  // Retour / Suivant du navigateur.
  useEffect(() => {
    const auRetour = () => {
      setSection(sectionDepuisChemin(window.location.pathname));
      setJeu(jeuDepuisUrl());
    };
    window.addEventListener('popstate', auRetour);
    return () => window.removeEventListener('popstate', auRetour);
  }, []);

  const naviguer = useCallback((cible: Section, jeu?: string) => {
    // Le paramètre `jeu` rend partageable un bracket précis
    // (`/classements?jeu=hok`) plutôt que la seule page des classements.
    const url = jeu ? `${cheminDe(cible)}?jeu=${encodeURIComponent(jeu)}` : cheminDe(cible);

    // Même destination : on évite d'empiler une entrée d'historique, sinon un
    // clic répété sur l'onglet courant oblige à autant de Retour pour sortir.
    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', url);
    }
    setSection(cible);
    setJeu(jeuDepuisUrl());
  }, []);

  return { section, jeu, naviguer };
}

/** Jeu demandé dans l'URL (`?jeu=hok`), s'il est valide. */
export function jeuDepuisUrl(): Jeu | null {
  if (typeof window === 'undefined') return null;
  const jeu = new URLSearchParams(window.location.search).get('jeu');
  return jeu === 'hok' || jeu === 'mlbb' || jeu === 'pubgm' || jeu === 'ff' ? jeu : null;
}
