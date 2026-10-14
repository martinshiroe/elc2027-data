import React from 'react';
import { ListOrdered, Trophy, CalendarDays, ArrowRight, Newspaper, CircleDashed } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { contenuDe } from '../data/contenu';
import { CarteActualite } from './CarteActualite';
import {
  Conteneur,
  EnTetePage,
  BandePlanete,
  Carte,
  CarteLien,
  TitreCarte,
  TitreSection,
  LienPage,
  Pastille,
  Trait,
} from './ui';
import { OngletsSaison } from './OngletsSaison';
import { jeuxActifs, nombreDeJeux } from './Blocs';
import { EtatDonnees, EnChargement, CarteGabarit, CarteEtat, LienCourt, LiensCourts } from './Etats';

interface PageSaisonProps {
  data: ELCData;
  etat: EtatDonnees;
  onReessayer: () => void;
  onNaviguer: (section: Section, jeu?: string) => void;
}

export const PageSaison: React.FC<PageSaisonProps> = ({ data, etat, onReessayer, onNaviguer }) => {
  const { saison, apropos } = contenuDe(data);
  const jeux = jeuxActifs(data);
  const actifs = jeux.map((j) => j.id as string);
  const premierRanking = jeux[0] ? (
    <LienPage section="classements" jeu={jeux[0].id} onNaviguer={onNaviguer} bouton="contour">
      Voir le ranking {jeux[0].court}
    </LienPage>
  ) : undefined;

  const reperes: React.ComponentProps<typeof CarteLien>[] = [
    {
      section: 'classements',
      jeu: 'hok',
      onNaviguer,
      surtitre: 'Ranking · HoK',
      titre: 'Honor of Kings',
      texte: 'Le classement des équipes MOBA, le tableau final à élimination directe et le barème.',
      action: 'Voir le ranking HoK',
      icone: <ListOrdered className="h-6 w-6" />,
    },
    {
      section: 'classements',
      jeu: 'mlbb',
      onNaviguer,
      surtitre: 'Ranking · MLBB',
      titre: 'Mobile Legends: Bang Bang',
      texte: 'Un classement dédié au jeu, avec ses équipes, ses séries et son tableau final.',
      action: 'Voir le ranking MLBB',
      icone: <ListOrdered className="h-6 w-6" />,
    },
    {
      section: 'classements',
      jeu: 'pubgm',
      onNaviguer,
      surtitre: 'Ranking · PUBG M',
      titre: 'PUBG Mobile',
      texte: 'Le classement individuel Battle Royale : points de placement et éliminations.',
      action: 'Voir le ranking PUBG M',
      icone: <ListOrdered className="h-6 w-6" />,
    },
    {
      section: 'classements',
      jeu: 'ff',
      onNaviguer,
      surtitre: 'Ranking · Free Fire',
      titre: 'Free Fire',
      texte: 'Le classement individuel Battle Royale : points de placement et éliminations.',
      action: 'Voir le ranking Free Fire',
      icone: <ListOrdered className="h-6 w-6" />,
    },
    {
      section: 'pantheon',
      onNaviguer,
      surtitre: 'Mémoire de la ligue',
      titre: 'Hall of Fame',
      texte: 'Les faits connus, les distinctions à confirmer et les moments qui font vivre la ligue.',
      action: 'Explorer le Hall of Fame',
      icone: <Trophy className="h-6 w-6" />,
    },
    {
      section: 'competition',
      onNaviguer,
      surtitre: 'La saison',
      titre: 'Calendrier',
      texte: 'Les phases de la saison, les périodes par discipline et le format des rencontres.',
      action: 'Voir le calendrier',
      icone: <CalendarDays className="h-6 w-6" />,
    },
  ];

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <div className="grid gap-10 lg:grid-cols-[1fr_330px] lg:items-start">
            <div>
              <p className="surtitre mb-4">Saison news · ELC — East League of Cameroun</p>
              <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">
                La scène de l'Est.
                <span className="block">Toute une saison</span>
                <span className="block">à construire.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-texte sm:text-lg">
                Actualités de la ligue, classements par jeu et faits marquants : suivez l'ELC depuis Bertoua, au cœur de
                l'Est Cameroun.
              </p>
            </div>
            <Carte haute className="bg-carte-haute/85 p-7 backdrop-blur-sm">
              <p className="surtitre mb-4">Le prochain chapitre</p>
              <p className="titre text-6xl sm:text-7xl">{saison.chapitre.annee}</p>
              <Pastille className="mt-5">{saison.chapitre.statut}</Pastille>
              <p className="mt-5 leading-relaxed text-texte">{saison.chapitre.texte}</p>
              <Trait className="mt-6" />
            </Carte>
          </div>
          <div className="mt-8 sm:mt-12">
            <OngletsSaison actif="actualites" jeux={actifs} onNaviguer={onNaviguer} />
          </div>
        </Conteneur>
      </EnTetePage>

      {/* ---------- Repères ---------- */}
      <section className="pb-10 sm:pb-16">
        <Conteneur>
          <TitreSection
            surtitre="Les repères de la saison"
            titre={`${nombreDeJeux(actifs.length)}. Des histoires à suivre.`}
            className="mb-6 sm:mb-8"
          />
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reperes.filter((r) => !r.jeu || actifs.includes(r.jeu)).map((r) => (
              <li key={r.titre}>
                <CarteLien {...r} />
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>

      {/* ---------- Nouvelles ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre="La vie de l'ELC" titre="Les nouvelles de la ligue." className="mb-6 sm:mb-8" />
          {etat === 'chargement' ? (
            <>
              <EnChargement texte="Chargement des actualités…" />
              <div className="grid gap-5 md:grid-cols-2">
                <CarteGabarit lignes={6} />
                <CarteGabarit lignes={6} />
              </div>
            </>
          ) : etat === 'erreur' ? (
            <CarteEtat
              icone={<CircleDashed className="h-6 w-6" />}
              titre="Le flux d'actualités est indisponible."
              erreur
              onReessayer={onReessayer}
              actions={premierRanking}
            >
              Nous n'avons pas pu charger les nouvelles de la ligue. Cela ne signifie pas qu'aucune actualité n'a été
              publiée. Réessayez ou poursuivez votre visite sur les autres pages.
            </CarteEtat>
          ) : saison.actualites.length === 0 ? (
            <CarteEtat icone={<Newspaper className="h-6 w-6" />} titre="Aucune nouvelle actualité publiée." actions={premierRanking}>
              Les prochaines nouvelles apparaîtront ici après publication. Les repères de la ligue restent disponibles ;
              aucune date de saison n'est encore validée.
            </CarteEtat>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {saison.actualites.map((a, i) => (
                <li key={a.id ?? i}>
                  <CarteActualite actu={a} grand />
                </li>
              ))}
            </ul>
          )}
        </Conteneur>
      </section>

      {/* ---------- Communauté ---------- */}
      <section className="pb-14 pt-4 sm:pb-20 sm:pt-6">
        <Conteneur>
          <BandePlanete className="border border-bord-fort">
            <div className="p-7 sm:p-9">
              <TitreSection surtitre="Bertoua · Est Cameroun" titre="Une communauté, avant les résultats.">
                {apropos.equipes.length > 0
                  ? `${apropos.equipes.join(', ')} sont citées dans la présentation de la ligue. Leur jeu et leurs statistiques de classement ne sont pas établis.`
                  : "Les équipes de la communauté seront présentées ici dès qu'elles pourront l'être."}
              </TitreSection>
              {apropos.equipes.length > 0 && (
                <ul className="mt-7 grid gap-4 sm:grid-cols-3">
                  {apropos.equipes.map((e) => (
                    <li key={e} className="border border-bord-fort bg-carte/90 px-5 py-4 font-bold italic text-white">
                      {e}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm text-doux">
                  Les résultats officiels seront publiés après validation, dans les rankings de chaque jeu.
                </p>
                <LienPage section="pantheon" onNaviguer={onNaviguer} bouton="contour" className="shrink-0">
                  Découvrir le Hall of Fame
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </LienPage>
              </div>
            </div>
          </BandePlanete>
        </Conteneur>
      </section>

      {/* ---------- Liens ---------- */}
      <section className="pb-14 sm:pb-20">
        <Conteneur>
          <LiensCourts>
            {jeux.slice(0, 2).map((j) => (
              <LienCourt
                key={j.id}
                section="classements"
                jeu={j.id}
                onNaviguer={onNaviguer}
                titre={`Ranking ${j.nom.replace(': Bang Bang', '')}`}
                action={`Suivre ${j.nom.replace(': Bang Bang', '')}`}
                icone={<ListOrdered className="h-6 w-6" />}
              />
            ))}
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

export default PageSaison;
