import React from 'react';
import { Section, cheminDe } from '../lib/routes';

interface LienSectionProps {
  section: Section;
  onNaviguer: (section: Section) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-current'?: 'page' | undefined;
  children: React.ReactNode;
}

/**
 * Lien de navigation interne.
 *
 * La navigation du site était faite de `<button>` : ni clic molette, ni
 * « ouvrir dans un nouvel onglet », ni copie de lien par clic droit, et rien
 * à suivre pour un moteur de recherche. Un vrai `<a href>` rend tout ça, et
 * l'`onClick` garde la navigation instantanée côté client.
 *
 * Les clics modifiés (Ctrl, Cmd, Maj, molette) ne sont pas interceptés : le
 * navigateur fait ce que l'utilisateur attend.
 */
export const LienSection: React.FC<LienSectionProps> = ({
  section,
  onNaviguer,
  className,
  style,
  'aria-current': ariaCurrent,
  children,
}) => (
  <a
    href={cheminDe(section)}
    aria-current={ariaCurrent}
    className={className}
    style={style}
    onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNaviguer(section);
    }}
  >
    {children}
  </a>
);

export default LienSection;
