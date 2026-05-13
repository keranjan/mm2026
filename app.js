/* ═══════════════════════════════════════════
   MM 2026 Tulosveikkaus – JavaScript
   ═══════════════════════════════════════════ */

/* ── Asetukset – muuta nämä ── */
const ADMIN_PIN    = '1234';
const SUPABASE_URL = 'https://oaoppcicnsnvjkbbjfda.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5my6qDEV3aFTxP8F8xVnlg_2mPaekjo';

/* ── Supabase API -apufunktio ── */
const api = (path, opts = {}) => fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  headers: {
    'apikey':        SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type':  'application/json',
    'Prefer':        opts.prefer || 'return=minimal',
    ...(opts.headers || {}),
  },
  ...opts,
});

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
  'Algeria':      'Algeria',       'Argentina':    'Argentiina',   'Australia':    'Australia',
  'Austria':      'Itävalta',      'Belgium':      'Belgia',       'Bosnia':       'Bosnia-Hertsegovina',
  'Brazil':       'Brasilia',      'Canada':       'Kanada',       'Cape Verde':   'Kap Verde',
  'Colombia':     'Kolumbia',      'Croatia':      'Kroatia',      'Czechia':      'Tšekki',
  'Curacao':      'Curaçao',       'DR Congo':     'Kongon dem. tasavalta', 'Ecuador': 'Ecuador',
  'Egypt':        'Egypti',        'England':      'Englanti',     'France':       'Ranska',
  'Germany':      'Saksa',         'Ghana':        'Ghana',        'Haiti':        'Haiti',
  'Iran':         'Iran',          'Iraq':         'Irak',         'Ivory Coast':  'Norsunluurannikko',
  'Japan':        'Japani',        'Jordan':       'Jordania',     'Mexico':       'Meksiko',
  'Morocco':      'Marokko',       'Netherlands':  'Alankomaat',   'New Zealand':  'Uusi-Seelanti',
  'Norway':       'Norja',         'Panama':       'Panama',       'Paraguay':     'Paraguay',
  'Portugal':     'Portugali',     'Qatar':        'Qatar',        'Saudi Arabia': 'Saudi-Arabia',
  'Scotland':     'Skotlanti',     'Senegal':      'Senegal',      'South Africa': 'Etelä-Afrikka',
  'South Korea':  'Etelä-Korea',   'Spain':        'Espanja',      'Sweden':       'Ruotsi',
  'Switzerland':  'Sveitsi',       'Tunisia':      'Tunisia',      'Turkiye':      'Turkki',
  'Uruguay':      'Uruguay',       'USA':          'Yhdysvallat',  'Uzbekistan':   'Uzbekistan',
};

function fi(name)   { return FI_NAMES[name] || name; }
function flag(name) { return FLAGS[name]    || '🏳️'; }

/* Kaikki 72 lohkovaiheen ottelua – aloitusajat UTC-muodossa */
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

function isLocked(m) { return Date.now() >= new Date(m.t).getTime(); }

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
  if (pw !== rw)             return 0;
  if (ph === rh && pa === ra) return 3;
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
   VEIKKAUKSET – logiikka ja HTML
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
  const open = MATCHES.filter(m => !isLocked(m));
  const done = open.filter(m => predDone(m.id)).length;
  const pct  = open.length ? Math.round(done / open.length * 100) : 100;
  document.getElementById('progress-fill').style.width   = pct + '%';
  document.getElementById('progress-label').textContent  = `${done} / ${open.length} avoimesta ottelusta veikattuna`;
  document.getElementById('progress-pct').textContent    = pct + '%';
}

