// ============================================================
// NEXUS - Autenticação (auth.js)
// ============================================================

let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(
      NEXUS_CONFIG.supabase.url,
      NEXUS_CONFIG.supabase.anonKey
    );
  }
  return supabaseClient;
}

// Usuário atual
let currentUser = null;

function getCurrentUser() { return currentUser; }

// Inicializar autenticação
async function initAuth() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();

  if (session?.user) {
    currentUser = session.user;
    return true;
  }
  return false;
}

// Login com email/senha
async function signIn(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  return data.user;
}

// Cadastro
async function signUp(email, password, name) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) throw error;
  return data;
}

// Logout
async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
  currentUser = null;
  window.location.reload();
}

// Escutar mudanças de auth
function onAuthChange(callback) {
  const sb = getSupabase();
  sb.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    callback(event, session);
  });
}

// Obter nome do usuário
function getUserName() {
  if (!currentUser) return 'Usuário';
  return currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuário';
}

function getUserEmail() {
  return currentUser?.email || '';
}

function getUserInitials() {
  const name = getUserName();
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
