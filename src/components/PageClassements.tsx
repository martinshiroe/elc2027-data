import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React, { useMemo, useState } from 'react';
import { ListOrdered, Trophy, ExternalLink, Search, Newspaper, CircleDashed } from 'lucide-react';
import { ELCData, ELCMobaGame, ELCTpsGame, ELCBracketTeam } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import {
  Conteneur,
  EnTetePage,
  Carte,
  TitreCarte,
  LienPage,
  TitreSection,
  Avis,
  BoutonLien,
  initiales,
} from './ui';
import { OngletsSaison } from './OngletsSaison';
import { JEUX, Jeu, jeuxActifs } from './Blocs';
import { EtatDonnees, EnChargement, Barre, CarteEtat, LienCourt, LiensCourts } from './Etats';

interface PageClassementsProps {
  data: ELCData;
  jeu: Jeu;
  etat: EtatDonnees;
  onReessayer: () => void;
  onNaviguer: (section: Section, jeu?: string) => void;
}

type Naviguer = (section: Section, jeu?: string) => void;

const RetourActus: React.FC<{ onNaviguer: Naviguer }> = ({ onNaviguer }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <LienPage section="saison" onNaviguer={onNaviguer} bouton="contour">{texteSite("Retour aux actualités")}</LienPage>
)); };

// Les emplacements non attribués portent un nom générique (« Équipe 3 »,
// « Joueur 12 ») : ils ne doivent pas apparaître comme des engagés.
const estGenerique = (nom: string | undefined) => !nom || /^(équipe|equipe|joueur)\s*\d+$/i.test(nom.trim());

const deuxChiffres = (n: number) => String(n).padStart(2, '0');

