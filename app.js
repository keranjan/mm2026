/* ═══════════════════════════════════════════
   MM 2026 Tulosveikkaus – JavaScript
   ═══════════════════════════════════════════ */

/* ── Asetukset – muuta ADMIN_PIN ── */
const ADMIN_PIN    = '1234';
const SUPABASE_URL = 'https://oaoppcicnsnvjkbbjfda.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5my6qDEV3aFTxP8F8xVnlg_2mPaekjo';

/* ── Supabase REST API -apufunktio ── */
const api = (path, opts = {}) => {
  const { headers: extraHeaders, prefer, ...rest } = opts;
  const method = rest.method || 'GET';
  const baseHeaders = {
    'apikey':        SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type':  'application/json',
  };
  if (method !== 'GET' && method !== 'DELETE') {
    baseHeaders['Prefer'] = prefer || 'return=minimal';
  }
  if (extraHeaders) Object.assign(baseHeaders, extraHeaders);
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: baseHeaders, ...rest });
};

/* ══════════════════════════════════════════
   DATA – Liput, joukkuenimet, ottelut
══════════════════════════════════════════ */

const FLAGS = {
  'Algeria':      '🇩🇿', 'Argentina':    '🇦🇷', 'Australia':    '🇦🇺',
  'Austria':      '🇦🇹', 'Belgium':      '🇧🇪', 'Bosnia':       '🇧🇦',
  'Brazil':       '🇧🇷', 'Canada':       '🇨🇦', 'Cape Verde':   '🇨🇻',
  'Colombia':     '🇨🇴', 'Croatia':      '🇭🇷', 'Czechia':      '🇨🇿',
  'Curacao':      '🇨🇼', 'DR Congo':     '🇨🇩', 'Ecuador':      '🇪🇨',
  'Egypt':        '🇪🇬', 'England':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'France':       '🇫🇷',
  'Germany':      '🇩🇪', 'Ghana':        '🇬🇭', 'Haiti':        '🇭🇹',
  'Iran':         '🇮🇷', 'Iraq':         '🇮🇶', 'Ivory Coast':  '🇨🇮',
  'Japan':        '🇯🇵', 'Jordan':       '🇯🇴', 'Mexico':       '🇲🇽',
  'Morocco':      '🇲🇦', 'Netherlands':  '🇳🇱', 'New Zealand':  '🇳🇿',
  'Norway':       '🇳🇴', 'Panama':       '🇵🇦', 'Paraguay':     '🇵🇾',
  'Portugal':     '🇵🇹', 'Qatar':        '🇶🇦', 'Saudi Arabia': '🇸🇦',
  'Scotland':     '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Senegal':      '🇸🇳', 'South Africa': '🇿🇦',
  'South Korea':  '🇰🇷', 'Spain':        '🇪🇸', 'Sweden':       '🇸🇪',
  'Switzerland':  '🇨🇭', 'Tunisia':      '🇹🇳', 'Turkiye':      '🇹🇷',
  'Uruguay':      '🇺🇾', 'USA':          '🇺🇸', 'Uzbekistan':   '🇺🇿',
};

const FI_NAMES = {
  'Algeria':      'Algeria',       'Argentina':    'Argentiina',    'Australia':    'Australia',
  'Austria':      'Itävalta',      'Belgium':      'Belgia',        'Bosnia':       'Bosnia-Hertsegovina',
  'Brazil':       'Brasilia',      'Canada':       'Kanada',        'Cape Verde':   'Kap Verde',
  'Colombia':     'Kolumbia',      'Croatia':      'Kroatia',       'Czechia':      'Tšekki',
  'Curacao':      'Curaçao',       'DR Congo':     'Kongon dem. tasavalta', 'Ecuador': 'Ecuador',
  'Egypt':        'Egypti',        'England':      'Englanti',      'France':       'Ranska',
  'Germany':      'Saksa',         'Ghana':        'Ghana',         'Haiti':        'Haiti',
  'Iran':         'Iran',          'Iraq':         'Irak',          'Ivory Coast':  'Norsunluurannikko',
  'Japan':        'Japani',        'Jordan':       'Jordania',      'Mexico':       'Meksiko',
  'Morocco':      'Marokko',       'Netherlands':  'Alankomaat',    'New Zealand':  'Uusi-Seelanti',
  'Norway':       'Norja',         'Panama':       'Panama',        'Paraguay':     'Paraguay',
  'Portugal':     'Portugali',     'Qatar':        'Qatar',         'Saudi Arabia': 'Saudi-Arabia',
  'Scotland':     'Skotlanti',     'Senegal':      'Senegal',       'South Africa': 'Etelä-Afrikka',
  'South Korea':  'Etelä-Korea',   'Spain':        'Espanja',       'Sweden':       'Ruotsi',
  'Switzerland':  'Sveitsi',       'Tunisia':      'Tunisia',       'Turkiye':      'Turkki',
  'Uruguay':      'Uruguay',       'USA':          'Yhdysvallat',   'Uzbekistan':   'Uzbekistan',
};

function fi(name)   { return name === 'TBD' ? 'TBD' : (FI_NAMES[name] || name); }
function flag(name) { return name === 'TBD' ? '🏳️' : (FLAGS[name] || '🏳️'); }

const ROUND_NAMES = {
  'R32': '32 parhaan kierros',
  'R16': '16 parhaan kierros',
  'QF':  'Neljännesvälierät',
  'SF':  'Välierät',
  '3.':  'Pronssiottelu',
  '🏆':  '🏆 Finaali',
};

