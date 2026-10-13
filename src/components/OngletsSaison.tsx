import React from 'react';
import { Section } from '../lib/routes';
import { LienPage } from './ui';

// Barre d'onglets de « Saison news ». Ce sont des liens : chaque onglet a son
// adresse (`/classements?jeu=mlbb`, `/hall-of-fame`) et se partage tel quel.
// La maquette prévoit deux rankings ; la ligue en compte quatre.

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
  onNaviguer: (section: Section, jeu?: string) => void;
}> = ({ actif, onNaviguer }) => (
  <nav aria-label="Rubriques de la saison" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
    <ul className="flex min-w-max border-b border-bord-fort">
      {ONGLETS.map((o) => {
        const estActif = o.id === actif;
        return (
          <li key={o.id}>
            <LienPage
              section={o.section}
              jeu={o.jeu}
              onNaviguer={onNaviguer}
              aria-current={estActif ? 'page' : undefined}
              className={`-mb-px block border-b-[3px] px-5 py-4 text-sm font-bold italic whitespace-nowrap transition-colors sm:px-6 sm:text-[0.95rem] ${
                estActif
                  ? 'border-magenta bg-carte-haute text-white'
                  : 'border-transparent text-doux hover:text-white'
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
