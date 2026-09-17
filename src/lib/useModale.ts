import { useEffect, useRef } from 'react';

const SELECTEUR_FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Comportement clavier attendu d'une boîte de dialogue.
 *
 * Les deux modales du site s'ouvraient sans rien de tout cela : au clavier,
 * la tabulation continuait de parcourir la page derrière le voile, Échap ne
 * fermait rien, et à la fermeture le focus repartait au début du document.
 *
 * - Échap ferme
 * - le focus entre dans la boîte à l'ouverture
 * - la tabulation reste enfermée dedans
 * - le focus retourne au bouton d'origine à la fermeture
 * - la page derrière ne défile plus
 */
export function useModale(ouverte: boolean, onFermer: () => void) {
  const conteneur = useRef<HTMLDivElement>(null);
  const declencheur = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ouverte) return;

    declencheur.current = document.activeElement as HTMLElement | null;

    const boite = conteneur.current;
    if (boite) {
      const premier = boite.querySelector<HTMLElement>(SELECTEUR_FOCUSABLE);
      (premier ?? boite).focus();
    }

    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onFermer();
        return;
      }
      if (e.key !== 'Tab' || !conteneur.current) return;

      const cibles = Array.from(
        conteneur.current.querySelectorAll<HTMLElement>(SELECTEUR_FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (cibles.length === 0) return;

      const premier = cibles[0];
      const dernier = cibles[cibles.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };

    document.addEventListener('keydown', auClavier);
    const defilementInitial = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', auClavier);
      document.body.style.overflow = defilementInitial;
      declencheur.current?.focus?.();
    };
  }, [ouverte, onFermer]);

  return conteneur;
}