const MATCHES = [
  {id:'m01',g:'A',h:'Mexico',       a:'South Africa', t:'2026-06-11T21:00Z'},
  {id:'m02',g:'A',h:'South Korea',  a:'Czechia',      t:'2026-06-12T04:00Z'},
  {id:'m03',g:'B',h:'Canada',       a:'Bosnia',       t:'2026-06-12T20:00Z'},
  {id:'m04',g:'D',h:'USA',          a:'Paraguay',     t:'2026-06-13T05:00Z'},
  {id:'m05',g:'B',h:'Qatar',        a:'Switzerland',  t:'2026-06-13T23:00Z'},
  {id:'m06',g:'C',h:'Brazil',       a:'Morocco',      t:'2026-06-13T23:00Z'},
  {id:'m07',g:'C',h:'Haiti',        a:'Scotland',     t:'2026-06-14T02:00Z'},
  {id:'m08',g:'D',h:'Australia',    a:'Turkiye',      t:'2026-06-14T08:00Z'},
  {id:'m09',g:'E',h:'Germany',      a:'Curacao',      t:'2026-06-14T19:00Z'},
  {id:'m10',g:'F',h:'Netherlands',  a:'Japan',        t:'2026-06-14T22:00Z'},
  {id:'m11',g:'E',h:'Ivory Coast',  a:'Ecuador',      t:'2026-06-15T00:00Z'},
  {id:'m12',g:'F',h:'Sweden',       a:'Tunisia',      t:'2026-06-15T04:00Z'},
  {id:'m13',g:'H',h:'Spain',        a:'Cape Verde',   t:'2026-06-15T17:00Z'},
  {id:'m14',g:'G',h:'Belgium',      a:'Egypt',        t:'2026-06-15T23:00Z'},
  {id:'m15',g:'H',h:'Saudi Arabia', a:'Uruguay',      t:'2026-06-15T23:00Z'},
  {id:'m16',g:'G',h:'Iran',         a:'New Zealand',  t:'2026-06-16T05:00Z'},
  {id:'m17',g:'I',h:'France',       a:'Senegal',      t:'2026-06-16T20:00Z'},
  {id:'m18',g:'I',h:'Iraq',         a:'Norway',       t:'2026-06-16T23:00Z'},
  {id:'m19',g:'J',h:'Argentina',    a:'Algeria',      t:'2026-06-17T03:00Z'},
  {id:'m20',g:'J',h:'Austria',      a:'Jordan',       t:'2026-06-17T08:00Z'},
  {id:'m21',g:'K',h:'Portugal',     a:'DR Congo',     t:'2026-06-17T19:00Z'},
  {id:'m22',g:'L',h:'England',      a:'Croatia',      t:'2026-06-17T22:00Z'},
  {id:'m23',g:'L',h:'Ghana',        a:'Panama',       t:'2026-06-18T00:00Z'},
  {id:'m24',g:'K',h:'Uzbekistan',   a:'Colombia',     t:'2026-06-18T04:00Z'},
  {id:'m25',g:'A',h:'Czechia',      a:'South Africa', t:'2026-06-18T17:00Z'},
  {id:'m26',g:'B',h:'Switzerland',  a:'Bosnia',       t:'2026-06-18T23:00Z'},
  {id:'m27',g:'B',h:'Canada',       a:'Qatar',        t:'2026-06-19T02:00Z'},
  {id:'m28',g:'A',h:'Mexico',       a:'South Korea',  t:'2026-06-19T03:00Z'},
  {id:'m29',g:'C',h:'Scotland',     a:'Morocco',      t:'2026-06-19T23:00Z'},
  {id:'m30',g:'D',h:'USA',          a:'Australia',    t:'2026-06-19T23:00Z'},
  {id:'m31',g:'C',h:'Brazil',       a:'Haiti',        t:'2026-06-20T02:00Z'},
  {id:'m32',g:'D',h:'Turkiye',      a:'Paraguay',     t:'2026-06-20T08:00Z'},
  {id:'m33',g:'F',h:'Netherlands',  a:'Sweden',       t:'2026-06-20T19:00Z'},
  {id:'m34',g:'E',h:'Germany',      a:'Ivory Coast',  t:'2026-06-20T21:00Z'},
  {id:'m35',g:'E',h:'Ecuador',      a:'Curacao',      t:'2026-06-21T04:00Z'},
  {id:'m36',g:'F',h:'Tunisia',      a:'Japan',        t:'2026-06-21T06:00Z'},
  {id:'m37',g:'H',h:'Spain',        a:'Saudi Arabia', t:'2026-06-21T17:00Z'},
  {id:'m38',g:'G',h:'Belgium',      a:'Iran',         t:'2026-06-21T23:00Z'},
  {id:'m39',g:'H',h:'Uruguay',      a:'Cape Verde',   t:'2026-06-21T23:00Z'},
  {id:'m40',g:'G',h:'New Zealand',  a:'Egypt',        t:'2026-06-22T05:00Z'},
  {id:'m41',g:'J',h:'Argentina',    a:'Austria',      t:'2026-06-22T19:00Z'},
  {id:'m42',g:'I',h:'France',       a:'Iraq',         t:'2026-06-22T22:00Z'},
  {id:'m43',g:'I',h:'Norway',       a:'Senegal',      t:'2026-06-23T01:00Z'},
  {id:'m44',g:'J',h:'Jordan',       a:'Algeria',      t:'2026-06-23T07:00Z'},
  {id:'m45',g:'K',h:'Portugal',     a:'Uzbekistan',   t:'2026-06-23T19:00Z'},
  {id:'m46',g:'L',h:'England',      a:'Ghana',        t:'2026-06-23T21:00Z'},
  {id:'m47',g:'L',h:'Panama',       a:'Croatia',      t:'2026-06-24T00:00Z'},
  {id:'m48',g:'K',h:'Colombia',     a:'DR Congo',     t:'2026-06-24T04:00Z'},
  {id:'m49',g:'B',h:'Switzerland',  a:'Canada',       t:'2026-06-24T23:00Z'},
  {id:'m50',g:'B',h:'Bosnia',       a:'Qatar',        t:'2026-06-24T23:00Z'},
  {id:'m51',g:'C',h:'Scotland',     a:'Brazil',       t:'2026-06-24T23:00Z'},
  {id:'m52',g:'C',h:'Morocco',      a:'Haiti',        t:'2026-06-24T23:00Z'},
  {id:'m53',g:'A',h:'Czechia',      a:'Mexico',       t:'2026-06-25T03:00Z'},
  {id:'m54',g:'A',h:'South Africa', a:'South Korea',  t:'2026-06-25T03:00Z'},
  {id:'m55',g:'E',h:'Ecuador',      a:'Germany',      t:'2026-06-25T21:00Z'},
  {id:'m56',g:'E',h:'Curacao',      a:'Ivory Coast',  t:'2026-06-25T21:00Z'},
  {id:'m57',g:'F',h:'Japan',        a:'Sweden',       t:'2026-06-26T01:00Z'},
  {id:'m58',g:'F',h:'Tunisia',      a:'Netherlands',  t:'2026-06-26T01:00Z'},
  {id:'m59',g:'D',h:'Turkiye',      a:'USA',          t:'2026-06-26T06:00Z'},
  {id:'m60',g:'D',h:'Paraguay',     a:'Australia',    t:'2026-06-26T06:00Z'},
  {id:'m61',g:'I',h:'Norway',       a:'France',       t:'2026-06-26T20:00Z'},
  {id:'m62',g:'I',h:'Senegal',      a:'Iraq',         t:'2026-06-26T20:00Z'},
  {id:'m63',g:'H',h:'Cape Verde',   a:'Saudi Arabia', t:'2026-06-27T02:00Z'},
  {id:'m64',g:'H',h:'Uruguay',      a:'Spain',        t:'2026-06-27T02:00Z'},
  {id:'m65',g:'G',h:'Egypt',        a:'Iran',         t:'2026-06-27T07:00Z'},
  {id:'m66',g:'G',h:'New Zealand',  a:'Belgium',      t:'2026-06-27T07:00Z'},
  {id:'m67',g:'L',h:'Panama',       a:'England',      t:'2026-06-27T22:00Z'},
  {id:'m68',g:'L',h:'Croatia',      a:'Ghana',        t:'2026-06-27T22:00Z'},
  {id:'m69',g:'K',h:'Colombia',     a:'Portugal',     t:'2026-06-28T02:30Z'},
  {id:'m70',g:'K',h:'DR Congo',     a:'Uzbekistan',   t:'2026-06-28T02:30Z'},
  {id:'m71',g:'J',h:'Algeria',      a:'Austria',      t:'2026-06-28T04:00Z'},
  {id:'m72',g:'J',h:'Jordan',       a:'Argentina',    t:'2026-06-28T04:00Z'},

  // ── 32 PARHAAN KIERROS (28.6.–3.7.) ──────────────────────
  {id:'r01',g:'R32',h:'TBD',a:'TBD',t:'2026-06-28T19:00Z'},  // Los Angeles
  {id:'r02',g:'R32',h:'TBD',a:'TBD',t:'2026-06-29T17:00Z'},  // Houston
  {id:'r03',g:'R32',h:'TBD',a:'TBD',t:'2026-06-29T20:30Z'},  // Boston
  {id:'r04',g:'R32',h:'TBD',a:'TBD',t:'2026-06-30T01:00Z'},  // Monterrey
  {id:'r05',g:'R32',h:'TBD',a:'TBD',t:'2026-06-30T17:00Z'},  // Dallas
  {id:'r06',g:'R32',h:'TBD',a:'TBD',t:'2026-06-30T21:00Z'},  // New York/NJ
  {id:'r07',g:'R32',h:'TBD',a:'TBD',t:'2026-07-01T01:00Z'},  // Mexico City
  {id:'r08',g:'R32',h:'TBD',a:'TBD',t:'2026-07-01T16:00Z'},  // Atlanta
  {id:'r09',g:'R32',h:'TBD',a:'TBD',t:'2026-07-01T20:00Z'},  // Seattle
  {id:'r10',g:'R32',h:'TBD',a:'TBD',t:'2026-07-02T00:00Z'},  // San Francisco
  {id:'r11',g:'R32',h:'TBD',a:'TBD',t:'2026-07-02T19:00Z'},  // Los Angeles
  {id:'r12',g:'R32',h:'TBD',a:'TBD',t:'2026-07-02T23:00Z'},  // Toronto
  {id:'r13',g:'R32',h:'TBD',a:'TBD',t:'2026-07-03T03:00Z'},  // Vancouver
  {id:'r14',g:'R32',h:'TBD',a:'TBD',t:'2026-07-03T18:00Z'},  // Dallas
  {id:'r15',g:'R32',h:'TBD',a:'TBD',t:'2026-07-03T22:00Z'},  // Miami
  {id:'r16',g:'R32',h:'TBD',a:'TBD',t:'2026-07-04T01:30Z'},  // Kansas City

  // ── 16 PARHAAN KIERROS (4.–7.7.) ─────────────────────────
  {id:'s01',g:'R16',h:'TBD',a:'TBD',t:'2026-07-04T17:00Z'},  // Houston
  {id:'s02',g:'R16',h:'TBD',a:'TBD',t:'2026-07-04T21:00Z'},  // Philadelphia
  {id:'s03',g:'R16',h:'TBD',a:'TBD',t:'2026-07-05T16:00Z'},  // Atlanta
  {id:'s04',g:'R16',h:'TBD',a:'TBD',t:'2026-07-05T20:00Z'},  // New York/NJ
  {id:'s05',g:'R16',h:'TBD',a:'TBD',t:'2026-07-06T00:00Z'},  // Mexico City
  {id:'s06',g:'R16',h:'TBD',a:'TBD',t:'2026-07-06T19:00Z'},  // Dallas
  {id:'s07',g:'R16',h:'TBD',a:'TBD',t:'2026-07-07T00:00Z'},  // Seattle
  {id:'s08',g:'R16',h:'TBD',a:'TBD',t:'2026-07-07T20:00Z'},  // Vancouver

  // ── NELJÄNNESVÄLIERÄT (9.–11.7.) ─────────────────────────
  {id:'q01',g:'QF',h:'TBD',a:'TBD',t:'2026-07-09T20:00Z'},   // Boston
  {id:'q02',g:'QF',h:'TBD',a:'TBD',t:'2026-07-10T19:00Z'},   // Los Angeles
  {id:'q03',g:'QF',h:'TBD',a:'TBD',t:'2026-07-11T21:00Z'},   // Miami
  {id:'q04',g:'QF',h:'TBD',a:'TBD',t:'2026-07-12T01:00Z'},   // Kansas City

  // ── VÄLIERÄT (14.–15.7.) ──────────────────────────────────
  {id:'sf1',g:'SF',h:'TBD',a:'TBD',t:'2026-07-14T19:00Z'},   // Dallas (AT&T)
  {id:'sf2',g:'SF',h:'TBD',a:'TBD',t:'2026-07-15T19:00Z'},   // Atlanta (Mercedes-Benz)

  // ── PRONSSIOTTELU & FINAALI ────────────────────────────────
  {id:'tp1',g:'3.',h:'TBD',a:'TBD',t:'2026-07-18T21:00Z'},   // Miami (Hard Rock)
  {id:'fi1',g:'🏆',h:'TBD',a:'TBD',t:'2026-07-19T19:00Z'},   // New York/NJ (MetLife)
];

