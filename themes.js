/* ============================================================
   NEXUS - Estilos base / Reset / Variáveis (main.css)
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

/* Variáveis padrão (sobrescritas pelo tema) */
:root {
  --bg: #09090f;
  --surface: #0f0f1a;
  --surface2: #13131f;
  --border: #1e1e30;
  --text: #e2e8f0;
  --text-muted: #64748b;
  --text-dim: #94a3b8;
  --accent: #8b5cf6;
  --accent2: #a855f7;
  --positive: #10b981;
  --negative: #ef4444;
  --warning: #f59e0b;
  --info: #06b6d4;
  --radius: 12px;
  --font: 'Syne', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --sidebar-w: 240px;
  --topbar-h: 58px;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
  line-height: 1.5;
  transition: background 0.3s, color 0.3s;
}
img { max-width: 100%; display: block; }
button { cursor: pointer; font-family: var(--font); }
input, select, textarea { font-family: var(--font); }
a { color: var(--accent); text-decoration: none; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--surface2); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* ── LAYOUT PRINCIPAL ────────────────────────────────────── */
#app-screen { display: flex; min-height: 100vh; }

/* Sidebar */
.sidebar {
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  z-index: 50;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-mark {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.logo-text {
  font-size: 18px; font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.sidebar-nav { padding: 16px 12px; flex: 1; }
.nav-section { margin-bottom: 24px; }
.nav-section-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 8px; margin-bottom: 8px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  color: var(--text-dim);
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: none; background: none;
  width: 100%; text-align: left;
}
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item.active { background: var(--accent)18; color: var(--accent); font-weight: 700; }
.nav-item.active::before { content: ''; display: block; }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-badge {
  margin-left: auto;
  background: var(--accent);
  color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 10px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}
.user-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px;
  border-radius: var(--radius);
  background: var(--surface2);
  cursor: pointer;
  transition: background 0.15s;
}
.user-card:hover { background: var(--border); }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.user-info { flex: 1; overflow: hidden; }
.user-name-text { font-size: 13px; font-weight: 600; truncate: ellipsis; }
.user-email-text { font-size: 11px; color: var(--text-muted); }

/* Main content */
.main-content {
  margin-left: var(--sidebar-w);
  flex: 1;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Topbar */
.topbar {
  height: var(--topbar-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  position: sticky; top: 0; z-index: 40;
  backdrop-filter: blur(12px);
}
.topbar-title { font-size: 16px; font-weight: 700; flex: 1; }
.topbar-actions { display: flex; align-items: center; gap: 8px; }

/* Page sections */
.page-section { display: none; padding: 24px; }
.page-section.active { display: block; }

/* ── GRID SISTEMA ────────────────────────────────────────── */
.grid { display: grid; gap: 16px; }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-1 { grid-template-columns: 1fr; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-4 { grid-column: span 4; }

/* ── CARDS ───────────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.3;
}
.card-hover { transition: transform 0.15s, box-shadow 0.15s; }
.card-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.card-title {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-muted);
}
.card-value {
  font-size: 28px; font-weight: 800;
  letter-spacing: -1px;
  font-family: var(--font-mono);
}
.card-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

/* Summary stats */
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  position: relative; overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  background: var(--stat-color, var(--accent));
}
.stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
.stat-value { font-size: 22px; font-weight: 800; font-family: var(--font-mono); letter-spacing: -0.5px; }
.stat-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.15; }

/* ── BOTÕES ──────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px; font-weight: 600;
  border: none; cursor: pointer;
  transition: all 0.15s;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--surface2); color: var(--text); }
.btn-danger { background: var(--negative)22; color: var(--negative); border: 1px solid var(--negative)44; }
.btn-danger:hover { background: var(--negative)33; }
.btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 6px; border: none; cursor: pointer; font-family: var(--font); font-weight: 600; transition: all 0.15s; }
.btn-icon {
  background: none; border: none; color: var(--text-muted);
  font-size: 14px; padding: 4px 6px; border-radius: 6px;
  cursor: pointer; transition: all 0.15s;
}
.btn-icon:hover { background: var(--surface2); color: var(--text); }

/* ── FORMULÁRIOS ─────────────────────────────────────────── */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.form-input {
  width: 100%; padding: 9px 12px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text); font-size: 13px;
  transition: border-color 0.15s;
  outline: none;
}
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent)15; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── MODAIS ──────────────────────────────────────────────── */
.modal-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  align-items: center; justify-content: center;
  padding: 20px;
}
.modal-overlay.active { display: flex; }
.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  width: 100%; max-width: 480px;
  max-height: 90vh; overflow-y: auto;
  position: relative;
  animation: modalIn 0.2s ease;
}
.modal-lg { max-width: 720px; }
.modal-xl { max-width: 960px; }
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.modal-title { font-size: 17px; font-weight: 700; }
.modal-close {
  background: none; border: none; color: var(--text-muted);
  font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
  line-height: 1;
}
.modal-close:hover { background: var(--surface2); color: var(--text); }
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

