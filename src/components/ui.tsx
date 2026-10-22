import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
// Briques visuelles de la maquette « Ligue de l'Est ».
//
// Toutes les pages s'assemblent avec ces composants : un seul endroit fixe le
// rythme des titres, l'aspect des cartes et des boutons. Une page absente de
// la maquette (Joueurs, Vidéos, Inscription…) obtient ainsi le même style
// qu'une page dessinée.

import React from 'react';
import { ArrowUpRight, Info, AlertCircle } from 'lucide-react';
import { Section, cheminDe } from '../lib/routes';

/** Largeur du contenu de la maquette, avec ses marges latérales. */
export const Conteneur: React.FC<{ image?: string; className?: string; children: React.ReactNode }> = ({
  image, className = '',
  children,
}) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return (<div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-8 ${className}`}>{texteSite(children)}</div>); };

/** Surtitre + titre de section. `niveau` choisit la balise, pas la taille. */
export const TitreSection: React.FC<{
  surtitre?: string;
  titre: React.ReactNode;
  niveau?: 1 | 2 | 3;
  taille?: 'page' | 'section';
  className?: string;
  id?: string;
  children?: React.ReactNode;
}> = ({ surtitre, titre, niveau = 2, taille = 'section', className = '', id, children }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const Balise = `h${niveau}` as 'h1' | 'h2' | 'h3';
  const tailles =
    taille === 'page'
      ? 'text-[1.6rem] sm:text-5xl lg:text-[3.4rem]'
      : 'text-[1.3rem] sm:text-3xl lg:text-[2.1rem]';
  return (
    <div className={className}>
      {surtitre && <p className="surtitre mb-2 text-[0.68rem] sm:mb-3 sm:text-xs">{texteSite(surtitre)}</p>}
      <Balise id={id} className={`titre ${tailles}`}>
        {texteSite(titre)}
      </Balise>
      {children && <div className="mt-3 text-[0.95rem] sm:mt-4 sm:text-[1.05rem] leading-relaxed text-texte max-w-3xl">{texteSite(children)}</div>}
    </div>
  );
};

/** Carte à fond violet nuit et fin liseré prune, sans arrondi. */
export const Carte: React.FC<{
  className?: string;
  haute?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
  children: React.ReactNode;
}> = ({ className = '', haute = false, as = 'div', children }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const Balise = as;
  return (
    <Balise className={`border border-bord ${haute ? 'bg-carte-haute' : 'bg-carte'} ${className}`}>
      {texteSite(children)}
    </Balise>
  );
};

/** Titre de carte : capitales italiques, plus petites qu'un titre de section. */
export const TitreCarte: React.FC<{ className?: string; niveau?: 2 | 3 | 4; children: React.ReactNode }> = ({
  className = '',
  niveau = 3,
  children,
}) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const Balise = `h${niveau}` as 'h2' | 'h3' | 'h4';
  return <Balise className={`titre text-base sm:text-xl ${className}`}>{texteSite(children)}</Balise>;
};

const BASE_BOUTON =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.82rem] font-bold italic tracking-wide sm:px-6 sm:py-3 sm:text-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';
const VARIANTES = {
  plein: 'bg-magenta-plein text-white hover:bg-[#a3000a]',
  contour: 'border-2 border-magenta text-white hover:bg-magenta/15',
  attente: 'bg-avis text-doux disabled:opacity-100',
};

type Variante = keyof typeof VARIANTES;

/** Bouton pilule de la maquette. */
export const Bouton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }
> = ({ variante = 'plein', className = '', children, ...reste }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <button className={`${BASE_BOUTON} ${VARIANTES[variante]} ${className}`} {...reste}>
    {texteSite(children)}
  </button>
)); };

/** Lien externe à l'apparence d'un bouton. */
export const BoutonLien: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { variante?: Variante }
> = ({ variante = 'plein', className = '', children, ...reste }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <a className={`${BASE_BOUTON} ${VARIANTES[variante]} ${className}`} {...reste}>
    {texteSite(children)}
  </a>
)); };

/**
 * Lien vers une page du site. Un vrai `<a href>` : clic molette, nouvel onglet
 * et copie de lien fonctionnent ; les clics modifiés ne sont pas interceptés.
 */
export const LienPage: React.FC<{
  section: Section;
  onNaviguer: (section: Section, jeu?: string) => void;
  jeu?: string;
  className?: string;
  bouton?: Variante;
  'aria-current'?: 'page' | undefined;
  'aria-label'?: string;
  children: React.ReactNode;
}> = ({ section, onNaviguer, jeu, className = '', bouton, children, ...aria }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <a
    href={jeu ? `${cheminDe(section)}?jeu=${jeu}` : cheminDe(section)}
    className={bouton ? `${BASE_BOUTON} ${VARIANTES[bouton]} ${className}` : className}
    onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNaviguer(section, jeu);
    }}
    {...aria}
  >
    {texteSite(children)}
  </a>
)); };

/** Pastille « À confirmer », « Programme à confirmer »… */
export const Pastille: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <span
    className={`inline-flex items-center rounded-full border border-bord-fort bg-avis px-3 py-1 text-xs font-medium text-white ${className}`}
  >
    {texteSite(children)}
  </span>
)); };

/** Bandeau d'information ou d'erreur, liseré à gauche. */
export const Avis: React.FC<{
  titre: string;
  ton?: 'info' | 'erreur';
  className?: string;
  children?: React.ReactNode;
}> = ({ titre, ton = 'info', className = '', children }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const erreur = ton === 'erreur';
  const Icone = erreur ? AlertCircle : Info;
  return (
    <div
      role={erreur ? 'alert' : undefined}
      className={`flex gap-4 px-5 py-4 ${
        erreur ? 'border border-alerte bg-[#2c1018]' : 'border-l-4 border-magenta bg-avis'
      } ${className}`}
    >
      <Icone className={`mt-0.5 h-5 w-5 shrink-0 ${erreur ? 'text-alerte' : 'text-magenta'}`} aria-hidden="true" />
      <div>
        <p className={`font-semibold ${erreur ? 'text-alerte' : 'text-white'}`}>{texteSite(titre)}</p>
        {children && <div className="mt-1 text-sm leading-relaxed text-texte">{texteSite(children)}</div>}
      </div>
    </div>
  );
};

/** Carte-lien vers une autre page : surtitre, titre, texte, flèche. */
export const CarteLien: React.FC<{
  section: Section;
  jeu?: string;
  onNaviguer: (section: Section, jeu?: string) => void;
  surtitre: string;
  titre: string;
  texte: string;
  action: string;
  icone?: React.ReactNode;
}> = ({ section, jeu, onNaviguer, surtitre, titre, texte, action, icone }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <Carte className="group relative flex h-full flex-col p-6 transition-colors hover:border-magenta/70">
    <div className="mb-5 flex items-start justify-between gap-4">
      <p className="surtitre text-[0.7rem]">{texteSite(surtitre)}</p>
      {icone && <span className="text-magenta" aria-hidden="true">{texteSite(icone)}</span>}
    </div>
    <TitreCarte className="mb-4">{texteSite(titre)}</TitreCarte>
    <p className="mb-8 flex-1 leading-relaxed text-texte">{texteSite(texte)}</p>
    <LienPage
      section={section}
      jeu={jeu}
      onNaviguer={onNaviguer}
      className="flex items-center justify-between font-bold italic text-magenta after:absolute after:inset-0"
    >
      <span>{texteSite(action)}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </LienPage>
  </Carte>
)); };

/** Petit trait magenta qui sépare deux blocs de texte. */
export const Trait: React.FC<{ className?: string }> = ({ className = '' }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <span className={`block h-0.5 w-14 bg-magenta ${className}`} aria-hidden="true" />
)); };

/**
 * En-tête de page : l'illustration du joueur, voilée de violet nuit, encadrée
 * par deux filets roses verticaux comme sur la maquette.
 */
export const EnTetePage: React.FC<{
  image?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ image = '/img/hero-joueur.webp', className = '', children }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <section className={`relative isolate overflow-hidden ${className}`}>
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <ImagePublique
        src={imageSite(image)}
        srcSet={sourcesSite(image === '/img/hero-joueur.webp' ? '/img/hero-joueur-1200.webp 1200w, /img/hero-joueur.webp 2400w' : undefined)}
        sizes="100vw"
        alt={texteSite("")}
        className="h-full w-full object-contain object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-nuit/60 via-nuit/75 to-nuit" />
      <div className="absolute inset-0 bg-gradient-to-r from-nuit/85 via-nuit/40 to-transparent" />
    </div>
    <span aria-hidden="true" className="pointer-events-none absolute left-[6.5%] top-44 bottom-16 hidden w-0.5 bg-rose/80 lg:block" />
    <span aria-hidden="true" className="pointer-events-none absolute right-[6.5%] top-44 bottom-16 hidden w-0.5 bg-rose/80 lg:block" />
    <div className="pt-[13.5rem] pb-8 sm:pt-60 sm:pb-16 lg:pt-44">{texteSite(children)}</div>
  </section>
)); };

/** Fond « planète violette » des bandes de la maquette. */
export const BandePlanete: React.FC<{ image?: string; className?: string; children: React.ReactNode }> = ({
  image,
  className = '',
  children,
}) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <section className={`relative isolate overflow-hidden ${className}`}>
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <ImagePublique src={imageSite(image || "/img/fond-planete.webp")} alt={texteSite("")} loading="lazy" className="h-full w-full object-contain opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/70 to-nuit" />
    </div>
    {texteSite(children)}
  </section>
)); };

/** Initiales d'un nom, pour les cartes sans portrait. */
export function initiales(nom: string): string {
  const mots = nom
    .replace(/[«»"()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return ((mots[0]?.[0] ?? '') + (mots[1]?.[0] ?? '')).toUpperCase();
}
