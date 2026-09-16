import React, { useState } from 'react';

export type GameKey = 'hok' | 'mlbb' | 'pubgm' | 'ff';

export const GAME_LOGOS: Record<GameKey, {
  name: string;
  shortName: string;
  category: 'MOBA' | 'TPS';
  localSvg: string;
  primaryColor: string;
  accentColor: string;
  borderActive: string;
  bgActive: string;
}> = {
  hok: {
    name: 'Honor of Kings',
    shortName: 'HOK',
    category: 'MOBA',
    localSvg: '/img/logo-hok.svg',
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    borderActive: 'border-amber-500/80 shadow-amber-950/60 ring-2 ring-amber-500/30',
    bgActive: 'bg-amber-500/20'
  },
  mlbb: {
    name: 'Mobile Legends: Bang Bang',
    shortName: 'MLBB',
    category: 'MOBA',
    localSvg: '/img/logo-mlbb.svg',
    primaryColor: '#3b82f6',
    accentColor: '#2563eb',
    borderActive: 'border-blue-500/80 shadow-blue-950/60 ring-2 ring-blue-500/30',
    bgActive: 'bg-blue-500/20'
  },
  pubgm: {
    name: 'PUBG Mobile',
    shortName: 'PUBGM',
    category: 'TPS',
    localSvg: '/img/logo-pubgm.svg',
    primaryColor: '#10b981',
    accentColor: '#059669',
    borderActive: 'border-emerald-500/80 shadow-emerald-950/60 ring-2 ring-emerald-500/30',
    bgActive: 'bg-emerald-500/20'
  },
  ff: {
    name: 'Free Fire',
    shortName: 'FF',
    category: 'TPS',
    localSvg: '/img/logo-ff.svg',
    primaryColor: '#f97316',
    accentColor: '#ea580c',
    borderActive: 'border-orange-500/80 shadow-orange-950/60 ring-2 ring-orange-500/30',
    bgActive: 'bg-orange-500/20'
  }
};

export const GameBadgeLogo: React.FC<{
  game: GameKey;
  active?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  customLogo?: string;
}> = ({ game, active = false, className = '', size = 'md', customLogo }) => {
  const info = GAME_LOGOS[game];
  const logoSrc = customLogo || info.localSvg;

  const heights = {
    sm: 'h-6 sm:h-7 max-w-[120px]',
    md: 'h-8 sm:h-9 max-w-[150px]',
    lg: 'h-11 sm:h-12 max-w-[200px]'
  };

  return (
    <div className={`inline-flex items-center justify-center relative select-none ${className}`}>
      <img
        src={logoSrc}
        alt={info.name}
        title={`${info.name} (${info.category})`}
        className={`${heights[size]} w-auto object-contain transition-all duration-200 ${
          active 
            ? 'brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
            : 'opacity-90 hover:opacity-100'
        }`}
        loading="eager"
      />
    </div>
  );
};

