import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { creerService, extraireEquipes } from '../api/challengermode';
import { initialELCData } from '../src/data/initialData';
import { PageJoueurs } from '../src/components/PageJoueurs';

const ids = { hok: '2c12729a-7bcc-4eb9-e4bc-08df3e4c1535', mlbb: '9ae20484-421e-45c3-e4c2-08df3e4c1535' };
const lineup = { id: 'team1', name: 'Lions ELC', disqualified: false, logo: { url: 'https://example.com/logo.png' }, members: [null, { captain: true, user: { id: 'p1', username: 'Lion' } }] };
function fixture() {
  return Object.fromEntries(Object.entries(ids).map(([jeu, id]) => [jeu, { id, attendance: { roster: null, signups: { lineupCount: 1, lineups: [structuredClone(lineup)] } } }])) as any;
}

test('Inscriptions avant le démarrage, roster ensuite, retrait des disqualifiés et données privées exclues', () => {
  const data = fixture();
  data.hok.attendance.signups.lineups[0].members[1].user.email = 'private@example.com';
  let equipes = extraireEquipes(data);
  assert.equal(equipes.length, 2);
  assert.equal(equipes[0].membres[0].pseudo, 'Lion');
  assert.doesNotMatch(JSON.stringify(equipes), /private@example.com|gameAccount/);
  data.hok.attendance.roster = { lineupCount: 0, lineups: [] };
  data.mlbb.attendance.signups.lineups[0].disqualified = true;
  assert.deepEqual(extraireEquipes(data), []);
  data.hok.attendance.roster.lineupCount = 33;
  assert.throws(() => extraireEquipes(data), /incomplète/);
  assert.throws(() => extraireEquipes({ ...fixture(), hok: null }), /inaccessible/);
});

test('Cache, déduplication des appels, panne GraphQL, reprise et renouvellement du jeton', async () => {
  let clock = Date.parse('2026-11-11T12:00:00Z');
  let authCalls = 0, graphCalls = 0, fail = false;
  const service = creerService(async (url, init) => {
    if (String(url).includes('access_keys')) {
      authCalls++;
      assert.deepEqual(JSON.parse(String(init?.body)), { refreshKey: 'test-secret' });
      return Response.json({ value: 'access-secret', expiresAt: new Date(clock + 600_000).toISOString() });
    }
    graphCalls++;
    assert.equal((init?.headers as any).Authorization, 'Bearer access-secret');
    return Response.json(fail ? { errors: [{ message: 'private upstream detail' }], data: fixture() } : { data: fixture() });
  }, () => clock, () => 'test-secret');
  const results = await Promise.all([service(), service(), service()]);
  assert.equal(authCalls, 1); assert.equal(graphCalls, 1);
  assert.doesNotMatch(JSON.stringify(results), /secret/);
  await service(); assert.equal(graphCalls, 1);
  clock += 301_000; fail = true;
  assert.equal((await service()).stale, true);
  await service(); assert.equal(graphCalls, 2);
  clock += 301_000; fail = false;
  assert.equal((await service()).stale, false);
  assert.equal(authCalls, 2); assert.equal(graphCalls, 3);
  clock += 25 * 60 * 60_000; fail = true;
  await assert.rejects(service(), /Synchronisation indisponible/);
});

test('Clé absente et échec initial ne deviennent pas une fausse liste vide', async () => {
  const service = creerService(async () => { throw new Error('must not fetch'); }, Date.now, () => undefined);
  await assert.rejects(service(), /Synchronisation indisponible/);
});

test('Les cartes existantes affichent équipes, logos et rosters, et respectent les disciplines masquées', () => {
  const data = structuredClone(initialELCData);
  data.competition.mlbb.actif = false;
  data.competition.ff.actif = false;
  data.joueurs = [{ id: 'manual', pseudo: 'Fiche conservée', discipline: 'Honor of Kings' }, { id: 'hidden', pseudo: 'Masqué FF', discipline: 'Free Fire' }];
  const equipes = extraireEquipes(fixture());
  equipes[1].nom = 'Équipe masquée';
  const html = renderToStaticMarkup(<PageJoueurs data={data} equipesInitiales={equipes} onNaviguer={() => {}} />);
  assert.match(html, /Lions ELC/); assert.match(html, /logo.png/);
  assert.match(html, /Lion.*Capitaine/); assert.match(html, /Fiche conservée/);
  assert.doesNotMatch(html, /Équipe masquée|Masqué FF/);
  assert.match(html, /tournaments\/2c12729a/);
});
