// Auth helper: gestiona token y protege fetch
(function(){
  const API_BASE = 'http://localhost:5001';
  const TOKEN_KEY = 'ub_token';
  const REDIRECT_KEY = 'ub_post_login_redirect';

  function setToken(t){ localStorage.setItem(TOKEN_KEY, t || ''); }
  function getToken(){ return localStorage.getItem(TOKEN_KEY) || ''; }
  function clearToken(){ localStorage.removeItem(TOKEN_KEY); }
  function setPostLoginRedirect(url){ localStorage.setItem(REDIRECT_KEY, url || ''); }
  function getPostLoginRedirect(){ const u = localStorage.getItem(REDIRECT_KEY)||''; localStorage.removeItem(REDIRECT_KEY); return u; }
  function setUser(u){ try { localStorage.setItem('ub_user', JSON.stringify(u||{})); } catch{} }
  function getUser(){ try { return JSON.parse(localStorage.getItem('ub_user')||'{}'); } catch{ return {}; } }

  async function login(username, password){
    try {
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!resp.ok) throw new Error('Usuario o contraseña incorrectos');
      const data = await resp.json();
      if (!data?.token) throw new Error('Token no recibido');
      setToken(data.token);
      setUser(data.user || { username });
      return data;
    } catch (e){
      if ((e?.message||'').includes('Failed to fetch')) throw new Error('No se pudo conectar con el servidor');
      throw e;
    }
  }

  function logout(){ clearToken(); setUser(null); window.location.href = 'login.html'; }

  function requireAuth(){
    const t = getToken();
    if (!t){ setPostLoginRedirect(window.location.pathname.split('/').pop()); window.location.href = 'login.html'; }
  }

  // Monkey patch fetch para añadir Authorization
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init={}) => {
    try {
      const url = typeof input === 'string' ? input : (input?.url || '');
      if (url.startsWith(API_BASE)){
        const token = getToken();
        init.headers = Object.assign({}, init.headers || {});
        if (token) init.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {}
    return origFetch(input, init);
  };

  window.Auth = { login, logout, requireAuth, getToken, setPostLoginRedirect, getPostLoginRedirect, getUser };
})();


