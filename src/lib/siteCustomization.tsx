import React, { createContext, useContext } from 'react';
import { ELCSiteCustomization } from '../types';
import { urlImage } from './images';

const SiteContext = createContext<ELCSiteCustomization>({});
export const SiteCustomizationProvider = SiteContext.Provider;

/** Les textes restent du texte React : aucun HTML provenant du CMS n'est exécuté. */
export function useSiteCustomization() {
  const content = useContext(SiteContext);
  function texteSite<T>(original: T): T {
    if (typeof original !== 'string') return original;
    const replacement = Object.prototype.hasOwnProperty.call(content.textes ?? {}, original) ? content.textes?.[original] : undefined;
    return (typeof replacement === 'string' ? replacement : original) as T;
  }
  function imageSite(original: string | undefined): string | undefined {
    if (!original) return original;
    const replacement = content.images?.[original];
    return urlImage(replacement || original) || undefined;
  }
  function sourcesSite(original: string | undefined): string | undefined {
    // Une image personnalisée ne doit pas être masquée par une ancienne source responsive.
    if (original?.split(',').some(source => Boolean(content.images?.[source.trim().split(/\s+/)[0]]))) return undefined;
    return original;
  }
  return { texteSite, imageSite, sourcesSite };
}
