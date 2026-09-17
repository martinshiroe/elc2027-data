// Remontée en haut de page après un changement de section.
//
// `behavior: 'smooth'` n'écoute pas le réglage système « réduire les
// animations » : un défilement animé sur toute la hauteur de la page est
// précisément ce qui déclenche des nausées chez les personnes sensibles au
// mouvement. On interroge donc la préférence avant de choisir.
export function remonter(): void {
  const reduit =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' });
}
