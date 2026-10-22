import { ImagePublique } from './ImagePublique';
import { urlImage } from '../lib/images';
import { useSiteCustomization } from '../lib/siteCustomization';
import React, { useCallback, useMemo, useState } from 'react';
import { Play, Search, ExternalLink, X } from 'lucide-react';
import { ELCData, ELCVideo } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { useModale } from '../lib/useModale';
import { Conteneur, EnTetePage, Carte, TitreCarte, BoutonLien, Bouton, Pastille, LienPage } from './ui';
import { YoutubeIcon, TikTokIcon } from './SocialIcons';
import { idYoutube, miniatureDe, masquerSiCassee } from './Blocs';

interface PageVideosProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
}

const DISCIPLINES: Record<string, string> = {
  hok: 'Honor of Kings',
  mlbb: 'Mobile Legends',
  pubgm: 'PUBG Mobile',
  ff: 'Free Fire',
  general: 'ELC',
};

const CATEGORIES: Record<string, string> = {
  highlight: 'Highlights',
  match: 'Match complet',
  clip: 'Clip',
  teaser: 'Bande-annonce',
  tutoriel: 'Tutoriel',
};

const libelleDiscipline = (d?: string) => DISCIPLINES[d ?? 'general'] ?? 'ELC';
const libelleCategorie = (c?: string) => (c ? CATEGORIES[c] ?? 'Vidéo' : 'Vidéo');

