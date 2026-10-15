/** Validation réservée aux images, distincte de celle des liens cliquables. */
export function lienPartagePhoto(value: string): boolean {
  try { const u = new URL(value.trim()); return ['photos.app.goo.gl', 'photos.google.com', 'drive.google.com'].includes(u.hostname); } catch { return false; }
}
export function urlImage(value: string | null | undefined): string {
  const v = value?.trim() ?? '';
  if (!v || lienPartagePhoto(v)) return '';
  if (/^data:image\/(?:png|jpe?g|webp|gif|avif);base64,[a-z0-9+/=\r\n]+$/i.test(v)) return v;
  if (/^\/(?![\/\\])/.test(v) && !/[\r\n\\]/.test(v)) return v;
  try { const u = new URL(v); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}

/** Réduit les imports avant de les stocker avec les contenus du site. */
export async function preparerImage(file: File): Promise<string> {
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'].includes(file.type)) throw new Error('Choisissez une image PNG, JPG, WebP, GIF ou AVIF. Exportez les SVG et HEIC en PNG.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Cette image dépasse 15 Mo. Réduisez-la avant de l’importer.');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d'); if (!context) throw new Error('Import indisponible dans ce navigateur.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.5]) { const result = canvas.toDataURL('image/webp', quality); if (result.length <= 450000) return result; }
    throw new Error('Image trop volumineuse après réduction. Utilisez une image plus petite ou une adresse directe.');
  } finally { bitmap.close(); }
}
