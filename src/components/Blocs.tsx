import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
// Blocs partagés par l'accueil et le calendrier.
//
// Ces contenus existaient sur l'ancien site et n'ont pas d'équivalent dessiné
// dans la maquette : ils reprennent ses cartes, ses titres et ses boutons.

import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { ELCData, ELCVideo } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { Carte, TitreCarte, TitreSection, LienPage, BoutonLien, Pastille, BandePlanete, Conteneur } from './ui';

export type Jeu = 'hok' | 'mlbb' | 'pubgm' | 'ff';

export const JEUX: { id: Jeu; nom: string; court: string; famille: 'MOBA' | 'Battle Royale' }[] = [
  { id: 'hok', nom: 'Honor of Kings', court: 'HoK', famille: 'MOBA' },
  { id: 'mlbb', nom: 'Mobile Legends: Bang Bang', court: 'MLBB', famille: 'MOBA' },
  { id: 'pubgm', nom: 'PUBG Mobile', court: 'PUBG M', famille: 'Battle Royale' },
  { id: 'ff', nom: 'Free Fire', court: 'Free Fire', famille: 'Battle Royale' },
];

/**
 * Disciplines retenues pour la saison. Une discipline désactivée dans l'admin
 * (`competition.<jeu>.actif === false`) disparaît de tout le site public.
 */
export function jeuxActifs(data: ELCData) {
  return JEUX.filter((j) => data.competition?.[j.id]?.actif !== false);
}

const NOMBRES = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre'];

/** « Deux jeux », « Un jeu »… pour les titres qui annonçaient « Quatre ». */
export function nombreDeJeux(n: number, mot: 'jeu' | 'discipline' = 'jeu'): string {
  const nombre = mot === 'discipline' && n === 1 ? 'Une' : NOMBRES[n] ?? String(n);
  const pluriel = n > 1 ? (mot === 'jeu' ? 'jeux' : 'disciplines') : mot;
  return `${nombre} ${pluriel}`;
}

/** « Honor of Kings et Mobile Legends », « A, B et C ». */
export function listeDesJeux(jeux: { nom: string }[]): string {
  const noms = jeux.map((j) => j.nom.replace(': Bang Bang', ''));
  return noms.length < 2 ? noms.join('') : `${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]}`;
}

type Naviguer = (section: Section, jeu?: string) => void;

