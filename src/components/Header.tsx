import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { LienPage } from './ui';
import { ReseauxSociaux } from './ReseauxSociaux';

interface HeaderProps {
  data: ELCData;
  activeSection: Section;
  onNaviguer: (section: Section, jeu?: string) => void;
}

// Les quatre entrées de la maquette. « Saison news » couvre aussi les rankings
// et le Hall of Fame, qui sont ses onglets.
const PRINCIPALES: { label: string; id: Section; actifSur: Section[] }[] = [
  { label: 'Home', id: 'accueil', actifSur: ['accueil'] },
  { label: 'About us', id: 'apropos', actifSur: ['apropos', 'contact'] },
  { label: 'Saison news', id: 'saison', actifSur: ['saison', 'classements', 'pantheon'] },
  { label: 'Calendrier', id: 'competition', actifSur: ['competition'] },
];

// Le menu complet, derrière le bouton rose : toutes les pages du site, y
// compris celles que la maquette ne place pas dans la barre.
const MENU: { label: string; id: Section }[] = [
  { label: 'Accueil', id: 'accueil' },
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

export const Header: React.FC<HeaderProps> = ({ data, activeSection, onNaviguer }) => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const panneau = useRef<HTMLDivElement>(null);

  // Menu plein écran : Échap le ferme, le focus y entre à l'ouverture et
  // revient au bouton à la fermeture, la page derrière ne défile plus.
  useEffect(() => {
    if (!menuOuvert) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOuvert(false);
      if (e.key === 'Tab' && panneau.current) {
        const focusables = panneau.current.querySelectorAll<HTMLElement>('a, button');
        const premier = focusables[0];
        const dernier = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };
    document.addEventListener('keydown', auClavier);
    const debordement = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panneau.current?.querySelector<HTMLElement>('a')?.focus();
    const bouton = boutonMenu.current;
    return () => {
      document.removeEventListener('keydown', auClavier);
      document.body.style.overflow = debordement;
      bouton?.focus();
    };
  }, [menuOuvert]);

  const aller = (section: Section, jeu?: string) => {
    setMenuOuvert(false);
    onNaviguer(section, jeu);
  };

  return (
    <header id="elc-header" className="absolute inset-x-0 top-0 z-40">
      <div className="flex h-28 w-full items-start justify-between px-4 pt-4 sm:h-36 sm:px-8 sm:pt-6 lg:px-[5%]">
        <LienPage section="accueil" onNaviguer={aller} aria-label="Ligue Esport Est Cameroun — accueil" className="shrink-0">
          <img
            src="/img/logo-ligue-est.webp"
            alt=""
            width={282}
            height={400}
            className="h-20 w-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.6)] sm:h-28"
          />
        </LienPage>

        <nav aria-label="Navigation principale" className="hidden flex-1 items-center pt-5 lg:flex">
          <span aria-hidden="true" className="mx-6 h-0.5 flex-1 bg-rose/90" />
          <ul className="flex items-center gap-2">
            {PRINCIPALES.map((item) => {
              const actif = item.actifSur.includes(activeSection);
              return (
                <li key={item.id}>
                  <LienPage
                    section={item.id}
                    onNaviguer={aller}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    className={`relative isolate block px-7 py-2.5 text-[0.95rem] font-extrabold italic uppercase tracking-[0.2em] text-white transition-colors ${
                      actif ? '' : 'hover:text-magenta'
                    }`}
                  >
                    {actif && <span aria-hidden="true" className="biseau absolute inset-0 -z-10 bg-magenta-plein" />}
                    {item.label}
                  </LienPage>
                </li>
              );
            })}
          </ul>
          <span aria-hidden="true" className="mx-6 h-0.5 flex-1 bg-rose/90" />
        </nav>

        <button
          ref={boutonMenu}
          type="button"
          onClick={() => setMenuOuvert(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOuvert}
          aria-controls="menu-complet"
          className="mt-3 flex h-12 w-12 shrink-0 cursor-pointer flex-col items-end justify-center gap-[5px] bg-fuchsia px-3 transition-transform hover:scale-105 sm:mt-4 sm:h-[52px] sm:w-[52px]"
        >
          <span className="block h-[3px] w-6 bg-white" />
          <span className="block h-[3px] w-4 bg-white" />
          <span className="block h-[3px] w-6 bg-white" />
        </button>
      </div>

      {menuOuvert && (
        <div
          ref={panneau}
          id="menu-complet"
          role="dialog"
          aria-modal="true"
          aria-label="Menu du site"
          className="fixed inset-0 z-50 overflow-y-auto bg-nuit/97 backdrop-blur-sm"
        >
          <div className="mx-auto flex min-h-full max-w-[1120px] flex-col px-5 py-6 sm:px-8">
            <div className="flex items-center justify-between">
              <img src="/img/logo-ligue-est.webp" alt="" width={282} height={400} className="h-16 w-auto" />
              <button
                type="button"
                onClick={() => setMenuOuvert(false)}
                aria-label="Fermer le menu"
                className="flex h-12 w-12 cursor-pointer items-center justify-center bg-fuchsia text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav aria-label="Toutes les pages" className="flex-1 py-10">
              <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-10">
                {MENU.map((item, i) => {
                  const actif = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <LienPage
                        section={item.id}
                        onNaviguer={aller}
                        aria-current={actif ? 'page' : undefined}
                        className={`group flex items-baseline gap-4 border-b border-bord py-4 transition-colors ${
                          actif ? 'text-magenta' : 'text-white hover:text-magenta'
                        }`}
                      >
                        <span className="w-8 text-sm font-bold italic text-doux">{String(i + 1).padStart(2, '0')}</span>
                        <span className="titre text-2xl text-inherit sm:text-3xl">
                          {item.label}
                        </span>
                      </LienPage>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-6 border-t border-bord pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-extrabold italic uppercase tracking-[0.15em] text-white">
                Ligue régionale d'esport de l'Est Cameroun
              </p>
              <ReseauxSociaux reseaux={data.meta.reseaux} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
