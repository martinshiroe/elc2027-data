import React from 'react';
import { Crown, Swords, Flame, Shield, Trophy, User, Sparkles, Camera, Medal } from 'lucide-react';
import { ELCData, ELCPantheonItem } from '../types';

interface PagePantheonProps {
  data: ELCData;
}

interface DistinctionCard {
  key: string;
  title: string;
  subtitle: string;
  desc: string;
  border: string;
  text: string;
  glow: string;
  gradient: string;
  icon: React.ReactNode;
  nomineNom?: string;
  nominePhoto?: string;
  nomineHero?: string;
  nomineClan?: string;
  nomineDetails?: string;
  nomineStatut?: string;
}

// Couleur de texte lisible sur un aplat donné. Le bandeau du nom prend la
// couleur de la distinction : blanc sur le bleu ou le rouge, mais il faut
// passer au noir sur l'or du G.O.A.T, sinon le nom disparaît.
const readableOn = (hex: string): string => {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '#ffffff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111111' : '#ffffff';
};

export const PagePantheon: React.FC<PagePantheonProps> = ({ data }) => {
  const curated = data.pantheon?.curated || [];
  const pantheonData = data.pantheon || {};

  const getLaureat = (distinctionKey: string) => {
    return (
      curated.find(
        item =>
          item.id === distinctionKey ||
          item.titre?.toLowerCase().includes(distinctionKey.toLowerCase()) ||
          (item as any).distinction === distinctionKey
      ) || null
    );
  };

  const defaultDistinctions: DistinctionCard[] = [
    {
      key: 'goat',
      title: 'G.O.A.T',
      subtitle: 'Greatest Of All Time',
      desc: 'Décerné au joueur le plus dominant de la saison, toutes disciplines confondues. Une seule attribution par saison.',
      border: '#ffd700',
      text: '#ffd700',
      glow: 'rgba(255, 215, 0, 0.15)',
      gradient: 'rgba(255, 215, 0, 0.06)',
      icon: <Crown className="w-6 h-6 text-[#ffd700]" />,
    },
    {
      key: 'godlike',
      title: 'GodLike',
      subtitle: 'Meilleur joueur MOBA',
      desc: 'Performance exceptionnelle dans les disciplines MOBA (Honor of Kings, Mobile Legends). Élu sur les stats de la saison entière.',
      border: '#3b82f6',
      text: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.15)',
      gradient: 'rgba(59, 130, 246, 0.06)',
      icon: <Swords className="w-6 h-6 text-[#3b82f6]" />,
    },
    {
      key: 'demonking',
      title: 'Demon King',
      subtitle: 'Meilleur joueur TPS',
      desc: 'Domination absolue dans les disciplines Battle Royale (PUBG Mobile, Free Fire). Calculé sur le cumul des points saison.',
      border: '#ef4444',
      text: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.15)',
      gradient: 'rgba(239, 68, 68, 0.06)',
      icon: <Flame className="w-6 h-6 text-[#ef4444]" />,
    },
    {
      key: 'mvp',
      title: 'MVP',
      subtitle: 'Most Valuable Player',
      desc: 'Élu par les pairs et les organisateurs pour son impact en jeu et son fair-play exemplaire tout au long de la saison.',
      border: '#14b8a6',
      text: '#14b8a6',
      glow: 'rgba(20, 184, 166, 0.15)',
      gradient: 'rgba(20, 184, 166, 0.06)',
      icon: <Shield className="w-6 h-6 text-[#14b8a6]" />,
    },
  ];

  // Merge custom titles, texts, and nominee photo/info configured in Admin
  const distinctions = defaultDistinctions.map(def => {
    const custom = pantheonData.distinctions?.find(d => d.key === def.key);
    if (!custom) return def;
    return {
      ...def,
      title: custom.title || def.title,
      subtitle: custom.subtitle || def.subtitle,
      desc: custom.desc || def.desc,
      nomineNom: custom.nomineNom,
      nominePhoto: custom.nominePhoto,
      nomineHero: custom.nomineHero,
      nomineClan: custom.nomineClan,
      nomineDetails: custom.nomineDetails,
      nomineStatut: custom.nomineStatut,
    };
  });

  const defaultAttributionSteps = [
    {
      step: '01',
      title: 'Fin de saison',
      desc: "Les distinctions sont décernées à l'issue de la dernière journée de compétition, une fois tous les résultats validés.",
    },
    {
      step: '02',
      title: 'Calcul des stats',
      desc: 'G.O.A.T, GodLike et Demon King sont calculés automatiquement à partir du cumul des points saison par discipline.',
    },
    {
      step: '03',
      title: 'Vote MVP',
      desc: 'Le MVP est élu par les joueurs participants et les organisateurs via un formulaire de vote interne.',
    },
    {
      step: '04',
      title: 'Annonce officielle',
      desc: 'Les lauréats sont annoncés sur les réseaux sociaux de l\'ELC et leur profil est mis en avant sur cette page.',
    },
  ];

  const attributionSteps = (pantheonData.attributionSteps && pantheonData.attributionSteps.length > 0)
    ? pantheonData.attributionSteps
    : defaultAttributionSteps;

  const pageTitle = pantheonData.titrePrincipal || 'Panthéon';
  const pageSubtitle = pantheonData.sousTitre || "Les distinctions qui gravent le nom d'un joueur dans l'histoire de l'ELC. Chaque cadre a une couleur fixe, reconnaissable au premier coup d'œil.";
  const attributionTitle = pantheonData.titreAttribution || 'Comment sont-elles attribuées ?';

  return (
    <div id="page-pantheon" className="bg-[#0e0e0e] min-h-screen text-white">
      {/* Header section matching Vercel version */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] text-teal-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Distinctions officielles · Saison 2027
            </div>
            <h1 className="font-audiowide text-4xl sm:text-6xl font-normal text-white mb-5 tracking-wide">
              {pageTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed font-light">
              {pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Iconic Distinction Frames */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Deux colonnes, pas quatre : une affiche a besoin de largeur.
              À quatre de front, la photo du joueur et le héros seraient
              réduits à des vignettes — exactement ce qu'on cherche à éviter. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {distinctions.map(d => {
              const laureat = getLaureat(d.key);
              const nomineeName = d.nomineNom || laureat?.nom;
              const nomineePhoto = d.nominePhoto || laureat?.image;
              const nomineeHero = d.nomineHero;
              const nomineeClan = d.nomineClan || laureat?.equipe;
              const nomineeDetails = d.nomineDetails || laureat?.discipline || laureat?.titre || '';
              const nomineeStatut = d.nomineStatut || (laureat ? 'Lauréat Homologué' : 'Nominé Officiel');
              const hasNominee = !!(nomineeName || nomineePhoto);
              const onAccent = readableOn(d.border);

              return (
                <div
                  key={d.key}
                  id={`distinction-${d.key}`}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border: `1px solid ${d.border}55`,
                    boxShadow: `0 8px 30px ${d.glow}`,
                  }}
                >
                  {/* ---------- L'affiche ---------- */}
                  <div className="relative aspect-square bg-[#0d0d0d] overflow-hidden">
                    {/* Fond : texture sombre + halo de la couleur du cadre */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(120% 90% at 70% 10%, ${d.border}22 0%, transparent 55%), linear-gradient(160deg, #141414 0%, #0a0a0a 100%)`,
                      }}
                    />
                    {/* Trame de points, comme sur les affiches de match */}
                    <div
                      className="absolute top-[8%] right-[8%] w-[22%] h-[14%] opacity-40"
                      style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
                        backgroundSize: '9px 9px',
                      }}
                    />

                    {/* Bloc de couleur en pointe, derrière le joueur */}
                    <div
                      className="absolute left-[13%] top-[9%] w-[54%] h-[78%]"
                      style={{
                        background: `linear-gradient(165deg, ${d.border} 0%, ${d.border}aa 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 100% 64%, 50% 100%, 0 64%)',
                      }}
                    />

                    {/* Héros / personnage du jeu, en retrait à droite */}
                    {nomineeHero && (
                      <img
                        src={nomineeHero}
                        alt=""
                        aria-hidden="true"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="absolute right-0 top-[6%] w-[40%] h-[56%] object-cover object-top opacity-85"
                        style={{
                          // Fondu sur les bords : l'image se dissout dans
                          // l'affiche au lieu de poser un rectangle net, que
                          // l'illustration soit détourée ou non.
                          maskImage:
                            'linear-gradient(to left, black 55%, transparent 100%), linear-gradient(to top, transparent 0%, black 35%)',
                          maskComposite: 'intersect',
                          WebkitMaskImage:
                            'linear-gradient(to left, black 55%, transparent 100%), linear-gradient(to top, transparent 0%, black 35%)',
                          WebkitMaskComposite: 'source-in',
                        }}
                      />
                    )}

                    {/* Photo du joueur, au premier plan */}
                    {nomineePhoto ? (
                      <img
                        src={nomineePhoto}
                        alt={nomineeName || 'Nominé'}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        // Cadre portrait fixe et recadrage sur le haut : une
                        // photo carrée ou paysage donne quand même un portrait
                        // correct, centré sur le visage.
                        className="absolute left-[40%] -translate-x-1/2 bottom-[15%] w-[42%] h-[64%] object-cover object-top"
                        style={{
                          maskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
                          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
                          filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.75))',
                        }}
                      />
                    ) : (
                      <div className="absolute left-[40%] -translate-x-1/2 bottom-[15%] w-[42%] h-[64%] flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/30 bg-black/25 text-white/70">
                        <Camera className="w-10 h-10" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-center px-2">
                          Photo du joueur
                        </span>
                      </div>
                    )}

                    {/* Intitulé de la distinction, à la verticale sur le flanc */}
                    <div
                      className="absolute left-[4%] bottom-[10%] top-[14%] flex items-end"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      <span className="font-audiowide text-white text-2xl sm:text-4xl lg:text-5xl leading-none uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                        {d.title}
                      </span>
                    </div>

                    {/* Sous-titre à l'horizontale, en haut à gauche. À la
                        verticale il entrait en collision avec le titre et se
                        faisait couper au milieu d'un mot. */}
                    <div className="absolute top-[5%] left-[4%] right-[38%]">
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/60 block truncate">
                        {d.subtitle}
                      </span>
                    </div>

                    {/* Repère de saison, en haut à droite */}
                    <div className="absolute top-[6%] right-[6%] flex items-center gap-2">
                      <span
                        className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                        style={{ color: d.text }}
                      >
                        ELC {data.meta.saison}
                      </span>
                      <span className="opacity-90">{d.icon}</span>
                    </div>

                    {/* Bandeau du nom */}
                    <div className="absolute left-[30%] right-0 bottom-[16%]">
                      <div
                        className="px-4 sm:px-6 py-2.5 sm:py-3.5"
                        style={{
                          background: `linear-gradient(90deg, ${d.border} 0%, ${d.border}cc 100%)`,
                        }}
                      >
                        <span
                          className="font-audiowide text-lg sm:text-2xl lg:text-3xl uppercase leading-none block truncate"
                          style={{ color: onAccent }}
                        >
                          {nomineeName || 'À attribuer'}
                        </span>
                      </div>
                      {/* Clan, puis statistiques ou discipline */}
                      <div className="px-4 sm:px-6 pt-2 sm:pt-3">
                        {nomineeClan && (
                          <div className="font-audiowide text-lg sm:text-2xl text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                            {nomineeClan}
                          </div>
                        )}
                        {nomineeDetails && (
                          <div className="font-mono text-[10px] sm:text-xs text-white/70 mt-1 truncate">
                            {nomineeDetails}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pied d'affiche */}
                    <div className="absolute bottom-[4%] left-0 right-0 text-center">
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/45">
                        {hasNominee ? nomineeStatut : 'Nomination à venir'}
                      </span>
                    </div>
                  </div>

                  {/* ---------- Ce que récompense la distinction ---------- */}
                  <div className="p-5 bg-[#111111] border-t border-white/[0.07]">
                    <p className="text-xs text-white/55 leading-relaxed font-light">
                      {d.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* "Comment sont-elles attribuées ?" Section */}
      <section className="py-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            {data.meta.pantheonBannerImage && (
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url("${data.meta.pantheonBannerImage}")` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/88 to-black/78" />
              </div>
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Trophy className="w-5 h-5 text-teal-400" />
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  {attributionTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {attributionSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="font-mono text-xs font-bold text-teal-400 shrink-0 mt-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PagePantheon;
