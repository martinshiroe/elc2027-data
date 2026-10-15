// Table des routes du site.
//
// Pas de dépendance ajoutée : une douzaine de routes plates ne justifient pas
// un routeur, et l'historique du navigateur suffit. `vercel.json` réécrit tout
// ce qui n'est pas `/api/` vers `index.html`, donc les liens directs
// fonctionnent.

export type Section =
  | 'page'
  | 'accueil'
  | 'apropos'
  | 'saison'
  | 'competition'
  | 'classements'
  | 'pantheon'
  | 'joueurs'
  | 'videos'
  | 'inscription'
  | 'contact'
  | 'introuvable';

interface Route {
  chemin: string;
  /** Repris dans le `<title>` et annoncé aux lecteurs d'écran au changement de vue. */
  titre: string;
  description: string;
}

export const ROUTES: Record<Section, Route> = {
  page: { chemin: '/pages', titre: 'Informations', description: 'Informations de la Ligue Esport Est Cameroun.' },
  accueil: {
    chemin: '/',
    titre: 'Accueil',
    description:
      "Ligue Régionale d'Esport de l'Est Cameroun — ELC, East League of Cameroon. Délégation régionale de la FECASES, basée à Bertoua.",
  },
  apropos: {
    chemin: '/a-propos',
    titre: 'À propos',
    description:
      "Mission, bureau exécutif, équipes et partenaires de la Ligue Régionale d'Esport de l'Est Cameroun.",
  },
  saison: {
    chemin: '/saison',
    titre: 'Saison news',
    description:
      "Actualités de la ligue, rankings par jeu et faits marquants : suivez l'ELC depuis Bertoua.",
  },
  competition: {
    chemin: '/calendrier',
    titre: 'Calendrier',
    description:
      'Les phases, les disciplines, les qualifications en ligne et les finales de la saison ELC 2027.',
  },
  classements: {
    chemin: '/classements',
    titre: 'Rankings',
    description:
      'Classements Honor of Kings, Mobile Legends, PUBG Mobile et Free Fire de la saison ELC 2027.',
  },
  pantheon: {
    chemin: '/hall-of-fame',
    titre: 'Hall of Fame',
    description:
      "Hall of Fame : les distinctions et les faits marquants de la Ligue Régionale d'Esport de l'Est Cameroun.",
  },
  joueurs: {
    chemin: '/joueurs',
    titre: 'Joueurs',
    description:
      'Les joueurs et équipes engagés dans les disciplines de la Ligue Esport Est Cameroun.',
  },
  videos: {
    chemin: '/videos',
    titre: 'Vidéos',
    description: "Replays, highlights et clips officiels de l'East League of Cameroon.",
  },
  inscription: {
    chemin: '/inscription',
    titre: 'Inscription',
    description:
      "Inscrivez votre équipe ou votre joueur pour la saison de l'East League of Cameroon.",
  },
  contact: {
    chemin: '/contact',
    titre: 'Contact',
    description:
      "Une question ou une envie de collaboration ? Écrivez à la Ligue Régionale d'Esport de l'Est Cameroun.",
  },
  introuvable: {
    chemin: '/404',
    titre: 'Page introuvable',
    description: "Cette page n'existe pas ou n'est plus accessible à cette adresse.",
  },
};

// Anciennes adresses, encore présentes dans des partages et des favoris.
// Elles mènent à la page qui les remplace plutôt qu'à la page 404.
const ALIAS: Record<string, Section> = {
  '/pantheon': 'pantheon',
  '/competition': 'competition',
  '/apropos': 'apropos',
  '/about': 'apropos',
};

const SECTIONS = Object.keys(ROUTES) as Section[];

/** Chemin d'une section, pour l'attribut `href` des liens de navigation. */
export function cheminDe(section: Section): string {
  return ROUTES[section].chemin;
}

/**
 * Section correspondant à une URL. Un chemin inconnu mène à la page 404 :
 * auparavant il retombait sur l'accueil, ce qui masquait les liens cassés.
 */
export function sectionDepuisChemin(chemin: string): Section {
  if (/^\/pages\/[^/]+\/?$/.test(chemin)) return 'page';
  const propre = chemin.replace(/\/+$/, '') || '/';
  return SECTIONS.find((s) => ROUTES[s].chemin === propre) ?? ALIAS[propre] ?? 'introuvable';
}