export const PageClassements: React.FC<PageClassementsProps> = ({ data, jeu, etat, onReessayer, onNaviguer }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const info = JEUX.find((j) => j.id === jeu)!;
  const moba = jeu === 'hok' || jeu === 'mlbb';
  const actifs = jeuxActifs(data);
  // L'autre jeu de la même famille, s'il est actif cette saison.
  const infoAutre = actifs.find((j) => j.id !== jeu && j.famille === info.famille);
  const titres = data.visual1?.titres?.find((t) => t.id === jeu);

  return (
    <>
      <EnTetePage image={data.competition[jeu]?.heroImage || undefined}>
        <Conteneur>
          <p className="surtitre mb-4">{texteSite("Saison news · ELC ")}{data.meta.saison || '2027'}</p>
          <h1 className="titre text-[1.6rem] sm:text-5xl lg:text-[3.6rem]">{texteSite("Ranking —")}<span className="block">{texteSite(info.nom)}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">
            {texteSite(info.famille)}{texteSite(" · ")}{titres?.badge ? `${titres.badge.toLowerCase()}, ` : ''}
            {moba
              ? 'classement par séries, puis tableau final à élimination directe.'
              : 'classement individuel au cumul des points de placement et des éliminations.'}
            {titres?.lancement ? ` Lancement prévu : ${titres.lancement}.` : ''}
          </p>
          <div className="mt-8 sm:mt-12">
            <OngletsSaison actif={jeu} jeux={actifs.map((j) => j.id)} onNaviguer={onNaviguer} />
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-10 sm:pb-14">
        <Conteneur>
          {etat === 'chargement' ? (
            <ChargementClassement nom={info.nom} moba={moba} />
          ) : etat === 'erreur' ? (
            <CarteEtat
              icone={<CircleDashed className="h-6 w-6" />}
              titre="Le classement n'a pas pu être chargé."
              erreur
              onReessayer={onReessayer}
              actions={<RetourActus onNaviguer={onNaviguer} />}
            >{texteSite("Les données du classement ")}{texteSite(info.nom)}{texteSite(" sont inaccessibles pour le moment. Il s'agit d'un problème de chargement, pas d'une absence de résultats. Aucun tableau n'est affiché à leur place.")}</CarteEtat>
          ) : moba ? (
            <ClassementMoba jeu={data.competition[jeu as 'hok' | 'mlbb']} data={data} onNaviguer={onNaviguer} />
          ) : (
            <ClassementTps jeu={data.competition[jeu as 'pubgm' | 'ff']} onNaviguer={onNaviguer} />
          )}
          {etat !== 'pret' && (
            <Avis titre={`ELC ${data.meta.saison || '2027'} · Résultats officiels`} className="mt-8">{texteSite("Les résultats officiels de ")}{texteSite(info.nom)}{texteSite(" sont publiés ici après validation par la ligue.")}{titres?.lancement ? ` Lancement prévu : ${titres.lancement}.` : ''}
            </Avis>
          )}
        </Conteneur>
      </section>

      {/* ---------- Calendrier de la discipline ---------- */}
      {etat === 'pret' && <CalendrierJeu jeu={data.competition[jeu]} startGgUrl={data.meta.startGgUrl} />}

      {/* ---------- Liens ---------- */}
      <section className="pb-14 sm:pb-20">
        <Conteneur>
          <LiensCourts>
            <LienCourt
              section="saison"
              onNaviguer={onNaviguer}
              titre="Saison news"
              action="Retour aux actualités"
              icone={<Newspaper className="h-6 w-6" />}
            />
            {infoAutre && (
              <LienCourt
                section="classements"
                jeu={infoAutre.id}
                onNaviguer={onNaviguer}
                titre={infoAutre.nom}
                action={`Voir le ranking ${infoAutre.court}`}
                icone={<ListOrdered className="h-6 w-6" />}
              />
            )}
            <LienCourt
              section="pantheon"
              onNaviguer={onNaviguer}
              titre="Hall of Fame"
              action="Explorer le Hall of Fame"
              icone={<Trophy className="h-6 w-6" />}
            />
          </LiensCourts>
        </Conteneur>
      </section>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Chiffres clés                                                        */
/* ------------------------------------------------------------------ */

const ChiffresCles: React.FC<{ chiffres: { valeur: string; legende: string; detail?: string }[] }> = ({ chiffres }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <dl className="grid grid-cols-3 gap-2.5 sm:gap-5">
    {chiffres.map((c) => (
      <div key={c.legende} className="flex flex-col gap-1 border border-bord bg-carte px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-5">
        <dd className="titre text-2xl normal-case sm:text-4xl">{texteSite(c.valeur)}</dd>
        <dt className="text-xs leading-snug text-texte sm:text-base">
          {texteSite(c.legende)}
          {c.detail && <span className="block text-[0.7rem] text-doux sm:text-xs">{texteSite(c.detail)}</span>}
        </dt>
      </div>
    ))}
  </dl>
)); };

const CelluleEquipe: React.FC<{ nom: string; logo?: string }> = ({ nom, logo }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <div className="flex items-center gap-3">
    {logo ? (
      <ImagePublique src={imageSite(logo)} alt={texteSite("")} loading="lazy" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 border border-bord-fort object-cover" />
    ) : (
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-bord-fort bg-carte-haute text-[0.65rem] font-extrabold italic text-doux">
        {initiales(nom)}
      </span>
    )}
    <span className="font-bold italic text-white">{texteSite(nom)}</span>
  </div>
)); };

/* ------------------------------------------------------------------ */
/* Chargement                                                           */
/* ------------------------------------------------------------------ */

const ChargementClassement: React.FC<{ nom: string; moba: boolean }> = ({ nom, moba }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
  <div>
    <EnChargement texte={`Chargement du classement ${nom}…`} />
    <div className="grid grid-cols-3 gap-2.5 sm:gap-5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 border border-bord bg-carte px-4 py-5">
          <Barre className="h-6 w-10 shrink-0" />
          <Barre className="flex-1" />
        </div>
      ))}
    </div>
    <Carte className="mt-5 overflow-hidden">
      <div className="border-b border-bord-fort px-6 py-5">
        <TitreCarte niveau={2} className="text-xl sm:text-2xl">{texteSite("Classement des ")}{moba ? 'équipes' : 'joueurs'}
        </TitreCarte>
      </div>
      <div aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-bord px-6 py-5">
            <Barre className="h-7 w-7 shrink-0" />
            <Barre className="flex-1" />
            <Barre className="hidden flex-1 sm:block" />
            <Barre className="hidden flex-1 sm:block" />
          </div>
        ))}
      </div>
    </Carte>
    <p className="mt-5 text-texte">{texteSite("Les rangs et les statistiques restent masqués pendant le chargement.")}</p>
  </div>
)); };

