import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Le service worker télécharge la nouvelle version en arrière-plan et prend
// la main aussitôt (skipWaiting + clientsClaim), mais la page déjà ouverte
// continue d'exécuter l'ancien JavaScript jusqu'au prochain rechargement.
// C'est ce décalage qui faisait qu'un champ ajouté dans l'admin n'apparaissait
// pas, alors que le serveur servait bien la version à jour : il fallait
// recharger deux fois pour le voir.
//
// On recharge donc dès que la nouvelle version prend le contrôle. Le garde-fou
// sur le contrôleur initial évite de recharger au tout premier chargement,
// quand le service worker s'installe pour la première fois — il n'y a alors
// rien de périmé à remplacer.
// Le rechargement n'a lieu que dans la minute qui suit l'ouverture de la page :
// c'est là que le service worker bascule en pratique. Passé ce délai, on laisse
// la main à l'utilisateur plutôt que de risquer de recharger sous ses doigts
// pendant qu'il saisit une fiche dans l'admin.
if ('serviceWorker' in navigator) {
  const avaitDejaUnControleur = Boolean(navigator.serviceWorker.controller);
  const ouvertureDeLaPage = Date.now();
  let rechargementEnCours = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!avaitDejaUnControleur || rechargementEnCours) return;
    if (Date.now() - ouvertureDeLaPage > 60_000) return;
    rechargementEnCours = true;
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
