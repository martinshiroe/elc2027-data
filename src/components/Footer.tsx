import React from 'react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { Conteneur, LienPage } from './ui';
import { ReseauxSociaux } from './ReseauxSociaux';

interface FooterProps {
  data: ELCData;
  onOpenRegulations: () => void;
  onNaviguer: (section: Section, jeu?: string) => void;
}

const LIENS: { label: string; id: Section }[] = [
  { label: 'À propos', id: 'apropos' },
  { label: 'Saison news', id: 'saison' },
  { label: 'Calendrier', id: 'competition' },
  { label: 'Rankings', id: 'classements' },
  { label: 'Hall of Fame', id: 'pantheon' },
  { label: 'Joueurs', id: 'joueurs' },
  { label: 'Vidéos', id: 'videos' },
  { label: 'Inscription', id: 'inscription' },
  { label: 'Contact', id: 'contact' },
];

export const Footer: React.FC<FooterProps> = ({ data, onOpenRegulations, onNaviguer }) => {
  const { meta } = data;
  const annee = meta.saison || '2027';

  return (
    <footer id="elc-footer" className="border-t border-bord-fort bg-nuit">
      <Conteneur className="flex flex-col gap-6 py-9 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-extrabold italic uppercase tracking-[0.14em] text-white">
          Ligue régionale d'esport de l'Est Cameroun
        </p>
        <p className="text-sm text-doux">Délégation régionale de la FECASES.</p>
        <ReseauxSociaux reseaux={meta.reseaux} />
      </Conteneur>

      <div className="border-t border-bord">
        <Conteneur className="flex flex-col gap-5 py-6 text-sm lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Pages du site">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LIENS.map((l) => (
                <li key={l.id}>
                  <LienPage section={l.id} onNaviguer={onNaviguer} className="text-doux transition-colors hover:text-white">
                    {l.label}
                  </LienPage>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-doux">
            {meta.contact?.email && (
              <a href={`mailto:${meta.contact.email}`} className="transition-colors hover:text-white">
                {meta.contact.email}
              </a>
            )}
            <button
              type="button"
              onClick={onOpenRegulations}
              className="cursor-pointer transition-colors hover:text-white"
            >
              Mentions légales
            </button>
            <span>© {annee} ELC</span>
          </div>
        </Conteneur>
      </div>
    </footer>
  );
};

export default Footer;