const Filtre: React.FC<{ actif: boolean; onClick: () => void; children: React.ReactNode }> = ({ actif, onClick, children }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();
return (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={actif}
    className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold italic whitespace-nowrap transition-colors ${
      actif ? 'border-magenta-plein bg-magenta-plein text-white' : 'border-bord-fort text-doux hover:border-magenta hover:text-white'
    }`}
  >
    {texteSite(children)}
  </button>
);};

export const PageVideos: React.FC<PageVideosProps> = ({ data, onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const videos = data.videos ?? [];
  const [plateforme, setPlateforme] = useState<'toutes' | 'youtube' | 'tiktok'>('toutes');
  const [discipline, setDiscipline] = useState('toutes');
  const [recherche, setRecherche] = useState('');
  const [enLecture, setEnLecture] = useState<ELCVideo | null>(null);

  const fermer = useCallback(() => setEnLecture(null), []);
  const lecteur = useModale(Boolean(enLecture), fermer);

  const aLaUne = useMemo(() => videos.find((v) => v.featured) ?? videos[0] ?? null, [videos]);
  const q = recherche.trim().toLowerCase();
  const affichees = videos.filter(
    (v) =>
      (plateforme === 'toutes' || v.plateforme === plateforme) &&
      (discipline === 'toutes' || (v.discipline ?? 'general') === discipline) &&
      (!q || [v.titre, v.description, libelleDiscipline(v.discipline)].some((x) => x?.toLowerCase().includes(q)))
  );
  const disciplinesPresentes = Array.from(new Set(videos.map((v) => v.discipline ?? 'general')));

  const youtube = data.meta.reseaux?.youtube;
  const tiktok = data.meta.reseaux?.tiktok;

  const reinitialiser = () => {
    setPlateforme('toutes');
    setDiscipline('toutes');
    setRecherche('');
  };

  return (
    <>
      <EnTetePage image={data.meta.videosBannerImage ? urlImage(data.meta.videosBannerImage) : undefined}>
        <Conteneur>
          <p className="surtitre mb-4">{texteSite("Diffusion · Vidéos officielles")}</p>
          <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">{texteSite("Le jeu en direct.")}<span className="block">{texteSite("Les moments forts.")}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">{texteSite("Matchs en direct, highlights et clips de la ligue, publiés sur nos chaînes YouTube et TikTok.")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            {texteSite(youtube && (
              <BoutonLien href={urlSure(youtube)} target="_blank" rel="noopener noreferrer">
                <YoutubeIcon className="h-4 w-4" />{texteSite("Chaîne YouTube")}</BoutonLien>
            ))}
            {texteSite(tiktok && (
              <BoutonLien variante="contour" href={urlSure(tiktok)} target="_blank" rel="noopener noreferrer">
                <TikTokIcon className="h-4 w-4" />{texteSite("Compte TikTok")}</BoutonLien>
            ))}
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-14 sm:pb-20">
        <Conteneur>
          {texteSite(videos.length === 0 ? (
            <Carte className="px-6 py-14 text-center sm:px-16">
              <TitreCarte className="mb-4 text-2xl">{texteSite("Les vidéos arrivent bientôt.")}</TitreCarte>
              <p className="mx-auto mb-7 max-w-2xl leading-relaxed text-texte">{texteSite("Les retransmissions de matchs, résumés et clips de la ligue seront publiés ici dès les premières rencontres.")}</p>
              <LienPage section="saison" onNaviguer={onNaviguer} bouton="contour">{texteSite("Saison news")}</LienPage>
            </Carte>
          ) : (
            <>
              {/* ---------- À la une ---------- */}
              {texteSite(aLaUne && (
                <Carte haute className="group relative mb-12 grid overflow-hidden lg:grid-cols-[7fr_5fr]">
                  <div className="relative aspect-video bg-encre">
                    {texteSite(miniatureDe(aLaUne) && (
                      <ImagePublique
                        src={imageSite(miniatureDe(aLaUne))}
                        onError={masquerSiCassee}
                        alt={texteSite("")}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain transition-transform duration-500"
                      />
                    ))}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-magenta text-white shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col p-6 sm:p-8">
                    <p className="surtitre mb-4">{texteSite("À la une")}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Pastille>{texteSite(libelleDiscipline(aLaUne.discipline))}</Pastille>
                      <Pastille>{texteSite(libelleCategorie(aLaUne.categorie))}</Pastille>
                    </div>
                    <h2 className="titre mb-4 text-2xl sm:text-[1.7rem]">
                      <button type="button" onClick={() => setEnLecture(aLaUne)} className="cursor-pointer text-left after:absolute after:inset-0">
                        {texteSite(aLaUne.titre)}
                      </button>
                    </h2>
                    {texteSite(aLaUne.description && <p className="mb-4 line-clamp-4 leading-relaxed text-texte">{texteSite(aLaUne.description)}</p>)}
                    <p className="mt-auto border-t border-bord-fort pt-4 text-sm text-doux">{texteSite(aLaUne.date || `Saison ${data.meta.saison}`)}</p>
                  </div>
                </Carte>
              ))}

              {/* ---------- Filtres ---------- */}
              <div className="mb-8 space-y-4 border-b border-bord-fort pb-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div role="group" aria-label={texteSite("Plateforme")} className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                    <Filtre actif={plateforme === 'toutes'} onClick={() => setPlateforme('toutes')}>{texteSite("Toutes (")}{texteSite(videos.length)}{texteSite(")")}</Filtre>
                    <Filtre actif={plateforme === 'youtube'} onClick={() => setPlateforme('youtube')}>
                      <YoutubeIcon className="h-4 w-4" />{texteSite("YouTube (")}{texteSite(videos.filter((v) => v.plateforme === 'youtube').length)}{texteSite(")")}</Filtre>
                    <Filtre actif={plateforme === 'tiktok'} onClick={() => setPlateforme('tiktok')}>
                      <TikTokIcon className="h-4 w-4" />{texteSite("TikTok (")}{texteSite(videos.filter((v) => v.plateforme === 'tiktok').length)}{texteSite(")")}</Filtre>
                  </div>
                  <label className="relative block w-full lg:w-72">
                    <span className="sr-only">{texteSite("Rechercher une vidéo")}</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doux" aria-hidden="true" />
                    <input
                      type="search"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      placeholder={texteSite("Rechercher une vidéo")}
                      className="w-full border border-bord-champ bg-encre py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-doux focus:border-magenta focus:outline-none"
                    />
                  </label>
                </div>
                {texteSite(disciplinesPresentes.length > 1 && (
                  <div role="group" aria-label={texteSite("Discipline")} className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
                    <Filtre actif={discipline === 'toutes'} onClick={() => setDiscipline('toutes')}>{texteSite("Toutes les disciplines")}</Filtre>
                    {texteSite(disciplinesPresentes.map((d) => (
                      <Filtre key={d} actif={discipline === d} onClick={() => setDiscipline(d)}>
                        {texteSite(libelleDiscipline(d))}
                      </Filtre>
                    )))}
                  </div>
                ))}
              </div>

              {/* ---------- Grille ---------- */}
              {texteSite(affichees.length === 0 ? (
                <Carte className="px-6 py-12 text-center">
                  <TitreCarte className="mb-3">{texteSite("Aucune vidéo ne correspond.")}</TitreCarte>
                  <p className="mb-6 text-texte">{texteSite("Changez de plateforme, de discipline ou de recherche.")}</p>
                  <Bouton variante="contour" type="button" onClick={reinitialiser}>{texteSite("Réinitialiser les filtres")}</Bouton>
                </Carte>
              ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {texteSite(affichees.map((v) => {
                    const mini = miniatureDe(v);
                    return (
                      <li key={v.id}>
                        <Carte as="article" className="group relative flex h-full flex-col overflow-hidden transition-colors hover:border-magenta/70">
                          <div className="relative aspect-video bg-encre">
                            {texteSite(mini && (
                              <ImagePublique
                                src={imageSite(mini)}
                        onError={masquerSiCassee}
                                alt={texteSite("")}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-contain opacity-85 transition-opacity group-hover:opacity-100"
                              />
                            ))}
                            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-nuit/85 px-2.5 py-1 text-xs font-semibold text-white">
                              {texteSite(v.plateforme === 'tiktok' ? <TikTokIcon className="h-3.5 w-3.5" /> : <YoutubeIcon className="h-3.5 w-3.5 text-[#FF0000]" />)}
                              {texteSite(v.plateforme === 'tiktok' ? 'TikTok' : 'YouTube')}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-magenta text-white">
                                <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <p className="surtitre mb-3 text-[0.68rem]">
                              {texteSite(libelleDiscipline(v.discipline))}{texteSite(" · ")}{texteSite(libelleCategorie(v.categorie))}
                            </p>
                            <h3 className="mb-2 line-clamp-2 font-bold italic leading-snug text-white">
                              <button type="button" onClick={() => setEnLecture(v)} className="cursor-pointer text-left after:absolute after:inset-0">
                                {texteSite(v.titre)}
                              </button>
                            </h3>
                            {texteSite(v.description && <p className="line-clamp-2 text-sm text-doux">{texteSite(v.description)}</p>)}
                            <p className="mt-auto pt-4 text-sm text-doux">{texteSite(v.date || `Saison ${data.meta.saison}`)}</p>
                          </div>
                        </Carte>
                      </li>
                    );
                  }))}
                </ul>
              ))}
            </>
          ))}
        </Conteneur>
      </section>

      {/* ---------- Lecteur ---------- */}
      {texteSite(enLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-nuit/90 p-3 backdrop-blur-md sm:p-6" onClick={fermer}>
          <div
            ref={lecteur}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lecteur-titre"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-bord-fort bg-carte-haute"
          >
            <div className="flex items-center justify-between gap-4 border-b border-bord-fort px-5 py-4">
              <h2 id="lecteur-titre" className="truncate font-bold italic text-white">
                {texteSite(enLecture.titre)}
              </h2>
              <button
                type="button"
                onClick={fermer}
                aria-label={texteSite("Fermer le lecteur")}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center bg-fuchsia text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex aspect-video w-full items-center justify-center bg-black">
              {texteSite(enLecture.plateforme !== 'tiktok' && idYoutube(enLecture.url) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${idYoutube(enLecture.url)}?autoplay=1&rel=0`}
                  title={texteSite(enLecture.titre)}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="max-w-md p-8 text-center">
                  <p className="mb-6 text-texte">
                    {texteSite(enLecture.plateforme === 'tiktok'
                      ? "Les vidéos TikTok de la ligue se regardent sur l'application ou le site TikTok."
                      : 'Cette vidéo ne peut pas être lue ici.')}
                  </p>
                  <BoutonLien href={urlSure(enLecture.url)} target="_blank" rel="noopener noreferrer">{texteSite("Ouvrir ")}{texteSite(enLecture.plateforme === 'tiktok' ? 'sur TikTok' : 'la vidéo')}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </BoutonLien>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-doux">
                {texteSite(libelleDiscipline(enLecture.discipline))}{texteSite(" · ")}{texteSite(libelleCategorie(enLecture.categorie))}
                {texteSite(enLecture.date ? ` · ${enLecture.date}` : '')}
              </p>
              <a
                href={urlSure(enLecture.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold italic text-magenta hover:underline"
              >{texteSite("Voir sur ")}{texteSite(enLecture.plateforme === 'tiktok' ? 'TikTok' : 'YouTube')}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PageVideos;
