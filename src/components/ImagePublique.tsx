import React, { useState } from 'react';
import { urlImage } from '../lib/images';

/** Une erreur ne masque plus silencieusement une zone ; un nouveau lien est réessayé. */
export function ImagePublique({ src, alt = '', onError: _onError, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(''); const safe = urlImage(src);
  if (!safe || failed === safe) return <div className={props.className} style={props.style} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={props['aria-hidden']}><span className="block p-3 text-xs text-slate-400">Image indisponible</span></div>;
  return <img {...props} src={safe} alt={alt} onError={()=>setFailed(safe)} />;
}
