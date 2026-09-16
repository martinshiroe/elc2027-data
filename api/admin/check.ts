// GET /api/admin/check — valide le code administrateur saisi à l'écran de
// connexion du portail d'admin, avant d'ouvrir l'éditeur.

import { adminKeyConfigured, verifyAdminKey } from '../_supabase';

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export default function handler(req: Req, res: Res): void {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
    return;
  }

  if (!adminKeyConfigured) {
    res.status(500).json({
      error: 'La variable d\'environnement ADMIN_KEY n\'est pas définie sur le projet Vercel.',
    });
    return;
  }

  const raw = req.headers['x-admin-key'];
  const provided = (Array.isArray(raw) ? raw[0] : raw) || (req.query.key as string | undefined);

  if (verifyAdminKey(provided)) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok: true, storage: 'supabase' });
  } else {
    res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
  }
}