/* ══════════════════════════════════════════
   TILA
══════════════════════════════════════════ */
let predictions = {};
let results     = {};
let users       = {};
let currentUser = localStorage.getItem('wc26_me') || '';
let adminOpen   = false;

/* ══════════════════════════════════════════
   APUFUNKTIOT
══════════════════════════════════════════ */

function isLocked(m) { return !!ROUND_NAMES[m.g] || !!results[m.id] || Date.now() >= new Date(m.t).getTime(); }
function isKnockout(m) { return !!ROUND_NAMES[m.g]; }

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('fi-FI', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Helsinki',
  });
}
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fi-FI', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Helsinki',
  });
}
function dayKey(iso) {
  return new Date(iso).toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' });
}

/* ══════════════════════════════════════════
   PISTEET
══════════════════════════════════════════ */

function winner(h, a) { return h > a ? 'home' : a > h ? 'away' : 'draw'; }
function calcPts(ph, pa, rh, ra) {
  if ([ph, pa, rh, ra].some(v => v === null || v === undefined)) return null;
  const pw = winner(ph, pa), rw = winner(rh, ra);
  if (pw !== rw)              return 0;
  if (ph === rh && pa === ra)  return 3;
  if ((ph - pa) === (rh - ra)) return 2;
  return 1;
}

/* ══════════════════════════════════════════
   SUPABASE – data in/out
══════════════════════════════════════════ */

async function loadResults() {
  try {
    const res = await api('results?select=match_id,home_goals,away_goals');
    if (!res.ok) return;
    const rows = await res.json();
    results = {};
    rows.forEach(r => { results[r.match_id] = { h: r.home_goals, a: r.away_goals }; });
  } catch (e) { console.error('loadResults:', e); }
}

async function loadAllPredictions() {
  try {
    const res = await api('predictions?select=username,match_id,home_goals,away_goals');
    if (!res.ok) return;
    const rows = await res.json();
    users = {};
    rows.forEach(r => {
      if (!users[r.username]) users[r.username] = { predictions: {} };
      users[r.username].predictions[r.match_id] = { h: r.home_goals, a: r.away_goals };
    });
    if (currentUser && users[currentUser]) {
      predictions = users[currentUser].predictions;
    }
  } catch (e) { console.error('loadAllPredictions:', e); }
}

/* ══════════════════════════════════════════
   VEIKKAUKSET
══════════════════════════════════════════ */

function getPred(id)  { return predictions[id] || { h: null, a: null }; }
function predDone(id) { const p = getPred(id); return p.h !== null && p.a !== null; }

function stepPred(id, side, delta) {
  const m = MATCHES.find(x => x.id === id);
  if (!m || isLocked(m)) return;
  if (!predictions[id]) predictions[id] = { h: null, a: null };
  const cur  = predictions[id][side];
  const next = cur === null ? (delta > 0 ? 0 : null) : Math.max(0, cur + delta);
  predictions[id][side] = next;
  updateProgress();
  refreshCard(id);
}

function updateProgress() {
  const open = MATCHES.filter(m => !isLocked(m) && !isKnockout(m));
  const done = open.filter(m => predDone(m.id)).length;
  const pct  = open.length ? Math.round(done / open.length * 100) : 100;
  document.getElementById('progress-fill').style.width  = pct + '%';
  document.getElementById('progress-label').textContent = `${done} / ${open.length} avoimesta ottelusta veikattuna`;
  document.getElementById('progress-pct').textContent   = pct + '%';
}

