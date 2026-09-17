import React from 'react';
import { ELCData } from '../types';
import { urlSure } from '../lib/urls';
import {
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
  WhatsAppIcon,
  InstagramIcon,
  DiscordIcon,
  XIcon
} from './SocialIcons';

interface FooterProps {
  data: ELCData;
  onOpenRegulations: () => void;
  onOpenDataModal?: () => void;
  onOpenAdmin?: () => void;
  onSelectSection?: (sec: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  data,
  onOpenRegulations,
  onSelectSection,
}) => {
  const { meta } = data;
  const reseaux = meta.reseaux || {};
  const contact = meta.contact || {};

  const handleNav = (sec: string) => {
    if (onSelectSection) {
      onSelectSection(sec);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="elc-footer"
      className="bg-[#0a0a0a] border-t border-white/[0.06] pt-[72px] px-7 pb-10"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr] gap-12 mb-14">
          {/* Col 1: Identity with circular league logo */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <img
                src="/img/logo-league.png"
                alt="ELC"
                className="w-[26px] h-[26px] rounded-full object-cover bg-white shrink-0"
              />
              <span
                className="text-[14px] text-white font-medium"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                ELC <span className="text-[#14b8a6]">{meta.saison || '2027'}</span>
              </span>
            </div>
            <p
              className="text-[12.5px] text-white/40 leading-[1.7] mb-[22px]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Ligue Esport Est Cameroun — la compétition esport qui fait vibrer le Cameroun.
            </p>
            {/* Social icons */}
            <div className="flex gap-[7px] flex-wrap">
              {reseaux.facebook && (
                <a
                  href={urlSure(reseaux.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Officiel"
                  aria-label="Facebook Officiel ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-[#1877F2] hover:border-[#1877F2]/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {reseaux.youtube && (
                <a
                  href={urlSure(reseaux.youtube)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube Officiel"
                  aria-label="Chaîne YouTube Officielle ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-[#FF0000] hover:border-[#FF0000]/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {reseaux.tiktok && (
                <a
                  href={urlSure(reseaux.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok Officiel"
                  aria-label="Compte TikTok Officiel ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-white hover:border-cyan-400/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {reseaux.whatsapp && (
                <a
                  href={urlSure(reseaux.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Officiel"
                  aria-label="Groupe WhatsApp Officiel ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-[#25D366] hover:border-[#25D366]/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              )}
              {reseaux.instagram && (
                <a
                  href={urlSure(reseaux.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram Officiel"
                  aria-label="Compte Instagram Officiel ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-[#E4405F] hover:border-[#E4405F]/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {reseaux.discord && (
                <a
                  href={urlSure(reseaux.discord)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Discord Officiel"
                  aria-label="Serveur Discord Officiel ELC"
                  className="w-[33px] h-[33px] rounded-lg bg-[#161616] border border-white/[0.08] text-white/40 hover:text-[#5865F2] hover:border-[#5865F2]/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <DiscordIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Compétition */}
          <div>
            <div
              className="text-[12px] text-white font-medium mb-3.5"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Compétition
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNav('competition')}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Calendrier
              </button>
              <button
                onClick={() => handleNav('classements')}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Classements
              </button>
              <button
                onClick={() => handleNav('joueurs')}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Joueurs
              </button>
              <button
                onClick={() => handleNav('pantheon')}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Panthéon
              </button>
              <button
                onClick={() => handleNav('videos')}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Vidéos & Médias
              </button>
            </div>
          </div>

          {/* Col 3: Disciplines */}
          <div>
            <div
              className="text-[12px] text-white font-medium mb-3.5"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Disciplines
            </div>
            <div className="flex flex-col gap-2">
              {['Honor of Kings', 'Mobile Legends', 'PUBG Mobile', 'Free Fire'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleNav('competition')}
                  className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <div
              className="text-[12px] text-white font-medium mb-3.5"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Contact
            </div>
            <div className="flex flex-col gap-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[13px] text-white/40 hover:text-white/85 transition-colors"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {contact.email}
                </a>
              )}
              {contact.telephone && (
                <a
                  href={`tel:${contact.telephone.replace(/\s/g, '')}`}
                  className="text-[13px] text-white/40 hover:text-white/85 transition-colors"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {contact.telephone}
                </a>
              )}
              <button
                onClick={onOpenRegulations}
                className="text-left text-[13px] text-white/40 hover:text-white/85 transition-colors cursor-pointer bg-transparent border-0 p-0"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Mentions légales
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-[22px] flex justify-between items-center flex-wrap gap-2.5">
          <span
            className="text-[12px] text-white/[0.28]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            © 2027 Ligue Esport Est Cameroun · Tous droits réservés
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
