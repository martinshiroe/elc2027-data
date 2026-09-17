// Table des routes du site.
//
// Le site s'affichait entièrement à `/` : sept vues pilotées par un
// `useState`, donc aucune page partageable, un bouton Retour qui faisait
// sortir du site, et une seule page indexée par Google. Pour une ligue dont
// l'audience arrive par Facebook, TikTok et WhatsApp, c'est le défaut le plus
// coûteux du site.
//
// Pas de dépendance ajoutée : sept routes plates ne justifient pas un routeur,
// et l'historique du navigateur suffit. `vercel.json` réécrit déjà tout ce qui
// n'est pas `/api/` vers `index.html`, donc les liens directs fonctionnent.

export type Section =
  | 'accueil'
  | 'competition'
  | 'classements'
  | 'joueurs'
  | 'pantheon'
  | 'videos'
  | 'inscription';

interface Route {
  chemin: string;
  /** Repris dans le `<title>` et annoncé aux lecteurs d'écran au changement de vue. */
  titre: string;
  description: string;
}

export const ROUTES: Record<Section, Route> = {
  accueil: {
    chemin: '/',
    titre: 'Accueil',
    description:
      'Compétition esport Honor of Kings, Mobile Legends, PUBG Mobile et Free Fire — saison 2027 de la Ligue Esport Est Cameroun.',
  },
  competition: {
    chemin: '/competition',
    titre: 'Format de compétition',
    description:
      'Les quatre phases, les quatre titres homologués, les qualifications en ligne et les finales en présentiel de la saison 2027.',
  },
  classements: {
    chemin: '/classements',
    titre: 'Classements & brackets',
    description:
      'Arbres BO3 Honor of Kings et Mobile Legends, classements par manche des 32 joueurs PUBG Mobile et Free Fire.',
  },
  joueurs: {
    chemin: '/joueurs',
    titre: 'Joueurs & rosters',
    description:
      'Les joueurs et équipes engagés dans les quatre disciplines de la Ligue Esport Est Cameroun.',
  },
  pantheon: {
    chemin: '/pantheon',
    titre: 'Panthéon',
    description:
      'Les distinctions officielles de la saison 2027 de l’East League of Cameroon.',
  },
  videos: {
    chemin: '/videos',
    titre: 'Vidéos & médias',
    description:
      'Replays, highlights et clips officiels de l’East League of Cameroon 2027.',
  },
  inscription: {
    chemin: '/inscription',
    titre: 'Inscription',
    description:
      'Inscrivez votre équipe ou votre joueur pour la saison 2027 de l’East League of Cameroon.',
  },
};

const SECTIONS = Object.keys(ROUTES) as Section[];

/** Chemin d'une section, pour l'attribut `href` des liens de navigation. */
export function cheminDe(section: Section): string {
  return ROUTES[section].chemin;
}

/**
 * Section correspondant à une URL. Tout chemin inconnu retombe sur l'accueil
 * plutôt que d'afficher une page vide — la réécriture Vercel sert `index.html`
 * pour n'importe quelle URL, y compris les fautes de frappe et les vieux liens.
 */
export function sectionDepuisChemin(chemin: string): Section {
  const propre = chemin.replace(/\/+$/, '') || '/';
  return SECTIONS.find((s) => ROUTES[s].chemin === propre) ?? 'accueil';
}
