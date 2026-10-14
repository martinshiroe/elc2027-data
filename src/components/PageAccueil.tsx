import React from 'react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { contenuDe } from '../data/contenu';
import { CarteActualite } from './CarteActualite';
import { urlSure } from '../lib/urls';
import { Conteneur, Carte, TitreCarte, TitreSection, LienPage } from './ui';
import { ReseauxSociaux } from './ReseauxSociaux';
import { BlocDisciplines, BlocPhases, BlocVideos, BlocInscription, jeuxActifs } from './Blocs';

interface PageAccueilProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
}

export const PageAccueil: React.FC<PageAccueilProps> = ({ data, onNaviguer }) => {
  const { saison } = contenuDe(data);
  const inscriptionOuverte = Boolean(data.meta.googleFormUrl);

  return (
    <>
      {/* ---------- Héros plein écran (cadre « LIGUE DE L'EST SITE WEB ») ---------- */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden md:min-h-[100svh]" aria-labelledby="titre-accueil">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img
            src="/img/hero-joueur.webp"
            srcSet="/img/hero-joueur-1200.webp 1200w, /img/hero-joueur.webp 2400w"
            sizes="100vw"
            alt=""
            // React 18 ne connaît pas encore `fetchPriority` : attribut HTML brut.
            {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover object-[62%_center]"
          />
          {/* Voile léger : l'illustration reste vive, le texte reste lisible. */}
          <div className="absolute inset-0 bg-gradient-to-r from-nuit/70 via-nuit/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nuit to-transparent" />
        </div>

        {/* Filets roses verticaux de la maquette. Ils s'arrêtent au-dessus des
            réseaux et des logos, sans jamais les traverser. */}
        <span aria-hidden="true" className="pointer-events-none absolute left-[6.5%] top-36 bottom-[19rem] hidden w-0.5 bg-rose/90 md:block" />
        <span aria-hidden="true" className="pointer-events-none absolute right-[6.5%] top-36 bottom-[16rem] hidden w-0.5 bg-rose/90 md:block" />

        <div className="flex flex-1 items-center px-5 pt-[13.5rem] pb-56 sm:px-[11.5%] sm:pt-60 md:pb-40 lg:pt-40">
          <div className="mx-auto w-full max-w-md border border-white/10 bg-white/[0.07] px-6 py-7 text-center shadow-2xl backdrop-blur-md sm:mx-0 sm:px-12 sm:py-9">
            <h1 id="titre-accueil" className="titre text-[1.4rem] leading-[1.18] tracking-[0.04em] sm:text-[2rem]">
              Affronte les meilleurs — sans compromis
            </h1>
            <p className="mx-auto mt-4 max-w-xs text-center text-base sm:text-left font-medium italic leading-snug tracking-wide text-white sm:mt-5 sm:text-lg">
              Pour que l'esport rayonne dans toute la région de l'Est.
            </p>
            <p className="sr-only">
              Ligue Régionale d'Esport de l'Est Cameroun — ELC, East League of Cameroon. Délégation régionale de la FECASES.
            </p>
          </div>
        </div>

        {/* Réseaux, à la verticale en bas à gauche */}
        <ReseauxSociaux
          reseaux={data.meta.reseaux}
          vertical
          className="absolute bottom-28 left-[5.2%] hidden gap-4! md:flex"
        />

        {/* Disciplines, en bas à droite : logos s'ils sont fournis dans l'admin.
            Grille 2 × 2 à hauteur égale ; un liseré clair garde lisibles les
            logos sombres (Free Fire) sur l'illustration. */}
        <ul
          className="absolute bottom-28 right-[5%] hidden grid-cols-2 items-center justify-items-center gap-x-5 gap-y-3 md:grid"
          aria-label="Disciplines"
        >
          {jeuxActifs(data).map((j) => {
            const logo = data.competition?.[j.id]?.logoImage;
            return (
              <li key={j.id} className="flex h-11 w-32 items-center justify-center">
                {logo ? (
                  <img
                    src={urlSure(logo)}
                    alt={j.nom}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.9))_drop-shadow(0_0_6px_rgba(255,255,255,0.25))]"
                  />
                ) : (
                  <span className="text-center text-sm font-extrabold italic uppercase leading-tight tracking-wider text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {j.nom.replace(': Bang Bang', '')}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile : réseaux à l'horizontale et disciplines empilées, au-dessus
            de « S'inscrire », comme sur la maquette mobile. */}
        <div className="absolute inset-x-0 bottom-24 flex items-end justify-between gap-4 px-5 md:hidden">
          <ReseauxSociaux reseaux={data.meta.reseaux} className="gap-3!" />
          <ul className="flex flex-col items-end gap-2" aria-label="Disciplines">
            {jeuxActifs(data).map((j) => {
              const logo = data.competition?.[j.id]?.logoImage;
              return (
                <li key={j.id} className="flex h-9 w-28 items-center justify-end">
                  {logo ? (
                    <img
                      src={urlSure(logo)}
                      alt={j.nom}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.9))_drop-shadow(0_0_6px_rgba(255,255,255,0.25))]"
                    />
                  ) : (
                    <span className="text-right text-xs font-extrabold italic uppercase leading-tight tracking-wider text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      {j.nom.replace(': Bang Bang', '')}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* « S'inscrire » en biseau, entre deux filets */}
        <div className="absolute inset-x-0 bottom-6 flex items-center px-5 sm:bottom-8 sm:px-[13%]">
          <span aria-hidden="true" className="h-0.5 flex-1 bg-magenta/90" />
          <LienPage
            section={inscriptionOuverte ? 'inscription' : 'contact'}
            onNaviguer={onNaviguer}
            className="relative isolate mx-2 px-10 py-3 text-base font-extrabold italic uppercase tracking-[0.15em] text-white transition-transform hover:scale-[1.03] sm:px-20 sm:py-4 sm:text-lg"
          >
            <span aria-hidden="true" className="biseau absolute inset-0 -z-10 bg-magenta-plein" />
            {inscriptionOuverte ? "S'inscrire" : 'Nous rejoindre'}
          </LienPage>
          <span aria-hidden="true" className="h-0.5 flex-1 bg-magenta/90" />
        </div>
      </section>

      {/* ---------- Disciplines ---------- */}
      <section className="py-12 sm:py-20">
        <Conteneur>
          <BlocDisciplines data={data} onNaviguer={onNaviguer} />
        </Conteneur>
      </section>

      {/* ---------- Les nouvelles de la ligue ---------- */}
      {saison.actualites.length > 0 && (
      <section className="pb-12 sm:pb-20">
        <Conteneur>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <TitreSection surtitre="La vie de l'ELC" titre="Les nouvelles de la ligue." />
            <LienPage section="saison" onNaviguer={onNaviguer} bouton="contour" className="shrink-0">
              Saison news
            </LienPage>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">
            {saison.actualites.slice(0, 2).map((a, i) => (
              <li key={a.id ?? i}>
                <CarteActualite actu={a} />
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>
      )}

      {/* ---------- Calendrier ---------- */}
      <section className="pb-12 sm:pb-20">
        <Conteneur>
          <BlocPhases data={data} />
          <div className="mt-8">
            <LienPage section="competition" onNaviguer={onNaviguer} bouton="contour">
              Tout le calendrier
            </LienPage>
          </div>
        </Conteneur>
      </section>

      {/* ---------- Vidéos ---------- */}
      <section className="pb-12 sm:pb-20">
        <Conteneur>
          <BlocVideos data={data} onNaviguer={onNaviguer} />
        </Conteneur>
      </section>

      <BlocInscription data={data} onNaviguer={onNaviguer} />
    </>
  );
};

export default PageAccueil;
