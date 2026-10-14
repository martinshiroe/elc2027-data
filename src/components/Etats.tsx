// États des blocs qui dépendent des données publiées (maquette, octobre 2026) :
// chargement, vide et erreur, plus les cartes-liens courtes de bas de page.

import React from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Section } from '../lib/routes';
import { Carte, TitreCarte, LienPage, Bouton } from './ui';

export type EtatDonnees = 'chargement' | 'pret' | 'erreur';

type Naviguer = (section: Section, jeu?: string) => void;

/** Ligne « ◌ Chargement de… » au-dessus des gabarits. */
export const EnChargement: React.FC<{ texte: string }> = ({ texte }) => (
  <p role="status" className="mb-5 flex items-center gap-3 font-semibold text-white">
    <Loader2 className="h-5 w-5 animate-spin text-magenta" aria-hidden="true" />
    {texte}
  </p>
);

/** Barre grisée d'un gabarit de chargement. */
export const Barre: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span aria-hidden="true" className={`block h-4 animate-pulse bg-[#2e2440] ${className}`} />
);

/** Carte gabarit : pastille ronde facultative et quelques barres. */
export const CarteGabarit: React.FC<{ rond?: boolean; lignes?: number; className?: string }> = ({
  rond = false,
  lignes = 4,
  className = '',
}) => (
  <Carte className={`p-5 sm:p-6 ${className}`}>
    <div aria-hidden="true" className="space-y-4">
      {rond && <span className="block h-12 w-12 animate-pulse rounded-full bg-[#2e2440]" />}
      <Barre className="h-5" />
      {Array.from({ length: lignes - 1 }, (_, i) => (
        <Barre key={i} className={i % 2 ? 'w-3/4' : 'w-2/5'} />
      ))}
    </div>
  </Carte>
);

/**
 * Carte d'état vide ou d'erreur : pictogramme cerclé, titre, texte, actions.
 * Une erreur annonce qu'il s'agit d'un problème de chargement, pas d'une
 * absence de contenu : l'une ne doit jamais se faire passer pour l'autre.
 */
export const CarteEtat: React.FC<{
  icone: React.ReactNode;
  titre: string;
  erreur?: boolean;
  onReessayer?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ icone, titre, erreur = false, onReessayer, children, actions }) => (
  <Carte className="p-6 sm:p-8">
    <div role={erreur ? 'alert' : undefined}>
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-magenta text-magenta" aria-hidden="true">
        {icone}
      </span>
      <TitreCarte niveau={2} className="mb-4 text-xl sm:text-[1.7rem]">
        {titre}
      </TitreCarte>
      <div className="max-w-3xl leading-relaxed text-texte">{children}</div>
      {(onReessayer || actions) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {onReessayer && (
            <Bouton variante="contour" type="button" onClick={onReessayer}>
              Réessayer
            </Bouton>
          )}
          {actions}
        </div>
      )}
    </div>
  </Carte>
);

/** Carte-lien courte de bas de page : titre, pictogramme, lien. */
export const LienCourt: React.FC<{
  section: Section;
  jeu?: string;
  onNaviguer: Naviguer;
  titre: string;
  action: string;
  icone: React.ReactNode;
}> = ({ section, jeu, onNaviguer, titre, action, icone }) => (
  <Carte className="group relative flex h-full flex-col p-5 transition-colors hover:border-magenta/70">
    <div className="mb-4 flex items-start justify-between gap-3">
      <TitreCarte niveau={3} className="text-base sm:text-lg">
        {titre}
      </TitreCarte>
      <span className="text-magenta" aria-hidden="true">
        {icone}
      </span>
    </div>
    <LienPage
      section={section}
      jeu={jeu}
      onNaviguer={onNaviguer}
      className="mt-auto flex items-center justify-between font-bold italic text-magenta after:absolute after:inset-0"
    >
      <span>{action}</span>
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </LienPage>
  </Carte>
);

/** Rangée de cartes-liens courtes. */
export const LiensCourts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // toArray écarte les cartes conditionnelles absentes (null, false).
  const cartes = React.Children.toArray(children);
  return (
    <ul className={`grid gap-4 sm:gap-5 ${cartes.length >= 3 ? 'md:grid-cols-3' : cartes.length === 2 ? 'md:grid-cols-2' : ''}`}>
      {cartes.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  );
};
