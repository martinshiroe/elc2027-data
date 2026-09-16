import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'elc2027-data.json');
const ADMIN_KEY_FILE = path.join(DATA_DIR, 'admin-code.txt');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Retrieve or generate ADMIN_KEY
let ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) {
  if (fs.existsSync(ADMIN_KEY_FILE)) {
    ADMIN_KEY = fs.readFileSync(ADMIN_KEY_FILE, 'utf-8').trim();
  } else {
    ADMIN_KEY = '2027ELC'; // Default clean admin key
    try {
      fs.writeFileSync(ADMIN_KEY_FILE, ADMIN_KEY, 'utf-8');
    } catch (e) {
      console.warn('Could not write admin-code.txt:', e);
    }
  }
}

function verifyAdminKey(req: express.Request): boolean {
  const provided = req.get('x-admin-key') || (req.query.key as string);
  return Boolean(provided && ADMIN_KEY && provided === ADMIN_KEY);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // --- API Routes FIRST ---

  // Read data
  app.get('/api/data', (req, res) => {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return res.status(404).json({ error: 'Fichier de données introuvable.' });
      }
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const json = JSON.parse(raw);
      res.json(json);
    } catch (err: any) {
      res.status(500).json({ error: 'Impossible de lire les données.', details: err.message });
    }
  });

  // Check admin key
  app.get('/api/admin/check', (req, res) => {
    if (verifyAdminKey(req)) {
      res.json({ ok: true, storage: 'local-file' });
    } else {
      res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
    }
  });

  // Write data
  app.post('/api/data', (req, res) => {
    if (!verifyAdminKey(req)) {
      return res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
    }

    try {
      const incoming = req.body;
      if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ error: 'Données invalides.' });
      }

      incoming.meta = incoming.meta || {};
      incoming.meta.derniereMaj = new Date().toISOString();

      fs.writeFileSync(DATA_FILE, JSON.stringify(incoming, null, 2), 'utf-8');
      res.json({ ok: true, savedAt: incoming.meta.derniereMaj });
    } catch (err: any) {
      res.status(500).json({ error: "Impossible d'enregistrer les données.", details: err.message });
    }
  });

  // Photo upload
  const PHOTOS_DIR = path.join(DATA_DIR, 'photos');
  if (!fs.existsSync(PHOTOS_DIR)) {
    try {
      fs.mkdirSync(PHOTOS_DIR, { recursive: true });
    } catch (e) {}
  }
  app.use('/photos', express.static(PHOTOS_DIR));

  app.post('/api/photo/:entityId', (req, res) => {
    if (!verifyAdminKey(req)) {
      return res.status(401).json({ error: 'Code administrateur invalide.', code: 'unauthorized' });
    }

    try {
      const entityId = String(req.params.entityId || '').replace(/[^a-z0-9_-]/gi, '');
      const { dataUrl } = req.body;
      if (!entityId || !dataUrl) {
        return res.status(400).json({ error: 'Identifiant ou image manquante.' });
      }

      const match = /^data:(image\/[a-z]+);base64,/.exec(dataUrl);
      const ext = match ? (match[1].includes('png') ? 'png' : match[1].includes('webp') ? 'webp' : 'jpg') : 'jpg';
      const base64 = match ? dataUrl.slice(match[0].length) : dataUrl;
      const fileName = `${entityId}.${ext}`;

      fs.writeFileSync(path.join(PHOTOS_DIR, fileName), base64, 'base64');
      res.json({ ok: true, url: `/photos/${fileName}?v=${Date.now()}` });
    } catch (err: any) {
      res.status(500).json({ error: "Impossible d'enregistrer la photo.", details: err.message });
    }
  });

  // --- Vite Middleware in Dev vs Static in Prod ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ELC 2027 Server running on http://0.0.0.0:${PORT}`);
    console.log(`Admin code: ${ADMIN_KEY}`);
  });
}

startServer();
