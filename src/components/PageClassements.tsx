import React, { useMemo, useState } from 'react';
import { ListOrdered, Trophy, ExternalLink, Search } from 'lucide-react';
import { ELCData, ELCMobaGame, ELCTpsGame, ELCBracketTeam } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import {
  Conteneur,
  EnTetePage,
  Carte,
  CarteLien,
  TitreCarte,
  TitreSection,
  Avis,
  BoutonLien,
  initiales,
} from './ui';
import { OngletsSaison } from './OngletsSaison';
import { JEUX, Jeu } from './Blocs';

interface PageClassementsProps {
  data: ELCData;
  jeu: Jeu;
  onNaviguer: (section: Section, jeu?: string) => void;
}

// Les emplacements non attribués portent un nom générique (« Équipe 3 »,
// « Joueur 12 ») : ils ne doivent pas apparaître comme des engagés.
const estGenerique = (nom: string | undefined) => !nom || /^(équipe|equipe|joueur)\s*\d+$/i.test(nom.trim());

const deuxChiffres = (n: number) => String(n).padStart(2, '0');

export const PageClassements: React.FC<PageClassementsProps> = ({ data, jeu, onNaviguer }) => {
  const info = JEUX.find((j) => j.id === jeu)!;
  const moba = jeu === 'hok' || jeu === 'mlbb';
  const autre = jeu === 'hok' ? 'mlbb' : jeu === 'mlbb' ? 'hok' : jeu === 'pubgm' ? 'ff' : 'pubgm';
  const infoAutre = JEUX.find((j) => j.id === autre)!;
  const titres = data.visual1?.titres?.find((t) => t.id === jeu);

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <p className="surtitre mb-4">Saison news · ELC {data.meta.saison || '2027'}</p>
          <h1 className="titre text-[2.1rem] sm:text-5xl lg:text-[3.6rem]">
            Ranking —<span className="block">{info.nom}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-texte">
            {info.famille} · {titres?.badge ? `${titres.badge.toLowerCase()}, ` : ''}
            {moba
              ? 'classement par séries, puis tableau final à élimination directe.'
              : 'classement individuel au cumul des points de placement et des éliminations.'}
            {titres?.lancement ? ` Lancement prévu : ${titres.lancement}.` : ''}
          </p>
          <div className="mt-12">
            <OngletsSaison actif={jeu} onNaviguer={onNaviguer} />
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-14">
        <Conteneur>
          {moba ? (
            <ClassementMoba jeu={data.competition[jeu as 'hok' | 'mlbb']} data={data} />
          ) : (
            <ClassementTps jeu={data.competition[jeu as 'pubgm' | 'ff']} />
          )}
        </Conteneur>
      </section>

      {/* ---------- Calendrier de la discipline ---------- */}
      <CalendrierJeu jeu={data.competition[jeu]} startGgUrl={data.meta.startGgUrl} />

      {/* ---------- Liens ---------- */}
      <section className="pb-20">
        <Conteneur>
          <ul className="grid gap-5 md:grid-cols-2">
            <li>
              <CarteLien
                section="classements"
                jeu={autre}
                onNaviguer={onNaviguer}
                surtitre={moba ? "L'autre MOBA" : "L'autre Battle Royale"}
                titre={infoAutre.nom}
                texte="Retrouvez l'autre classement de la discipline : mêmes critères de lecture, même barème."
                action="Voir le ranking"
                icone={<ListOrdered className="h-6 w-6" />}
              />
            </li>
            <li>
              <CarteLien
                section="pantheon"
                onNaviguer={onNaviguer}
                surtitre="Au-delà du tableau"
                titre="Hall of Fame"
                texte="Découvrez les faits marquants connus et les distinctions de la ligue."
                action="Explorer le Hall of Fame"
                icone={<Trophy className="h-6 w-6" />}
              />
            </li>
          </ul>
        </Conteneur>
      </section>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Chiffres clés                                                        */
/* ------------------------------------------------------------------ */

const ChiffresCles: React.FC<{ chiffres: { valeur: string; legende: string }[] }> = ({ chiffres }) => (
  <dl className="grid gap-5 sm:grid-cols-3">
    {chiffres.map((c) => (
      <div key={c.legende} className="flex items-center gap-4 border border-bord bg-carte px-6 py-5">
        <dd className="titre text-3xl normal-case sm:text-4xl">{c.valeur}</dd>
        <dt className="text-texte">{c.legende}</dt>
      </div>
    ))}
  </dl>
);

const CelluleEquipe: React.FC<{ nom: string; logo?: string }> = ({ nom, logo }) => (
  <div className="flex items-center gap-3">
    {logo ? (
      <img src={urlSure(logo)} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 border border-bord-fort object-cover" />
    ) : (
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-bord-fort bg-carte-haute text-[0.65rem] font-extrabold italic text-doux">
        {initiales(nom)}
      </span>
    )}
    <span className="font-bold italic text-white">{nom}</span>
  </div>
);

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

const ClassementMoba: React.FC<{ jeu: ELCMobaGame; data: ELCData }> = ({ jeu, data }) => {
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

  return (
    <div className="space-y-8">
      {!resultats && (
        <Avis titre={equipes.length > 0 ? 'Aucun résultat officiel pour le moment' : 'Classement pas encore ouvert'}>
          {equipes.length > 0
            ? 'Les équipes engagées sont listées ci-dessous. Le classement se remplira au fil des séries validées par la ligue.'
            : "Les équipes engagées seront annoncées après la clôture des inscriptions. Le tableau se remplira au fil des séries validées par la ligue."}
        </Avis>
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
          <TitreCarte niveau={2} className="text-xl sm:text-2xl">Classement des équipes</TitreCarte>
          <p className="text-sm text-doux">
            {equipes.length} équipe{equipes.length > 1 ? 's' : ''}
            {data.meta.derniereMaj && resultats
              ? ` · mis à jour le ${new Date(data.meta.derniereMaj).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : ''}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <caption className="sr-only">Classement des équipes de {jeu.nom}</caption>
            <thead className="bg-carte-haute text-sm font-semibold text-doux">
              <tr>
                <th scope="col" className="px-6 py-4">Rang</th>
                <th scope="col" className="py-4 pr-4">Équipe</th>
                <th scope="col" className="px-3 py-4 text-center">Joués</th>
                <th scope="col" className="px-3 py-4 text-center">Victoires</th>
                {avecNuls && <th scope="col" className="px-3 py-4 text-center">Nuls</th>}
                <th scope="col" className="px-3 py-4 text-center">Défaites</th>
                <th scope="col" className="px-3 py-4 text-center">Manches V–D</th>
                <th scope="col" className="px-3 py-4 text-center">Diff.</th>
                <th scope="col" className="px-6 py-4 text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {lignes.length === 0 ? (
                <tr>
                  <td colSpan={avecNuls ? 9 : 8} className="px-6 py-10 text-center text-doux">
                    Aucune équipe annoncée pour l'instant.
                  </td>
                </tr>
              ) : (
                lignes.map((l, i) => {
                  const diff = l.mg - l.mp;
                  return (
                    <tr key={l.equipe.id} className={`border-t border-bord ${i === 0 && resultats ? 'bg-carte-haute' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`titre text-2xl ${i === 0 && resultats ? 'text-magenta' : ''}`}>{deuxChiffres(i + 1)}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <CelluleEquipe nom={l.equipe.nom} logo={l.equipe.logo} />
                      </td>
                      <td className="px-3 py-4 text-center text-white">{l.joues}</td>
                      <td className="px-3 py-4 text-center text-white">{l.v}</td>
                      {avecNuls && <td className="px-3 py-4 text-center text-white">{l.n}</td>}
                      <td className="px-3 py-4 text-center text-white">{l.d}</td>
                      <td className="px-3 py-4 text-center text-white">
                        {l.mg} – {l.mp}
                      </td>
                      <td className="px-3 py-4 text-center text-texte">{diff > 0 ? `+${diff}` : diff}</td>
                      <td className="px-6 py-4 text-center text-lg font-bold text-magenta">{l.points}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-bord-fort px-6 py-4 text-sm text-doux">
          Joués, victoires et défaites portent sur les séries. Les manches sont les parties gagnées ou perdues au sein de
          ces séries.
        </p>
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
                <p className="mb-3 text-sm font-bold italic text-magenta">{c.n}</p>
                <TitreCarte className="mb-3 text-lg">{c.t}</TitreCarte>
                <p className="leading-relaxed text-texte">{c.x}</p>
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
  const equipes = jeu.bracket?.equipes ?? [];
  const quarts = jeu.bracket?.quarts ?? [];
  const demis = jeu.bracket?.demis ?? [];
  const champion = jeu.bracket?.champion ?? '';
  const nomEquipe = (i: number) => {
    const e = equipes[i];
    return e && !estGenerique(e.nom) ? e.nom : `À déterminer`;
  };

  const Case: React.FC<{ nom?: string; attente: string; mise?: boolean }> = ({ nom, attente, mise }) => (
    <div
      className={`px-3 py-2.5 text-sm ${
        nom ? `border ${mise ? 'border-magenta bg-avis' : 'border-bord-fort bg-carte-haute'} font-bold italic text-white` : 'border border-dashed border-bord-fort text-doux'
      }`}
    >
      <span className="block truncate">{nom || attente}</span>
    </div>
  );

  const Colonne: React.FC<{ titre: string; children: React.ReactNode; className?: string }> = ({ titre, children, className = '' }) => (
    <div className="flex flex-col">
      <p className="mb-4 border-b border-bord-fort pb-3 text-center text-xs font-extrabold italic uppercase tracking-[0.15em] text-doux">{titre}</p>
      <div className={`flex flex-1 flex-col justify-around gap-4 ${className}`}>{children}</div>
    </div>
  );

  return (
    <div>
      <TitreSection surtitre="Phase finale" titre="Le tableau final." className="mb-6" />
      <Carte className="overflow-x-auto p-5 sm:p-6">
        <div className="grid min-w-[880px] grid-cols-4 gap-5">
          <Colonne titre="Huitièmes">
            {Array.from({ length: 8 }, (_, m) => (
              <div key={m} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">Match {m + 1}</p>
                <Case nom={nomEquipe(m * 2) === 'À déterminer' ? '' : nomEquipe(m * 2)} attente="À déterminer" />
                <Case nom={nomEquipe(m * 2 + 1) === 'À déterminer' ? '' : nomEquipe(m * 2 + 1)} attente="À déterminer" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Quarts">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">Quart {i + 1}</p>
                <Case nom={quarts[i]} attente="En attente des huitièmes" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Demi-finales">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-doux">Demie {i + 1}</p>
                <Case nom={demis[i]} attente="En attente des quarts" />
              </div>
            ))}
          </Colonne>
          <Colonne titre="Grande finale">
            <div className="border border-magenta/70 bg-carte-haute p-5 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-magenta text-magenta">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-extrabold italic uppercase tracking-[0.15em] text-doux">Champion</p>
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

const ClassementTps: React.FC<{ jeu: ELCTpsGame }> = ({ jeu }) => {
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
      {!resultats && (
        <Avis titre={joueurs.length > 0 ? 'Aucun résultat officiel pour le moment' : 'Classement pas encore ouvert'}>
          {joueurs.length > 0
            ? 'Les joueurs engagés sont listés ci-dessous. Les points se cumuleront au fil des manches validées par la ligue.'
            : 'Les joueurs qualifiés seront annoncés après la clôture des inscriptions et des qualifications en ligne.'}
        </Avis>
      )}

      <ChiffresCles
        chiffres={[
          { valeur: deuxChiffres(places), legende: 'Places au classement' },
          { valeur: `+${bareme.places[0] ?? 0}`, legende: 'Points pour une 1re place' },
          { valeur: `+${bareme.elimination}`, legende: 'Point par élimination' },
        ]}
      />

      <Carte className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-bord-fort px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <TitreCarte niveau={2} className="text-xl sm:text-2xl">Classement des joueurs</TitreCarte>
          {joueurs.length > 0 && (
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Rechercher un joueur</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doux" aria-hidden="true" />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un joueur"
                className="w-full border border-bord-champ bg-encre py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-doux focus:border-magenta focus:outline-none"
              />
            </label>
          )}
        </div>
        <div className="max-h-[640px] overflow-auto">
          <table className="w-full min-w-[520px] text-left">
            <caption className="sr-only">Classement individuel de {jeu.nom}</caption>
            <thead className="sticky top-0 bg-carte-haute text-sm font-semibold text-doux">
              <tr>
                <th scope="col" className="px-6 py-4">Rang</th>
                <th scope="col" className="py-4 pr-4">Joueur</th>
                <th scope="col" className="px-3 py-4 text-center">Éliminations</th>
                <th scope="col" className="px-6 py-4 text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {affiches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-doux">
                    {joueurs.length === 0 ? "Aucun joueur annoncé pour l'instant." : 'Aucun joueur ne correspond à cette recherche.'}
                  </td>
                </tr>
              ) : (
                affiches.map((j) => {
                  const rang = joueurs.indexOf(j) + 1;
                  return (
                    <tr key={j.id} className={`border-t border-bord ${rang === 1 && resultats ? 'bg-carte-haute' : ''}`}>
                      <td className="px-6 py-3.5">
                        <span className={`titre text-2xl ${rang === 1 && resultats ? 'text-magenta' : ''}`}>{deuxChiffres(rang)}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <CelluleEquipe nom={j.nom} logo={j.photo} />
                      </td>
                      <td className="px-3 py-3.5 text-center text-white">{j.kills}</td>
                      <td className="px-6 py-3.5 text-center text-lg font-bold text-magenta">{j.scoreTotal}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Carte>

      <div>
        <TitreSection surtitre="Comprendre le tableau" titre="Le barème Battle Royale." className="mb-6" />
        <Carte className="p-5 sm:p-6">
          <ol className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {bareme.places.map((pts, i) => (
              <li key={i} className="border border-bord-fort bg-carte-haute px-2 py-3 text-center">
                <span className="block text-xs font-semibold text-doux">{i === 0 ? '1re' : `${i + 1}e`} place</span>
                <span className="titre mt-1 block text-xl">+{pts}</span>
              </li>
            ))}
            <li className="border border-magenta/70 bg-avis px-2 py-3 text-center">
              <span className="block text-xs font-semibold text-doux">Élimination</span>
              <span className="titre mt-1 block text-xl text-magenta">+{bareme.elimination}</span>
            </li>
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-doux">
            Chaque manche rapporte des points selon la place finale, plus {bareme.elimination} point
            {bareme.elimination > 1 ? 's' : ''} par élimination. Le classement additionne toutes les manches ; à égalité,
            le nombre d'éliminations départage.
          </p>
        </Carte>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Calendrier propre à la discipline                                   */
/* ------------------------------------------------------------------ */

const CalendrierJeu: React.FC<{ jeu: ELCMobaGame | ELCTpsGame; startGgUrl?: string }> = ({ jeu, startGgUrl }) => {
  if (!jeu.calendrier?.length && !startGgUrl) return null;
  return (
    <section className="pb-14">
      <Conteneur>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <TitreSection surtitre="Calendrier de la discipline" titre={`Les phases ${jeu.nom}.`} />
          {startGgUrl && (
            <BoutonLien variante="contour" href={urlSure(startGgUrl)} target="_blank" rel="noopener noreferrer" className="shrink-0">
              Arbre officiel sur start.gg
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </BoutonLien>
          )}
        </div>
        {jeu.calendrier?.length > 0 && (
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {jeu.calendrier.map((c, i) => (
              <li key={i}>
                <Carte className="h-full p-5">
                  <p className="surtitre mb-3 text-[0.68rem]">{c.periode}</p>
                  <TitreCarte className="mb-2 text-base sm:text-lg">{c.phase}</TitreCarte>
                  <p className="text-sm text-doux">{c.lieu}</p>
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