function resultBadge(id) {
  const p = getPred(id), r = results[id];
  if (!r) return '';
  const pts   = calcPts(p.h, p.a, r.h, r.a);
  const score = `${r.h}–${r.a}`;
  if (pts === null) return `<div class="result-wrap"><span class="result-line rn">Tulos: ${score} · ei veikkausta</span></div>`;
  const cls = ['r0', 'r1', 'r2', 'r3'][pts];
  const lbl = ['Ei osunut · 0 p', 'Oikea voittaja +1 p', 'Oikea maaliero +2 p', 'Tarkka tulos! +3 p'][pts];
  return `<div class="result-wrap"><span class="result-line ${cls}">Tulos: ${score} · ${lbl}</span></div>`;
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
  return `<div class="match-card ${locked ? 'locked' : ''} ${cardExtraClass(m.id)}" id="mc-${m.id}">
    <div class="match-row">
      <div class="team-block">
        <span class="flag">${flag(m.h)}</span>
        <span class="team-name">${fi(m.h)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:4px;flex-shrink:0">
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
      <div class="team-block away">
        <span class="flag">${flag(m.a)}</span>
        <span class="team-name">${fi(m.a)}</span>
      </div>
    </div>
    <div class="match-meta">
      <span>Lohko ${m.g} &middot; ${fmtTime(m.t)}</span>
      ${locked ? '<span>&#128274; lukittu</span>' : ''}
    </div>
    ${resultBadge(m.id)}
  </div>`;
}

function renderMatches() {
  const sorted = [...MATCHES].sort((a, b) => new Date(a.t) - new Date(b.t));
  let html = '', lastDay = '';
  for (const m of sorted) {
    const day = dayKey(m.t);
    if (day !== lastDay) { html += `<div class="date-label">${fmtDate(m.t)}</div>`; lastDay = day; }
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

/* ── Tallenna veikkaukset ── */
async function savePredictions() {
  const name = document.getElementById('username').value.trim();
  if (!name) { toast('Kirjoita nimesi ensin'); return; }
  const open = MATCHES.filter(m => !isLocked(m));
  if (!open.some(m => predDone(m.id))) { toast('Syötä vähintään yksi tulos ensin'); return; }

  toast('Tallennetaan…');
  const rows = Object.entries(predictions)
    .filter(([, v]) => v.h !== null && v.a !== null)
    .map(([match_id, v]) => ({ username: name, match_id, home_goals: v.h, away_goals: v.a }));

  const res = await api('predictions', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates',
    body:   JSON.stringify(rows),
  });

  if (!res.ok) { toast('Virhe tallennuksessa :('); return; }

  currentUser = name;
  localStorage.setItem('wc26_me', name);
  await loadAllPredictions();
  renderLeaderboard();
  toast('Veikkaukset tallennettu ✓');
}

/* ══════════════════════════════════════════
   TULOSTAULUKKO
══════════════════════════════════════════ */

function calcUser(preds) {
  let total = 0, exact = 0, diff = 0, win = 0;
  for (const m of MATCHES) {
    const r = results[m.id]; if (!r) continue;
    const p = preds[m.id];   if (!p || p.h === null || p.a === null) continue;
    const pts = calcPts(p.h, p.a, r.h, r.a);
    total += pts;
    if (pts === 3) exact++; else if (pts === 2) diff++; else if (pts === 1) win++;
  }
  return { total, exact, diff, win };
}

function renderLeaderboard() {
  const ranked = Object.entries(users)
    .map(([name, data]) => ({ name, ...calcUser(data.predictions || {}) }))
    .sort((a, b) => b.total - a.total || b.exact - a.exact || b.diff - a.diff);
  const medals = ['🥇', '🥈', '🥉'];
  const html = ranked.length
    ? ranked.map((u, i) => `<div class="lb-entry${u.name === currentUser ? ' me' : ''}">
        <div class="lb-rank">${i < 3 ? medals[i] : i + 1}</div>
        <div class="lb-name">${u.name}${u.name === currentUser ? ' <span style="font-size:11px;color:var(--text-muted)">(sinä)</span>' : ''}</div>
        <div class="lb-breakdown">${u.exact} / ${u.diff} / ${u.win}</div>
        <div class="lb-pts">${u.total}</div>
      </div>`).join('')
    : '<div class="empty-state">Ei vielä pelaajia – tallenna veikkauksesi näkyäksesi tässä.</div>';
  document.getElementById('lb-body').innerHTML = html;
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
  toast('Tulos tallennettu');
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
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
  if (tab === 'leaderboard') renderLeaderboard();
  if (tab === 'admin' && adminOpen) renderAdmin();
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
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
  // Päivitä data ja lukitse ottelut automaattisesti minuutin välein
  setInterval(async () => {
    await loadResults();
    await loadAllPredictions();
    renderMatches();
    renderLeaderboard();
  }, 60_000);
}

init();
