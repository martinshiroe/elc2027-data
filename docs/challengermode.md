# Équipes Challengermode dans la vitrine

`GET /api/challengermode` lit uniquement les tournois ELC :

- HoK : `2c12729a-7bcc-4eb9-e4bc-08df3e4c1535`
- MLBB : `9ae20484-421e-45c3-e4c2-08df3e4c1535`

Configurer `CHALLENGERMODE_REFRESH_KEY` comme secret Production sur Vercel,
puis déployer. Le bot doit pouvoir lire ces tournois. Ne jamais préfixer cette
variable par `VITE_` ni la placer dans les données du CMS.

Le serveur échange cette clé contre un jeton temporaire, puis envoie une requête
GraphQL fixe en lecture seule. Aucun paramètre public ne permet d'exécuter une
autre opération. Il ne transmet au navigateur que les noms, logos, pseudos,
indicateurs de capitaine et liens des tournois. Aucun résultat ni bracket importé.

Avant le démarrage, la source est `attendance.signups`; lorsque `roster` est
disponible, il devient la source officielle. Les disqualifiés et la liste d'attente
ne sont pas affichés. Limite de 32 équipes par tournoi (les deux tournois ELC ont
8 places) : une liste tronquée est traitée comme une erreur, jamais publiée.

La page Équipes & joueurs réutilise sa grille et ses cartes. Les fiches manuelles
sont conservées séparément : aucune écriture dans Supabase. Les disciplines
désactivées sont filtrées pour les équipes importées et les fiches manuelles.
Une équipe retirée disparaît à la prochaine lecture réussie. Une liste vide
réussie remplace les anciennes équipes.

Cache serveur et CDN de cinq minutes; actualisation toutes les cinq minutes
lorsque la page est visible et au retour sur l'onglet. En cas de panne, une instance
chaude peut conserver son dernier instantané pendant 24 h avec un avertissement.
Le cache mémoire ne survit pas à un redémarrage/déploiement; à froid une panne
renvoie 503 et la page conserve les fiches du CMS. Aucun faux succès vide.

Pour le développement local, charger la variable depuis un environnement privé
avant `node --import tsx server.ts`. Sans clé, le reste du site fonctionne.
`npm test` couvre les sources avant/après démarrage, erreurs, cache, renouvellement,
confidentialité et rendu des disciplines actives.

Références : les schémas Auth et GraphQL fournis par l'organisateur, et
https://www.challengermode.com/developers/docs/client-api/reference/base-url
