import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { Camera } from 'lucide-react';
import { urlSure, urlCss } from '../lib/urls';

// Cadre « affiche » d'une distinction du Hall of Fame, repris de l'ancien
// Panthéon. Chaque distinction garde sa couleur fixe, reconnaissable au
// premier coup d'œil : or pour le G.O.A.T, bleu pour GodLike, rouge pour
// Demon King, sarcelle pour le MVP.

export interface Affiche {
  key: string;
  title: string;
  subtitle: string;
  desc: string;
  couleur: string;
  icone: React.ReactNode;
  nom?: string;
  photo?: string;
  heros?: string;
  fond?: string;
  clan?: string;
  details?: string;
  statut?: string;
}

// Couleur de texte lisible sur l'aplat du bandeau : blanc sur le bleu ou le
// rouge, noir sur l'or du G.O.A.T, sinon le nom disparaît.
const lisibleSur = (hex: string): string => {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '#ffffff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111111' : '#ffffff';
};

export const AfficheDistinction: React.FC<{ d: Affiche; saison: string }> = ({ d, saison }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const aUnNomine = Boolean(d.nom || d.photo);
  const surAccent = lisibleSur(d.couleur);

  return (
    <article
      id={`distinction-${d.key}`}
      aria-label={texteSite(`${d.title} — ${d.subtitle}${d.nom ? ` : ${d.nom}` : ''}`)}
      className="overflow-hidden transition-shadow duration-300"
      style={{ border: `1px solid ${d.couleur}66`, boxShadow: `0 10px 34px ${d.couleur}26` }}
    >
      {/* ---------- L'affiche ---------- */}
      <div className="relative aspect-square overflow-hidden bg-nuit">
        {/* Fond : halo de la couleur du cadre sur violet nuit */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 70% 10%, ${d.couleur}26 0%, transparent 55%), linear-gradient(160deg, #1a1530 0%, #0c0a18 100%)`,
          }}
        />
        {/* Fond personnalisé choisi dans l'admin, voilé pour garder le texte lisible */}
        {texteSite(d.fond && (
          <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${urlCss(imageSite(d.fond))}")` }}>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(12,10,24,0.70) 0%, rgba(12,10,24,0.86) 100%)' }}
            />
          </div>
        ))}

        {/* Trame de points, comme sur les affiches de match */}
        <div
          aria-hidden="true"
          className="absolute right-[8%] top-[8%] h-[14%] w-[22%] opacity-40"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '9px 9px' }}
        />

        {/* Bloc de couleur en pointe, derrière le joueur */}
        <div
          aria-hidden="true"
          className="absolute left-[13%] top-[9%] h-[78%] w-[54%]"
          style={{
            background: `linear-gradient(165deg, ${d.couleur} 0%, ${d.couleur}aa 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 64%, 50% 100%, 0 64%)',
          }}
        />

        {/* Héros du jeu, en retrait à droite, fondu sur les bords */}
        {texteSite(d.heros && (
          <ImagePublique
            src={imageSite(d.heros)}
            alt={texteSite("")}
            aria-hidden="true"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="absolute right-0 top-[6%] h-[56%] w-[40%] object-contain object-top opacity-85"
            style={{
              maskImage: 'linear-gradient(to left, black 55%, transparent 100%), linear-gradient(to top, transparent 0%, black 35%)',
              maskComposite: 'intersect',
              WebkitMaskImage: 'linear-gradient(to left, black 55%, transparent 100%), linear-gradient(to top, transparent 0%, black 35%)',
              WebkitMaskComposite: 'source-in',
            }}
          />
        ))}

        {/* Photo du joueur au premier plan, recadrée sur le visage */}
        {texteSite(d.photo ? (
          <ImagePublique
            src={imageSite(d.photo)}
            alt={texteSite(d.nom ? `Portrait de ${d.nom}` : 'Portrait du nominé')}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="absolute bottom-[15%] left-[40%] h-[64%] w-[42%] -translate-x-1/2 object-contain object-bottom"
            style={{
              maskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
              filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.75))',
            }}
          />
        ) : (
          <div className="absolute bottom-[15%] left-[40%] flex h-[64%] w-[42%] -translate-x-1/2 flex-col items-center justify-center gap-2 border border-dashed border-black/30 bg-black/25 text-white/75">
            <Camera className="h-10 w-10" aria-hidden="true" />
            <span className="px-2 text-center text-[10px] font-bold uppercase tracking-widest">{texteSite("Photo du joueur")}</span>
          </div>
        ))}

        {/* Intitulé de la distinction, à la verticale sur le flanc */}
        <div
          aria-hidden="true"
          className="absolute bottom-[10%] left-[4%] top-[14%] flex items-end"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <span className="titre text-2xl leading-none drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-4xl lg:text-5xl">
            {texteSite(d.title)}
          </span>
        </div>

        {/* Sous-titre, en haut à gauche */}
        <div className="absolute left-[4%] right-[38%] top-[5%]">
          <span className="block truncate text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">
            {texteSite(d.subtitle)}
          </span>
        </div>

        {/* Repère de saison, en haut à droite */}
        <div className="absolute right-[6%] top-[6%] flex items-center gap-2">
          <span className="text-[10px] font-extrabold italic uppercase tracking-widest sm:text-xs" style={{ color: d.couleur }}>{texteSite("ELC ")}{texteSite(saison)}
          </span>
          <span aria-hidden="true" style={{ color: d.couleur }}>
            {texteSite(d.icone)}
          </span>
        </div>

        {/* Bandeau du nom */}
        <div className="absolute bottom-[16%] left-[30%] right-0">
          <div className="px-4 py-2.5 sm:px-6 sm:py-3.5" style={{ background: `linear-gradient(90deg, ${d.couleur} 0%, ${d.couleur}cc 100%)` }}>
            <span className="titre block truncate text-lg leading-none sm:text-2xl lg:text-3xl" style={{ color: surAccent }}>
              {texteSite(d.nom || 'À attribuer')}
            </span>
          </div>
          <div className="px-4 pt-2 sm:px-6 sm:pt-3">
            {texteSite(d.clan && (
              <div className="titre text-lg leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-2xl">{texteSite(d.clan)}</div>
            ))}
            {texteSite(d.details && <div className="mt-1 truncate text-[10px] text-white/75 sm:text-xs">{texteSite(d.details)}</div>)}
          </div>
        </div>

        {/* Pied d'affiche */}
        <div className="absolute bottom-[4%] left-0 right-0 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/55 sm:text-[10px]">
            {texteSite(aUnNomine ? d.statut || 'Nominé officiel' : 'Nomination à venir')}
          </span>
        </div>
      </div>

      {/* ---------- Ce que récompense la distinction ---------- */}
      <div className="border-t border-bord bg-carte p-5">
        <p className="text-sm leading-relaxed text-texte">{texteSite(d.desc)}</p>
      </div>
    </article>
  );
};