function matchStats(id) {
  const r = results[id];
  if (!r) return '';
  const all = Object.values(users)
    .map(u => u.predictions[id])
    .filter(p => p && p.h !== null && p.a !== null);
  const n = all.length;
  if (n === 0) return '';
  const w1  = all.filter(p => winner(p.h, p.a) === winner(r.h, r.a)).length;
  const gd  = all.filter(p => winner(p.h, p.a) === winner(r.h, r.a) && (p.h - p.a) === (r.h - r.a)).length;
  const ex  = all.filter(p => p.h === r.h && p.a === r.a).length;
  return `<div class="match-stats">
    <span title="Oikea voittaja">🏆 ${w1}/${n}</span>
    <span title="Oikea maaliero">📐 ${gd}/${n}</span>
    <span title="Tarkka tulos">🎯 ${ex}/${n}</span>
  </div>`;
}

function resultBadge(id) {
  const p = getPred(id), r = results[id];
  if (!r) return '';
  const pts   = calcPts(p.h, p.a, r.h, r.a);
  const score = `${r.h}–${r.a}`;
  const badge = pts === null
    ? `<span class="result-line rn">Tulos: ${score} · ei veikkausta</span>`
    : `<span class="result-line ${ ['r0','r1','r2','r3'][pts] }">Tulos: ${score} · ${ ['Ei osunut · 0 p','Oikea voittaja +1 p','Oikea maaliero +2 p','Tarkka tulos! +3 p'][pts] }</span>`;
  return `<div class="result-wrap">${badge}${matchStats(id)}</div>`;
}

function cardExtraClass(id) {
  const r = results[id];
  if (!r) return '';
  const pts = calcPts(getPred(id).h, getPred(id).a, r.h, r.a);
  return pts === null ? '' : ['pts-0', 'pts-1', 'pts-2', 'pts-3'][pts];
}

function matchCardHtml(m) {
  const p      = getPred(m.id);
  const locked = isLocked(m);
  const hv     = p.h !== null ? p.h : null;
  const av     = p.a !== null ? p.a : null;
  const dis    = locked ? 'disabled' : '';
  const hDisp  = hv !== null ? hv : '–';
  const aDisp  = av !== null ? av : '–';
  const hEmpty = hv === null ? ' empty' : '';
  const aEmpty = av === null ? ' empty' : '';
  return `<div class="match-card ${locked ? 'locked' : ''} ${isKnockout(m) ? 'knockout' : ''} ${cardExtraClass(m.id)}" id="mc-${m.id}">
    <div class="match-row">
      <div class="match-teams-row">
        <div class="team-block">
          <span class="flag">${flag(m.h)}</span>
          <span class="team-name">${fi(m.h)}</span>
        </div>
        <div class="team-block away">
          <span class="flag">${flag(m.a)}</span>
          <span class="team-name">${fi(m.a)}</span>
        </div>
      </div>
      <div class="match-stepper-row">
        <div class="stepper">
          <button class="step-btn" ${dis} onclick="stepPred('${m.id}','h',-1)">−</button>
          <div class="score-display${hEmpty}">${hDisp}</div>
          <button class="step-btn" ${dis} onclick="stepPred('${m.id}','h',1)">+</button>
        </div>
        <span class="score-sep">:</span>
        <div class="stepper">
          <button class="step-btn" ${dis} onclick="stepPred('${m.id}','a',-1)">−</button>
          <div class="score-display${aEmpty}">${aDisp}</div>
          <button class="step-btn" ${dis} onclick="stepPred('${m.id}','a',1)">+</button>
        </div>
      </div>
    </div>
    <div class="match-meta">
      <span>${ROUND_NAMES[m.g] ? `${fmtDate(m.t)} &middot; ${fmtTime(m.t)}` : `Lohko ${m.g} &middot; ${fmtTime(m.t)}`}</span>
      ${locked ? '<span>&#128274; lukittu</span>' : ''}
    </div>
    ${resultBadge(m.id)}
  </div>`;
}

function renderMatches() {
  // Kuuma putki -banneri
  const streakEl = document.getElementById('streak-banner');
  if (streakEl && currentUser && users[currentUser]) {
    const streak = calcCurrentStreak(users[currentUser].predictions || {});
    if (streak >= 3) {
      const fire = streak >= 7 ? '🔥🔥🔥' : streak >= 5 ? '🔥🔥' : '🔥';
      streakEl.innerHTML = `${fire} <strong>${streak} oikein peräkkäin</strong> — kuuma putki käynnissä!`;
      streakEl.style.display = 'flex';
    } else {
      streakEl.style.display = 'none';
    }
  } else if (streakEl) {
    streakEl.style.display = 'none';
  }

  const sorted = [...MATCHES].sort((a, b) => new Date(a.t) - new Date(b.t));
  let html = '', lastKey = '';
  for (const m of sorted) {
    const isKnockout = !!ROUND_NAMES[m.g];
    const day = dayKey(m.t);
    // Lohkovaihe: pelkkä päivämäärä | Jatkovaihe: kierros + päivämäärä
    const key = isKnockout ? `${m.g}__${day}` : day;
    if (key !== lastKey) {
      if (isKnockout) {
        html += `<div class="date-label">${ROUND_NAMES[m.g]} &middot; ${fmtDate(m.t)}</div>`;
      } else {
        html += `<div class="date-label">${fmtDate(m.t)}</div>`;
      }
      lastKey = key;
    }
    html += matchCardHtml(m);
  }
  document.getElementById('matches-container').innerHTML = html;
  updateProgress();
}

function refreshCard(id) {
  const el = document.getElementById('mc-' + id);
  const m  = MATCHES.find(x => x.id === id);
  if (el && m) el.outerHTML = matchCardHtml(m);
}

async function savePredictions() {
  const name = document.getElementById('username').value.trim();
  if (!name) { toast('Kirjoita nimesi ensin', 'error'); return; }
  const open = MATCHES.filter(m => !isLocked(m) && !isKnockout(m));
  if (!open.some(m => predDone(m.id))) { toast('Syötä vähintään yksi tulos ensin', 'error'); return; }

  const btn = document.getElementById('save-btn');
  const origText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Tallennetaan…';
  btn.style.opacity = '0.7';

  const rows = Object.entries(predictions)
    .filter(([, v]) => v.h !== null && v.a !== null)
    .map(([match_id, v]) => ({ username: name, match_id, home_goals: v.h, away_goals: v.a }));

  // Suodata pois ottelut jotka ovat ehtineet lukittua sivun avauksen jälkeen
  const nowLocked = rows.filter(r => {
    const m = MATCHES.find(m => m.id === r.match_id);
    return m && (Date.now() >= new Date(m.t).getTime() || results[m.id]);
  });
  const safeRows = rows.filter(r => {
    const m = MATCHES.find(m => m.id === r.match_id);
    return m && Date.now() < new Date(m.t).getTime() && !results[m.id] && !ROUND_NAMES[m.g];
  });

  if (safeRows.length === 0) {
    btn.disabled = false;
    btn.textContent = origText;
    btn.style.opacity = '';
    toast('Kaikki veikkaukset ovat jo lukittuja — ei tallennettavaa', 'error');
    return;
  }

  if (nowLocked.length > 0) {
    toast(`${nowLocked.length} ottelu on jo alkanut — niitä ei tallenneta`, 'info');
    await new Promise(r => setTimeout(r, 1200)); // pieni tauko ennen jatkoa
  }

  const existingRes = await api(`predictions?username=eq.${encodeURIComponent(name)}&select=match_id`);
  const existingIds = new Set();
  if (existingRes.ok) {
    const existing = await existingRes.json();
    existing.forEach(r => existingIds.add(r.match_id));
  }

  const toInsert = safeRows.filter(r => !existingIds.has(r.match_id));
  const toUpdate = safeRows.filter(r =>  existingIds.has(r.match_id));

  let failed = false;

  if (toInsert.length > 0) {
    const res = await api('predictions', {
      method: 'POST',
      body:   JSON.stringify(toInsert),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Insert-virhe:', res.status, err);
      failed = true;
    }
  }

  for (const row of toUpdate) {
    const res = await api(
      `predictions?username=eq.${encodeURIComponent(name)}&match_id=eq.${row.match_id}`,
      { method: 'PATCH', body: JSON.stringify({ home_goals: row.home_goals, away_goals: row.away_goals }) }
    );
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Update-virhe:', row.match_id, res.status, err);
      failed = true;
    }
  }

  btn.disabled = false;
  btn.textContent = origText;
  btn.style.opacity = '';

  if (failed) {
    toast('Tallennuksessa tapahtui virhe — yritä uudelleen', 'error');
    return;
  }

  currentUser = name;
  localStorage.setItem('wc26_me', name);
  await loadAllPredictions();
  renderLeaderboard();
  const count = safeRows.length;
  toast(`${count} veikkausta tallennettu!`, 'success');
}

