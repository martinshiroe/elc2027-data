import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ELCData, ELCJoueurProfil } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { jeuxActifs } from './Blocs';
import { Conteneur, EnTetePage, Carte, TitreCarte, LienPage, Pastille, initiales } from './ui';

interface PageJoueursProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
}

// Le champ `discipline` des fiches joueur est un libellé libre saisi dans
// l'admin : on rapproche les variantes courantes du bon filtre.
const FILTRES: { id: string; label: string; motifs: RegExp }[] = [
  { id: 'tous', label: 'Tous', motifs: /.*/ },
  { id: 'hok', label: 'Honor of Kings', motifs: /honor|hok/i },
  { id: 'mlbb', label: 'Mobile Legends', motifs: /mobile legends|mlbb/i },
  { id: 'pubgm', label: 'PUBG Mobile', motifs: /pubg/i },
  { id: 'ff', label: 'Free Fire', motifs: /free ?fire|\bff\b/i },
];

export const PageJoueurs: React.FC<PageJoueursProps> = ({ data, onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');

  const joueurs: ELCJoueurProfil[] = useMemo(
    () =>
      (data.joueurs ?? []).map((j, i) => ({
        id: j.id || `joueur-${i}`,
        pseudo: j.pseudo || j.nom || 'Joueur',
        nomReel: j.nomReel,
        discipline: j.discipline || 'Esport',
        equipe: j.equipe,
        role: j.role,
        ville: j.ville,
        photo: j.photo,
        statut: j.statut || 'Inscrit',
        kills: j.kills,
        points: j.points,
      })),
    [data.joueurs]
  );

  // Filtres : « Tous » puis les seules disciplines actives de la saison.
  const actifs = jeuxActifs(data).map((j) => j.id as string);
  const filtres = FILTRES.filter((f) => f.id === 'tous' || actifs.includes(f.id));

  const q = recherche.trim().toLowerCase();
  const motif = FILTRES.find((f) => f.id === filtre)!.motifs;
  const affiches = joueurs.filter(
    (p) =>
      motif.test(p.discipline) &&
      (!q || [p.pseudo, p.equipe, p.discipline, p.nomReel].some((v) => v?.toLowerCase().includes(q)))
  );

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <p className="surtitre mb-4">{texteSite("Communauté et joueurs")}</p>
          <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">{texteSite("Les joueurs")}<span className="block">{texteSite("qui font la ligue.")}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">{texteSite("Les joueurs et les équipes engagés dans les disciplines de la ligue, validés par le comité de l'ELC et la FECASES.")}</p>
        </Conteneur>
      </EnTetePage>

      <section className="pb-14 sm:pb-20">
        <Conteneur>
          <div className="mb-8 flex flex-col gap-4 border-b border-bord-fort pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label={texteSite("Filtrer par discipline")} className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {texteSite(filtres.map((f) => {
                const actif = filtre === f.id;
                const nombre = f.id === 'tous' ? joueurs.length : joueurs.filter((p) => f.motifs.test(p.discipline)).length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFiltre(f.id)}
                    aria-pressed={actif}
                    className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-bold italic whitespace-nowrap transition-colors ${
                      actif ? 'border-magenta-plein bg-magenta-plein text-white' : 'border-bord-fort text-doux hover:border-magenta hover:text-white'
                    }`}
                  >
                    {texteSite(f.label)} <span className="font-normal opacity-80">{texteSite("(")}{texteSite(nombre)}{texteSite(")")}</span>
                  </button>
                );
              }))}
            </div>
            <label className="relative block w-full lg:w-72">
              <span className="sr-only">{texteSite("Rechercher un joueur ou une équipe")}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doux" aria-hidden="true" />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder={texteSite("Pseudo ou équipe")}
                className="w-full border border-bord-champ bg-encre py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-doux focus:border-magenta focus:outline-none"
              />
            </label>
          </div>

          {texteSite(affiches.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {texteSite(affiches.map((p) => (
                <li key={p.id}>
                  <Carte as="article" className="flex h-full flex-col p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <Pastille>{texteSite(p.discipline)}</Pastille>
                      <span className="text-xs font-bold italic text-magenta">{texteSite(p.statut)}</span>
                    </div>
                    <div className="mb-4 flex items-center gap-4">
                      {texteSite(p.photo ? (
                        <ImagePublique
                          src={imageSite(p.photo)}
                          alt={texteSite("")}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 shrink-0 border border-bord-fort object-cover"
                        />
                      ) : (
                        <span aria-hidden="true" className="titre flex h-14 w-14 shrink-0 items-center justify-center border border-bord-fort bg-carte-haute text-lg text-doux">
                          {texteSite(initiales(p.pseudo))}
                        </span>
                      ))}
                      <div className="min-w-0">
                        <TitreCarte className="truncate text-lg">{texteSite(p.pseudo)}</TitreCarte>
                        <p className="truncate text-sm text-doux">{texteSite(p.equipe || p.role || 'Compétiteur')}</p>
                      </div>
                    </div>
                    {texteSite((p.points !== undefined || p.kills !== undefined || p.ville) && (
                      <dl className="mt-auto space-y-1.5 border-t border-bord pt-4 text-sm">
                        {texteSite(p.points !== undefined && (
                          <div className="flex justify-between">
                            <dt className="text-doux">{texteSite("Points ELC")}</dt>
                            <dd className="font-bold text-magenta">{texteSite(p.points)}</dd>
                          </div>
                        ))}
                        {texteSite(p.kills !== undefined && (
                          <div className="flex justify-between">
                            <dt className="text-doux">{texteSite("Éliminations")}</dt>
                            <dd className="font-semibold text-white">{texteSite(p.kills)}</dd>
                          </div>
                        ))}
                        {texteSite(p.ville && (
                          <div className="flex justify-between">
                            <dt className="text-doux">{texteSite("Zone")}</dt>
                            <dd className="text-white">{texteSite(p.ville)}</dd>
                          </div>
                        ))}
                      </dl>
                    ))}
                  </Carte>
                </li>
              )))}
            </ul>
          ) : (
            <Carte className="px-6 py-14 text-center sm:px-16">
              <TitreCarte className="mb-4 text-2xl">
                {texteSite(joueurs.length === 0 ? 'Aucun joueur publié pour le moment.' : 'Aucun joueur ne correspond.')}
              </TitreCarte>
              <p className="mx-auto mb-7 max-w-2xl leading-relaxed text-texte">
                {texteSite(joueurs.length === 0
                  ? "Les listes officielles des joueurs et des équipes s'afficheront ici au fur et à mesure des validations par le comité de la ligue et la FECASES."
                  : 'Essayez une autre discipline ou un autre nom.')}
              </p>
              {texteSite(joueurs.length === 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  <LienPage section="inscription" onNaviguer={onNaviguer} bouton="plein">{texteSite("S'inscrire")}</LienPage>
                  <LienPage section="apropos" onNaviguer={onNaviguer} bouton="contour">{texteSite("Les équipes de la communauté")}</LienPage>
                </div>
              ))}
            </Carte>
          ))}
        </Conteneur>
      </section>
    </>
  );
};

export default PageJoueurs;
