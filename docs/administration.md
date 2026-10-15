# Administration ELC

Ouvrir le site avec `#admin`, puis saisir le code administrateur existant.

L’interface reprend la maquette Figma de la section admin : écran de connexion, navigation latérale par rubrique, tableau de bord, formulaires et barre d’enregistrement. Les compteurs correspondent au contenu réel. Aucun rôle, historique ou circuit de validation fictif n’est présenté comme fonctionnel.

## Modifier les contenus

- **Général & Liens** : identité de la compétition, contacts, liens et bannières.
- **Actualités / Pages** : annonces, présentation, membres du bureau, partenaires et fait marquant.
- **Textes, images & logos** : catalogue des libellés et images auparavant fixés dans le code. Rechercher un texte ou filtrer par page. Un libellé partagé est modifié partout où il apparaît. « Rétablir » supprime la personnalisation. Les images utilisent une URL ou un chemin `/img/…`.
- **Hall of Fame** : titres, descriptions, portraits, lauréats et attribution. Ajouter une distinction, choisir sa couleur et son logo, ou masquer une distinction existante.
- **Tous les champs du site** : édition détaillée des données existantes, y compris joueurs, listes et champs complémentaires. Les modules spécialisés restent préférables pour ajouter le premier élément d’une liste vide.
- Les modules disciplines, calendrier, MOBA, Battle Royale et vidéos conservent leurs données et leurs outils.

## Créer une page ou une catégorie

Dans **Pages & catégories**, ajouter une page puis renseigner titre, adresse, catégorie et contenu. La catégorie est libre : saisir un nouveau nom pour en créer une. Choisir l’affichage dans le menu et/ou le pied de page.

Le raccourci **Politique de confidentialité** crée un brouillon vide à compléter avec les pratiques réelles de la ligue. Il ne génère aucun texte juridique fictif.

Les pages publiées ont une adresse `/pages/adresse-choisie`. Les brouillons sont absents des réponses publiques de l’API ; ils sont chargés après authentification administrateur. Les adresses en double et la publication de pages vides sont refusées.

## Enregistrer

## Images, portraits et couvertures

Chaque champ image propose une adresse directe, un aperçu et **Importer une image**. Formats importés : PNG, JPG, WebP, GIF et AVIF, jusqu’à 15 Mo avant réduction. L’import produit une image fixe de 1 600 pixels maximum, compressée et enregistrée avec les contenus. Exporter les SVG/HEIC en PNG avant import ; les liens directs vers des SVG restent possibles. Les anciens imports raster sont à nouveau affichables.

Un lien Google Photos de partage ouvre une page, pas un fichier image : télécharger la photo depuis Google Photos, puis l’importer ici. Un lien direct public vers une image reste utilisable ; les liens privés, expirés ou bloqués par l’hébergeur sont signalés par l’aperçu.

La rubrique Actualités contient désormais un champ **Image de couverture de l’article**, indépendant de la vidéo. Le portrait du fait marquant est publié uniquement après activation de la case confirmant l’accord de publication. Les bannières d’accueil, d’inscription, de vidéo, de discipline et d’attribution sont reliées à leurs champs.

Le document complet est limité à 3 Mo dans l’éditeur pour éviter un refus lors de l’enregistrement. Au-delà, remplacer certains imports par des liens d’images hébergées. Aucun import n’est envoyé sur le site avant **Enregistrer et publier**.

## Sauvegarde

Toutes les modifications, y compris les vidéos, restent dans la copie de travail jusqu’à **Enregistrer et publier**, puis confirmation. Ce bouton utilise l’API et le stockage Supabase déjà en place. Un échec conserve les changements pour réessayer. **Annuler** restaure la dernière version chargée ou enregistrée. Une confirmation protège la fermeture lorsqu’il reste des modifications.

Il n’y a pas de nouvelle table Supabase ni de nouveau secret à configurer. Les champs facultatifs `site.textes`, `site.images` et `site.pages` sont conservés dans le document existant.

## Vérification

`npm test` vérifie le rendu des dix pages, le remplacement des textes/logos, la protection contre le HTML et les URL exécutables, les pages personnalisées, les distinctions, la sauvegarde et la confidentialité des brouillons avec un stockage simulé.

`npm run lint` contrôle TypeScript ; `npm run build` produit le site.

La vérification visuelle et interactive sur navigateur reste à effectuer : le lancement de l’aperçu local n’a pas pu être autorisé durant cette session. Après déploiement de test, vérifier la connexion, les menus sur mobile, l’enregistrement, l’annulation, la réouverture de l’administration et la page de confidentialité dans un navigateur non connecté.
