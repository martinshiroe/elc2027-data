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
  nomineDetails?: string;
  nomineStatut?: string;
}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distinctions.map(d => {
              const laureat = getLaureat(d.key);
              const nomineeName = d.nomineNom || laureat?.nom;
              const nomineePhoto = d.nominePhoto || laureat?.image;
              const nomineeDetails = d.nomineDetails || laureat?.discipline || laureat?.titre || 'Candidat officiel';
              const nomineeStatut = d.nomineStatut || (laureat ? 'Lauréat Homologué' : 'Nominé Officiel');
              const hasNominee = !!(nomineeName || nomineePhoto);

              return (
                <div
                  key={d.key}
                  id={`distinction-${d.key}`}
                  className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  style={{
                    background: `linear-gradient(180deg, ${d.gradient} 0%, rgba(17,17,17,0.95) 100%)`,
                    border: `1px solid ${d.border}55`,
                    boxShadow: `0 8px 30px ${d.glow}`,
                  }}
                >
                  {/* Top glowing flare */}
                  <div
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none"
                    style={{ background: d.border }}
                  />

                  <div>
                    {/* Header with icon and badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="p-2.5 rounded-xl border"
                        style={{
                          background: `${d.border}15`,
                          borderColor: `${d.border}40`,
                        }}
                      >
                        {d.icon}
                      </div>

                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                        style={{
                          color: d.text,
                          borderColor: `${d.border}40`,
                          backgroundColor: `${d.border}10`,
                        }}
                      >
                        ELC 2027
                      </span>
                    </div>

                    <h2
                      className="font-audiowide text-2xl font-bold tracking-tight mb-1"
                      style={{ color: d.text }}
                    >
                      {d.title}
                    </h2>
                    <p className="text-xs font-semibold text-white/75 mb-4">
                      {d.subtitle}
                    </p>

                    <p className="text-xs text-white/55 leading-relaxed mb-6 font-light">
                      {d.desc}
                    </p>
                  </div>

                  {/* Dedicated Nominee Photo & Profile Showcase Frame */}
                  <div className="pt-4 border-t border-white/[0.08]">
                    {hasNominee ? (
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm flex items-center gap-3">
                        {/* Photo, en portrait sur toute la hauteur du cadre —
                            le format vertical met le visage en valeur bien
                            mieux que l'ancienne vignette carrée de 48 px. */}
                        <div className="relative shrink-0">
                          {nomineePhoto ? (
                            <img
                              src={nomineePhoto}
                              alt={nomineeName || 'Nominé'}
                              referrerPolicy="no-referrer"
                              className="w-24 h-32 rounded-xl object-cover object-top border-2 shadow-lg"
                              style={{ borderColor: d.border }}
                            />
                          ) : (
                            <div
                              className="w-24 h-32 rounded-xl flex items-center justify-center border-2 font-audiowide font-bold text-4xl"
                              style={{ borderColor: d.border, background: `${d.border}20`, color: d.text }}
                            >
                              {(nomineeName || 'N').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div
                            className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-black border"
                            style={{ borderColor: d.border }}
                          >
                            <Medal className="w-3.5 h-3.5" style={{ color: d.text }} />
                          </div>
                        </div>

                        {/* Nom et détails, en face de la photo */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5">
                            <span
                              className="inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border"
                              style={{
                                color: d.text,
                                borderColor: `${d.border}40`,
                                backgroundColor: `${d.border}15`
                              }}
                            >
                              {nomineeStatut}
                            </span>
                          </div>
                          {/* Pas de troncature : la place gagnée en hauteur
                              permet aux noms longs de passer à la ligne. */}
                          <div className="text-sm font-bold text-white leading-tight break-words">
                            {nomineeName}
                          </div>
                          <div className="text-[11px] text-white/50 font-light leading-snug mt-0.5 break-words">
                            {nomineeDetails}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Placeholder Frame for Nominee Photo */
                      <div className="p-3 rounded-xl bg-black/25 border border-dashed border-white/15 flex items-center gap-3">
                        {/* Même gabarit que le cadre rempli, pour que la grille
                            ne saute pas quand un nominé est renseigné. */}
                        <div
                          className="w-24 h-32 rounded-xl border border-dashed flex flex-col items-center justify-center shrink-0 text-white/30"
                          style={{ borderColor: `${d.border}50` }}
                        >
                          <Camera className="w-7 h-7 text-white/40" />
                          <span className="text-[8px] font-mono uppercase text-white/40 mt-1.5">Photo</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs text-white/50 font-mono mb-1">
                            <span className="font-semibold text-white/70 text-[11px]">Espace Nominé</span>
                            <span className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                          </div>
                          <p className="text-[10px] text-white/40 leading-snug">
                            Photo &amp; candidat en cours d'attribution officielle
                          </p>
                        </div>
                      </div>
                    )}
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
