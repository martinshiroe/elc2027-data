import React, { useState, useEffect } from 'react';
import { remonter } from '../lib/scroll';
import { Menu, X } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { LienSection } from './LienSection';

interface HeaderProps {
  data: ELCData;
  activeSection: string;
  setActiveSection: (sec: Section) => void;
  onOpenRegister?: () => void;
  onOpenRegulations?: () => void;
  onOpenDataModal?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  activeSection,
  setActiveSection,
  onOpenRegister,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; id: Section }[] = [
    { label: 'Compétition', id: 'competition' },
    { label: 'Classements', id: 'classements' },
    { label: 'Joueurs', id: 'joueurs' },
    { label: 'Panthéon', id: 'pantheon' },
    { label: 'Vidéos', id: 'videos' },
    { label: 'Inscription', id: 'inscription' },
  ];

  // Échap ferme le menu mobile : il couvre l'écran, il faut pouvoir en
  // sortir sans viser la croix.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', auClavier);
    return () => document.removeEventListener('keydown', auClavier);
  }, [mobileMenuOpen]);

  const handleNavClick = (id: Section) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    remonter();
  };

  const handleRegister = (id: Section) => {
    if (onOpenRegister) {
      onOpenRegister();
      setMobileMenuOpen(false);
    } else {
      handleNavClick(id);
    }
  };

  return (
    <header
      id="elc-header"
      className="sticky top-0 z-50 bg-[#0e0e0e] border-b border-white/[0.08]"
      style={{ transition: 'background 0.2s' }}
    >
      <div className="max-w-[1280px] mx-auto px-7 h-[60px] flex items-center justify-between gap-2">
        {/* Brand: Wordmark + 2027 */}
        <LienSection
          section="accueil"
          onNaviguer={handleNavClick}
          className="flex items-center gap-2 cursor-pointer mr-4"
        >
          <img
            src="/img/logo-elc-wordmark.png"
            alt="ELC"
            /* `w-auto` laissait la largeur inconnue jusqu'au chargement : la
               barre de navigation sautait. Les dimensions intrinsèques
               donnent le ratio au navigateur, la classe garde la taille. */
            width={480}
            height={264}
            className="h-[22px] w-auto shrink-0"
          />
          <span
            className="font-medium text-[15px] text-[#14b8a6] tracking-[-0.2px] whitespace-nowrap"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {data.meta.saison || '2027'}
          </span>
        </LienSection>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <LienSection
                key={item.id}
                section={item.id}
                onNaviguer={handleNavClick}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3.5 py-1.5 rounded-md text-[14px] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/[0.07]'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.03]'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {item.label}
              </LienSection>
            );
          })}
        </div>

        {/* Right Button: S'inscrire */}
        <div className="flex items-center gap-2">
          {/* L'appel à l'action principal mène à une page du site : c'est un
              lien, pas un bouton. Il devient partageable et ouvrable dans un
              nouvel onglet, sans changer d'apparence. */}
          <LienSection
            section="inscription"
            onNaviguer={handleRegister}
            className="bg-[#14b8a6] hover:opacity-85 text-[#0e0e0e] px-4.5 py-1.5 rounded-md text-[13px] font-medium transition-opacity cursor-pointer whitespace-nowrap"
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}
          >
            S'inscrire
          </LienSection>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/[0.05] border-0 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="menu-mobile" className="md:hidden bg-[#0e0e0e] border-b border-white/[0.08] px-6 py-4 space-y-2">
          <LienSection
            section="accueil"
            onNaviguer={handleNavClick}
            aria-current={activeSection === 'accueil' ? 'page' : undefined}
            className={`block w-full text-left px-3 py-2.5 rounded-md text-sm cursor-pointer ${
              activeSection === 'accueil'
                ? 'text-white bg-white/[0.07]'
                : 'text-white/60 hover:text-white'
            }`}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Accueil
          </LienSection>
          {navItems.map((item) => (
            <LienSection
              key={item.id}
              section={item.id}
              onNaviguer={handleNavClick}
              aria-current={activeSection === item.id ? 'page' : undefined}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm cursor-pointer ${
                activeSection === item.id
                  ? 'text-white bg-white/[0.07]'
                  : 'text-white/60 hover:text-white'
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {item.label}
            </LienSection>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