/* ------------------------------------------------------------------ */
/* MOBA : classement des équipes + tableau final                        */
/* ------------------------------------------------------------------ */

interface LigneMoba {
  equipe: ELCBracketTeam;
  joues: number;
  v: number;
  n: number;
  d: number;
  mg: number;
  mp: number;
  points: number;
}

const ClassementMoba: React.FC<{ jeu: ELCMobaGame; data: ELCData; onNaviguer: Naviguer }> = ({ jeu, data, onNaviguer }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const bareme = jeu.bareme ?? { victoire: 3, nul: 1, defaite: 0 };
  const equipes = (jeu.bracket?.equipes ?? []).filter((e) => !estGenerique(e.nom));

  const lignes: LigneMoba[] = equipes
    .map((e) => {
      const v = e.victoires ?? 0;
      const n = e.nuls ?? 0;
      const d = e.defaites ?? 0;
      const mg = e.manchesGagnees ?? 0;
      const mp = e.manchesPerdues ?? 0;
      return { equipe: e, joues: v + n + d, v, n, d, mg, mp, points: v * bareme.victoire + n * bareme.nul + d * bareme.defaite };
    })
    .sort((a, b) => b.points - a.points || b.mg - b.mp - (a.mg - a.mp) || b.mg - a.mg || a.equipe.nom.localeCompare(b.equipe.nom));

  const resultats = lignes.some((l) => l.joues > 0);
  const avecNuls = lignes.some((l) => l.n > 0);
  const seriesMax = Math.max(0, ...lignes.map((l) => l.joues));
  const format = data.visual2?.structure?.qualifsFinales?.match(/bo\s?(\d)/i)?.[1];

  // Aucune équipe annoncée : pas de tableau vide ni d'arbre de « À déterminer ».
  if (equipes.length === 0) {
    return (
      <div className="space-y-5">
        <ChiffresCles
          chiffres={[
            { valeur: '—', legende: 'Équipes classées', detail: 'Non disponible' },
            { valeur: '—', legende: 'Séries validées', detail: 'Non disponible' },
            { valeur: format ? `Bo${format}` : '—', legende: 'Format officiel', detail: format ? undefined : 'Non disponible' },
          ]}
        />
        <CarteEtat icone={<ListOrdered className="h-6 w-6" />} titre="Le classement reste à établir." actions={<RetourActus onNaviguer={onNaviguer} />}>{texteSite("Pas encore de résultats validés pour établir un classement ")}{texteSite(jeu.nom)}{texteSite(". Aucun rang ni point ne peut être attribué avant validation.")}</CarteEtat>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!resultats && (
        <Avis titre="Aucun résultat officiel pour le moment">{texteSite("Les équipes engagées sont listées ci-dessous. Le classement se remplira au fil des séries validées par la ligue.")}</Avis>
      )}

      <ChiffresCles
        chiffres={[
          { valeur: deuxChiffres(equipes.length), legende: equipes.length > 1 ? 'Équipes engagées' : 'Équipe engagée' },
          { valeur: deuxChiffres(seriesMax), legende: 'Séries jouées' },
          { valeur: format ? `Bo${format}` : '—', legende: 'Format des séries' },
        ]}
      />

      <Carte className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bord-fort px-6 py-5">
          <TitreCarte niveau={2} className="text-xl sm:text-2xl">{texteSite("Classement des équipes")}</TitreCarte>
          <p className="text-sm text-doux">
            {texteSite(equipes.length)}{texteSite(" équipe")}{equipes.length > 1 ? 's' : ''}
            {data.meta.derniereMaj && resultats
              ? ` · mis à jour le ${new Date(data.meta.derniereMaj).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : ''}
          </p>
        </div>
        {lignes.length === 0 ? (
          <p className="px-6 py-10 text-center text-doux">{texteSite("Aucune équipe annoncée pour l'instant.")}</p>
        ) : (
          <>
          {/* Mobile : une carte par équipe, comme sur la maquette. Le tableau
              à 8 colonnes ne tient pas sur un téléphone sans défiler. */}
          <ol className="space-y-3 p-3 md:hidden" aria-label={texteSite(`Classement des équipes de ${jeu.nom}`)}>
            {lignes.map((l, i) => {
              const diff = l.mg - l.mp;
              const tete = i === 0 && resultats;
              const stats: [string, React.ReactNode][] = [
                ['Joués', l.joues],
                ['Victoires', l.v],
                ...(avecNuls ? [['Nuls', l.n] as [string, React.ReactNode]] : []),
                ['Défaites', l.d],
                ['Manches V–D', `${l.mg} – ${l.mp}`],
                ['Diff.', diff > 0 ? `+${diff}` : diff],
              ];
              return (
                <li key={l.equipe.id} className={`border p-4 ${tete ? 'border-magenta bg-carte-haute' : 'border-bord bg-carte'}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-doux">{texteSite("Rang")}</p>
                      <p className={`titre text-3xl ${tete ? 'text-magenta' : ''}`}>{deuxChiffres(i + 1)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-doux">{texteSite("Équipe")}</p>
                      <CelluleEquipe nom={l.equipe.nom} logo={l.equipe.logo} />
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-bord pt-3">
                    {stats.map(([libelle, valeur]) => (
                      <div key={libelle}>
                        <dt className="text-xs text-doux">{texteSite(libelle)}</dt>
                        <dd className="text-lg text-white">{texteSite(valeur)}</dd>
                      </div>
                    ))}
                    <div>
                      <dt className="text-xs text-doux">{texteSite("Points")}</dt>
                      <dd className="text-lg font-bold text-magenta">{texteSite(l.points)}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ol>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left">
              <caption className="sr-only">{texteSite("Classement des équipes de ")}{texteSite(jeu.nom)}</caption>
              <thead className="bg-carte-haute text-sm font-semibold text-doux">
                <tr>
                  <th scope="col" className="px-6 py-4">{texteSite("Rang")}</th>
                  <th scope="col" className="py-4 pr-4">{texteSite("Équipe")}</th>
                  <th scope="col" className="px-3 py-4 text-center">{texteSite("Joués")}</th>
                  <th scope="col" className="px-3 py-4 text-center">{texteSite("Victoires")}</th>
                  {avecNuls && <th scope="col" className="px-3 py-4 text-center">{texteSite("Nuls")}</th>}
                  <th scope="col" className="px-3 py-4 text-center">{texteSite("Défaites")}</th>
                  <th scope="col" className="px-3 py-4 text-center">{texteSite("Manches V–D")}</th>
                  <th scope="col" className="px-3 py-4 text-center">{texteSite("Diff.")}</th>
                  <th scope="col" className="px-6 py-4 text-center">{texteSite("Points")}</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => {
                  const diff = l.mg - l.mp;
                  return (
                    <tr key={l.equipe.id} className={`border-t border-bord ${i === 0 && resultats ? 'bg-carte-haute' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`titre text-2xl ${i === 0 && resultats ? 'text-magenta' : ''}`}>{deuxChiffres(i + 1)}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <CelluleEquipe nom={l.equipe.nom} logo={l.equipe.logo} />
                      </td>
                      <td className="px-3 py-4 text-center text-white">{texteSite(l.joues)}</td>
                      <td className="px-3 py-4 text-center text-white">{texteSite(l.v)}</td>
                      {avecNuls && <td className="px-3 py-4 text-center text-white">{texteSite(l.n)}</td>}
                      <td className="px-3 py-4 text-center text-white">{texteSite(l.d)}</td>
                      <td className="px-3 py-4 text-center text-white">
                        {texteSite(l.mg)}{texteSite(" – ")}{texteSite(l.mp)}
                      </td>
                      <td className="px-3 py-4 text-center text-texte">{diff > 0 ? `+${diff}` : diff}</td>
                      <td className="px-6 py-4 text-center text-lg font-bold text-magenta">{texteSite(l.points)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
        <p className="border-t border-bord-fort px-6 py-4 text-sm text-doux">{texteSite("Joués, victoires et défaites portent sur les séries. Les manches sont les parties gagnées ou perdues au sein de ces séries.")}</p>
      </Carte>

      <div>
        <TitreSection surtitre="Comprendre le tableau" titre="Comment lire ce ranking ?" className="mb-6" />
        <ul className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: '01 · Barème',
              t: `${bareme.victoire} points par victoire`,
              x: `Une série gagnée vaut ${bareme.victoire} points${bareme.nul ? `, un nul ${bareme.nul}` : ''} ; une défaite vaut ${bareme.defaite}. Joués = victoires + défaites${bareme.nul ? ' + nuls' : ''}.`,
            },
            {
              n: '02 · Ordre du tableau',
              t: 'Points, puis différence',
              x: 'Tri par points décroissants, puis différence de manches (V − D). Ensuite, manches gagnées.',
            },
            {
              n: '03 · Après la saison',
              t: 'Le tableau final',
              x: 'Les équipes poursuivent en élimination directe : huitièmes, quarts, demi-finales puis grande finale.',
            },
          ].map((c) => (
            <li key={c.n}>
              <Carte className="h-full p-5">
                <p className="mb-3 text-sm font-bold italic text-magenta">{texteSite(c.n)}</p>
                <TitreCarte className="mb-3 text-lg">{texteSite(c.t)}</TitreCarte>
                <p className="leading-relaxed text-texte">{texteSite(c.x)}</p>
              </Carte>
            </li>
          ))}
        </ul>
      </div>

      <TableauFinal jeu={jeu} />
    </div>
  );
};

/** Arbre à élimination directe : huitièmes → quarts → demies → finale. */
const TableauFinal: React.FC<{ jeu: ELCMobaGame }> = ({ jeu }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const equipes = jeu.bracket?.equipes ?? [];
  const quarts = jeu.bracket?.quarts ?? [];
  const demis = jeu.bracket?.demis ?? [];
  const champion = jeu.bracket?.champion ?? '';
  const nomEquipe = (i: number) => {
    const e = equipes[i];
    return e && !estGenerique(e.nom) ? e.nom : `À déterminer`;
  };

  const Case: React.FC<{ nom?: string; attente: string; mise?: boolean }> = ({ nom, attente, mise }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
    <div
      className={`px-3 py-2.5 text-sm ${
        nom ? `border ${mise ? 'border-magenta bg-avis' : 'border-bord-fort bg-carte-haute'} font-bold italic text-white` : 'border border-dashed border-bord-fort text-doux'
      }`}
    >
      <span className="block truncate">{nom || attente}</span>
    </div>
  )); };

  const Colonne: React.FC<{ titre: string; children: React.ReactNode; className?: string }> = ({ titre, children, className = '' }) => { const { texteSite, imageSite, sourcesSite } = useSiteCustomization(); return ((
    <div className="flex flex-col">
      <p className="mb-4 border-b border-bord-fort pb-3 text-center text-xs font-extrabold italic uppercase tracking-[0.15em] text-doux">{texteSite(titre)}</p>
      <div className={`flex flex-1 flex-col justify-around gap-4 ${className}`}>{texteSite(children)}</div>
    </div>
  )); };

  return (
    <div>
      <TitreSection surtitre="Phase finale" titre="Le tableau final." className="mb-6" />
      <Carte className="overflow-x-auto p-5 sm:p-6">
        <div className="grid min-w-[880px] grid-cols-4 gap-5">
          <Colonne titre="Huitièmes">
            {Array.from({ length: 8 }, (_, m) => (
              <div key={m} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">{texteSite("Match ")}{texteSite(m + 1)}</p>
                <Case nom={nomEquipe(m * 2) === 'À déterminer' ? '' : nomEquipe(m * 2)} attente="À déterminer" />
                <Case nom={nomEquipe(m * 2 + 1) === 'À déterminer' ? '' : nomEquipe(m * 2 + 1)} attente="À déterminer" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Quarts">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">{texteSite("Quart ")}{texteSite(i + 1)}</p>
                <Case nom={quarts[i]} attente="En attente des huitièmes" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Demi-finales">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">{texteSite("Demie ")}{texteSite(i + 1)}</p>
                <Case nom={demis[i]} attente="En attente des quarts" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Grande finale">
            <div className="border border-magenta/70 bg-carte-haute p-5 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-magenta text-magenta">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-extrabold italic uppercase tracking-[0.15em] text-doux">{texteSite("Champion")}</p>
              <Case nom={champion} attente="À couronner" mise />
            </div>
          </Colonne>
        </div>
      </Carte>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Battle Royale : classement individuel                                */
/* ------------------------------------------------------------------ */

const ClassementTps: React.FC<{ jeu: ELCTpsGame; onNaviguer: Naviguer }> = ({ jeu, onNaviguer }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const [recherche, setRecherche] = useState('');
  const bareme = jeu.bareme ?? { places: [], elimination: 0 };

  const joueurs = useMemo(
    () =>
      (jeu.roster ?? [])
        .filter((j) => !estGenerique(j.nom))
        .map((j) => ({ ...j, scoreTotal: j.scoreTotal ?? 0, kills: j.kills ?? 0 }))
        .sort((a, b) => b.scoreTotal - a.scoreTotal || b.kills - a.kills || a.nom.localeCompare(b.nom)),
    [jeu.roster]
  );
  const places = (jeu.roster ?? []).length;
  const resultats = joueurs.some((j) => j.scoreTotal > 0 || j.kills > 0);
  const filtre = recherche.trim().toLowerCase();
  const affiches = filtre ? joueurs.filter((j) => j.nom.toLowerCase().includes(filtre)) : joueurs;

  return (
    <div className="space-y-8">
      {!resultats && joueurs.length > 0 && (
        <Avis titre="Aucun résultat officiel pour le moment">{texteSite("Les joueurs engagés sont listés ci-dessous. Les points se cumuleront au fil des manches validées par la ligue.")}</Avis>
      )}

      <ChiffresCles
        chiffres={[
          { valeur: deuxChiffres(places), legende: 'Places au classement' },
          { valeur: `+${bareme.places[0] ?? 0}`, legende: 'Points pour une 1re place' },
          { valeur: `+${bareme.elimination}`, legende: 'Point par élimination' },
        ]}
      />

      {joueurs.length === 0 ? (
        <CarteEtat icone={<ListOrdered className="h-6 w-6" />} titre="Le classement reste à établir." actions={<RetourActus onNaviguer={onNaviguer} />}>{texteSite("Les joueurs qualifiés de ")}{texteSite(jeu.nom)}{texteSite(" seront annoncés après la clôture des inscriptions et des qualifications en ligne. Aucun rang ni point ne peut être attribué avant validation.")}</CarteEtat>
      ) : (
        <Carte className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-bord-fort px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <TitreCarte niveau={2} className="text-xl sm:text-2xl">{texteSite("Classement des joueurs")}</TitreCarte>
            {joueurs.length > 0 && (
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">{texteSite("Rechercher un joueur")}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doux" aria-hidden="true" />
                <input
                  type="search"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder={texteSite("Rechercher un joueur")}
                  className="w-full border border-bord-champ bg-encre py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-doux focus:border-magenta focus:outline-none"
                />
              </label>
            )}
          </div>
          <div className="max-h-[640px] overflow-auto">
            <table className="w-full text-left">
              <caption className="sr-only">{texteSite("Classement individuel de ")}{texteSite(jeu.nom)}</caption>
              <thead className="sticky top-0 bg-carte-haute text-sm font-semibold text-doux">
                <tr>
                  <th scope="col" className="px-3 py-4 sm:px-6">{texteSite("Rang")}</th>
                  <th scope="col" className="py-4 pr-4">{texteSite("Joueur")}</th>
                  <th scope="col" className="px-2 py-4 text-center"><abbr title={texteSite("Éliminations")} className="no-underline sm:hidden">{texteSite("Élim.")}</abbr><span className="hidden sm:inline">{texteSite("Éliminations")}</span></th>
                  <th scope="col" className="px-3 py-4 sm:px-6 text-center">{texteSite("Points")}</th>
                </tr>
              </thead>
              <tbody>
                {affiches.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 sm:px-6 text-center text-doux">
                      {joueurs.length === 0 ? "Aucun joueur annoncé pour l'instant." : 'Aucun joueur ne correspond à cette recherche.'}
                    </td>
                  </tr>
                ) : (
                  affiches.map((j) => {
                    const rang = joueurs.indexOf(j) + 1;
                    return (
                      <tr key={j.id} className={`border-t border-bord ${rang === 1 && resultats ? 'bg-carte-haute' : ''}`}>
                        <td className="px-3 py-3.5 sm:px-6">
                          <span className={`titre text-2xl ${rang === 1 && resultats ? 'text-magenta' : ''}`}>{deuxChiffres(rang)}</span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <CelluleEquipe nom={j.nom} logo={j.photo} />
                        </td>
                        <td className="px-3 py-3.5 text-center text-white">{texteSite(j.kills)}</td>
                        <td className="px-3 py-3.5 sm:px-6 text-center text-lg font-bold text-magenta">{texteSite(j.scoreTotal)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Carte>
      )}

      <div>
        <TitreSection surtitre="Comprendre le tableau" titre="Le barème Battle Royale." className="mb-6" />
        <Carte className="p-5 sm:p-6">
          <ol className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {bareme.places.map((pts, i) => (
              <li key={i} className="border border-bord-fort bg-carte-haute px-2 py-3 text-center">
                <span className="block text-xs font-semibold text-doux">{i === 0 ? '1re' : `${i + 1}e`}{texteSite(" place")}</span>
                <span className="titre mt-1 block text-xl">{texteSite("+")}{texteSite(pts)}</span>
              </li>
            ))}
            <li className="border border-magenta/70 bg-avis px-2 py-3 text-center">
              <span className="block text-xs font-semibold text-doux">{texteSite("Élimination")}</span>
              <span className="titre mt-1 block text-xl text-magenta">{texteSite("+")}{texteSite(bareme.elimination)}</span>
            </li>
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-doux">{texteSite("Chaque manche rapporte des points selon la place finale, plus ")}{texteSite(bareme.elimination)}{texteSite(" point")}{bareme.elimination > 1 ? 's' : ''}{texteSite(" par élimination. Le classement additionne toutes les manches ; à égalité, le nombre d'éliminations départage.")}</p>
        </Carte>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Calendrier propre à la discipline                                   */
/* ------------------------------------------------------------------ */

const CalendrierJeu: React.FC<{ jeu: ELCMobaGame | ELCTpsGame; startGgUrl?: string }> = ({ jeu, startGgUrl }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  if (!jeu.calendrier?.length && !startGgUrl) return null;
  return (
    <section className="pb-10 sm:pb-14">
      <Conteneur>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <TitreSection surtitre="Calendrier de la discipline" titre={`Les phases ${jeu.nom}.`} />
          {startGgUrl && (
            <BoutonLien variante="contour" href={urlSure(startGgUrl)} target="_blank" rel="noopener noreferrer" className="shrink-0">{texteSite("Arbre officiel sur start.gg")}<ExternalLink className="h-4 w-4" aria-hidden="true" />
            </BoutonLien>
          )}
        </div>
        {jeu.calendrier?.length > 0 && (
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {jeu.calendrier.map((c, i) => (
              <li key={i}>
                <Carte className="h-full p-5">
                  <p className="surtitre mb-3 text-[0.68rem]">{texteSite(c.periode)}</p>
                  <TitreCarte className="mb-2 text-base sm:text-lg">{texteSite(c.phase)}</TitreCarte>
                  <p className="text-sm text-doux">{texteSite(c.lieu)}</p>
                </Carte>
              </li>
            ))}
          </ol>
        )}
      </Conteneur>
    </section>
  );
};

export default PageClassements;
