import React, { useState } from 'react';
import { ELCData, ELCPageLibre } from '../types';
import catalogue from '../data/siteContentCatalog.json';
import { urlSure } from '../lib/urls';

type Props={data:ELCData;onChange:(data:ELCData)=>void};
const noms:Record<string,string>={PageAccueil:'Accueil',PageHallOfFame:'Hall of Fame',Header:'Menu et logos',Footer:'Pied de page',ui:'Éléments communs',Blocs:'Blocs communs',PageAPropos:'À propos',PageSaison:'Actualités',PageCalendrier:'Calendrier',PageClassements:'Classements',PageJoueurs:'Joueurs',PageContact:'Contact',PageInscription:'Inscription',PageVideos:'Vidéos',RegulationsModal:'Mentions et règlements'};
function nom(f:string){return noms[f.replace('.tsx','')]??f.replace('.tsx','');}
export function AdminPersonnalisation({data,onChange}:Props) {
  const [query,setQuery]=useState(''); const [page,setPage]=useState(''); const [mode,setMode]=useState<'textes'|'images'>('textes');
  const [limit,setLimit]=useState(40);
  const entries=catalogue[mode].filter(e=>(!page||e.fichiers.includes(page))&&`${e.valeur} ${(data.site?.[mode]??{})[e.valeur]??''}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
  const files=[...new Set(catalogue[mode].flatMap(e=>e.fichiers))].sort();
  function update(key:string,value:string,reset=false){const values={...data.site?.[mode]};if(reset)delete values[key];else values[key]=value;onChange({...data,site:{...data.site,[mode]:values}});}
  return <>
    <div className="admin-notice mb-6">Ces réglages modifient les libellés et visuels du site. Pour les équipes, articles, portraits et résultats, utilisez leurs modules dédiés. Un même libellé partagé est modifié partout où il apparaît.</div>
    <div className="admin-toolbar">
      <select aria-label="Type de contenu" value={mode} onChange={e=>{setMode(e.target.value as typeof mode);setPage('');setLimit(40);}}><option value="textes">Textes et libellés</option><option value="images">Images et logos</option></select>
      <input aria-label="Rechercher un contenu" placeholder="Rechercher un titre, un bouton, un texte…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(40);}} />
      <select aria-label="Filtrer par page" value={page} onChange={e=>{setPage(e.target.value);setLimit(40);}}><option value="">Toutes les pages</option>{files.map(f=><option key={f} value={f}>{nom(f)}</option>)}</select>
    </div>
    <p className="mb-4">{entries.length} élément(s)</p>
    <div className="admin-content-list">{entries.slice(0,limit).map(entry=>{
      const value=data.site?.[mode]?.[entry.valeur]??entry.valeur;
      return <details className="admin-panel" key={entry.valeur}>
        <summary>{entry.valeur.length>130?entry.valeur.slice(0,130)+'…':entry.valeur}</summary>
        <p className="text-xs">{entry.fichiers.map(nom).join(' · ')}</p>
        {mode==='images'&&<img src={urlSure(value)} className="admin-image-preview" alt="Aperçu du visuel" />}
        <label className="admin-field">{mode==='textes'?'Texte affiché':'Adresse de l’image ou du logo'}
          {mode==='textes'?<textarea rows={value.length>120?4:2} value={value} onChange={e=>update(entry.valeur,e.target.value)}/>:<input value={value} onChange={e=>update(entry.valeur,e.target.value)} placeholder="https://… ou /img/…"/>}
        </label>
        <button type="button" className="admin-text-button" onClick={()=>update(entry.valeur,'',true)}>Rétablir la valeur d’origine</button>
      </details>;
    })}</div>
    {!entries.length&&<div className="admin-panel">Aucun résultat pour cette recherche.</div>}
    {entries.length>limit&&<button type="button" className="admin-secondary mt-5" onClick={()=>setLimit(limit+40)}>Afficher les suivants</button>}
  </>;
}

export function slugPage(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export function validerPages(pages:ELCPageLibre[]):string|null {
  const seen=new Set<string>();
  for(const p of pages){
    if(!p.titre.trim())return 'Chaque page doit avoir un titre.';
    if(!p.slug||slugPage(p.slug)!==p.slug)return 'Utilisez une adresse composée de lettres minuscules, chiffres et tirets.';
    if(seen.has(p.slug))return `L’adresse « ${p.slug} » est déjà utilisée.`;
    seen.add(p.slug);
    if(p.publie&&!p.texte.trim())return `Ajoutez le contenu de « ${p.titre} » avant de la publier.`;
    if(p.image && !urlSure(p.image))return `L’image de « ${p.titre} » n’a pas une adresse valide.`;
  }
  return null;
}
export function AdminPagesLibres({data,onChange}:Props){
  const pages=data.site?.pages??[];
  const [selected,setSelected]=useState<string|null>(pages[0]?.id??null);
  const [error,setError]=useState('');
  const current=pages.find(p=>p.id===selected);
  function save(next:ELCPageLibre[]){onChange({...data,site:{...data.site,pages:next}});setError('');}
  function add(privacy=false){
    const base=privacy?'politique-de-confidentialite':'nouvelle-page';let slug=base;let i=2;while(pages.some(p=>p.slug===slug))slug=base+'-'+i++;
    const p:ELCPageLibre={id:crypto.randomUUID(),slug,titre:privacy?'Politique de confidentialité':'Nouvelle page',categorie:privacy?'Informations légales':'Informations',texte:'',publie:false,menu:false,piedDePage:true};save([...pages,p]);setSelected(p.id);
  }
  function update(patch:Partial<ELCPageLibre>){if(!current)return;save(pages.map(p=>p.id===current.id?{...p,...patch}:p));}
  return <div className="admin-content-list">
    <div className="admin-toolbar"><button type="button" className="admin-primary" onClick={()=>add()}>+ Nouvelle page</button><button type="button" className="admin-secondary" onClick={()=>add(true)}>+ Politique de confidentialité</button></div>
    <div className="admin-notice">Créez votre contenu puis activez « Publier la page ». Les brouillons n’apparaissent ni dans les menus ni sur le site public. La politique de confidentialité doit décrire vos pratiques réelles.</div>
    {pages.length>0&&<label className="admin-field">Page à modifier<select value={selected??''} onChange={e=>setSelected(e.target.value)}><option value="" disabled>Choisir une page</option>{pages.map(p=><option key={p.id} value={p.id}>{p.titre} — {p.publie?'Publiée':'Brouillon'}</option>)}</select></label>}
    {current&&<section className="admin-panel admin-page-grid">
      <label className="admin-field">Titre<input value={current.titre} onChange={e=>update({titre:e.target.value})}/></label>
      <label className="admin-field">Adresse de la page<input value={current.slug} onChange={e=>update({slug:slugPage(e.target.value)})}/><small>/pages/{current.slug}</small></label>
      <label className="admin-field">Catégorie<input list="categories-pages" value={current.categorie} onChange={e=>update({categorie:e.target.value})}/><datalist id="categories-pages">{[...new Set(pages.map(p=>p.categorie))].map(c=><option key={c} value={c}/>)}</datalist></label>
      <label className="admin-field">Image de couverture (facultative)<input value={current.image??''} onChange={e=>update({image:e.target.value})}/></label>
      <label className="admin-field admin-wide">Contenu<textarea rows={16} value={current.texte} onChange={e=>update({texte:e.target.value})}/><small>Texte libre. Les sauts de ligne sont conservés.</small></label>
      <div className="admin-wide"><label className="admin-checkbox"><input type="checkbox" checked={current.publie} onChange={e=>{
        if(e.target.checked){const message=validerPages(pages.map(p=>p.id===current.id?{...p,publie:true}:p));if(message){setError(message);return;}}update({publie:e.target.checked});
      }}/>Publier la page</label><label className="admin-checkbox"><input type="checkbox" checked={current.menu} onChange={e=>update({menu:e.target.checked})}/>Afficher dans le menu</label><label className="admin-checkbox"><input type="checkbox" checked={current.piedDePage} onChange={e=>update({piedDePage:e.target.checked})}/>Afficher dans le pied de page</label></div>
      {error&&<p role="alert" className="admin-error-text admin-wide">{error}</p>}
      <button type="button" className="admin-text-button" onClick={()=>{if(window.confirm(`Supprimer la page « ${current.titre} » ? La suppression sera appliquée à l’enregistrement.`)){save(pages.filter(p=>p.id!==current.id));setSelected(null);}}}>Supprimer cette page</button>
    </section>}
    {current&&<section className="admin-panel"><h2>Aperçu du contenu</h2><p className="admin-eyebrow">{current.categorie}</p><h3 className="text-xl mb-4">{current.titre}</h3><div className="whitespace-pre-wrap break-words">{current.texte||'Le contenu de la page apparaîtra ici.'}</div></section>}
  </div>;
}

export function AdminDistinctions({data,onChange}:Props){
  const defaults=[{key:'goat',title:'G.O.A.T',couleur:'#ffd700'},{key:'godlike',title:'GodLike',couleur:'#3b82f6'},{key:'demonking',title:'Demon King',couleur:'#ef4444'},{key:'mvp',title:'MVP',couleur:'#14b8a6'}];
  const saved=data.pantheon?.distinctions??[];
  const entries=[...defaults,...saved.filter(d=>!defaults.some(v=>v.key===d.key))];
  function update(key:string,patch:Record<string,unknown>){
    const existing=saved.find(d=>d.key===key)??{key,title:defaults.find(d=>d.key===key)?.title??'',subtitle:'',desc:''};
    const next=saved.some(d=>d.key===key)?saved.map(d=>d.key===key?{...d,...patch}:d):[...saved,{...existing,...patch}];
    onChange({...data,pantheon:{...data.pantheon,distinctions:next}});
  }
  return <section className="admin-panel mb-6"><h2>Catégories et identité des distinctions</h2><p>Les titres, descriptions, lauréats et portraits se modifient dans les fiches ci-dessous.</p>
    <div className="admin-content-list mt-4">{entries.map(d=>{const current=saved.find(v=>v.key===d.key);return <div className="admin-page-grid" key={d.key}>
      <label className="admin-checkbox"><input type="checkbox" checked={current?.visible!==false} onChange={e=>update(d.key,{visible:e.target.checked})}/>{current?.title||d.title}</label>
      <label className="admin-field">Couleur<input type="color" value={current?.couleur??d.couleur??'#f4b544'} onChange={e=>update(d.key,{couleur:e.target.value})}/></label>
      <label className="admin-field admin-wide">Logo de la distinction (facultatif)<input value={current?.logoImage??''} placeholder="https://… ou /img/…" onChange={e=>update(d.key,{logoImage:e.target.value})}/></label>
    </div>;})}</div>
    <button type="button" className="admin-primary mt-5" onClick={()=>update('distinction-'+crypto.randomUUID(),{title:'Nouvelle distinction',subtitle:'',desc:'',visible:true,couleur:'#f4b544'})}>+ Ajouter une distinction</button>
  </section>;
}
