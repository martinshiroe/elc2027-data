# Vitrine ELC

Les composants visuels, les images et les feuilles de styles existants sont conservés. Les rankings, brackets, statistiques de match et inscriptions locales ne sont plus proposés au public. Les anciennes adresses `/classements` et `/inscription` affichent le calendrier.

Dans **Général & Liens**, renseigner `challengermodeUrl` avec l'adresse réelle de l'espace ELC. Sans adresse valide, aucun lien vers un espace supposé n'est affiché. Les anciens liens Google Forms et start.gg ne sont plus utilisés.

Le module **Équipes & joueurs** permet d'ajouter des portraits, un nom d'équipe, un rôle, une ville et une présentation. La recherche publique par équipe permet de retrouver ses membres. Les anciennes données de résultats restent conservées pour éviter de perdre l'historique, mais leurs éditeurs ne sont plus proposés.

## Calendrier Honor of Kings confirmé

Dates transmises et confirmées par le propriétaire le 11 novembre 2026, en UTC+1 (heure du Cameroun) :

- Ouverture des inscriptions : 16 novembre 2026, 08 h 00.
- Début du tournoi : 11 janvier 2027, 09 h 12.
- Clôture des inscriptions : 6 février 2027, 23 h 30.

La clôture postérieure au lancement a été explicitement confirmée. La fermeture de la confirmation de présence appartient au parcours Challengermode et n'est pas ajoutée à la vitrine.

`preparerVitrine` applique ce calendrier aux anciennes données embarquées et aux données chargées depuis l'API, sans écriture automatique en base. Le marqueur `meta.calendrierHokVersion` est enregistré lors de la prochaine sauvegarde normale de l'administration. Une fois marqué, le calendrier reste modifiable et n'est pas réécrit au chargement. Les calendriers des autres jeux sont conservés et présentés comme prévisionnels.

## Mobile Legends et annonces des titres

Mobile Legends : ouverture le 16 novembre 2026 à 08 h 30 ; lancement le 30 janvier 2027 à 20 h 30 ; clôture le 14 février 2027 à 23 h 30. Le fuseau UTC+1 est repris du contexte des captures du même tournoi régional.

Les captures fournies précisent 8 équipes et 250 000 FCFA de dotation pour chacun des deux jeux. Honor of Kings : 5 contre 5 + 2 remplaçants. Mobile Legends : 5 contre 5. Ces données apparaissent dans les cartes de titres existantes, sans tableau de match. Une seconde migration (`calendrierMobaVersion`) applique ces précisions une seule fois et préserve ensuite les modifications administratives.
