/* ============================================================
   NEXUS - Componentes Visuais (components.css)
   ============================================================ */

/* ── AUTH SCREEN ─────────────────────────────────────────── */
#auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
#auth-screen::before {
  content: '';
  position: fixed;
  top: -30%; left: -20%;
  width: 60%; height: 60%;
  background: radial-gradient(circle, var(--accent)15 0%, transparent 60%);
  pointer-events: none;
}
#auth-screen::after {
  content: '';
  position: fixed;
  bottom: -30%; right: -20%;
  width: 50%; height: 50%;
  background: radial-gradient(circle, var(--accent2)10 0%, transparent 60%);
  pointer-events: none;
}

.auth-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
}
.auth-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  justify-content: center;
}
.auth-logo-mark {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
}
.auth-logo-text {
  font-size: 28px; font-weight: 800; letter-spacing: -1px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.auth-subtitle {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 28px;
  margin-top: -20px;
}

.auth-tabs {
  display: flex;
  background: var(--surface2);
  border-radius: 8px;
  padding: 3px;
  margin-bottom: 24px;
}
.auth-tab {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font);
}
.auth-tab.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

/* ── TOPBAR SEARCH ───────────────────────────────────────── */
.topbar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  color: var(--text-muted);
  min-width: 220px;
}
.topbar-search input {
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 13px;
  font-family: var(--font);
  width: 100%;
}

/* ── INVESTMENT SECTION ──────────────────────────────────── */
.asset-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.asset-search-bar input {
  flex: 1;
}
.asset-type-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
.asset-type-tab {
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface2);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
}
.asset-type-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.tickers-wrapper {
  max-height: 140px;
  overflow-y: auto;
  padding: 4px;
}

.inv-summary {
  display: flex;
  gap: 16px;
  font-size: 13px;
  padding: 12px;
  background: var(--surface2);
  border-radius: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

/* ── THEME SELECTOR ──────────────────────────────────────── */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;
}
.theme-card { cursor: pointer; }
.theme-card.active .theme-preview {
  box-shadow: 0 0 0 2px var(--accent);
}

.editor-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.editor-field label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── SUMMARY TOTAL ───────────────────────────────────────── */
.patrimony-card {
  background: linear-gradient(135deg, var(--accent)20, var(--accent2)10);
  border: 1px solid var(--accent)40;
}
.patrimony-card .card-value {
  font-size: 36px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── SEÇÃO DE INVESTIMENTOS ──────────────────────────────── */
.inv-refresh-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 3px 8px;
  border-radius: 20px;
  border: 1px solid var(--border);
}
.inv-refresh-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--positive);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ── DIVISOR ─────────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}

/* ── OVERFLOW SCROLL ─────────────────────────────────────── */
.scroll-x { overflow-x: auto; }
.scroll-y { overflow-y: auto; }
