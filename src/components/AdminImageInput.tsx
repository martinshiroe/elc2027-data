import React, { useId, useRef, useState } from 'react';
import { lienPartagePhoto, preparerImage, urlImage } from '../lib/images';

export function AdminImageInput({ value, onChange, className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId(); const input = useRef<HTMLInputElement>(null); const sequence = useRef(0);
  const [failed, setFailed] = useState(''); const [loaded, setLoaded] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const raw = String(value ?? ''); const src = urlImage(raw);
  const update = (next: string) => { sequence.current++; setError(''); setFailed(''); setLoaded(''); setBusy(false); onChange?.({ target: { value: next }, currentTarget: { value: next } } as React.ChangeEvent<HTMLInputElement>); };
  const upload = async (file?: File) => {
    if (!file) return; const version = ++sequence.current; setBusy(true); setError('');
    try { const next = await preparerImage(file); if (sequence.current === version) update(next); }
    catch (e) { if (sequence.current === version) setError(e instanceof Error ? e.message : 'Impossible de lire cette image.'); }
    finally { if (sequence.current === version) setBusy(false); if (input.current) input.current.value = ''; }
  };
  const message = lienPartagePhoto(raw) ? 'Ce lien ouvre une page de partage. Téléchargez la photo depuis Google Photos, puis utilisez « Importer une image ».' : raw && !src ? 'Adresse non utilisable. Collez un lien direct https:// vers l’image ou importez un fichier.' : src && failed === src ? 'Image inaccessible : vérifiez que le lien est public et ouvre directement une image, ou importez le fichier.' : '';
  return <div className="space-y-2 min-w-0">
    <input {...props} type="text" value={raw.startsWith('data:') ? '' : raw} onChange={e=>update(e.target.value)} className={className ?? 'w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-white'} placeholder={raw.startsWith('data:') ? 'Image importée — coller un lien pour la remplacer' : props.placeholder ?? 'https://…/photo.jpg'} aria-describedby={id} />
    <div className="flex flex-wrap gap-2">
      <button type="button" className="admin-secondary" disabled={busy || props.disabled} onClick={()=>input.current?.click()}>{busy ? 'Préparation…' : 'Importer une image'}</button>
      {raw && <button type="button" className="admin-text-button" disabled={props.disabled} onClick={()=>update('')}>Retirer l’image</button>}
    </div>
    <input ref={input} type="file" className="hidden" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={e=>void upload(e.target.files?.[0])} aria-label="Choisir une image" />
    {src && failed !== src && <img key={src} src={src} alt="Aperçu de l’image" referrerPolicy="no-referrer" className="max-h-40 max-w-full rounded border border-slate-700 object-contain" onLoad={()=>setLoaded(src)} onError={()=>setFailed(src)} />}
    <p id={id} role={message || error ? 'alert' : 'status'} className="text-xs text-slate-300">{error || message || (src && loaded===src ? 'Image chargée. Enregistrez les modifications pour la publier.' : src ? 'Chargement de l’aperçu…' : 'Lien direct ou fichier. Les imports sont réduits automatiquement (image fixe).')}</p>
  </div>;
}
