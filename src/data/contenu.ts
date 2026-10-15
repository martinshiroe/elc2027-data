// Textes par défaut des pages « À propos », « Saison news » et « Hall of Fame ».
//
// Repris de la maquette Figma « Ligue de l'Est » (octobre 2026). Chaque champ
// peut être remplacé par `data.contenu` : ce qui est saisi dans l'admin gagne,
// le reste retombe sur ces valeurs.

import type { ELCContenu, ELCData, ELCFaitMarquant } from '../types';

/** Contenu éditorial une fois complété : plus aucun champ manquant. */
export interface ContenuComplet {
  apropos: Required<NonNullable<ELCContenu['apropos']>>;
  saison: Required<NonNullable<ELCContenu['saison']>>;
  faitMarquant: ELCFaitMarquant;
}

export const CONTENU_PAR_DEFAUT: ContenuComplet = {
  apropos: {
    accroche: 'Une ligue régionale, une ambition nationale.',
    presentation: "Basée à Bertoua, l'ELC est la délégation régionale de la FECASES pour l'Est Cameroun.",
    piliers: [
      { titre: 'Mission', texte: 'Bâtir une scène esport crédible et durable, un jeu et un format à la fois.' },
      { titre: 'Vision', texte: 'Devenir la référence régionale de la compétition nationale FECASES.' },
      { titre: 'Objectif central', texte: 'Rétablir la confiance des joueurs envers les institutions esportives.' },
    ],
    activites: [
      { titre: 'Matchs custom', texte: 'Bi-mensuels · Bo3 ou Bo5 · Jeu tiré au sort.' },
      { titre: 'Diffusion', texte: 'Matchs en direct et vidéos des moments forts.' },
      { titre: 'Classements', texte: 'Suivi multi-disciplines des équipes et joueurs sur le portail.' },
    ],
    competition: {
      titre: 'Compétition ELC 2027',
      texte:
        'Programme à confirmer : Honor of Kings et Mobile Legends envisagés. Autres disciplines après validation.',
      projet: "Projet à venir : Gaming House à Bertoua (siège, centre d'entraînement, salle d'événements).",
    },
    dateBureau: '17 février 2026',
    bureau: [
      { nom: "Martin Abollo Oba'a", role: 'Président' },
      { nom: 'Bouba Karimoussa', role: 'Vice-président' },
      { nom: 'Danagai Honorine', role: 'Secrétaire générale' },
      { nom: 'Tata Moussa', role: 'Secrétaire financier' },
      { nom: 'Adama Chetima', role: 'Directeur technique' },
      { nom: 'Engolo Engolo Francis Michel', role: 'Conseiller administratif' },
    ],
    equipes: ['Kira Order (KO Squad)', 'AOD Squad', 'Gale Squad'],
    production: {
      titre: 'Production visuelle et streaming',
      texte: 'PaintArt Softwork (production visuelle) et Silverstorm (streamer officiel).',
    },
    partenaires: [
      { titre: 'FECASES', texte: 'Affiliation institutionnelle.' },
      { titre: 'Partenaires locaux', texte: 'Zone à compléter après accord écrit et fourniture des logos.' },
      { titre: 'Devenir partenaire', texte: "Contactez-nous pour discuter d'une collaboration." },
    ],
  },
  saison: {
    chapitre: {
      annee: '2027',
      statut: 'Programme à confirmer',
      texte: 'Honor of Kings et Mobile Legends envisagés. Autres disciplines après validation.',
    },
    actualites: [
      {
        rubrique: 'Compétition',
        titre: 'ELC 2027 : un programme en préparation.',
        texte:
          'Honor of Kings et Mobile Legends sont envisagés. Les autres disciplines seront annoncées après validation.',
        note: 'Programme, dates et calendrier à confirmer',
      },
      {
        rubrique: 'Matchs custom',
        titre: 'Des rendez-vous pour faire vivre la scène.',
        texte: 'Le format annoncé : matchs custom bi-mensuels, en Bo3 ou Bo5, avec un jeu tiré au sort.',
        note: 'Aucune date de rencontre validée à ce jour',
      },
      {
        rubrique: 'Diffusion',
        titre: 'Le jeu en direct. Les moments forts en vidéo.',
        texte:
          'La ligue prévoit la diffusion des matchs en direct et des vidéos des moments forts pour suivre la compétition.',
        note: 'Liens de diffusion officiels à fournir',
      },
      {
        rubrique: 'Projet à venir',
        titre: 'Une Gaming House à Bertoua.',
        texte:
          "Un projet de siège, de centre d'entraînement et de salle d'événements pour accompagner la scène régionale.",
        note: 'Projet à venir, non réalisé',
      },
    ],
  },
  faitMarquant: {
    publie: false,
    nom: 'KO Kira',
    surnom: 'The Destroyer',
    distinction: 'Double MVP, Gold Laner',
    description: 'Fait marquant : victoire 2-0 contre AOD Squad sans aucune tour concédée.',
    stats: [
      { valeur: '2–0', legende: 'Victoire contre AOD Squad' },
      { valeur: '0', legende: 'Tour concédée' },
    ],
    source:
      'Source : page About us. Jeu, date et tournoi non précisés. Ce fait marquant ne constitue pas un palmarès officiel ni une autorisation de publication publique.',
  },
};

/**
 * Prend la valeur saisie si elle existe, sinon le défaut. Un texte vide
 * retombe sur le défaut ; une liste vide, elle, est un choix : elle affiche
 * l'état « aucune présentation disponible » de la maquette.
 */
function choisir<T>(saisi: T | undefined, defaut: T): T {
  if (saisi === undefined || saisi === null) return defaut;
  if (typeof saisi === 'string' && saisi.trim() === '') return defaut;
  return saisi;
}

function fusionner<T extends object>(saisi: Partial<T> | undefined, defaut: T): T {
  // Les champs facultatifs (ex. photo du fait marquant) n'existent pas
  // forcément dans la maquette : conserver aussi les clés saisies.
  const resultat = { ...defaut, ...saisi };
  if (!saisi) return resultat;
  for (const cle of Object.keys(defaut) as (keyof T)[]) {
    resultat[cle] = choisir(saisi[cle] as T[keyof T] | undefined, defaut[cle]);
  }
  return resultat;
}

/** Contenu éditorial complet : la saisie de l'admin, complétée par la maquette. */
export function contenuDe(data: ELCData): ContenuComplet {
  const c = data.contenu ?? {};
  return {
    apropos: fusionner(c.apropos, CONTENU_PAR_DEFAUT.apropos),
    saison: fusionner(c.saison, CONTENU_PAR_DEFAUT.saison),
    faitMarquant: fusionner(c.faitMarquant, CONTENU_PAR_DEFAUT.faitMarquant),
  };
}
