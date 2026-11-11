import { ImagePublique } from './ImagePublique';
import { urlImage } from '../lib/images';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { Crown, Swords, Flame, Shield, Newspaper, ListOrdered, CircleDashed } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { urlCss, urlSure } from '../lib/urls';
import { contenuDe } from '../data/contenu';
import { Conteneur, EnTetePage, TitreSection, Avis, LienPage } from './ui';
import { EtatDonnees, EnChargement, CarteGabarit, CarteEtat, LienCourt, LiensCourts } from './Etats';
import { OngletsSaison } from './OngletsSaison';
import { CarteFaitMarquant } from './CarteFaitMarquant';
import { AfficheDistinction } from './AfficheDistinction';
import { jeuxActifs } from './Blocs';

interface PageHallOfFameProps {
  data: ELCData;
  etat: EtatDonnees;
  onReessayer: () => void;
  onNaviguer: (section: Section, jeu?: string) => void;
}

// Les quatre distinctions officielles de l'ancien Panthéon, chacune avec sa
// couleur fixe. Textes, nominés, photos, héros et fonds restent modifiables
// dans l'admin (onglet Panthéon).
const DISTINCTIONS = [
  {
    key: 'goat',
    couleur: '#ffd700',
    title: 'G.O.A.T',
    subtitle: 'Greatest Of All Time',
    desc: 'Décerné au joueur le plus dominant de la saison, toutes disciplines confondues. Une seule attribution par saison.',
    Icone: Crown,
  },
  {
    key: 'godlike',
    couleur: '#3b82f6',
    title: 'GodLike',
    subtitle: 'Meilleur joueur MOBA',
    desc: 'Performance exceptionnelle dans les disciplines MOBA (Honor of Kings, Mobile Legends).',
    Icone: Swords,
  },
  {
    key: 'demonking',
    couleur: '#ef4444',
    title: 'Demon King',
    subtitle: 'Meilleur joueur Battle Royale',
    desc: 'Domination absolue dans les disciplines Battle Royale (PUBG Mobile, Free Fire).',
    Icone: Flame,
  },
  {
    key: 'mvp',
    couleur: '#14b8a6',
    title: 'MVP',
    subtitle: 'Most Valuable Player',
    desc: "Élu par les pairs et les organisateurs pour son impact en jeu et son fair-play exemplaire tout au long de la saison.",
    Icone: Shield,
  },
];

