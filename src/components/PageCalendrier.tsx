import React from 'react';
import { ArrowRight, ExternalLink, Smartphone, Tv, Users, Swords } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { Conteneur, EnTetePage, Carte, TitreCarte, TitreSection, LienPage, Bouton, BoutonLien } from './ui';
import { BlocPhases, BlocInscription, JEUX } from './Blocs';

interface PageCalendrierProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
  onOpenRegulations: () => void;
}

export const PageCalendrier: React.FC<PageCalendrierProps> = ({ data, onNaviguer, onOpenRegulations }) => {
  const v2 = data.visual2;
  const structure = v2?.structure;
  const faits = [
    structure?.equipesMoba && { Icone: Users, valeur: structure.equipesMoba, legende: 'par discipline MOBA' },
    structure?.joueursTps && { Icone: Users, valeur: structure.joueursTps, legende: 'en Battle Royale' },
    structure?.qualifsFinales && { Icone: Swords, valeur: structure.qualifsFinales, legende: 'qualifications et finales' },
    structure?.cashPrize && { Icone: Swords, valeur: structure.cashPrize, legende: 'cash prize' },
  ].filter(Boolean) as { Icone: typeof Users; valeur: string; legende: string }[];

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <p className="surtitre mb-4">Calendrier · Saison {data.meta.saison || '2027'}</p>
          <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">
            Une saison.
            <span className="block">Quatre disciplines.</span>
          </h1>
          {v2?.bandeauSousTitre && <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">{v2.bandeauSousTitre}.</p>}
          <div className="mt-8 flex flex-wrap gap-4">
            {data.meta.startGgUrl && (
              <BoutonLien href={urlSure(data.meta.startGgUrl)} target="_blank" rel="noopener noreferrer">
                Brackets sur start.gg
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </BoutonLien>
            )}
            <Bouton variante={data.meta.startGgUrl ? 'contour' : 'plein'} type="button" onClick={onOpenRegulations}>
              Règlement FECASES
            </Bouton>
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-10 sm:pb-16">
        <Conteneur>
          <BlocPhases data={data} />
        </Conteneur>
      </section>

      {/* ---------- Par discipline ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre="Par discipline" titre="Les dates de chaque jeu." className="mb-6 sm:mb-8" />
          <ul className="grid gap-5 md:grid-cols-2">
            {JEUX.map((j) => {
              const jeu = data.competition?.[j.id];
              return (
                <li key={j.id}>
                  <Carte className="flex h-full flex-col p-6">
                    <p className="surtitre mb-2 text-[0.68rem]">{j.famille}</p>
                    <TitreCarte className="mb-5 text-xl sm:text-2xl">{j.nom}</TitreCarte>
                    <ol className="mb-6 divide-y divide-bord">
                      {(jeu?.calendrier ?? []).map((c, i) => (
                        <li key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                          <span className="font-semibold text-white">{c.phase}</span>
                          <span className="shrink-0 text-sm text-doux">
                            {c.periode}
                            {c.lieu ? ` · ${c.lieu}` : ''}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <LienPage
                      section="classements"
                      jeu={j.id}
                      onNaviguer={onNaviguer}
                      className="mt-auto inline-flex items-center gap-2 self-start font-bold italic text-magenta hover:underline"
                    >
                      Voir le ranking {j.court}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </LienPage>
                  </Carte>
                </li>
              );
            })}
          </ul>
        </Conteneur>
      </section>

      {/* ---------- Format ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre="Format de compétition" titre="Comment se joue la saison." className="mb-6 sm:mb-8" />
          {faits.length > 0 && (
            <dl className="mb-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {faits.map((f) => (
                <div key={f.legende} className="border border-bord bg-carte p-5">
                  <dd className="titre text-xl">{f.valeur}</dd>
                  <dt className="mt-2 text-sm text-doux">{f.legende}</dt>
                </div>
              ))}
            </dl>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            {v2?.plateformes && (
              <Carte className="flex gap-4 p-6">
                <Smartphone className="h-6 w-6 shrink-0 text-magenta" aria-hidden="true" />
                <p className="leading-relaxed text-texte">{v2.plateformes}</p>
              </Carte>
            )}
            {v2?.diffusion && (
              <Carte className="flex gap-4 p-6">
                <Tv className="h-6 w-6 shrink-0 text-magenta" aria-hidden="true" />
                <p className="leading-relaxed text-texte">{v2.diffusion}</p>
              </Carte>
            )}
          </div>
        </Conteneur>
      </section>

      <BlocInscription data={data} onNaviguer={onNaviguer} />
    </>
  );
};

export default PageCalendrier;