/* ══════════════════════════════════════════
   TULOSTAULUKKO
══════════════════════════════════════════ */

function calcUser(preds) {
  let total = 0, exact = 0, diff = 0, win = 0, miss = 0;
  for (const m of MATCHES) {
    const r = results[m.id]; if (!r) continue;
    const p = preds[m.id];   if (!p || p.h === null || p.a === null) continue;
    const pts = calcPts(p.h, p.a, r.h, r.a);
    total += pts;
    if (pts === 3) exact++; else if (pts === 2) diff++; else if (pts === 1) win++; else miss++;
  }
  return { total, exact, diff, win, miss };
}

function renderLeaderboard() {
  const ranked = Object.entries(users)
    .map(([name, data]) => ({ name, ...calcUser(data.predictions || {}), weekly: calcWeeklyPts(data.predictions || {}) }))
    .sort((a, b) => b.total - a.total || b.exact - a.exact || b.diff - a.diff);

  // Viikon veikkaaja — kaikki jotka yltävät viim. 7 pv huipputulokseen
  const topWeekly = Math.max(...ranked.map(u => u.weekly));
  const weeklyWinners = new Set(topWeekly > 0 ? ranked.filter(u => u.weekly === topWeekly).map(u => u.name) : []);

  const medals = ['🥇', '🥈', '🥉'];
  const html = ranked.length
    ? ranked.map((u, i) => {
        const preds     = users[u.name]?.predictions || {};
        const achiev    = calcAchievements(preds, u);
        const icons     = achiev.filter(a => a.unlocked).map(a => `<span title="${a.name}">${a.icon}</span>`).join('');
        const isWeekly  = weeklyWinners.has(u.name);
        return `<div class="lb-entry${u.name === currentUser ? ' me' : ''}" onclick="openProfile('${u.name.replace(/'/g,"\\'")}', ${i + 1})" style="cursor:pointer">
          <div class="lb-rank">${i < 3 ? medals[i] : i + 1}</div>
          <div class="lb-name">${u.name}${u.name === currentUser ? ' <span style="font-size:11px;color:var(--text-muted)">(sinä)</span>' : ''}${isWeekly ? ' <span class="badge-weekly" title="Viikon veikkaaja — eniten pisteitä viimeisen 7 päivän otteluista">⭐ viikon veikkaaja</span>' : ''}</div>
          <div class="lb-icons">${icons}</div>
          <div class="lb-breakdown">${u.exact} / ${u.diff} / ${u.win}</div>
          <div class="lb-pts">${u.total}</div>
        </div>`;
      }).join('')
    : '<div class="empty-state">Ei vielä pelaajia – tallenna veikkauksesi näkyäksesi tässä.</div>';
  document.getElementById('lb-body').innerHTML = html;
}

/* ══════════════════════════════════════════
   SAAVUTUKSET
══════════════════════════════════════════ */

const ACHIEVEMENTS = [
  // ── Pistepohjaisia ──────────────────────────────────────────
  {
    id:   'first_point',
    icon: '🌱',
    name: 'Ensimmäinen piste',
    desc: 'Ensimmäinen oikea veikkaus',
    check: ({ stats }) => stats.total >= 1,
  },
  {
    id:   'ten_points',
    icon: '⭐',
    name: 'Kympin oppilas',
    desc: '10 pistettä yhteensä',
    check: ({ stats }) => stats.total >= 10,
  },
  {
    id:   'twenty_five_points',
    icon: '🌟',
    name: 'Mestari',
    desc: '25 pistettä yhteensä',
    check: ({ stats }) => stats.total >= 25,
  },
  {
    id:   'fifty_points',
    icon: '👑',
    name: 'Legenda',
    desc: '50 pistettä yhteensä',
    check: ({ stats }) => stats.total >= 50,
  },
  // ── Tarkkuuspohjaisia ───────────────────────────────────────
  {
    id:   'three_exact',
    icon: '🎯',
    name: 'Tarkka-ampuja',
    desc: '3 tarkkaa tulosta (3p)',
    check: ({ stats }) => stats.exact >= 3,
  },
  {
    id:   'ten_exact',
    icon: '💎',
    name: 'Timantti',
    desc: '10 tarkkaa tulosta (3p)',
    check: ({ stats }) => stats.exact >= 10,
  },
  {
    id:   'five_in_a_row',
    icon: '🔥',
    name: 'Tulessa',
    desc: '5 oikeaa voittajaa peräkkäin',
    check: ({ streak }) => streak >= 5,
  },
  {
    id:   'five_diff',
    icon: '🧠',
    name: 'Strategi',
    desc: 'Oikea maaliero 5 kertaa (2p)',
    check: ({ stats }) => stats.diff >= 5,
  },
  // ── Erikoisia ───────────────────────────────────────────────
  {
    id:   'perfect_start',
    icon: '⚡',
    name: 'Täydellinen aloitus',
    desc: 'Oikea veikkaus kisojen avauksesta',
    check: ({ preds }) => {
      const r = results['m01'];
      const p = preds['m01'];
      if (!r || !p || p.h === null) return false;
      return calcPts(p.h, p.a, r.h, r.a) > 0;
    },
  },
  {
    id:   'unicorn',
    icon: '🦄',
    name: 'Harvinainen helmi',
    desc: 'Ainoa pelaaja joka veikkasi tietyn ottelun oikein',
    check: ({ preds }) => {
      return MATCHES.some(m => {
        const r = results[m.id]; if (!r) return false;
        const p = preds[m.id];   if (!p || p.h === null) return false;
        if (calcPts(p.h, p.a, r.h, r.a) === 0) return false;
        const others = Object.values(users).filter(udata => {
          const op = udata.predictions?.[m.id];
          if (!op || op.h === null) return false;
          return calcPts(op.h, op.a, r.h, r.a) > 0;
        });
        return others.length === 1;
      });
    },
  },
  {
    id:   'gambler',
    icon: '🐉',
    name: 'Uhkapeluri',
    desc: 'Veikannut yli 3 maalin eroa ja osunut',
    check: ({ preds }) => {
      return MATCHES.some(m => {
        const r = results[m.id]; if (!r) return false;
        const p = preds[m.id];   if (!p || p.h === null) return false;
        return Math.abs(p.h - p.a) > 3 && calcPts(p.h, p.a, r.h, r.a) > 0;
      });
    },
  },
  {
    id:   'world_traveller',
    icon: '🌍',
    name: 'Maailmanmatkustaja',
    desc: 'Oikea veikkaus jokaisesta lohkosta A–L',
    check: ({ preds }) => {
      const groups = new Set('ABCDEFGHIJKL'.split(''));
      const hit    = new Set();
      for (const m of MATCHES) {
        const r = results[m.id]; if (!r) continue;
        const p = preds[m.id];   if (!p || p.h === null) continue;
        if (calcPts(p.h, p.a, r.h, r.a) > 0) hit.add(m.g);
      }
      return [...groups].every(g => hit.has(g));
    },
  },
  // ── Jatkopelit ─────────────────────────────────────────────
  {
    id:   'ko_first',
    icon: '🎬',
    name: 'Tästä hauskuus alkaa',
    desc: 'Arvaa jatkopelien ensimmäisen ottelun voittajan oikein',
    check: ({ preds }) => {
      const r = results['r01'];
      const p = preds['r01'];
      if (!r || !p || p.h === null) return false;
      return calcPts(p.h, p.a, r.h, r.a) > 0;
    },
  },
  {
    id:   'ko_exact',
    icon: '🏹',
    name: 'Knockoutin kunkku',
    desc: 'Tarkka tulos jatkopelissä (3p)',
    check: ({ preds }) => {
      return MATCHES.filter(m => isKnockout(m)).some(m => {
        const r = results[m.id]; if (!r) return false;
        const p = preds[m.id];   if (!p || p.h === null) return false;
        return calcPts(p.h, p.a, r.h, r.a) === 3;
      });
    },
  },
  {
    id:   'crystal_ball',
    icon: '🔮',
    name: 'Kristallipallo',
    desc: 'Arvaa 10 jatko-ottelun voittajaa oikein',
    check: ({ preds }) => {
      const hits = MATCHES.filter(m => isKnockout(m)).filter(m => {
        const r = results[m.id]; if (!r) return false;
        const p = preds[m.id];   if (!p || p.h === null) return false;
        return calcPts(p.h, p.a, r.h, r.a) > 0;
      });
      return hits.length >= 10;
    },
  },
  {
    id:   'long_road',
    icon: '🗺️',
    name: 'Pitkä matka',
    desc: 'Oikea veikkaus jokaiselta kierrokselta',
    check: ({ preds }) => {
      const rounds = ['R32','R16','QF','SF','🏆'];
      return rounds.every(round =>
        MATCHES.filter(m => m.g === round).some(m => {
          const r = results[m.id]; if (!r) return false;
          const p = preds[m.id];   if (!p || p.h === null) return false;
          return calcPts(p.h, p.a, r.h, r.a) > 0;
        })
      );
    },
  },
  {
    id:   'final_master',
    icon: '🏆',
    name: 'Finaalin mestari',
    desc: 'Arvasi finaalin voittajan oikein',
    check: ({ preds }) => {
      const r = results['fi1'];
      const p = preds['fi1'];
      if (!r || !p || p.h === null) return false;
      return winner(p.h, p.a) === winner(r.h, r.a);
    },
  },
  {
    id:   'final_prophet',
    icon: '✨',
    name: 'Profeetta',
    desc: 'Tarkka tulos finaalista — täydellinen turnaus!',
    check: ({ preds }) => {
      const r = results['fi1'];
      const p = preds['fi1'];
      if (!r || !p || p.h === null) return false;
      return calcPts(p.h, p.a, r.h, r.a) === 3;
    },
  },
];

