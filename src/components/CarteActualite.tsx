import { useSiteCustomization } from '../lib/siteCustomization';
import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { ELCActualite } from '../types';
import { urlSure } from '../lib/urls';
import { Carte, TitreCarte } from './ui';
import { idYoutube, masquerSiCassee } from './Blocs';

// Une actualité de la ligue : rubrique, titre, texte, et selon ce que l'admin
// a saisi une image, une vidéo, un lien et une note de bas de carte.

const dateLisible = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Vidéo YouTube en « façade » : la miniature d'abord, le lecteur au clic.
 * Une iframe YouTube pèse près d'un mégaoctet ; sur une page de plusieurs
 * actualités, la charger d'office ralentirait tout le monde, surtout en 3G.
 */
const VideoActualite: React.FC<{ url: string; titre: string }> = ({ url, titre }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const [lecture, setLecture] = useState(false);
  const id = idYoutube(url);

  if (!id) {
    return (
      <a
        href={urlSure(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-5 inline-flex items-center gap-2 font-bold italic text-magenta hover:underline"
      >
        <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />{texteSite("Voir la vidéo")}<span className="sr-only">{texteSite(" (nouvel onglet)")}</span>
      </a>
    );
  }

  return (
    <div className="relative mb-5 aspect-video overflow-hidden border border-bord-fort bg-encre">
      {texteSite(lecture ? (
        <iframe
          src={imageSite(`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`)}
          title={texteSite(titre)}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLecture(true)}
          className="group absolute inset-0 cursor-pointer"
          aria-label={texteSite(`Lire la vidéo : ${titre}`)}
        >
          <img
            src={imageSite(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            alt={texteSite("")}
            loading="lazy"
            onError={masquerSiCassee}
            className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-magenta-plein text-white shadow-xl transition-transform group-hover:scale-110">
              <Play className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true" />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

export const CarteActualite: React.FC<{ actu: ELCActualite; grand?: boolean }> = ({ actu, grand = false }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const date = dateLisible(actu.date);
  return (
    <Carte as="article" className="flex h-full flex-col p-5 sm:p-7">
      {texteSite(actu.image && !actu.video && (
        <img
          src={imageSite(urlSure(actu.image))}
          alt={texteSite("")}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={masquerSiCassee}
          className="-mx-5 -mt-5 mb-5 aspect-[16/9] w-[calc(100%+2.5rem)] max-w-none border-b border-bord object-cover sm:-mx-7 sm:-mt-7 sm:w-[calc(100%+3.5rem)]"
        />
      ))}
      <p className="surtitre mb-4 text-[0.7rem]">
        {texteSite(actu.rubrique)}
        {texteSite(date && <span className="text-doux">{texteSite(" · ")}{texteSite(date)}</span>)}
      </p>
      <TitreCarte className={`mb-4 ${grand ? 'text-xl sm:text-2xl' : 'text-lg sm:text-2xl'}`}>{texteSite(actu.titre)}</TitreCarte>
      {texteSite(actu.video && <VideoActualite url={actu.video} titre={actu.titre} />)}
      <p className="whitespace-pre-line leading-relaxed text-texte">{texteSite(actu.texte)}</p>
      {texteSite(actu.lien?.url && (
        <a
          href={urlSure(actu.lien.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 self-start rounded-full border-2 border-magenta px-5 py-2.5 text-sm font-bold italic text-white transition-colors hover:bg-magenta/15"
        >
          {texteSite(actu.lien.libelle || 'En savoir plus')}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{texteSite(" (nouvel onglet)")}</span>
        </a>
      ))}
      {texteSite(actu.note && (
        <div className="mt-auto pt-6">
          <p className="border-t border-bord-fort pt-4 text-sm text-doux">{texteSite(actu.note)}</p>
        </div>
      ))}
    </Carte>
  );
};
