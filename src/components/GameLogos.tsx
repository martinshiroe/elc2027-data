import React, { useState } from 'react';

export type GameKey = 'hok' | 'mlbb' | 'pubgm' | 'ff';

export const GAME_LOGOS: Record<GameKey, {
  name: string;
  shortName: string;
  logoUrls: string[];
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
}> = {
  hok: {
    name: 'Honor of Kings',
    shortName: 'HOK',
    logoUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Honor_of_Kings_Wordmark_Logo.png',
      'https://upload.wikimedia.org/wikipedia/en/3/30/Honor_of_Kings_logo.png',
      'https://images.seeklogo.com/logo-png/52/1/honor-of-kings-logo-png_seeklogo-526435.png'
    ],
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/50'
  },
  mlbb: {
    name: 'Mobile Legends: Bang Bang',
    shortName: 'MLBB',
    logoUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mobile_Legends_Bang_Bang_logo.svg/640px-Mobile_Legends_Bang_Bang_logo.svg.png',
      'https://upload.wikimedia.org/wikipedia/en/6/65/Mobile_Legends_Bang_Bang_logo_2020.svg',
      'https://images.seeklogo.com/logo-png/43/1/mobile-legends-bang-bang-logo-png_seeklogo-434057.png'
    ],
    primaryColor: '#3b82f6',
    accentColor: '#2563eb',
    badgeBg: 'bg-blue-500/15',
    badgeBorder: 'border-blue-500/50'
  },
  pubgm: {
    name: 'PUBG Mobile',
    shortName: 'PUBGM',
    logoUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/PUBG_Mobile_simple_logo_black.svg/640px-PUBG_Mobile_simple_logo_black.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/PUBG_Mobile_simple_logo_black.svg',
      'https://images.seeklogo.com/logo-png/33/1/pubg-mobile-logo-png_seeklogo-334351.png'
    ],
    primaryColor: '#10b981',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/50'
  },
  ff: {
    name: 'Free Fire',
    shortName: 'FF',
    logoUrls: [
      'https://upload.wikimedia.org/wikipedia/en/9/90/Logo_of_Garena_Free_Fire.png',
      'https://images.seeklogo.com/logo-png/36/1/garena-free-fire-logo-png_seeklogo-360566.png'
    ],
    primaryColor: '#f97316',
    accentColor: '#ea580c',
    badgeBg: 'bg-orange-500/15',
    badgeBorder: 'border-orange-500/50'
  }
};

export const GameBadgeLogo: React.FC<{
  game: GameKey;
  active?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ game, active = false, className = '', size = 'md' }) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);
  const info = GAME_LOGOS[game];

  const heights = {
    sm: 'h-6 max-w-[110px]',
    md: 'h-8 max-w-[140px] sm:h-9 sm:max-w-[160px]',
    lg: 'h-11 max-w-[180px] sm:h-13 sm:max-w-[200px]'
  };

  const handleError = () => {
    if (urlIndex + 1 < info.logoUrls.length) {
      setUrlIndex(urlIndex + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed) {
    // High-fidelity custom SVG branded logo representation
    return (
      <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
        {game === 'hok' && (
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 fill-current shrink-0" aria-hidden="true">
              <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
            </svg>
            <span className="font-serif tracking-widest font-black text-xs sm:text-sm bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow">
              HONOR OF KINGS
            </span>
          </div>
        )}
        {game === 'mlbb' && (
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400 fill-current shrink-0" aria-hidden="true">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.5L19.5 8.7V15.3L12 19.5L4.5 15.3V8.7L12 4.5Z" />
            </svg>
            <span className="font-audiowide font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow">
              MOBILE LEGENDS
            </span>
          </div>
        )}
        {game === 'pubgm' && (
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] tracking-tighter">
              PUBG
            </span>
            <span className="font-mono font-black text-xs sm:text-sm tracking-wider text-white">
              MOBILE
            </span>
          </div>
        )}
        {game === 'ff' && (
          <div className="flex items-center gap-1.5">
            <span className="font-black italic text-xs sm:text-sm tracking-widest bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 bg-clip-text text-transparent drop-shadow">
              FREE FIRE
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center relative ${className}`}>
      <img
        src={info.logoUrls[urlIndex]}
        alt={info.name}
        title={info.name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={handleError}
        className={`${heights[size]} w-auto object-contain transition-all duration-200 filter ${
          active ? 'brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]' : 'opacity-85 hover:opacity-100'
        }`}
        loading="lazy"
      />
    </div>
  );
};
