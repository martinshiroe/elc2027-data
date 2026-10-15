import { AdminImageInput } from './AdminImageInput';
// Éditeurs de l'admin pour le contenu ajouté avec la refonte : actualités
// (avec lien et vidéo), pages « À propos » et « Saison news », fait marquant.
//
// Ils lisent le contenu complet (saisie + textes par défaut de la maquette)
// et réécrivent la section entière dans `formData.contenu` : ce qui s'affiche
// dans l'admin est exactement ce que le site montre.

import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, Youtube, Link2, Newspaper, Users, Star } from 'lucide-react';
import { ELCData, ELCActualite, ELCBlocTexte, ELCMembreBureau } from '../types';
import { contenuDe, ContenuComplet } from '../data/contenu';
import { idYoutube } from './Blocs';

type Maj = (data: ELCData) => void;

/* ------------------------------------------------------------------ */
/* Champs                                                               */
/* ------------------------------------------------------------------ */

const CLASSE_CHAMP = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500';

const Champ: React.FC<{
  label: string;
  valeur: string | undefined;
  onChange: (v: string) => void;
  aide?: string;
  placeholder?: string;
  type?: string;
  multiligne?: boolean;
  lignes?: number;
}> = ({ label, valeur, onChange, aide, placeholder, type = 'text', multiligne, lignes = 3 }) => {
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] text-slate-400 mb-1">
        {label}
      </label>
      {/photo|image|logo/i.test(label) ? <AdminImageInput id={id} value={valeur ?? ''} onChange={e=>onChange(e.target.value)} /> : multiligne ? (
        <textarea id={id} rows={lignes} value={valeur ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={CLASSE_CHAMP} />
      ) : (
        <input id={id} type={type} value={valeur ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={CLASSE_CHAMP} />
      )}
      {aide && <p className="mt-1 text-[10px] text-slate-500">{aide}</p>}
    </div>
  );
};

const Bloc: React.FC<{ titre: string; icone?: React.ReactNode; aide?: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  titre,
  icone,
  aide,
  children,
  action,
}) => (
  <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="font-display font-bold text-amber-400 text-sm flex items-center gap-2">
        {icone}
        {titre}
      </h4>
      {action}
    </div>
    {aide && <p className="text-[11px] text-slate-400">{aide}</p>}
    {children}
  </section>
);

export const BoutonAjout: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 cursor-pointer"
  >
    <Plus className="w-3.5 h-3.5" />
    {children}
  </button>
);

