import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ELCData } from '../types';

interface HeaderProps {
  data: ELCData;
  activeSection: string;
  setActiveSection: (sec: string) => void;
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

  const navItems = [
    { label: 'Compétition', id: 'competition' },
    { label: 'Classements', id: 'classements' },
    { label: 'Joueurs', id: 'joueurs' },
    { label: 'Panthéon', id: 'pantheon' },
    { label: 'Vidéos', id: 'videos' },
    { label: 'Inscription', id: 'inscription' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      handleNavClick('inscription');
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
        <button
          onClick={() => handleNavClick('accueil')}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 mr-4 focus:outline-none"
        >
          <img
            src="/img/logo-elc-wordmark.png"
            alt="ELC"
            className="h-[22px] w-auto shrink-0"
          />
          <span
            className="font-medium text-[15px] text-[#14b8a6] tracking-[-0.2px] whitespace-nowrap"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {data.meta.saison || '2027'}
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-md text-[14px] whitespace-nowrap transition-colors cursor-pointer border-0 ${
                  isActive
                    ? 'text-white bg-white/[0.07]'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.03]'
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Button: S'inscrire */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegister}
            className="bg-[#14b8a6] hover:opacity-85 text-[#0e0e0e] px-4.5 py-1.5 rounded-md text-[13px] font-medium transition-opacity cursor-pointer border-0 whitespace-nowrap"
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}
          >
            S'inscrire
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/[0.05] border-0 cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-white/[0.08] px-6 py-4 space-y-2">
          <button
            onClick={() => handleNavClick('accueil')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer border-0 ${
              activeSection === 'accueil'
                ? 'text-white bg-white/[0.07]'
                : 'text-white/60 hover:text-white'
            }`}
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Accueil
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm cursor-pointer border-0 ${
                activeSection === item.id
                  ? 'text-white bg-white/[0.07]'
                  : 'text-white/60 hover:text-white'
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
