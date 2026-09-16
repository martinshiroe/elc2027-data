import React from 'react';
import { ELCData } from '../types';

interface CtaBannerProps {
  data: ELCData;
  onOpenRegister?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ data, onOpenRegister }) => {
  const ctaImage = data.meta.ctaImage;
  const registerUrl = data.meta.googleFormUrl;

  const handleRegister = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else if (registerUrl) {
      window.open(registerUrl, '_blank');
    } else {
      alert("Les inscriptions ne sont pas encore ouvertes. Revenez bientôt !");
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0e0e0e',
        padding: '120px 28px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}
    >
      {ctaImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${ctaImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(14,14,14,0.88) 0%, rgba(14,14,14,0.94) 50%, rgba(14,14,14,0.98) 100%)',
            }}
          />
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 20,
            padding: '5px 14px',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 11,
              color: '#22c55e',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Inscriptions bientôt disponibles · Saison 2027
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(34px, 5vw, 64px)',
            letterSpacing: '-2px',
            color: '#fff',
            margin: '0 0 20px',
            lineHeight: 1.15,
          }}
        >
          Rejoins l'ELC 2027
          <br />
          gratuitement
        </h2>

        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 17,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.75,
            margin: '0 auto 40px',
            maxWidth: 500,
          }}
        >
          Crée ton profil, choisis ta discipline et affronte les meilleurs joueurs de la scène camerounaise.
        </p>

        <button
          onClick={handleRegister}
          style={{
            background: '#22c55e',
            color: '#06210f',
            padding: '14px 32px',
            borderRadius: 6,
            fontFamily: "'Manrope', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          S'inscrire — c'est gratuit
        </button>
      </div>
    </section>
  );
};

export default CtaBanner;
