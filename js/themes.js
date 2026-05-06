// ============================================================
// NEXUS - Temas + Fontes (themes.js) v2
// ============================================================

const NEXUS_FONTS = {
  'syne':        { label: 'Syne',         css: "'Syne', sans-serif",        mono: "'Space Mono', monospace" },
  'inter':       { label: 'Inter',        css: "'Inter', sans-serif",        mono: "'Roboto Mono', monospace" },
  'poppins':     { label: 'Poppins',      css: "'Poppins', sans-serif",      mono: "'Roboto Mono', monospace" },
  'rajdhani':    { label: 'Rajdhani',     css: "'Rajdhani', sans-serif",     mono: "'Space Mono', monospace" },
  'outfit':      { label: 'Outfit',       css: "'Outfit', sans-serif",       mono: "'JetBrains Mono', monospace" },
  'dm-sans':     { label: 'DM Sans',      css: "'DM Sans', sans-serif",      mono: "'Roboto Mono', monospace" },
  'nunito':      { label: 'Nunito',       css: "'Nunito', sans-serif",       mono: "'JetBrains Mono', monospace" },
  'jetbrains':   { label: 'JetBrains',    css: "'JetBrains Mono', monospace", mono: "'JetBrains Mono', monospace" },
};

const NEXUS_THEMES = {
  'nexus-dark':    { label: '🌌 Nexus Dark',    dark:true,  '--bg':'#09090f','--surface':'#0f0f1a','--surface2':'#13131f','--border':'#1e1e30','--text':'#e2e8f0','--text-muted':'#64748b','--text-dim':'#94a3b8','--accent':'#8b5cf6','--accent2':'#a855f7','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
  'midnight-blue': { label: '🌊 Midnight Blue', dark:true,  '--bg':'#060d1a','--surface':'#0a1628','--surface2':'#0e1f36','--border':'#1a3050','--text':'#e0eeff','--text-muted':'#4a6080','--text-dim':'#7090b0','--accent':'#3b82f6','--accent2':'#60a5fa','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'12px' },
  'emerald-night': { label: '🌿 Emerald Night', dark:true,  '--bg':'#050f0a','--surface':'#091a10','--surface2':'#0d2218','--border':'#153320','--text':'#d1fae5','--text-muted':'#3d6b50','--text-dim':'#6ba87a','--accent':'#10b981','--accent2':'#34d399','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
  'rose-noir':     { label: '🌹 Rose Noir',     dark:true,  '--bg':'#0f050a','--surface':'#1a0812','--surface2':'#220c18','--border':'#35101f','--text':'#ffe4ef','--text-muted':'#6b3050','--text-dim':'#a06070','--accent':'#ec4899','--accent2':'#f472b6','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'12px' },
  'amber-dusk':    { label: '🔥 Amber Dusk',    dark:true,  '--bg':'#0f0900','--surface':'#1a1000','--surface2':'#231800','--border':'#352500','--text':'#fff3d0','--text-muted':'#6b4f00','--text-dim':'#a07830','--accent':'#f59e0b','--accent2':'#fbbf24','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
  'cyber-red':     { label: '⚡ Cyber Red',     dark:true,  '--bg':'#0f0000','--surface':'#1a0000','--surface2':'#220000','--border':'#350000','--text':'#ffe0e0','--text-muted':'#6b0000','--text-dim':'#a04040','--accent':'#ef4444','--accent2':'#f87171','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'12px' },
  'neon-cyan':     { label: '🔵 Neon Cyan',     dark:true,  '--bg':'#000f12','--surface':'#001a20','--surface2':'#00222a','--border':'#003545','--text':'#cffafe','--text-muted':'#005570','--text-dim':'#0080a0','--accent':'#06b6d4','--accent2':'#22d3ee','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'12px' },
  'slate-pro':     { label: '🪨 Slate Pro',     dark:true,  '--bg':'#0a0c10','--surface':'#10141c','--surface2':'#161b26','--border':'#1e2535','--text':'#e2e8f0','--text-muted':'#4a5568','--text-dim':'#718096','--accent':'#667eea','--accent2':'#764ba2','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'8px' },
  'monokai':       { label: '🎨 Monokai',       dark:true,  '--bg':'#1a1a2e','--surface':'#16213e','--surface2':'#0f3460','--border':'#1f4080','--text':'#f8f8f2','--text-muted':'#44475a','--text-dim':'#6272a4','--accent':'#ff79c6','--accent2':'#bd93f9','--positive':'#50fa7b','--negative':'#ff5555','--warning':'#f1fa8c','--info':'#8be9fd','--radius':'10px' },
  'forest':        { label: '🌲 Forest',        dark:true,  '--bg':'#0a0f08','--surface':'#111a0e','--surface2':'#172214','--border':'#1f3018','--text':'#e8f5e0','--text-muted':'#4a6040','--text-dim':'#7a9a60','--accent':'#84cc16','--accent2':'#a3e635','--positive':'#22c55e','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
  'clean-light':   { label: '☀️ Clean Light',   dark:false, '--bg':'#f8fafc','--surface':'#ffffff','--surface2':'#f1f5f9','--border':'#e2e8f0','--text':'#0f172a','--text-muted':'#94a3b8','--text-dim':'#64748b','--accent':'#8b5cf6','--accent2':'#a855f7','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
  'sky-blue':      { label: '🌤️ Sky Blue',      dark:false, '--bg':'#eff6ff','--surface':'#ffffff','--surface2':'#dbeafe','--border':'#bfdbfe','--text':'#1e3a5f','--text-muted':'#93c5fd','--text-dim':'#60a5fa','--accent':'#3b82f6','--accent2':'#2563eb','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'14px' },
  'mint-fresh':    { label: '🌱 Mint Fresh',    dark:false, '--bg':'#f0fdf4','--surface':'#ffffff','--surface2':'#dcfce7','--border':'#bbf7d0','--text':'#14532d','--text-muted':'#86efac','--text-dim':'#4ade80','--accent':'#22c55e','--accent2':'#16a34a','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'14px' },
  'rose-gold':     { label: '💗 Rose Gold',     dark:false, '--bg':'#fff1f2','--surface':'#ffffff','--surface2':'#ffe4e6','--border':'#fecdd3','--text':'#881337','--text-muted':'#fda4af','--text-dim':'#fb7185','--accent':'#e11d48','--accent2':'#be123c','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'16px' },
  'lavender':      { label: '💜 Lavender',      dark:false, '--bg':'#faf5ff','--surface':'#ffffff','--surface2':'#f3e8ff','--border':'#e9d5ff','--text':'#4c1d95','--text-muted':'#c4b5fd','--text-dim':'#a78bfa','--accent':'#7c3aed','--accent2':'#6d28d9','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'16px' },
  'graphite':      { label: '🩶 Graphite',      dark:false, '--bg':'#f9fafb','--surface':'#ffffff','--surface2':'#f3f4f6','--border':'#e5e7eb','--text':'#111827','--text-muted':'#9ca3af','--text-dim':'#6b7280','--accent':'#374151','--accent2':'#1f2937','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#3b82f6','--radius':'8px' },
  'peach':         { label: '🍑 Peach',         dark:false, '--bg':'#fff7ed','--surface':'#ffffff','--surface2':'#ffedd5','--border':'#fed7aa','--text':'#7c2d12','--text-muted':'#fdba74','--text-dim':'#fb923c','--accent':'#ea580c','--accent2':'#c2410c','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'16px' },
  'ocean':         { label: '🌊 Ocean',         dark:false, '--bg':'#ecfeff','--surface':'#ffffff','--surface2':'#cffafe','--border':'#a5f3fc','--text':'#164e63','--text-muted':'#67e8f9','--text-dim':'#22d3ee','--accent':'#0891b2','--accent2':'#0e7490','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#8b5cf6','--radius':'14px' },
  'sand':          { label: '🏜️ Sand',          dark:false, '--bg':'#fefce8','--surface':'#ffffff','--surface2':'#fef9c3','--border':'#fde68a','--text':'#713f12','--text-muted':'#fcd34d','--text-dim':'#f59e0b','--accent':'#d97706','--accent2':'#b45309','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'10px' },
  'custom':        { label: '🎨 Personalizado', dark:true,  '--bg':'#09090f','--surface':'#0f0f1a','--surface2':'#13131f','--border':'#1e1e30','--text':'#e2e8f0','--text-muted':'#64748b','--text-dim':'#94a3b8','--accent':'#8b5cf6','--accent2':'#a855f7','--positive':'#10b981','--negative':'#ef4444','--warning':'#f59e0b','--info':'#06b6d4','--radius':'12px' },
};

let currentThemeName = 'nexus-dark';
let currentFontName = 'syne';
let customThemeData = {};

function applyTheme(name, custom = {}, fontName = null) {
  const base = NEXUS_THEMES[name] || NEXUS_THEMES['nexus-dark'];
  const theme = { ...base, ...custom };
  const root = document.documentElement;
  Object.entries(theme).forEach(([k,v]) => { if(k.startsWith('--')) root.style.setProperty(k,v); });
  document.body.classList.toggle('theme-light', !theme.dark);
  document.body.classList.toggle('theme-dark', !!theme.dark);
  currentThemeName = name;
  customThemeData = custom;

  if (fontName) {
    currentFontName = fontName;
    const font = NEXUS_FONTS[fontName] || NEXUS_FONTS['syne'];
    root.style.setProperty('--font', font.css);
    root.style.setProperty('--font-mono', font.mono);
  }

  localStorage.setItem('nexus_theme', name);
  localStorage.setItem('nexus_theme_custom', JSON.stringify(custom));
  localStorage.setItem('nexus_font', fontName || currentFontName);
}

async function loadTheme() {
  try {
    const settings = await DB.getSettings();
    const custom = settings.theme_custom || {};
    const font = custom._font || localStorage.getItem('nexus_font') || 'syne';
    applyTheme(settings.theme_name || 'nexus-dark', custom, font);
  } catch {
    const t = localStorage.getItem('nexus_theme') || 'nexus-dark';
    const c = JSON.parse(localStorage.getItem('nexus_theme_custom') || '{}');
    const f = localStorage.getItem('nexus_font') || 'syne';
    applyTheme(t, c, f);
  }
}

async function saveTheme(name, custom = {}, fontName = null) {
  applyTheme(name, custom, fontName);
  const saveData = { ...custom, _font: fontName || currentFontName };
  try { await DB.saveSettings(name, saveData); } catch {}
}

function renderThemeSelector() {
  const container = document.getElementById('theme-grid');
  if (!container) return;
  container.innerHTML = Object.entries(NEXUS_THEMES).map(([key, theme]) => `
    <div class="theme-card ${currentThemeName===key?'active':''}" onclick="selectTheme('${key}')">
      <div class="theme-preview" style="background:${theme['--bg']};border:2px solid ${currentThemeName===key?theme['--accent']:theme['--border']};border-radius:8px;padding:7px;cursor:pointer;">
        <div style="background:${theme['--surface']};border-radius:4px;padding:5px;margin-bottom:3px;">
          <div style="width:40%;height:5px;background:${theme['--accent']};border-radius:3px;margin-bottom:3px;"></div>
          <div style="width:70%;height:3px;background:${theme['--border']};border-radius:2px;"></div>
        </div>
        <div style="display:flex;gap:3px;">
          <div style="flex:1;background:${theme['--surface']};border-radius:3px;height:16px;"></div>
          <div style="flex:1;background:${theme['--surface']};border-radius:3px;height:16px;"></div>
        </div>
      </div>
      <div style="font-size:10px;margin-top:5px;color:var(--text-dim);text-align:center;">${theme.label}</div>
    </div>
  `).join('');
}

function renderFontSelector() {
  const container = document.getElementById('font-grid');
  if (!container) return;
  container.innerHTML = Object.entries(NEXUS_FONTS).map(([key, font]) => `
    <div class="font-card ${currentFontName===key?'active':''}" onclick="selectFont('${key}')">
      <div class="font-name" style="font-family:${font.css}">${font.label}</div>
      <div class="font-sample" style="font-family:${font.css}">R$ 1.234,56</div>
    </div>
  `).join('');
}

function selectTheme(name) {
  if (name === 'custom') { openModal('modal-theme-editor'); renderThemeEditor(); return; }
  saveTheme(name, {}, currentFontName);
  renderThemeSelector();
  showToast('Tema aplicado!');
}

function selectFont(name) {
  currentFontName = name;
  applyTheme(currentThemeName, customThemeData, name);
  renderFontSelector();
  saveTheme(currentThemeName, customThemeData, name);
  showToast('Fonte aplicada!');
}

const THEME_EDITOR_FIELDS = [
  { key:'--bg', label:'Fundo' }, { key:'--surface', label:'Cards' },
  { key:'--surface2', label:'Cards secundários' }, { key:'--border', label:'Bordas' },
  { key:'--text', label:'Texto' }, { key:'--text-muted', label:'Texto suave' },
  { key:'--accent', label:'Destaque' }, { key:'--accent2', label:'Destaque 2' },
  { key:'--positive', label:'Positivo' }, { key:'--negative', label:'Negativo' },
  { key:'--warning', label:'Aviso' }, { key:'--info', label:'Info' },
];

function renderThemeEditor() {
  const container = document.getElementById('theme-editor-fields');
  if (!container) return;
  const current = { ...NEXUS_THEMES['custom'], ...customThemeData };
  container.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">` +
    THEME_EDITOR_FIELDS.map(f => `
      <div class="editor-field">
        <label>${f.label}</label>
        <div style="display:flex;gap:6px;align-items:center;">
          <input type="color" value="${current[f.key]||'#000000'}" oninput="updateCustomTheme('${f.key}',this.value)" style="width:36px;height:30px;border:none;border-radius:5px;cursor:pointer;background:transparent;">
          <input type="text" value="${current[f.key]||'#000000'}" oninput="updateCustomTheme('${f.key}',this.value)" class="form-input" style="flex:1;font-family:var(--font-mono);font-size:11px;padding:5px 8px;">
        </div>
      </div>
    `).join('') + `</div>`;
}

function updateCustomTheme(key, value) {
  customThemeData[key] = value;
  applyTheme('custom', customThemeData, currentFontName);
}

function saveCustomTheme() {
  saveTheme('custom', customThemeData, currentFontName);
  closeModal('modal-theme-editor');
  showToast('Tema personalizado salvo!');
}