function calcStreak(preds) {
  const sorted = [...MATCHES]
    .filter(m => results[m.id] && preds[m.id] && preds[m.id].h !== null && preds[m.id].a !== null)
    .sort((a, b) => new Date(a.t) - new Date(b.t));
  let best = 0, current = 0;
  for (const m of sorted) {
    const p = preds[m.id];
    if (!p || p.h === null || p.a === null) { current = 0; continue; }
    const pts = calcPts(p.h, p.a, results[m.id].h, results[m.id].a);
    if (pts > 0) { current++; best = Math.max(best, current); }
    else         { current = 0; }
  }
  return best;
}

function calcCurrentStreak(preds) {
  const sorted = [...MATCHES]
    .filter(m => results[m.id] && preds[m.id] && preds[m.id].h !== null && preds[m.id].a !== null)
    .sort((a, b) => new Date(a.t) - new Date(b.t));
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const m = sorted[i];
    const p = preds[m.id];
    const pts = calcPts(p.h, p.a, results[m.id].h, results[m.id].a);
    if (pts > 0) current++;
    else break;
  }
  return current;
}

function calcWeeklyPts(preds) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let pts = 0;
  for (const m of MATCHES) {
    const r = results[m.id]; if (!r) continue;
    if (new Date(m.t).getTime() < weekAgo) continue;
    const p = preds[m.id]; if (!p || p.h === null || p.a === null) continue;
    pts += calcPts(p.h, p.a, r.h, r.a);
  }
  return pts;
}

function calcAchievements(preds, stats) {
  const streak = calcStreak(preds);
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: a.check({ preds, stats, streak }),
  }));
}

/* ══════════════════════════════════════════
   PELAAJAN PROFIILI
══════════════════════════════════════════ */