/* ── LISTAS ──────────────────────────────────────────────── */
.tx-item, .investment-item, .saving-item, .goal-item, .debt-item, .bill-item, .cat-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  margin-bottom: 8px;
  background: var(--surface2);
  transition: all 0.15s;
}
.tx-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.tx-info { flex: 1; min-width: 0; }
.tx-desc { font-size: 13px; font-weight: 600; }
.tx-cat { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.tx-amount { font-size: 14px; font-weight: 700; font-family: var(--font-mono); white-space: nowrap; }

/* Investimentos */
.investment-item { gap: 12px; }
.inv-ticker { font-family: var(--font-mono); font-size: 14px; font-weight: 700; min-width: 70px; color: var(--accent); }
.inv-info { flex: 1; }
.inv-name { font-size: 12px; color: var(--text-muted); }
.inv-type { font-size: 10px; }
.inv-qty { font-size: 12px; color: var(--text-dim); min-width: 80px; }
.inv-price, .inv-total { text-align: right; min-width: 90px; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }

/* Tickers */
.ticker-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: var(--font-mono); font-size: 12px;
  cursor: pointer; transition: all 0.15s;
  margin: 3px;
}
.ticker-chip:hover { border-color: var(--accent); background: var(--accent)15; }
.ticker-chip.owned { border-color: var(--positive)80; background: var(--positive)12; }
.chip-price { font-size: 10px; }

/* Progress */
.progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin: 8px 0; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

/* Categories */
.cat-item { padding: 10px 12px; }
.cat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.cat-name { flex: 1; font-size: 13px; font-weight: 600; }

/* Calendar */
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
.cal-wd { text-align: center; font-size: 10px; font-weight: 700; color: var(--text-muted); padding: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.cal-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-day {
  aspect-ratio: 1;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s;
  font-size: 12px; font-weight: 600;
  gap: 2px; position: relative;
}
.cal-day:hover { border-color: var(--accent); }
.cal-day.today { border-color: var(--accent); background: var(--accent)15; color: var(--accent); }
.cal-day.has-bill { }
.cal-day.empty { background: transparent; border-color: transparent; cursor: default; }
.cal-day-num { font-size: 12px; }
.cal-bill-dot { width: 5px; height: 5px; border-radius: 50%; }

/* Bill list */
.bill-item { padding: 10px 12px; }
.bill-day { font-size: 18px; font-weight: 800; font-family: var(--font-mono); min-width: 30px; }
.bill-icon { font-size: 16px; }
.bill-name { flex: 1; font-size: 13px; font-weight: 500; }
.bill-amount { font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
.bill-today { border-color: var(--warning); background: var(--warning)10; }
.bill-past { opacity: 0.5; }

/* Saving / Goal / Debt items */
.saving-icon, .goal-icon, .debt-icon {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.saving-info, .goal-header > div { flex: 1; min-width: 0; }
.saving-name, .goal-name, .debt-name { font-size: 13px; font-weight: 700; }
.saving-amt, .saving-pct { font-size: 12px; color: var(--text-muted); }
.saving-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.goal-deadline, .debt-sub { font-size: 11px; color: var(--text-muted); }
.goal-values { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
.goal-item.completed { opacity: 0.7; }
.goal-header { display: flex; align-items: flex-start; gap: 10px; width: 100%; margin-bottom: 8px; }
.debt-header { display: flex; align-items: flex-start; gap: 10px; width: 100%; margin-bottom: 8px; }
.debt-amounts { text-align: right; margin-left: auto; }
.debt-footer { display: flex; justify-content: space-between; align-items: center; }
.debt-item, .saving-item, .goal-item { flex-direction: column; align-items: stretch; }

/* ── ESTADO VAZIO ────────────────────────────────────────── */
.empty-state {
  text-align: center; padding: 40px 20px;
  color: var(--text-muted); font-size: 13px;
}

/* ── CORES SEMÂNTICAS ────────────────────────────────────── */
.positive { color: var(--positive); }
.negative { color: var(--negative); }
.warning-text { color: var(--warning); }
.accent { color: var(--accent); }
.mt-8 { margin-top: 8px; }

/* ── LOADER ──────────────────────────────────────────────── */
#app-loader {
  position: fixed; inset: 0;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; flex-direction: column; gap: 16px;
}
.loader-ring {
  width: 48px; height: 48px; border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TEMAS LIGHT ─────────────────────────────────────────── */
body.theme-light {
  --surface-shadow: rgba(0,0,0,0.06);
}
body.theme-light .card,
body.theme-light .stat-card { box-shadow: 0 1px 4px var(--surface-shadow); }

/* ── TOAST ───────────────────────────────────────────────── */
.nexus-toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9000;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  font-size: 13px; font-weight: 500;
  transform: translateY(20px); opacity: 0;
  transition: all 0.25s ease;
  max-width: 360px;
}
.nexus-toast.show { transform: translateY(0); opacity: 1; }
.toast-success .toast-icon { color: var(--positive); }
.toast-error .toast-icon   { color: var(--negative); }
.toast-info .toast-icon    { color: var(--info); }
.toast-icon { font-size: 16px; font-weight: 700; }

/* ── BADGE ───────────────────────────────────────────────── */
.badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.badge-sm { padding: 1px 6px; font-size: 10px; }
.badge-stock { background: var(--info)22; color: var(--info); border: 1px solid var(--info)44; }
.badge-fii { background: var(--positive)22; color: var(--positive); border: 1px solid var(--positive)44; }
.badge-custom { background: var(--warning)22; color: var(--warning); border: 1px solid var(--warning)44; }

/* ── RESPONSIVO ──────────────────────────────────────────── */
@media (max-width: 1100px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  :root { --sidebar-w: 0px; }
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .col-span-2, .col-span-3, .col-span-4 { grid-column: span 1; }
}

/* ── ANIMATION ENTRADA ───────────────────────────────────── */
.page-section.active > * {
  animation: fadeUp 0.3s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
