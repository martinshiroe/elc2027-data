import React from 'react';
import { Section } from '../lib/routes';
import { LienPage } from './ui';

// Barre d'onglets de « Saison news ». Ce sont des liens : chaque onglet a son
// adresse (`/classements?jeu=mlbb`, `/hall-of-fame`) et se partage tel quel.
// La maquette prévoit deux rankings ; la ligue en compte jusqu'à quatre, selon
// les disciplines actives de la saison.

export type OngletSaison = 'actualites' | 'hok' | 'mlbb' | 'pubgm' | 'ff' | 'halloffame';

const ONGLETS: { id: OngletSaison; label: string; section: Section; jeu?: string }[] = [
  { id: 'actualites', label: 'Actualités', section: 'saison' },
  { id: 'hok', label: 'Ranking HoK', section: 'classements', jeu: 'hok' },
  { id: 'mlbb', label: 'Ranking MLBB', section: 'classements', jeu: 'mlbb' },
  { id: 'pubgm', label: 'Ranking PUBG M', section: 'classements', jeu: 'pubgm' },
  { id: 'ff', label: 'Ranking Free Fire', section: 'classements', jeu: 'ff' },
  { id: 'halloffame', label: 'Hall of Fame', section: 'pantheon' },
];

export const OngletsSaison: React.FC<{
  actif: OngletSaison;
  /** Identifiants des disciplines actives : les autres onglets de ranking disparaissent. */
  jeux: string[];
  onNaviguer: (section: Section, jeu?: string) => void;
}> = ({ actif, jeux, onNaviguer }) => (
  <nav aria-label="Rubriques de la saison" className="sm:overflow-x-auto">
    {/* Mobile : onglets empilés pleine largeur (maquette mobile) ;
        à partir de 640 px, la barre horizontale. */}
    <ul className="flex flex-col gap-2 sm:min-w-max sm:flex-row sm:gap-0 sm:border-b sm:border-bord-fort">
      {ONGLETS.filter((o) => !o.jeu || jeux.includes(o.jeu)).map((o) => {
        const estActif = o.id === actif;
        return (
          <li key={o.id}>
            <LienPage
              section={o.section}
              jeu={o.jeu}
              onNaviguer={onNaviguer}
              aria-current={estActif ? 'page' : undefined}
              className={`block border-b-[3px] px-5 py-3.5 text-[0.95rem] font-bold italic whitespace-nowrap transition-colors sm:-mb-px sm:px-6 sm:py-4 ${
                estActif
                  ? 'border-magenta bg-avis text-white sm:bg-carte-haute'
                  : 'border-bord-fort bg-carte text-doux hover:text-white sm:border-transparent sm:bg-transparent'
              }`}
            >
              {o.label}
            </LienPage>
          </li>
        );
      })}
    </ul>
  </nav>
);