/** Les disciplines actives, chacune menant à son ranking. */
export const BlocDisciplines: React.FC<{ data: ELCData; onNaviguer: Naviguer; niveau?: 2 | 3 }> = ({
  data,
  onNaviguer,
  niveau = 2,
}) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const titres = data.visual1?.titres ?? [];
  const jeux = jeuxActifs(data);
  if (jeux.length === 0) return null;
  const colonnes = jeux.length >= 4 ? 'lg:grid-cols-4' : jeux.length === 3 ? 'lg:grid-cols-3' : '';
  return (
    <div>
      <TitreSection
        niveau={niveau}
        surtitre={"Les disciplines"}
        titre={`${nombreDeJeux(jeux.length)}. Une seule ligue.`}
        className="mb-6 sm:mb-8"
      >
        {texteSite(data.visual2?.bandeauSousTitre)}
      </TitreSection>
      <ul className={`grid gap-5 sm:grid-cols-2 ${colonnes}`}>
        {texteSite(jeux.map((jeu) => {
          const t = titres.find((x) => x.id === jeu.id);
          const logo = data.competition?.[jeu.id]?.logoImage;
          const image = data.competition?.[jeu.id]?.heroImage;
          return (
            <li key={jeu.id}>
              <Carte className="group relative flex h-full flex-col overflow-hidden transition-colors hover:border-magenta/70">
                <div className="relative h-32 overflow-hidden bg-carte-haute">
                  {texteSite(image && (
                    <ImagePublique
                      src={imageSite(image)}
                      alt={texteSite("")}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain opacity-60 transition-transform duration-500"
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-carte to-transparent" />
                  {texteSite(logo && (
                    <ImagePublique
                      src={imageSite(logo)}
                      alt={texteSite("")}
                      loading="lazy"
                      className="absolute bottom-3 left-5 h-9 w-auto max-w-[70%] object-contain"
                    />
                  ))}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="surtitre mb-2 text-[0.68rem]">{texteSite(jeu.famille)}</p>
                  <TitreCarte niveau={niveau === 2 ? 3 : 4} className="mb-3">
                    {texteSite(jeu.nom)}
                  </TitreCarte>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {texteSite(t?.badge && <Pastille>{texteSite(t.badge)}</Pastille>)}
                    {texteSite(t?.lancement && <Pastille>{texteSite(t.lancement)}</Pastille>)}
                  </div>
                  <LienPage
                    section="classements"
                    jeu={jeu.id}
                    onNaviguer={onNaviguer}
                    className="mt-auto flex items-center justify-between font-bold italic text-magenta after:absolute after:inset-0"
                  >
                    <span>{texteSite("Voir le ranking")}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </LienPage>
                </div>
              </Carte>
            </li>
          );
        }))}
      </ul>
    </div>
  );
};

/** Les grandes phases de la saison. */
export const BlocPhases: React.FC<{ data: ELCData; niveau?: 2 | 3 }> = ({ data, niveau = 2 }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const v2 = data.visual2;
  if (!v2?.phases?.length) return null;
  return (
    <div>
      <TitreSection
        niveau={niveau}
        surtitre={v2.calendrierLabel || 'Calendrier prévisionnel'}
        titre={v2.calendrierPeriode || 'La saison'}
        className="mb-6 sm:mb-8"
      />
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {texteSite(v2.phases.map((phase, i) => {
          const finale = Boolean(phase.tag);
          return (
            <li key={i}>
              <Carte haute={finale} className={`relative flex h-full flex-col p-6 ${finale ? 'border-magenta/70' : ''}`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="titre text-4xl text-magenta">
                    {texteSite(String(i + 1).padStart(2, '0'))}
                  </span>
                  {texteSite(phase.tag && <Pastille className="border-magenta">{texteSite(phase.tag)}</Pastille>)}
                </div>
                <p className="surtitre mb-2 text-[0.68rem]">{texteSite(phase.periode)}</p>
                <TitreCarte niveau={niveau === 2 ? 3 : 4} className="mb-3 text-base sm:text-lg">
                  {texteSite(phase.titre)}
                </TitreCarte>
                <p className="text-sm leading-relaxed text-texte">{texteSite(phase.sousTitre)}</p>
              </Carte>
            </li>
          );
        }))}
      </ol>
    </div>
  );
};

export function idYoutube(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * La couverture choisie par l'admin prime. Seules les anciennes miniatures
 * signées de YouTube Studio sont remplacées par la miniature publique stable.
 */
export function miniatureDe(video: ELCVideo): string {
  if (video.miniature && !/^https?:\/\/i9\.ytimg\.com\//i.test(video.miniature)) return video.miniature;
  const id = video.url ? idYoutube(video.url) : null;
  if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return video.miniature ?? '';
}

/** À poser sur une miniature : si elle ne charge pas, on la masque. */
export const masquerSiCassee = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = 'hidden';
};

/** Les dernières vidéos, avec un lien vers la page Vidéos. */
export const BlocVideos: React.FC<{ data: ELCData; onNaviguer: Naviguer }> = ({ data, onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const videos = (data.videos ?? []).slice().sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 3);
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <TitreSection surtitre={"Diffusion"} titre={"Le jeu en direct. Les moments forts en vidéo."} />
        <LienPage section="videos" onNaviguer={onNaviguer} bouton="contour" className="shrink-0">{texteSite("Toutes les vidéos")}</LienPage>
      </div>
      {texteSite(videos.length === 0 ? (
        <Carte className="p-6 text-texte">{texteSite("Les premières vidéos de la ligue seront publiées ici.")}</Carte>
      ) : (
        <ul className="grid gap-5 md:grid-cols-3">
          {texteSite(videos.map((v) => {
            const mini = miniatureDe(v);
            return (
              <li key={v.id}>
                <Carte className="group relative h-full overflow-hidden transition-colors hover:border-magenta/70">
                  <div className="relative aspect-video bg-carte-haute">
                    {texteSite(mini && (
                      <ImagePublique
                        src={imageSite(mini)}
                        onError={masquerSiCassee}
                        alt={texteSite("")}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain opacity-80 transition-opacity group-hover:opacity-100"
                      />
                    ))}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-magenta text-white shadow-lg">
                        <Play className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                  <div className="p-5">
                    {texteSite(v.date && <p className="surtitre mb-2 text-[0.68rem]">{texteSite(v.date)}</p>)}
                    <a
                      href={urlSure(v.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold italic leading-snug text-white after:absolute after:inset-0"
                    >
                      {texteSite(v.titre)}
                      <span className="sr-only">{texteSite(" (nouvel onglet)")}</span>
                    </a>
                  </div>
                </Carte>
              </li>
            );
          }))}
        </ul>
      ))}
    </div>
  );
};

/** Appel à l'inscription, sur le fond « planète » de la maquette. */
export const BlocInscription: React.FC<{ data: ELCData; onNaviguer: Naviguer }> = ({ data, onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const ouvert = Boolean(data.meta.googleFormUrl);
  return (
    <BandePlanete image={data.meta.ctaImage || undefined} className="py-12 sm:py-20">
      <Conteneur>
        <Carte haute className="bg-carte-haute/80 p-7 sm:p-10">
          <TitreSection
            surtitre={`Saison ${data.meta.saison || '2027'}`}
            titre={ouvert ? 'Les inscriptions sont ouvertes.' : 'Préparez votre équipe.'}
          >
            {texteSite(ouvert
              ? 'Équipes MOBA et joueurs Battle Royale : inscrivez-vous pour la prochaine saison de la ligue.'
              : "Les inscriptions ouvriront prochainement. Écrivez-nous dès maintenant pour pré-enregistrer votre équipe.")}
          </TitreSection>
          <div className="mt-8 flex flex-wrap gap-4">
            {texteSite(ouvert ? (
              <LienPage section="inscription" onNaviguer={onNaviguer} bouton="plein">{texteSite("S'inscrire")}</LienPage>
            ) : (
              <LienPage section="contact" onNaviguer={onNaviguer} bouton="plein">{texteSite("Nous contacter")}</LienPage>
            ))}
            {texteSite(data.meta.reseaux?.whatsapp && (
              <BoutonLien variante="contour" href={urlSure(data.meta.reseaux.whatsapp)} target="_blank" rel="noopener noreferrer">{texteSite("Assistance WhatsApp")}</BoutonLien>
            ))}
          </div>
        </Carte>
      </Conteneur>
    </BandePlanete>
  );
};
