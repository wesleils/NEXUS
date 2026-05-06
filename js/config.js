// ============================================================
// NEXUS - Configuração do Supabase
// ============================================================

const NEXUS_CONFIG = {
  supabase: {
    url: 'https://yahssmxsdkhcmwwaukcd.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHNzbXhzZGtoY213d2F1a2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTkzMDgsImV4cCI6MjA5MzU5NTMwOH0.nuvEUOMXySeHHi68xoPjVQHkFfxYd8U8I3sopFyCb_k'
  },
  brapi: {
    // BRAPI - API gratuita brasileira para ações e FIIs da B3
    // Limite: 15 req/min no plano gratuito, delay ~15min nas cotações
    baseUrl: 'https://brapi.dev/api',
    token: '' // opcional no plano gratuito
  },
  currency: 'BRL',
  locale: 'pt-BR'
};

// Formatar moeda
function formatCurrency(value) {
  return new Intl.NumberFormat(NEXUS_CONFIG.locale, {
    style: 'currency',
    currency: NEXUS_CONFIG.currency
  }).format(value || 0);
}

// Formatar data
function formatDate(date) {
  if (!date) return '';
  return new Date(date + 'T00:00:00').toLocaleDateString(NEXUS_CONFIG.locale);
}

// Formatar percentual
function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${(value || 0).toFixed(2)}%`;
}

// Gerar ID único simples
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Toast de notificação
function showToast(message, type = 'success') {
  const existing = document.querySelector('.nexus-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `nexus-toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Modal genérico
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}

// Fechar modal clicando fora
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
