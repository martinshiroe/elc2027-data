import React from 'react';
import { ELCData } from '../types';
import { urlCss } from '../lib/urls';
import { Section } from '../lib/routes';

interface HeroProps {
  data: ELCData;
  onSelectSection: (sec: Section) => void;
  onOpenRegulations?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onSelectSection }) => {
  const { meta } = data;

  const handleRegister = () => {
    if (meta.googleFormUrl) {
      window.open(meta.googleFormUrl, '_blank');
    } else {
      // Sans formulaire configuré, on envoie vers la page Inscription, qui
      // explique la démarche et donne les contacts — et non vers la liste des
      // joueurs, qui ne répond pas à l'intention de s'inscrire.
      onSelectSection('inscription');
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#0e0e0e] pt-[120px] pb-20 text-center"
    >
      {/* Background with overlay */}
      {meta.heroImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url("${urlCss(meta.heroImage)}")` }}
        >
          {/* Le voile montait à 45 % en haut : au-dessus des écrans et de la
              foule d'une photo d'arène, le sous-titre en blanc/70 passait
              sous le seuil lisible. Il finit désormais à 100 %, ce qui règle
              du même coup l'arête franche visible en bas du hero sur mobile,
              là où la photo s'arrêtait net. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(14,14,14,0.70) 0%, rgba(14,14,14,0.88) 55%, rgba(14,14,14,1) 88%, rgba(14,14,14,1) 100%)',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0e0e0e]/80 to-[#0e0e0e]" />
      )}

      {/* Top glowing radial flare */}
      <div
        className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(20,184,166,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-7 relative">
        {/* Pulsing Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#14b8a6]/[0.12] border border-[#14b8a6]/30 rounded-full px-3.5 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] shrink-0 animate-pulse" />
          <span
            className="text-[11px] text-[#14b8a6] tracking-[1.2px] uppercase font-mono"
          >
            East League of Cameroon · Saison 2027
          </span>
        </div>

        {/* Display Heading */}
        <h1
          className="font-audiowide text-[clamp(28px,4.6vw,58px)] leading-[1.35] text-white tracking-[0.005em] mx-auto mb-6 max-w-[980px]"
          style={{ textWrap: 'balance' }}
        >
          Affronte les meilleurs — sans compromis
        </h1>

        {/* Subtitle */}
        <p
          className="text-[18px] text-white/75 leading-[1.9] max-w-[640px] mx-auto mb-10"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Honor of Kings, Mobile Legends, PUBG Mobile, Free Fire — quatre disciplines, des dizaines d'équipes, une saison qui décide tout.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleRegister}
            className="bg-[#14b8a6] hover:opacity-85 text-[#0e0e0e] px-7 py-3.5 rounded-md text-[15px] font-medium transition-opacity cursor-pointer border-0"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            S'inscrire gratuitement
          </button>
          <button
            onClick={() => onSelectSection('competition')}
            className="bg-white/[0.06] hover:bg-white/[0.1] text-white px-7 py-3.5 rounded-md text-[15px] font-medium border border-white/[0.14] transition-colors cursor-pointer"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Découvrir le format
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
