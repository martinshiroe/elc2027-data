export interface ELCContact {
  telephone: string;
  email: string;
}

export interface ELCReseaux {
  youtube: string;
  facebook: string;
  whatsapp: string;
  tiktok?: string;
  instagram?: string;
  discord?: string;
  twitter?: string;
}

export interface ELCLiens {
  statuts: string;
  statutsTexte: string;
}

export interface ELCMeta {
  organisateur: string;
  competitionCode: string;
  competitionNom: string;
  saison: string;
  badgeHaut: string;
  derniereMaj: string;
  contact: ELCContact;
  reseaux: ELCReseaux;
  liens: ELCLiens;
  heroImage: string;
  ctaImage: string;
  videosBannerImage?: string;
  pantheonBannerImage?: string;
  inscriptionBannerImage?: string;
  /** Bandeau affiché au-dessus du bouton « Je m'inscris ». Vide = /img/bandeau-inscription.png. */
  formBannerImage?: string;
  googleFormUrl?: string;
  startGgUrl?: string;
  favicon?: string;
}

export interface ELCPantheonItem {
  id: string;
  nom: string;
  titre: string;
  discipline: string;
  annee: string;
  biographie: string;
  palmares?: string[];
  image?: string;
}

export interface ELCJoueurProfil {
  id: string;
  pseudo: string;
  nomReel?: string;
  discipline: string;
  equipe?: string;
  role?: string;
  ville?: string;
  photo?: string;
  statut?: string;
  kills?: number;
  points?: number;
}

export interface ELCTitre {
  id: string;
  discipline: string;
  badge: string;
  nom: string;
  sousTitre: string;
  lancement: string;
  plateforme: string;
}

export interface ELCVisual1 {
  footer: string;
  bandeau: string;
  titreCentral: string;
  sousTitreCentral: string;
  titres: ELCTitre[];
  footerGauche: string;
}

export interface ELCPhase {
  titre: string;
  sousTitre: string;
  periode: string;
  tag: string;
}

export interface ELCVisual2 {
  bandeauSousTitre: string;
  calendrierLabel: string;
  calendrierPeriode: string;
  phases: ELCPhase[];
  structure: {
    equipesMoba: string;
    joueursTps: string;
    qualifsFinales: string;
    cashPrize: string;
  };
  plateformes: string;
  diffusion: string;
}

export interface ELCVisual3 {
  sousTitre: string;
  badges: string[];
  pubg: {
    nom: string;
    lancementBadge: string;
    placesJoueurs: string;
    note: string;
  };
  ff: {
    nom: string;
    lancementBadge: string;
    placesJoueurs: string;
    note: string;
  };
  titreReglement: string;
  reglement: string;
  titreEtapes: string;
  etapesTournoi: string;
  titrePrix: string;
  prixTotal: string;
  footerGauche: string;
  footerDroite: string;
}

export interface ELCVisual4 {
  sousTitre: string;
  badges: string[];
  titrePrizePool: string;
  prizePool: string;
  colonnes: string[];
  equipes: string[];
  quarts: string[];
  demis: string[];
  champion: string;
  footerGauche: string;
  footerDroite: string;
}

export interface ELCCalendrierItem {
  phase: string;
  periode: string;
  lieu: string;
}

export interface ELCBracketTeam {
  id: string;
  nom: string;
  logo: string;
  score?: number;
}

export interface ELCMobaBracket {
  equipes: ELCBracketTeam[];
  quarts: string[];
  demis: string[];
  champion: string;
}

export interface ELCBaremeMoba {
  victoire: number;
  nul: number;
  defaite: number;
}

export interface ELCMobaGame {
  nom: string;
  family: string;
  logoImage?: string;
  calendrier: ELCCalendrierItem[];
  bareme: ELCBaremeMoba;
  manches: any[];
  bracket: ELCMobaBracket;
  heroImage: string;
}

export interface ELCTpsBareme {
  places: number[];
  elimination: number;
}

export interface ELCTpsPlayer {
  id: string;
  nom: string;
  photo: string;
  scoreTotal?: number;
  kills?: number;
}

export interface ELCTpsGame {
  nom: string;
  family: string;
  logoImage?: string;
  calendrier: ELCCalendrierItem[];
  bareme: ELCTpsBareme;
  manches: any[];
  roster: ELCTpsPlayer[];
  heroImage: string;
}

export interface ELCCompetition {
  hok: ELCMobaGame;
  mlbb: ELCMobaGame;
  pubgm: ELCTpsGame;
  ff: ELCTpsGame;
}

export interface ELCVideo {
  id: string;
  titre: string;
  url: string;
  plateforme: 'youtube' | 'tiktok' | 'autre';
  discipline?: string; // 'hok' | 'mlbb' | 'pubgm' | 'ff' | 'general';
  categorie?: 'highlight' | 'match' | 'clip' | 'teaser' | 'tutoriel';
  miniature?: string;
  duree?: string;
  date?: string;
  description?: string;
  vues?: string;
  featured?: boolean;
}

export interface ELCPantheonDistinction {
  key: string;
  title: string;
  subtitle: string;
  desc: string;
  nomineNom?: string;
  nominePhoto?: string;
  nomineHero?: string;
  fondImage?: string;
  nomineClan?: string;
  nomineDetails?: string;
  nomineStatut?: string;
}

export interface ELCPantheonAttributionStep {
  step: string;
  title: string;
  desc: string;
}

export interface ELCPantheonData {
  titrePrincipal?: string;
  sousTitre?: string;
  titreAttribution?: string;
  distinctions?: ELCPantheonDistinction[];
  attributionSteps?: ELCPantheonAttributionStep[];
  curated: any[];
}

export interface ELCData {
  meta: ELCMeta;
  visual1: ELCVisual1;
  visual2: ELCVisual2;
  visual3: ELCVisual3;
  visual4: ELCVisual4;
  competition: ELCCompetition;
  joueurs: any[];
  pantheon: ELCPantheonData;
  videos?: ELCVideo[];
}
