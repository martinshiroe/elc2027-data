import React from 'react';
import { ELCReseaux } from '../types';
import { urlSure } from '../lib/urls';
import {
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  InstagramIcon,
  DiscordIcon,
  XIcon,
} from './SocialIcons';

// Ordre et libellés des réseaux. Seuls ceux renseignés dans l'admin
// s'affichent : un lien vide ne mène nulle part.
const RESEAUX: {
  cle: keyof ELCReseaux;
  nom: string;
  Icone: React.FC<{ className?: string }>;
  couleur: string;
}[] = [
  { cle: 'instagram', nom: 'Instagram', Icone: InstagramIcon, couleur: 'text-white/85 hover:text-[#E4405F]' },
  { cle: 'youtube', nom: 'YouTube', Icone: YoutubeIcon, couleur: 'text-[#FF0000] hover:text-[#ff4d4d]' },
  { cle: 'facebook', nom: 'Facebook', Icone: FacebookIcon, couleur: 'text-white/85 hover:text-[#4d8ef7]' },
  { cle: 'tiktok', nom: 'TikTok', Icone: TikTokIcon, couleur: 'text-white/85 hover:text-[#25F4EE]' },
  { cle: 'whatsapp', nom: 'WhatsApp', Icone: WhatsAppIcon, couleur: 'text-white/85 hover:text-[#25D366]' },
  { cle: 'discord', nom: 'Discord', Icone: DiscordIcon, couleur: 'text-white/85 hover:text-[#5865F2]' },
  { cle: 'twitter', nom: 'X', Icone: XIcon, couleur: 'text-white/85 hover:text-white' },
];

export function reseauxRenseignes(reseaux?: Partial<ELCReseaux>) {
  return RESEAUX.filter((r) => Boolean(reseaux?.[r.cle]));
}

export const ReseauxSociaux: React.FC<{
  reseaux?: Partial<ELCReseaux>;
  vertical?: boolean;
  className?: string;
}> = ({ reseaux, vertical = false, className = '' }) => {
  const liste = reseauxRenseignes(reseaux);
  if (liste.length === 0) return null;
  return (
    <ul className={`flex ${vertical ? 'flex-col gap-6' : 'flex-wrap gap-5'} ${className}`}>
      {liste.map(({ cle, nom, Icone, couleur }) => (
        <li key={cle}>
          <a
            href={urlSure(reseaux?.[cle] ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${nom} de la ligue (nouvel onglet)`}
            className={`flex h-8 w-8 items-center justify-center transition-colors ${couleur}`}
          >
            <Icone className="h-6 w-6" />
          </a>
        </li>
      ))}
    </ul>
  );
};
