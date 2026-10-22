import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { Lock, Trophy } from 'lucide-react';
import { ELCFaitMarquant } from '../types';
import { urlSure } from '../lib/urls';

// Le fait marquant de la page « À propos », repris en grand dans le Hall of
// Fame. Tant que l'accord de publication n'est pas obtenu, la carte le dit
// clairement et n'affiche aucun portrait.

export const CarteFaitMarquant: React.FC<{ fait: ELCFaitMarquant; compact?: boolean }> = ({ fait, compact = false }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const nomComplet = fait.surnom ? (
    <>
      {texteSite(fait.nom)}
      <span className="block">{texteSite("« ")}{texteSite(fait.surnom)}{texteSite(" »")}</span>
    </>
  ) : (
    fait.nom
  );
  const enAttente = !fait.publie;

  const portrait = (taille: string) =>
    fait.photo && fait.publie ? (
      <ImagePublique
        src={imageSite(fait.photo)}
        alt={texteSite(`Portrait de ${fait.nom}`)}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${taille} h-auto self-start shrink-0 border border-bord-fort`}
      />
    ) : null;

  if (compact) {
    return (
      <div className="flex flex-col gap-6 border border-bord-fort bg-carte-haute p-6 sm:flex-row sm:items-center">
        {texteSite(portrait('w-full sm:w-40') ?? (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-lg border border-bord-fort bg-carte px-2 text-center text-[0.7rem] font-bold italic uppercase tracking-[0.15em] text-doux">
            {texteSite(enAttente ? 'Accord de publication à obtenir' : 'Aucun portrait publié')}
          </div>
        ))}
        <div>
          <p className="titre text-xl sm:text-2xl">
            {texteSite(fait.nom)}
            {texteSite(fait.surnom && <>{texteSite(" « ")}{texteSite(fait.surnom)}{texteSite(" »")}</>)}
          </p>
          <p className="mt-3 font-extrabold italic uppercase text-magenta">{texteSite(fait.distinction)}</p>
          <p className="mt-3 leading-relaxed text-texte">{texteSite(fait.description)}</p>
        </div>
      </div>
    );
  }

  return (
    <article className="border border-bord-fort bg-carte-haute">
      {texteSite(enAttente && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-avis px-6 py-4">
          <p className="flex items-center gap-3 font-semibold text-white">
            <Lock className="h-5 w-5 text-magenta" aria-hidden="true" />{texteSite("Accord de publication à obtenir")}</p>
          <p className="text-sm text-doux">{texteSite("Publication en attente de validation")}</p>
        </div>
      ))}
      <div className="flex flex-col gap-8 p-6 sm:p-8 md:flex-row">
        {texteSite(portrait('w-full md:w-60') ?? (
          <div className="relative flex h-64 w-full shrink-0 flex-col items-center justify-center overflow-hidden border border-bord-fort md:w-60">
            <ImagePublique src={imageSite("/img/fond-planete.webp")} alt={texteSite("")} aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-nuit/50" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-magenta text-magenta">
              <Trophy className="h-10 w-10" aria-hidden="true" />
            </span>
            <p className="titre relative mt-5 text-xl">{texteSite(fait.distinction.split(',')[0])}</p>
            <p className="relative mt-2 text-xs text-doux">{texteSite("Aucun portrait publié")}</p>
          </div>
        ))}
        <div className="flex-1">
          <p className="surtitre mb-4">{texteSite(fait.distinction.split(',').reverse().map((s) => s.trim()).join(' · '))}</p>
          <h3 className="titre text-2xl sm:text-4xl">{texteSite(nomComplet)}</h3>
          <p className="mt-5 text-base leading-relaxed text-texte sm:text-lg">{texteSite(fait.description)}</p>
          {texteSite(fait.stats && fait.stats.length > 0 && (
            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              {texteSite(fait.stats.map((s) => (
                <div key={s.legende} className="border-t border-bord-fort pt-4">
                  <dt className="sr-only">{texteSite(s.legende)}</dt>
                  <dd className="titre text-3xl">{texteSite(s.valeur)}</dd>
                  <dd className="mt-1 text-sm text-doux">{texteSite(s.legende)}</dd>
                </div>
              )))}
            </dl>
          ))}
        </div>
      </div>
      {texteSite(fait.source && <p className="border-t border-bord bg-carte px-6 py-4 text-sm text-doux sm:px-8">{texteSite(fait.source)}</p>)}
    </article>
  );
};
