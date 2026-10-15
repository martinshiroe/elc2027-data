import { AdminImageInput } from './AdminImageInput';
import React from 'react';
import { ELCData } from '../types';
import { contenuDe } from '../data/contenu';

const labels:Record<string,string>={meta:'Identité, contacts et visuels',visual1:'Présentation et disciplines',visual2:'Calendrier et format',visual3:'Informations de compétition',visual4:'Règlements et informations',competition:'Compétitions et résultats',joueurs:'Joueurs',pantheon:'Hall of Fame',videos:'Vidéos',contenu:'Contenus éditoriaux',apropos:'À propos',saison:'Saison',faitMarquant:'Fait marquant',curated:'Lauréats',distinctions:'Distinctions',attributionSteps:'Étapes d’attribution',bracket:'Tableau de compétition',equipes:'Équipes',roster:'Joueurs engagés',hok:'Honor of Kings',mlbb:'Mobile Legends',pubgm:'PUBG Mobile',ff:'Free Fire'};
const title=(key:string)=>labels[key]??key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ');
type Value=string|number|boolean|null|Value[]|{[key:string]:Value};

function ChampStructure({value,label,onChange}: {value:Value;label:string;onChange:(value:Value)=>void}) {
  if (typeof value==='boolean') return <label className="admin-checkbox"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>{label}</label>;
  if (typeof value==='number') return <label className="admin-field">{label}<input type="number" step="any" value={value} onChange={e=>{if(Number.isFinite(e.target.valueAsNumber))onChange(e.target.valueAsNumber);}}/></label>;
  if ((typeof value==='string'||value===null) && /photo|image|logo|thumbnail|nomine hero/i.test(label)) return <label className="admin-field">{label}<AdminImageInput value={value??''} onChange={e=>onChange(e.target.value)}/></label>;
  if(typeof value==='string'||value===null) return <label className="admin-field">{label}<textarea rows={String(value??'').length>150?4:2} value={value??''} onChange={e=>onChange(e.target.value)}/></label>;
  if(Array.isArray(value))return <details className="admin-panel"><summary>{label} ({value.length})</summary><div className="admin-content-list mt-4">
    {value.map((item,i)=><div key={i}><ChampStructure value={item} label={`${label} ${i+1}`} onChange={next=>onChange(value.map((v,j)=>j===i?next:v))}/><div className="admin-toolbar mt-2">
      <button type="button" className="admin-text-button" disabled={i===0} onClick={()=>{const next=[...value];[next[i-1],next[i]]=[next[i],next[i-1]];onChange(next);}}>↑ Monter</button>
      <button type="button" className="admin-text-button" onClick={()=>{if(window.confirm('Retirer cet élément de la liste ?'))onChange(value.filter((_,j)=>j!==i));}}>Retirer</button>
    </div></div>)}
    {value.length>0&&<button type="button" className="admin-secondary" onClick={()=>{const copy=JSON.parse(JSON.stringify(value[value.length-1]));if(copy&&typeof copy==='object'&&!Array.isArray(copy)){if('id'in copy)copy.id=crypto.randomUUID();if('key'in copy)copy.key='element-'+crypto.randomUUID();}onChange([...value,copy]);}}>Dupliquer le dernier élément</button>}
    {!value.length&&<p>Liste vide. Utilisez le module dédié pour créer le premier élément.</p>}
  </div></details>;
  return <details className="admin-panel"><summary>{label}</summary><div className="admin-content-list mt-4">{Object.entries(value).filter(([key])=>!['id','key'].includes(key)).map(([key,item])=><ChampStructure key={key} value={item} label={title(key)} onChange={next=>onChange({...value,[key]:next})}/>)}</div></details>;
}
export function AdminChamps({data,onChange}: {data:ELCData;onChange:(data:ELCData)=>void}) {
  const complete={...data,contenu:contenuDe(data)};
  return <div className="admin-content-list"><div className="admin-notice">Les modifications s’appliquent aux mêmes contenus que les modules dédiés. Les textes fixes et les logos sont disponibles dans « Textes, images & logos ».</div>
    {Object.entries(complete).filter(([key])=>key!=='site').map(([key,value])=><ChampStructure key={key} label={title(key)} value={value as Value} onChange={next=>onChange({...data,[key]:next})}/>)}</div>;
}