export const PageHallOfFame: React.FC<PageHallOfFameProps> = ({ data, etat, onReessayer, onNaviguer }) => {
 const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const { faitMarquant } = contenuDe(data);
  const pantheon = data.pantheon ?? { curated: [] };
  const curated = pantheon.curated ?? [];

  const definitions = [...DISTINCTIONS, ...(pantheon.distinctions ?? []).filter(d => !DISTINCTIONS.some(def => def.key === d.key)).map(d => ({ ...d, couleur: '#f4b544', Icone: Crown }))];
  const distinctions = definitions.filter(def => pantheon.distinctions?.find(d => d.key === def.key)?.visible !== false).map((def) => {
    const perso = pantheon.distinctions?.find((d) => d.key === def.key);
    const laureat = curated.find(
      (item) =>
        item.id === def.key ||
        item.titre?.toLowerCase().includes(def.key) ||
        (item as { distinction?: string }).distinction === def.key
    );
    return {
      ...def,
      couleur: perso?.couleur && /^#[0-9a-f]{6}$/i.test(perso.couleur) ? perso.couleur : def.couleur,
      icone: perso?.logoImage && urlImage(perso.logoImage) ? <ImagePublique src={imageSite(perso.logoImage)} alt={texteSite("")} className="h-6 w-6 object-contain" /> : <def.Icone className="h-6 w-6" />,
      title: perso?.title || def.title,
      subtitle: perso?.subtitle || def.subtitle,
      desc: perso?.desc || def.desc,
      nom: perso?.nomineNom || laureat?.nom,
      photo: perso?.nominePhoto || laureat?.image,
      heros: perso?.nomineHero,
      fond: perso?.fondImage,
      clan: perso?.nomineClan || laureat?.equipe,
      details: perso?.nomineDetails || laureat?.discipline || '',
      statut: perso?.nomineStatut || (laureat ? 'Lauréat homologué' : perso?.nomineNom ? 'Nominé officiel' : ''),
    };
  });

  const aucunLaureat = distinctions.every((d) => !d.nom);
  const saison = data.meta.saison || '2027';
  // GodLike récompense le MOBA, Demon King le Battle Royale : sans aucune
  // discipline active dans la famille, la distinction n'a pas lieu d'être.
  const jeux = jeuxActifs(data);
  const familles = new Set(jeux.map((j) => j.famille));
  const distinctionsVisibles = distinctions.filter(
    (d) => Boolean(d.nom?.trim()) && (d.key !== 'godlike' || familles.has('MOBA')) && (d.key !== 'demonking' || familles.has('Battle Royale'))
  );

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <p className="surtitre mb-4">{texteSite("Saison news · Les faits marquants")}</p>
          <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">
            {pantheon.titrePrincipal || 'Hall of Fame.'}
            <span className="block">{texteSite("La mémoire de l'Est.")}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">
            {pantheon.sousTitre ||
              'Les distinctions et les faits marquants de la ligue, avec une règle : séparer les informations connues du palmarès encore à confirmer.'}
          </p>
          <div className="mt-8 sm:mt-12">
            <OngletsSaison actif="halloffame" jeux={jeux.map((j) => j.id)} onNaviguer={onNaviguer} />
          </div>
        </Conteneur>
      </EnTetePage>

      {etat === 'pret' ? (
        <>
        {/* ---------- Le fait marquant ---------- */}
        {faitMarquant.publie && <section className="pb-10 sm:pb-16">
          <Conteneur>
            <TitreSection surtitre="Dans la présentation de la ligue" titre="Une performance à retenir." className="mb-6 sm:mb-8" />
            <CarteFaitMarquant fait={faitMarquant} />
          </Conteneur>
        </section>}

        {/* ---------- Les distinctions ---------- */}
        {distinctionsVisibles.length > 0 && <section className="py-10 sm:py-16">
          <Conteneur>
            <TitreSection
              surtitre={aucunLaureat ? 'Le prochain chapitre' : `Distinctions officielles · Saison ${saison}`}
              titre={aucunLaureat ? 'Le palmarès reste à écrire.' : 'Les distinctions de la saison.'}
              className="mb-6 sm:mb-8"
            >
              {aucunLaureat
                ? "Aucun palmarès officiel n'a été fourni. Ces espaces sont réservés aux distinctions de la saison, après confirmation des compétitions, des résultats et des accords de publication."
                : 'Chaque distinction récompense une saison entière, une fois les résultats validés.'}
            </TitreSection>
            {/* Deux colonnes, pas quatre : une affiche a besoin de largeur, sinon
                la photo du joueur et le héros deviennent des vignettes. */}
            <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
              {distinctionsVisibles.map((d) => (
                <li key={d.key}>
                  <AfficheDistinction d={d} saison={saison} />
                </li>
              ))}
            </ul>
          </Conteneur>
        </section>}

        </>
      ) : (
        <section className="pb-4">
          <Conteneur>
            {etat === 'chargement' ? (
              <>
                <EnChargement texte="Chargement des distinctions…" />
                <div className="grid gap-5 md:grid-cols-3">
                  <CarteGabarit rond />
                  <CarteGabarit rond />
                  <CarteGabarit rond />
                </div>
                <p className="mt-6 text-texte">{texteSite("Les distinctions sont en cours de chargement. Aucune identité ni performance n'est affichée pendant l'attente.")}</p>
              </>
            ) : (
              <CarteEtat
                icone={<CircleDashed className="h-6 w-6" />}
                titre="Les distinctions sont inaccessibles."
                erreur
                onReessayer={onReessayer}
                actions={
                  <LienPage section="saison" onNaviguer={onNaviguer} bouton="contour">{texteSite("Retour aux actualités")}</LienPage>
                }
              >{texteSite("Nous n'avons pas pu accéder aux données des distinctions. Ce problème de chargement ne permet pas de conclure à l'absence de palmarès. Réessayez ou retrouvez les actualités de la ligue.")}</CarteEtat>
            )}
          </Conteneur>
        </section>
      )}

      {/* ---------- Confiance ---------- */}
      <section className="py-10 sm:py-12">
        <Conteneur>
          <Avis titre="Un Hall of Fame fondé sur la confiance.">{texteSite("Vérifier le résultat, confirmer le contexte et la distinction, puis obtenir les accords nécessaires avant toute publication.")}{texteSite(' ')}
            {etat === 'pret' && !aucunLaureat
              ? "Aucun titre n'est attribué sans validation de la ligue."
              : "Aucun lauréat n'est annoncé ici."}
          </Avis>
        </Conteneur>
      </section>

      {/* ---------- Liens ---------- */}
      <section className="pb-14 sm:pb-20">
        <Conteneur>
          <LiensCourts>
            <LienCourt
              section="saison"
              onNaviguer={onNaviguer}
              titre="Saison news"
              action="Retour aux actualités"
              icone={<Newspaper className="h-6 w-6" />}
            />
            {jeux.slice(0, 2).map((j) => (
              <LienCourt
                key={j.id}
                section="joueurs"
                jeu={j.id}
                onNaviguer={onNaviguer}
                titre={`Joueurs · ${j.nom.replace(': Bang Bang', '')}`}
                action={`Découvrir les joueurs ${j.court}`}
                icone={<ListOrdered className="h-6 w-6" />}
              />
            ))}
          </LiensCourts>
        </Conteneur>
      </section>
    </>
  );
};

export default PageHallOfFame;
