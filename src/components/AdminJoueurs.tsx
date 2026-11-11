import React from 'react';
import { ELCData, ELCJoueurProfil } from '../types';
import { AdminImageInput } from './AdminImageInput';

export function AdminJoueurs({ data, onChange }: { data: ELCData; onChange: (data: ELCData) => void }) {
  const joueurs = data.joueurs ?? [];
  const modifier = (index: number, champ: string, valeur: string) => onChange({
    ...data,
    joueurs: joueurs.map((joueur, i) => i === index ? { ...joueur, [champ]: valeur } : joueur),
  });
  const champs = [
    ['pseudo', 'Pseudo'], ['equipe', 'Équipe / roster'], ['discipline', 'Jeu'],
    ['role', 'Rôle (capitaine, titulaire, remplaçant…)'], ['ville', 'Ville'],
    ['biographie', 'Présentation'],
  ] as const;
  return <div className="admin-content-list">
    <p className="admin-notice">Renseignez le même nom d’équipe pour les membres d’un roster. Les visiteurs peuvent retrouver l’ensemble de ses joueurs avec la recherche.</p>
    {joueurs.map((joueur: ELCJoueurProfil, index: number) => <section className="admin-panel" key={joueur.id || index}>
      <h2>{joueur.pseudo || 'Nouveau joueur'}</h2>
      {champs.map(([champ, label]) => <label className="admin-field" key={champ}>{label}
        <input value={joueur[champ] ?? ''} onChange={e => modifier(index, champ, e.target.value)} />
      </label>)}
      <label className="admin-field">Photo<AdminImageInput value={joueur.photo ?? ''} onChange={e => modifier(index, 'photo', e.target.value)} /></label>
      <button type="button" className="admin-text-button" onClick={() => {
        if (window.confirm('Retirer ce portrait de la vitrine ?')) onChange({ ...data, joueurs: joueurs.filter((_, i) => i !== index) });
      }}>Retirer le portrait</button>
    </section>)}
    <button type="button" className="admin-secondary" onClick={() => onChange({
      ...data, joueurs: [...joueurs, { id: crypto.randomUUID(), pseudo: '', equipe: '', discipline: '', role: '', ville: '', biographie: '', photo: '' }],
    })}>Ajouter un joueur au roster</button>
  </div>;
}