function openProfile(name, rank) {
  const data  = users[name];
  if (!data) return;
  const preds = data.predictions || {};
  const stats = calcUser(preds);

  // Pisteet per lohko
  const groups = {};
  for (const m of MATCHES) {
    const r = results[m.id]; if (!r) continue;
    const p = preds[m.id];   if (!p || p.h === null || p.a === null) continue;
    const pts = calcPts(p.h, p.a, r.h, r.a);
    if (!groups[m.g]) groups[m.g] = 0;
    groups[m.g] += pts;
  }

  // Paras lohko
  const bestGroup = Object.entries(groups).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Pelatut ottelut
  const played = MATCHES
    .filter(m => results[m.id] && preds[m.id] && preds[m.id].h !== null && preds[m.id].a !== null)
    .sort((a, b) => new Date(a.t) - new Date(b.t));

  const played3 = played.filter(m => {
    const p = preds[m.id]; const r = results[m.id];
    return p && r && calcPts(p.h, p.a, r.h, r.a) === 3;
  });
  const played0 = played.filter(m => {
    const p = preds[m.id]; const r = results[m.id];
    return p && r && calcPts(p.h, p.a, r.h, r.a) === 0;
  });

  const totalPlayed = played.length;
  const hitRate     = totalPlayed ? Math.round((stats.exact + stats.diff + stats.win) / totalPlayed * 100) : 0;

  // Saavutukset
  const achievements = calcAchievements(preds, stats);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Pisterivit
  function matchRows(list) {
    if (!list.length) return '<p style="font-size:13px;color:var(--text-muted);padding:0.5rem 0">–</p>';
    return list.map(m => {
      const p   = preds[m.id];
      const r   = results[m.id];
      const pts = calcPts(p.h, p.a, r.h, r.a);
      const cls = ['r0','r1','r2','r3'][pts];
      const lbl = ['0 p','1 p','2 p','3 p'][pts];
      return `<div class="profile-match-row">
        <span class="pmr-teams">${flag(m.h)} <strong>${fi(m.h)}</strong> – <strong>${fi(m.a)}</strong> ${flag(m.a)}</span>
        <span class="pmr-pred">${p.h}–${p.a} / ${r.h}–${r.a}</span>
        <span class="pmr-badge ${cls}">${lbl}</span>
      </div>`;
    }).join('');
  }

  // Lohkoruudukko
  const allGroups = 'ABCDEFGHIJKL'.split('');
  const groupGrid = allGroups.map(g => {
    const pts  = groups[g] ?? null;
    const best = g === bestGroup;
    return `<div class="profile-group-tile${best ? ' best' : ''}">
      <div class="pgt-label">Lohko ${g}</div>
      <div class="pgt-pts">${pts !== null ? pts : '–'}</div>
    </div>`;
  }).join('');

  // Saavutusruudukko
  const achievementGrid = achievements.map(a => `
    <div class="achievement${a.unlocked ? ' unlocked' : ''}" title="${a.desc}">
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-desc">${a.desc}</div>
    </div>
  `).join('');

  document.getElementById('profile-content').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${name[0].toUpperCase()}</div>
      <div>
        <div class="profile-name">${name}</div>
        <div class="profile-rank">Sijoitus ${rank}. · ${totalPlayed} ottelua veikattuna · ${hitRate}% osumia</div>
      </div>
      <div class="profile-pts">
        <div class="profile-pts-num">${stats.total}</div>
        <div class="profile-pts-lbl">pistettä</div>
      </div>
    </div>

    <div class="profile-stats">
      <div class="profile-stat">
        <div class="profile-stat-num ps-gold">${stats.exact}</div>
        <div class="profile-stat-lbl">🥇 Tarkka</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-num ps-silver">${stats.diff}</div>
        <div class="profile-stat-lbl">🥈 Maaliero</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-num ps-bronze">${stats.win}</div>
        <div class="profile-stat-lbl">🥉 Voittaja</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-num ps-miss">${stats.miss}</div>
        <div class="profile-stat-lbl">✗ Ei osunut</div>
      </div>
    </div>

    <div class="profile-section-title">Saavutukset · ${unlockedCount} / ${achievements.length} avattu</div>
    <div class="achievements-grid">${achievementGrid}</div>

    <div class="profile-section-title" style="margin-top:1.5rem">Pisteet per lohko${bestGroup ? ` · Paras: Lohko ${bestGroup}` : ''}</div>
    <div class="profile-groups">${groupGrid}</div>

    ${played3.length ? `
      <div class="profile-section-title" style="margin-top:1.5rem">🥇 Tarkat tulokset (${played3.length} kpl)</div>
      ${matchRows(played3)}
    ` : ''}

    ${played0.length ? `
      <div class="profile-section-title" style="margin-top:1.5rem">Ei osunut (${played0.length} kpl)</div>
      ${matchRows(played0)}
    ` : ''}

    ${!played.length ? '<p style="color:var(--text-muted);font-size:13px;margin-top:1rem">Ei vielä tuloksia syötetty – profiili täydentyy kisojen edetessä.</p>' : ''}
  `;

  document.getElementById('profile-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfile(e) {
  if (e && e.target !== document.getElementById('profile-overlay')) return;
  document.getElementById('profile-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════
   ADMIN
══════════════════════════════════════════ */

function checkPin() {
  if (document.getElementById('pin-input').value === ADMIN_PIN) {
    adminOpen = true;
    document.getElementById('admin-gate').style.display  = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    renderAdmin();
  } else {
    document.getElementById('pin-error').style.display = 'block';
  }
}

function lockAdmin() {
  adminOpen = false;
  document.getElementById('admin-gate').style.display  = 'block';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('pin-input').value            = '';
  document.getElementById('pin-error').style.display   = 'none';
}

async function stepResult(id, side, delta) {
  if (!results[id]) results[id] = { h: null, a: null };
  const cur  = results[id][side];
  const next = cur === null ? (delta > 0 ? 0 : null) : Math.max(0, cur + delta);
  results[id][side] = next;
  const { h, a } = results[id];

  if (h === null && a === null) {
    await api(`results?match_id=eq.${id}`, { method: 'DELETE' });
    delete results[id];
  } else if (h !== null && a !== null) {
    await api('results', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body:   JSON.stringify({ match_id: id, home_goals: h, away_goals: a }),
    });
  }

  const el = document.getElementById('ac-' + id);
  const m  = MATCHES.find(x => x.id === id);
  if (el && m) el.outerHTML = adminCardHtml(m);
  refreshCard(id);
  renderLeaderboard();
  toast('Tulos tallennettu', 'success');
}

function adminCardHtml(m) {
  const r      = results[m.id] || {};
  const hv     = r.h !== undefined && r.h !== null ? r.h : null;
  const av     = r.a !== undefined && r.a !== null ? r.a : null;
  const hDisp  = hv !== null ? hv : '–';
  const aDisp  = av !== null ? av : '–';
  const hEmpty = hv === null ? ' empty' : '';
  const aEmpty = av === null ? ' empty' : '';
  return `<div class="admin-card" id="ac-${m.id}">
    <div class="admin-row">
      <div class="admin-team">
        <span style="font-size:18px;flex-shrink:0">${flag(m.h)}</span>
        <span>${fi(m.h)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
        <div class="stepper">
          <button class="step-btn" onclick="stepResult('${m.id}','h',-1)">−</button>
          <div class="score-display${hEmpty}">${hDisp}</div>
          <button class="step-btn" onclick="stepResult('${m.id}','h',1)">+</button>
        </div>
        <span class="score-sep">:</span>
        <div class="stepper">
          <button class="step-btn" onclick="stepResult('${m.id}','a',-1)">−</button>
          <div class="score-display${aEmpty}">${aDisp}</div>
          <button class="step-btn" onclick="stepResult('${m.id}','a',1)">+</button>
        </div>
      </div>
      <div class="admin-team right">
        <span style="font-size:18px;flex-shrink:0">${flag(m.a)}</span>
        <span>${fi(m.a)}</span>
      </div>
    </div>
    <div class="match-meta" style="margin-top:5px">Lohko ${m.g} &middot; ${fmtDate(m.t)} ${fmtTime(m.t)}</div>
  </div>`;
}

function renderAdmin() {
  const sorted = [...MATCHES].sort((a, b) => new Date(a.t) - new Date(b.t));
  let html = '', lastDay = '';
  for (const m of sorted) {
    const day = dayKey(m.t);
    if (day !== lastDay) { html += `<div class="date-label">${fmtDate(m.t)}</div>`; lastDay = day; }
    html += adminCardHtml(m);
  }
  document.getElementById('admin-container').innerHTML = html;
}

/* ══════════════════════════════════════════
   VÄLILEHDET & APUVÄLINEET
══════════════════════════════════════════ */

function showTab(tab, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
  // Synkronoi molemmat navipalkit
  const label = btn?.textContent?.trim();
  if (label) {
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => {
      if (b.textContent.trim() === label) b.classList.add('active');
    });
  }
  if (tab === 'leaderboard') renderLeaderboard();
  if (tab === 'chart') renderChart();
  if (tab === 'admin' && adminOpen) renderAdmin();
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ══════════════════════════════════════════
   PISTEKEHITYSKAAVIO
══════════════════════════════════════════ */

let chartInstance = null;
let chartSelectedPlayers = new Set();
let chartAllPlayers = [];

const CHART_STORAGE_KEY = 'wc26_chart_players';

function saveChartSelection() {
  localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify([...chartSelectedPlayers]));
}

function loadChartSelection() {
  try {
    const saved = localStorage.getItem(CHART_STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : null;
  } catch { return null; }
} // [{name, total, data}] järjestyksessä

const PALETTE = [
  '#4ade80','#facc15','#60a5fa','#f97316','#e879f9',
  '#34d399','#fb7185','#a78bfa','#38bdf8','#fbbf24',
  '#f472b6','#84cc16','#fb923c','#c084fc','#2dd4bf',
  '#67e8f9','#fca5a5','#86efac','#fde68a','#c4b5fd',
];

function renderChart() {
  const played = [...MATCHES]
    .sort((a, b) => new Date(a.t) - new Date(b.t))
    .filter(m => results[m.id]);

  if (played.length === 0) {
    document.getElementById('chart-sub').textContent = 'Kuvaaja täyttyy kun ensimmäiset tulokset on syötetty.';
    document.getElementById('chart-player-list').innerHTML = '';
    return;
  }

  // Laske kaikki pelaajat + heidän kumulatiivinen data
  chartAllPlayers = Object.entries(users)
    .map(([name, data]) => {
      const preds = data.predictions || {};
      let cum = 0;
      const pts = played.map(m => {
        const p = preds[m.id], r = results[m.id];
        const v = (p && r) ? (calcPts(p.h, p.a, r.h, r.a) ?? 0) : 0;
        cum += v; return cum;
      });
      return { name, total: cum, pts };
    })
    .sort((a, b) => b.total - a.total);

  // Oletusvalinta: tallennettu / top 5 + oma nimi
  if (chartSelectedPlayers.size === 0) {
    const saved = loadChartSelection();
    if (saved && saved.size > 0) {
      // Suodata pois pelaajat jotka eivät enää ole mukana
      chartSelectedPlayers = new Set([...saved].filter(n => chartAllPlayers.some(p => p.name === n)));
    }
    if (chartSelectedPlayers.size === 0) {
      chartAllPlayers.slice(0, 5).forEach(p => chartSelectedPlayers.add(p.name));
      if (currentUser) chartSelectedPlayers.add(currentUser);
    }
  }

  renderChartPlayerList();
  drawChart(played);
}

function renderChartPlayerList(filter = '') {
  const list = document.getElementById('chart-player-list');
  const q = filter.toLowerCase();
  const visible = chartAllPlayers.filter(p => !q || p.name.toLowerCase().includes(q));
  list.innerHTML = visible.map((p, i) => {
    const colorIdx = chartAllPlayers.indexOf(p);
    const color = PALETTE[colorIdx % PALETTE.length];
    const checked = chartSelectedPlayers.has(p.name);
    const isMe = p.name === currentUser;
    return `<label class="chart-player-chip${checked ? ' selected' : ''}${isMe ? ' me' : ''}"
        style="${checked ? `--chip-color:${color}` : ''}">
      <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleChartPlayer('${p.name.replace(/'/g,"\\'")}', this.checked)" style="display:none">
      <span class="chip-dot" style="background:${checked ? color : 'transparent'};border-color:${color}"></span>
      <span class="chip-name">${p.name}</span>
      <span class="chip-pts">${p.total}p</span>
    </label>`;
  }).join('');
}

function toggleChartPlayer(name, on) {
  on ? chartSelectedPlayers.add(name) : chartSelectedPlayers.delete(name);
  saveChartSelection();
  renderChartPlayerList(document.getElementById('chart-search').value);
  const played = [...MATCHES].sort((a,b)=>new Date(a.t)-new Date(b.t)).filter(m=>results[m.id]);
  drawChart(played);
}

function filterChartPlayers() {
  renderChartPlayerList(document.getElementById('chart-search').value);
}

function chartSelectTop5() {
  chartSelectedPlayers = new Set(chartAllPlayers.slice(0, 5).map(p => p.name));
  if (currentUser) chartSelectedPlayers.add(currentUser);
  saveChartSelection();
  renderChartPlayerList(document.getElementById('chart-search').value);
  const played = [...MATCHES].sort((a,b)=>new Date(a.t)-new Date(b.t)).filter(m=>results[m.id]);
  drawChart(played);
}

function chartSelectAll() {
  chartSelectedPlayers = new Set(chartAllPlayers.map(p => p.name));
  saveChartSelection();
  renderChartPlayerList(document.getElementById('chart-search').value);
  const played = [...MATCHES].sort((a,b)=>new Date(a.t)-new Date(b.t)).filter(m=>results[m.id]);
  drawChart(played);
}

function chartSelectNone() {
  chartSelectedPlayers = new Set(currentUser ? [currentUser] : []);
  saveChartSelection();
  renderChartPlayerList(document.getElementById('chart-search').value);
  const played = [...MATCHES].sort((a,b)=>new Date(a.t)-new Date(b.t)).filter(m=>results[m.id]);
  drawChart(played);
}

function drawChart(played) {
  const selected = chartAllPlayers.filter(p => chartSelectedPlayers.has(p.name));
  const labels = played.map((_, i) => `P${i + 1}`);
  const matchLabels = played.map(m => `${m.h} – ${m.a} (${m.t ? m.t.slice(0,10) : ''})`);

  const datasets = selected.map(p => {
    const colorIdx = chartAllPlayers.indexOf(p);
    const color = PALETTE[colorIdx % PALETTE.length];
    const isMe = p.name === currentUser;
    return {
      label: p.name,
      data: p.pts,
      borderColor: color,
      backgroundColor: color + '18',
      borderWidth: isMe ? 3 : 1.5,
      pointRadius: isMe ? 4 : 2,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: false,
    };
  });

  document.getElementById('chart-sub').textContent =
    `${played.length} pelattua ottelua · ${selected.length}/${chartAllPlayers.length} pelaajaa näkyvissä`;

  const ctx = document.getElementById('pts-chart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e2d20',
          borderColor: '#2e7d4f',
          borderWidth: 1,
          titleColor: '#c9a227',
          bodyColor: '#e0e8e0',
          callbacks: {
            title: items => `Ottelu ${items[0].label}: ${matchLabels[items[0].dataIndex]}`,
            label: item => ` ${item.dataset.label}: ${item.raw} p`,
          },
        },
      },
      scales: {
        x: { ticks: { color: '#8aab8a', font: { size: 11 } }, grid: { color: '#2a3d2a' } },
        y: { beginAtZero: true, ticks: { color: '#8aab8a', font: { size: 11 } }, grid: { color: '#2a3d2a' } },
      },
    },
  });
}

let toastTimer;
function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  el.innerHTML = `<span style="font-size:15px">${icons[type]}</span> ${msg}`;
  el.className = `show toast-${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), type === 'error' ? 4000 : 2800);
}

