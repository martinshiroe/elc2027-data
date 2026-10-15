import React, { useState } from 'react';
import { KeyRound, LockKeyhole, Save, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { ELCData } from '../types';
import { contenuDe } from '../data/contenu';
import './admin.css';

export const ADMIN_MODULES = [
  { id:'dashboard', groupe:'Pilotage', titre:'Tableau de bord', description:'Une vue d’ensemble des contenus et des points à vérifier.' },
  { id:'general', groupe:'Pilotage', titre:'Général & Liens', description:'Identité de la compétition, inscriptions et contacts publics de la ligue.' },
  { id:'actualites', groupe:'Contenus', titre:'Actualités', description:'Gérer les nouvelles, images et vidéos de la ligue.' },
  { id:'pages', groupe:'Contenus', titre:'Pages', description:'Présentation de la ligue, bureau, partenaires et fait marquant.' },
  { id:'personnalisation', groupe:'Contenus', titre:'Textes, images & logos', description:'Personnaliser les textes et visuels de toutes les pages publiques.' },
  { id:'pages-libres', groupe:'Contenus', titre:'Pages & catégories', description:'Créer des pages, organiser leurs catégories et choisir où afficher leurs liens.' },
  { id:'donnees', groupe:'Contenus', titre:'Tous les champs du site', description:'Accéder aux contenus détaillés, listes et informations complémentaires de chaque rubrique.' },
  { id:'disciplines', groupe:'Contenus', titre:'Disciplines', description:'Modifier les jeux, leurs logos et leur visibilité.' },
  { id:'calendrier', groupe:'Contenus', titre:'Calendrier & Roadmap', description:'Préparer les phases et les dates de la saison.' },
  { id:'videos', groupe:'Contenus', titre:'Vidéos & Médias', description:'Ajouter, modifier et mettre en avant les vidéos.' },
  { id:'moba', groupe:'Compétition', titre:'Tournois MOBA', description:'Équipes, rencontres, résultats et règlements MOBA.' },
  { id:'tps', groupe:'Compétition', titre:'Roster Battle Royale', description:'Joueurs, points et règlements Battle Royale.' },
  { id:'pantheon', groupe:'Compétition', titre:'Hall of Fame', description:'Distinctions, lauréats, photos et règles d’attribution.' },
] as const;
export type AdminModule = typeof ADMIN_MODULES[number]['id'];

export function AdminLogin({ code, onCode, onSubmit, loading, error, onClose, saison }: {
  code:string; onCode:(v:string)=>void; onSubmit:(e:React.FormEvent)=>void;
  loading:boolean; error:string; onClose:()=>void; saison:string;
}) {
  return <div className="admin-console admin-login">
    <header><strong>ELC / {saison}</strong><span className="admin-badge">ACCÈS ADMINISTRATEUR</span></header>
    <div className="admin-login-grid">
      <section><p className="admin-eyebrow">EAST LEAGUE OF CAMEROON</p>
        <h1>Une saison. Un espace de pilotage.</h1>
        <p className="admin-intro">Contenus, équipes et compétitions de la Ligue Esport Est Cameroun, réunis dans votre console.</p>
        <div className="admin-rule" />
        <ol className="admin-login-steps"><li>Préparer les contenus de la saison</li><li>Vérifier les équipes et résultats</li><li>Valider avant de mettre en ligne</li></ol>
        <div className="admin-notice">Vos modifications sont conservées dans le panneau jusqu’à leur enregistrement.</div>
      </section>
      <form className="admin-login-card" onSubmit={onSubmit}>
        <div className="admin-key"><KeyRound size={24} aria-hidden="true" /></div>
        <h2 id="admin-title">Espace Administrateur ELC</h2>
        <p>Entrez votre code d’accès administrateur pour modifier les contenus et les paramètres de la ligue.</p>
        <label className="admin-field" htmlFor="admin-code">Code d’accès administrateur *
          <input id="admin-code" type="password" autoComplete="current-password" autoFocus required value={code}
            onChange={e=>onCode(e.target.value)} placeholder="Saisir votre code" disabled={loading}
            aria-invalid={Boolean(error)} aria-describedby={error ? 'admin-login-error' : 'admin-code-help'} />
          <small id="admin-code-help">Utilisez le code transmis par l’administration de la ligue.</small>
        </label>
        {error && <p id="admin-login-error" role="alert" className="admin-notice admin-error">{error}</p>}
        <button className="admin-primary" disabled={loading || !code.trim()}><LockKeyhole size={18} aria-hidden="true" />{loading ? 'Vérification…' : 'Déverrouiller le panneau'}</button>
        <button className="admin-text-button" type="button" onClick={onClose}>↗ Retour au site public</button>
      </form>
    </div>
    <footer>Ligue Esport Est Cameroun · Délégation régionale FECASES<span>Administration réservée aux personnes autorisées</span></footer>
  </div>;
}

export function AdminShell({active,onSelect,onClose,onSave,onReset,dirty,loading,success,error,saison,children}: {
  active:AdminModule; onSelect:(id:AdminModule)=>void; onClose:()=>void; onSave:()=>void; onReset:()=>void;
  dirty:boolean; loading:boolean; success?:string; error?:string; saison:string; children:React.ReactNode;
}) {
  const [menu,setMenu]=useState(false);
  const module=ADMIN_MODULES.find(m=>m.id===active)!;
  return <div className="admin-console admin-shell">
    <aside className={menu ? 'admin-sidebar is-open' : 'admin-sidebar'} id="admin-navigation">
      <div className="admin-brand">ELC / {saison}<small>CONSOLE ADMINISTRATEUR</small></div>
      <nav aria-label="Modules d’administration">
        {['Pilotage','Contenus','Compétition'].map(group=><div key={group}><p className="admin-nav-group">{group}</p>
          {ADMIN_MODULES.filter(m=>m.groupe===group).map(m=><button key={m.id} type="button" aria-current={active===m.id?'page':undefined}
            onClick={()=>{onSelect(m.id);setMenu(false);}}>{active===m.id && <span aria-hidden="true">› </span>}{m.titre}</button>)}
        </div>)}
      </nav>
      <button className="admin-text-button" onClick={onClose} disabled={loading}><LogOut size={14} aria-hidden="true" /> Quitter l’administration</button>
    </aside>
    <div className="admin-workspace">
      <header className="admin-session"><button className="admin-menu" aria-label={menu?'Fermer les modules':'Ouvrir les modules'} aria-controls="admin-navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
        <span>East League of Cameroon / Administration</span><span className="admin-session-state">Saison {saison} · Session active</span>
      </header>
      <main className="admin-main" id="admin-module">
        <div className="admin-module-heading"><div><p className="admin-eyebrow">{module.groupe}</p><h1 id="admin-title">{active==='dashboard'?`Préparer la saison ${saison}`:module.titre}</h1><p>{module.description}</p></div></div>
        <fieldset className="admin-editors" disabled={loading}>{children}</fieldset>
      </main>
      <footer className="admin-savebar">
        <div role={error?'alert':'status'} aria-live="polite"><strong className={error?'admin-error-text':''}>{error || (dirty?'Modifications non enregistrées':success || 'Aucun changement en attente')}</strong>
          <p>L’enregistrement met à jour le site public.</p></div>
        <div className="admin-save-actions"><button className="admin-secondary" onClick={onReset} disabled={!dirty || loading}>Annuler</button>
          <button className="admin-primary" onClick={onSave} disabled={!dirty || loading}><Save size={18} aria-hidden="true" />{loading?'Enregistrement…':'Enregistrer et publier'}</button></div>
      </footer>
    </div>
  </div>;
}

export function AdminDashboard({data,onSelect}: {data:ELCData;onSelect:(id:AdminModule)=>void}) {
  const actualites=contenuDe(data).saison.actualites;
  const stats=[['Disciplines',Object.keys(data.competition).length,'disciplines'],['Actualités',actualites.length,'actualites'],['Vidéos',data.videos?.length??0,'videos'],['Pages personnalisées',data.site?.pages?.length??0,'pages-libres']] as const;
  return <div className="admin-dashboard">
    <div className="admin-notice"><strong>Votre espace de gestion</strong><p>Modifiez les contenus, vérifiez leur présentation, puis enregistrez pour mettre le site à jour.</p></div>
    <div className="admin-stats">{stats.map(([label,count,target])=><button className="admin-panel" key={label} onClick={()=>onSelect(target)}><strong>{count}</strong><span>{label}</span><small>Ouvrir le module →</small></button>)}</div>
    <div className="admin-dashboard-columns"><section className="admin-panel"><h2>À vérifier en priorité</h2>
      {([['Coordonnées officielles','Vérifier les liens sociaux et les contacts.','general'],['Programme de la saison','Mettre à jour les disciplines et les dates.','calendrier'],['Hall of Fame','Compléter les distinctions, les textes et les portraits.','pantheon']] as const).map(([title,description,target])=><div className="admin-check" key={target}><h3>{title}</h3><p>{description}</p><button onClick={()=>onSelect(target)} className="admin-text-button">Ouvrir le module <ArrowRight size={14} aria-hidden="true"/></button></div>)}
    </section><section className="admin-panel"><h2>Personnaliser le site</h2><p>Titres, logos, images, navigation et pages supplémentaires.</p><button className="admin-secondary" onClick={()=>onSelect('personnalisation')}>Textes et visuels <ArrowRight size={16}/></button><button className="admin-secondary" onClick={()=>onSelect('pages-libres')}>Créer une page <ArrowRight size={16}/></button></section></div>
    <section className="admin-panel"><h2>Contenus de la ligue</h2>{actualites.length?actualites.slice(0,5).map((a,i)=><div className="admin-content-row" key={a.id??i}><span>{a.titre}</span><small>{a.rubrique}</small><button className="admin-text-button" onClick={()=>onSelect('actualites')}>Modifier →</button></div>):<p>Aucune actualité. Ajoutez votre première annonce dans le module Actualités.</p>}</section>
  </div>;
}