/** Monter, descendre, supprimer un élément d'une liste. */
export function Commandes<T>({
  liste,
  index,
  onChange,
  nom,
}: {
  liste: T[];
  index: number;
  onChange: (l: T[]) => void;
  nom: string;
}) {
  const deplacer = (vers: number) => {
    const l = [...liste];
    [l[index], l[vers]] = [l[vers], l[index]];
    onChange(l);
  };
  const classe = 'p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-default';
  return (
    <div className="flex items-center gap-1">
      <button type="button" className={classe} disabled={index === 0} onClick={() => deplacer(index - 1)} aria-label={`Monter : ${nom}`}>
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button type="button" className={classe} disabled={index === liste.length - 1} onClick={() => deplacer(index + 1)} aria-label={`Descendre : ${nom}`}>
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        className="p-1.5 rounded-md bg-red-500/15 text-red-300 hover:bg-red-500/25 cursor-pointer"
        onClick={() => {
          if (window.confirm(`Supprimer « ${nom} » ? (définitif après « Enregistrer tout »)`)) onChange(liste.filter((_, i) => i !== index));
        }}
        aria-label={`Supprimer : ${nom}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Liste de blocs « titre + texte » (piliers, activités, partenaires). */
const ListeBlocs: React.FC<{ liste: ELCBlocTexte[]; onChange: (l: ELCBlocTexte[]) => void; nomElement: string }> = ({
  liste,
  onChange,
  nomElement,
}) => (
  <div className="space-y-3">
    {liste.map((b, i) => (
      <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">#{i + 1}</span>
          <Commandes liste={liste} index={i} onChange={onChange} nom={b.titre || nomElement} />
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
          <Champ label="Titre" valeur={b.titre} onChange={(v) => onChange(liste.map((x, j) => (j === i ? { ...x, titre: v } : x)))} />
          <Champ label="Texte" valeur={b.texte} multiligne lignes={2} onChange={(v) => onChange(liste.map((x, j) => (j === i ? { ...x, texte: v } : x)))} />
        </div>
      </div>
    ))}
    <BoutonAjout onClick={() => onChange([...liste, { titre: '', texte: '' }])}>Ajouter {nomElement}</BoutonAjout>
  </div>
);

/* ------------------------------------------------------------------ */
/* Écriture dans formData                                               */
/* ------------------------------------------------------------------ */

function majContenu<K extends keyof ContenuComplet>(data: ELCData, maj: Maj, cle: K, valeur: ContenuComplet[K]) {
  maj({ ...data, contenu: { ...(data.contenu ?? {}), [cle]: valeur } });
}

/* ------------------------------------------------------------------ */
/* Onglet « Actualités »                                                */
/* ------------------------------------------------------------------ */

export const OngletActualites: React.FC<{ formData: ELCData; setFormData: Maj }> = ({ formData, setFormData }) => {
  const { saison } = contenuDe(formData);
  const actus = saison.actualites;
  const majSaison = (s: Partial<typeof saison>) => majContenu(formData, setFormData, 'saison', { ...saison, ...s });
  const majActus = (l: ELCActualite[]) => majSaison({ actualites: l });
  const majActu = (i: number, champ: Partial<ELCActualite>) => majActus(actus.map((a, j) => (j === i ? { ...a, ...champ } : a)));

  const ajouter = () =>
    majActus([
      {
        id: `actu-${Date.now()}`,
        rubrique: 'Actualité',
        titre: '',
        texte: '',
        date: new Date().toISOString().slice(0, 10),
      },
      ...actus,
    ]);

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-400">
        Les actualités s'affichent sur la page « Saison news » dans cet ordre ; les deux premières apparaissent aussi sur
        l'accueil. Ajoutez un lien (inscription, article, formulaire…) ou une vidéo : une vidéo YouTube se lit
        directement sur le site, une vidéo TikTok ou autre s'ouvre dans un nouvel onglet. Pensez à « Enregistrer tout ».
      </p>

      <Bloc
        titre={`Actualités (${actus.length})`}
        icone={<Newspaper className="w-4 h-4" />}
        action={<BoutonAjout onClick={ajouter}>Nouvelle actualité</BoutonAjout>}
      >
        {actus.length === 0 && <p className="text-xs text-slate-500">Aucune actualité : la section est masquée sur l'accueil.</p>}
        <div className="space-y-4">
          {actus.map((a, i) => {
            const youtube = a.video ? Boolean(idYoutube(a.video)) : false;
            const lienDouteux = a.lien?.url && !/^https?:\/\//i.test(a.lien.url);
            return (
              <article key={a.id ?? i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {i < 2 && <span className="mr-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Accueil</span>}
                    {a.titre || 'Nouvelle actualité'}
                  </span>
                  <Commandes liste={actus} index={i} onChange={majActus} nom={a.titre || 'cette actualité'} />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Champ label="Rubrique" valeur={a.rubrique} placeholder="Compétition, Matchs custom…" onChange={(v) => majActu(i, { rubrique: v })} />
                  <Champ label="Date" type="date" valeur={a.date} onChange={(v) => majActu(i, { date: v })} />
                  <Champ label="Note de bas de carte (facultatif)" valeur={a.note} placeholder="Ex. : dates à confirmer" onChange={(v) => majActu(i, { note: v })} />
                </div>
                <Champ label="Titre" valeur={a.titre} onChange={(v) => majActu(i, { titre: v })} />
                <Champ label="Image de couverture de l’article" valeur={a.image} onChange={(v) => majActu(i, { image: v || undefined })} aide="Affichée en haut de l’article, même avec une vidéo." />
                <Champ label="Texte" valeur={a.texte} multiligne lignes={4} onChange={(v) => majActu(i, { texte: v })} />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" /> Lien (facultatif)
                    </p>
                    <Champ
                      label="Adresse"
                      type="url"
                      valeur={a.lien?.url}
                      placeholder="https://…"
                      onChange={(v) => majActu(i, { lien: v ? { url: v, libelle: a.lien?.libelle } : undefined })}
                    />
                    <Champ
                      label="Texte du bouton"
                      valeur={a.lien?.libelle}
                      placeholder="En savoir plus"
                      onChange={(v) => a.lien?.url && majActu(i, { lien: { url: a.lien.url, libelle: v } })}
                    />
                    {lienDouteux && <p className="text-[10px] text-red-300">L'adresse doit commencer par https:// pour être affichée.</p>}
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5" /> Vidéo (facultatif)
                    </p>
                    <Champ
                      label="Lien de la vidéo"
                      type="url"
                      valeur={a.video}
                      placeholder="https://youtube.com/… ou https://tiktok.com/…"
                      onChange={(v) => majActu(i, { video: v || undefined })}
                    />
                    {a.video && (
                      <p className={`text-[10px] ${youtube ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {youtube ? 'Vidéo YouTube : lecture directement sur le site.' : 'Cette vidéo s’ouvrira dans un nouvel onglet.'}
                      </p>
                    )}

                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Bloc>

      <Bloc titre="Encadré « Le prochain chapitre » (Saison news)" icone={<Star className="w-4 h-4" />}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Champ label="Année" valeur={saison.chapitre.annee} onChange={(v) => majSaison({ chapitre: { ...saison.chapitre, annee: v } })} />
          <Champ label="Statut" valeur={saison.chapitre.statut} placeholder="Programme à confirmer" onChange={(v) => majSaison({ chapitre: { ...saison.chapitre, statut: v } })} />
          <Champ label="Texte" valeur={saison.chapitre.texte} multiligne lignes={2} onChange={(v) => majSaison({ chapitre: { ...saison.chapitre, texte: v } })} />
        </div>
      </Bloc>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Onglet « Pages » : À propos et fait marquant                          */
/* ------------------------------------------------------------------ */

export const OngletPages: React.FC<{ formData: ELCData; setFormData: Maj }> = ({ formData, setFormData }) => {
  const { apropos, faitMarquant } = contenuDe(formData);
  const majApropos = (p: Partial<typeof apropos>) => majContenu(formData, setFormData, 'apropos', { ...apropos, ...p });
  const majFait = (f: Partial<typeof faitMarquant>) => majContenu(formData, setFormData, 'faitMarquant', { ...faitMarquant, ...f });
  const bureau = apropos.bureau;
  const majMembre = (i: number, m: Partial<ELCMembreBureau>) => majApropos({ bureau: bureau.map((x, j) => (j === i ? { ...x, ...m } : x)) });
  const stats = faitMarquant.stats ?? [];

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-400">
        Textes des pages « À propos » et « Hall of Fame ». Un champ vidé reprend le texte d'origine de la maquette. Pensez
        à « Enregistrer tout ».
      </p>

      <Bloc titre="Qui nous sommes">
        <Champ label="Accroche (titre)" valeur={apropos.accroche} onChange={(v) => majApropos({ accroche: v })} />
        <Champ label="Présentation" valeur={apropos.presentation} multiligne lignes={2} onChange={(v) => majApropos({ presentation: v })} />
        <p className="text-[11px] font-bold text-slate-300 pt-2">Mission, vision, objectif…</p>
        <ListeBlocs liste={apropos.piliers} onChange={(l) => majApropos({ piliers: l })} nomElement="un pilier" />
      </Bloc>

      <Bloc titre="Ce que nous faisons">
        <ListeBlocs liste={apropos.activites} onChange={(l) => majApropos({ activites: l })} nomElement="une activité" />
        <div className="grid gap-2 sm:grid-cols-3 pt-2">
          <Champ label="Encadré compétition : titre" valeur={apropos.competition.titre} onChange={(v) => majApropos({ competition: { ...apropos.competition, titre: v } })} />
          <Champ label="Texte" valeur={apropos.competition.texte} multiligne lignes={2} onChange={(v) => majApropos({ competition: { ...apropos.competition, texte: v } })} />
          <Champ label="Projet (petit texte)" valeur={apropos.competition.projet} multiligne lignes={2} onChange={(v) => majApropos({ competition: { ...apropos.competition, projet: v } })} />
        </div>
      </Bloc>

      <Bloc
        titre={`Bureau exécutif (${bureau.length})`}
        icone={<Users className="w-4 h-4" />}
        action={<BoutonAjout onClick={() => majApropos({ bureau: [...bureau, { nom: '', role: '' }] })}>Ajouter un membre</BoutonAjout>}
      >
        <Champ label="Date de la liste" valeur={apropos.dateBureau} placeholder="17 février 2026" onChange={(v) => majApropos({ dateBureau: v })} />
        <div className="space-y-3">
          {bureau.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{m.nom || 'Nouveau membre'}</span>
                <Commandes liste={bureau} index={i} onChange={(l) => majApropos({ bureau: l })} nom={m.nom || 'ce membre'} />
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <Champ label="Nom" valeur={m.nom} onChange={(v) => majMembre(i, { nom: v })} />
                <Champ label="Rôle" valeur={m.role} onChange={(v) => majMembre(i, { role: v })} />
                <Champ label="Photo (adresse)" type="url" valeur={m.photo} placeholder="https://…" onChange={(v) => majMembre(i, { photo: v || undefined })} />
              </div>
              <Champ label="Biographie" valeur={m.biographie} multiligne lignes={2} onChange={(v) => majMembre(i, { biographie: v || undefined })} />
            </div>
          ))}
        </div>
        <Champ
          label="Production visuelle et streaming"
          valeur={apropos.production.texte}
          multiligne
          lignes={2}
          onChange={(v) => majApropos({ production: { ...apropos.production, texte: v } })}
        />
      </Bloc>

      <Bloc titre={`Équipes de la communauté (${apropos.equipes.length})`} aide="Laissez la liste vide pour afficher « Aucune présentation disponible pour le moment ».">
        <div className="space-y-2">
          {apropos.equipes.map((e, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Champ label={`Équipe ${i + 1}`} valeur={e} onChange={(v) => majApropos({ equipes: apropos.equipes.map((x, j) => (j === i ? v : x)) })} />
              </div>
              <Commandes liste={apropos.equipes} index={i} onChange={(l) => majApropos({ equipes: l })} nom={e || 'cette équipe'} />
            </div>
          ))}
        </div>
        <BoutonAjout onClick={() => majApropos({ equipes: [...apropos.equipes, ''] })}>Ajouter une équipe</BoutonAjout>
      </Bloc>

      <Bloc titre="Partenaires et soutiens">
        <p className="text-xs text-slate-400">Pour la FECASES comme pour chaque partenaire, ajoutez le logo et l’adresse de sa page ou de son site. Le lien s’ouvre dans un nouvel onglet.</p>
        {apropos.partenaires.map((p, i) => {
          const update = (patch: Partial<typeof p>) => majApropos({partenaires: apropos.partenaires.map((item, j) => j === i ? {...item, ...patch} : item)});
          return <div key={i} className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <Commandes liste={apropos.partenaires} index={i} onChange={partenaires=>majApropos({partenaires})} nom={p.titre || 'ce partenaire'}/>
            <Champ label="Nom du partenaire" valeur={p.titre} onChange={titre=>update({titre})}/>
            <Champ label="Présentation" valeur={p.texte} multiligne onChange={texte=>update({texte})}/>
            <Champ label="Logo du partenaire" valeur={p.logo} onChange={logo=>update({logo:logo || undefined})}/>
            <Champ label="Lien vers le site ou la page" valeur={p.url} placeholder="https://…" onChange={url=>update({url:url || undefined})} aide="Adresse complète commençant par https:// ou http://."/>
            {p.url && !/^https?:\/\//i.test(p.url.trim()) && <p role="alert" className="text-xs text-amber-300">Ajoutez https:// au début du lien. Un lien invalide ne sera pas actif sur la vitrine.</p>}
          </div>;
        })}
        <BoutonAjout onClick={()=>majApropos({partenaires:[...apropos.partenaires,{titre:'Nouveau partenaire',texte:''}]})}>Ajouter un partenaire</BoutonAjout>
      </Bloc>

      <Bloc titre="Fait marquant (À propos et Hall of Fame)" icone={<Star className="w-4 h-4" />}>
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input type="checkbox" checked={Boolean(faitMarquant.publie)} onChange={(e) => majFait({ publie: e.target.checked })} />
          Publier le portrait — je confirme avoir obtenu l’accord de publication (sans cette case, la photo reste masquée sur le site)
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          <Champ label="Nom" valeur={faitMarquant.nom} onChange={(v) => majFait({ nom: v })} />
          <Champ label="Surnom" valeur={faitMarquant.surnom} onChange={(v) => majFait({ surnom: v })} />
          <Champ label="Distinction" valeur={faitMarquant.distinction} placeholder="Double MVP, Gold Laner" onChange={(v) => majFait({ distinction: v })} />
        </div>
        <Champ label="Description" valeur={faitMarquant.description} multiligne lignes={2} onChange={(v) => majFait({ description: v })} />
        <Champ label="Photo (adresse)" type="url" valeur={faitMarquant.photo} placeholder="https://…" onChange={(v) => majFait({ photo: v || undefined })} />
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="w-28">
                <Champ label="Chiffre" valeur={s.valeur} onChange={(v) => majFait({ stats: stats.map((x, j) => (j === i ? { ...x, valeur: v } : x)) })} />
              </div>
              <div className="flex-1">
                <Champ label="Légende" valeur={s.legende} onChange={(v) => majFait({ stats: stats.map((x, j) => (j === i ? { ...x, legende: v } : x)) })} />
              </div>
              <Commandes liste={stats} index={i} onChange={(l) => majFait({ stats: l })} nom={s.legende || 'ce chiffre'} />
            </div>
          ))}
          <BoutonAjout onClick={() => majFait({ stats: [...stats, { valeur: '', legende: '' }] })}>Ajouter un chiffre</BoutonAjout>
        </div>
        <Champ label="Source / mention" valeur={faitMarquant.source} multiligne lignes={2} onChange={(v) => majFait({ source: v })} />
      </Bloc>
    </div>
  );
};
