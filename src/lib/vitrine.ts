import type { ELCData } from '../types';

/** Tournois officiels identifiés depuis les invitations fournies par la ligue. */
export function inscriptionChallengermode(jeu: string): string | null {
  const ids: Record<string, string> = {
    hok: '2c12729a-7bcc-4eb9-e4bc-08df3e4c1535',
    mlbb: '9ae20484-421e-45c3-e4c2-08df3e4c1535',
  };
  return ids[jeu] ? `https://www.challengermode.com/s/EastLeagueCameroon/tournaments/${ids[jeu]}` : null;
}

/** One-time migration of the old CMS calendar. Subsequent admin edits win. */
function preparerHok(data: ELCData): ELCData {
  if (data.meta.calendrierHokVersion === 1) return data;
  const calendrier = [
    { phase: 'Ouverture des inscriptions', periode: '16 novembre 2026 à 08 h 00', lieu: 'UTC+1' },
    { phase: 'Début du tournoi', periode: '11 janvier 2027 à 09 h 12', lieu: 'UTC+1' },
    { phase: 'Clôture des inscriptions', periode: '6 février 2027 à 23 h 30', lieu: 'UTC+1' },
  ];
  return {
    ...data,
    meta: { ...data.meta, calendrierHokVersion: 1 },
    competition: { ...data.competition, hok: { ...data.competition.hok, calendrier } },
    visual1: { ...data.visual1, titres: data.visual1.titres.map(t => t.id === 'hok' ? { ...t, lancement: '11 janvier 2027' } : t) },
    visual2: {
      ...data.visual2,
      calendrierLabel: 'Honor of Kings · Calendrier confirmé',
      calendrierPeriode: 'Novembre 2026 – Février 2027',
      phases: [
        ...calendrier.map(c => ({ titre: c.phase, sousTitre: 'Honor of Kings · Heure du Cameroun (UTC+1)', periode: c.periode, tag: 'HONOR OF KINGS' })),
        { titre: 'Les autres titres', sousTitre: 'Retrouvez les annonces et le calendrier prévisionnel de chaque jeu.', periode: 'Saison 2027', tag: '' },
      ],
    },
  };
}

export function preparerVitrine(source: ELCData): ELCData {
  const data = preparerHok(source);
  if (data.meta.calendrierMobaVersion === 1) return data;
  return {
    ...data,
    meta: { ...data.meta, calendrierMobaVersion: 1 },
    competition: { ...data.competition, mlbb: { ...data.competition.mlbb, calendrier: [
      { phase: 'Ouverture des inscriptions', periode: '16 novembre 2026 à 08 h 30', lieu: 'UTC+1' },
      { phase: 'Début du tournoi', periode: '30 janvier 2027 à 20 h 30', lieu: 'UTC+1' },
      { phase: 'Clôture des inscriptions', periode: '14 février 2027 à 23 h 30', lieu: 'UTC+1' },
    ] } },
    visual1: { ...data.visual1, titres: data.visual1.titres.map(t => {
      if (t.id === 'hok') return { ...t, badge: '8 ÉQUIPES', format: '5 contre 5 + 2 remplaçants', dotation: '250 000 FCFA' };
      if (t.id === 'mlbb') return { ...t, badge: '8 ÉQUIPES', lancement: '30 janvier 2027', format: '5 contre 5', dotation: '250 000 FCFA' };
      return t;
    }) },
    visual2: { ...data.visual2,
      calendrierLabel: 'Honor of Kings & Mobile Legends · Calendrier confirmé',
      phases: [
        { titre: 'Ouverture des inscriptions', periode: '16 novembre 2026', sousTitre: 'Honor of Kings : 08 h 00 · Mobile Legends : 08 h 30 (UTC+1).', tag: '' },
        { titre: 'Lancement Honor of Kings', periode: '11 janvier 2027 à 09 h 12', sousTitre: '8 équipes · 5 contre 5 + 2 remplaçants · Heure du Cameroun (UTC+1).', tag: '' },
        { titre: 'Lancement Mobile Legends', periode: '30 janvier 2027 à 20 h 30', sousTitre: '8 équipes · 5 contre 5 · Heure du Cameroun (UTC+1).', tag: '' },
        { titre: 'Clôture des inscriptions', periode: 'Février 2027', sousTitre: 'Honor of Kings : 6 février à 23 h 30 · Mobile Legends : 14 février à 23 h 30 (UTC+1).', tag: 'LES DEUX JEUX' },
      ],
    },
  };
}

/** Never substitute an unrelated tournament platform or a guessed ELC space. */
export function lienChallengermode(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (url.hostname !== 'challengermode.com' && url.hostname !== 'www.challengermode.com') return null;
    return url.href;
  } catch {
    return null;
  }
}
