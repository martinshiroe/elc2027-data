import React from 'react';
import { Play, ChevronRight, Film } from 'lucide-react';
import { ELCData, ELCVideo } from '../types';
import { YoutubeIcon, TikTokIcon } from './SocialIcons';

interface HomeVideosTeaserProps {
  data: ELCData;
  onNavigateToVideos: () => void;
  onPlayVideo?: (video: ELCVideo) => void;
}

export const HomeVideosTeaser: React.FC<HomeVideosTeaserProps> = ({
  data,
  onNavigateToVideos,
}) => {
  const videos = data.videos || [];
  const displayVideos = videos.slice(0, 3);

  if (displayVideos.length === 0) return null;

  return (
    <section className="bg-[#0b0b0b] py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25 mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Médias & Contenus</span>
            </div>
            <h2 className="font-audiowide text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-wide">
              Vidéos & Clips Officiels
            </h2>
          </div>

          <button
            onClick={onNavigateToVideos}
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            <span>Explorer toute la vitrine</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              onClick={onNavigateToVideos}
              className="group rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-teal-500/40 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                <img
                  src={video.miniature}
                  alt={video.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Platform Tag */}
                <div className="absolute top-3 left-3">
                  {video.plateforme === 'youtube' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-600/90 text-white text-[11px] font-semibold backdrop-blur-md">
                      <YoutubeIcon className="w-3 h-3" />
                      <span>YouTube</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/80 border border-white/20 text-white text-[11px] font-semibold backdrop-blur-md">
                      <TikTokIcon className="w-3 h-3 text-cyan-400" />
                      <span>TikTok</span>
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                {video.duree && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-white/90 bg-black/80 backdrop-blur-md">
                      {video.duree}
                    </span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title and date */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans font-medium text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover:text-teal-300 transition-colors mb-2">
                    {video.titre}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-white/50 line-clamp-2 font-light leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>{video.date || 'Saison 2027'}</span>
                  <span className="text-teal-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Visionner
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeVideosTeaser;