/* ══════════════════════════════════════════
   KÄYNNISTYS
══════════════════════════════════════════ */

async function init() {
  if (currentUser) document.getElementById('username').value = currentUser;
  renderMatches();
  document.getElementById('lb-body').innerHTML = '<div class="empty-state">Ladataan…</div>';
  await loadResults();
  await loadAllPredictions();
  renderMatches();
  renderLeaderboard();
  setInterval(async () => {
    await loadResults();
    await loadAllPredictions();
    renderMatches();
    renderLeaderboard();
  }, 60_000);
  // Sulje profiili Escape-näppäimellä
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProfile();
  });
}

init();

/* ══════════════════════════════════════════
   PYYHKÄISYNAVIGOINTI
══════════════════════════════════════════ */
(function () {
  const TABS = ['picks', 'leaderboard', 'chart', 'admin'];
  let startX = 0, startY = 0, locked = false;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (locked) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    const activeTab = document.querySelector('.section.active')?.id?.replace('tab-', '');
    const idx = TABS.indexOf(activeTab);
    if (idx === -1) return;
    const nextIdx = dx < 0 ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= TABS.length) return;
    const nextTab = TABS[nextIdx];
    const btn = document.querySelector(`.nav-btn[onclick*="'${nextTab}'"]`);
    showTab(nextTab, btn);
    closeMenu();
    locked = true;
    setTimeout(() => { locked = false; }, 600);
  }, { passive: true });
})();
