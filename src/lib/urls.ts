// Validation des URL venant des données du site.
//
// Tout ce qui est affiché ici — liens des réseaux, formulaire d'inscription,
// images de fond, photos — est saisi dans le portail d'administration, donc par
// une personne de confiance. Mais un lien « javascript:… » placé dans un href
// s'exécute au clic, chez tous les visiteurs, et survit à chaque rechargement :
// une erreur de saisie ou un accès admin détourné deviendrait une faille
// permanente. Ces deux fonctions coupent cette possibilité à la racine.

const PROTOCOLES_AUTORISES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Renvoie l'URL si son protocole est sûr, une chaîne vide sinon. Le vide se
 * propage bien : les composants testent déjà la présence du lien avant de
 * rendre une balise, donc un lien refusé disparaît au lieu d'être cliquable.
 *
 * Les chemins relatifs (/img/logo.png) sont acceptés : ils ne peuvent pas
 * porter de protocole.
 */
export function urlSure(valeur: string | undefined | null): string {
  if (!valeur) return '';
  const nettoyee = String(valeur).trim();
  if (!nettoyee) return '';

  // Un chemin relatif ne peut pas changer de protocole. En revanche « //site »
  // est un lien protocole-relatif vers l'extérieur : on le laisse passer, le
  // navigateur lui appliquera https.
  if (nettoyee.startsWith('/') || nettoyee.startsWith('#') || nettoyee.startsWith('?')) {
    return nettoyee;
  }

  try {
    // La base ne sert qu'à résoudre les formes relatives non couvertes ci-dessus.
    const analysee = new URL(nettoyee, 'https://elc2027-data.vercel.app');
    return PROTOCOLES_AUTORISES.has(analysee.protocol) ? nettoyee : '';
  } catch {
    return '';
  }
}

/**
 * Prépare une valeur destinée à un `url("…")` CSS.
 *
 * Sans échappement, une adresse contenant `")` referme la parenthèse et laisse
 * injecter des déclarations CSS arbitraires dans la page — de quoi la
 * défigurer, ou faire fuiter des informations par des sélecteurs et des
 * requêtes d'arrière-plan. On refuse les protocoles douteux, puis on encode les
 * caractères capables de sortir du `url()`.
 */
export function urlCss(valeur: string | undefined | null): string {
  const sure = urlSure(valeur);
  if (!sure) return '';
  return sure
    .replace(/\\/g, '%5C')
    .replace(/"/g, '%22')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/[\n\r]/g, '');
}
