// Auth helper: gestiona token y protege fetch para aplicación integrada - V3.0
(function(){
  // Configuración simple para aplicación integrada
  try {
    if (typeof window !== 'undefined') {
      window.CONFIG = window.CONFIG || {};
      window.CONFIG.API_BASE_URL = 'http://localhost:5001/api';
    }
  } catch {}
  const TOKEN_KEY = 'ub_token';
  const REDIRECT_KEY = 'ub_post_login_redirect';

  function setToken(t){ sessionStorage.setItem(TOKEN_KEY, t || ''); }
  function getToken(){ return sessionStorage.getItem(TOKEN_KEY) || ''; }
  function clearToken(){ sessionStorage.removeItem(TOKEN_KEY); }
  function setPostLoginRedirect(url){ sessionStorage.setItem(REDIRECT_KEY, url || ''); }
  function getPostLoginRedirect(){ const u = sessionStorage.getItem(REDIRECT_KEY)||''; sessionStorage.removeItem(REDIRECT_KEY); return u; }
  function setUser(u){ try { sessionStorage.setItem('ub_user', JSON.stringify(u||{})); } catch{} }
  function getUser(){ try { return JSON.parse(sessionStorage.getItem('ub_user')||'{}'); } catch{ return {}; } }

  async function login(username, password){
    try {
      // Usar CONFIG.API_BASE_URL para aplicación integrada
      const apiUrl = window.CONFIG?.API_BASE_URL || 'http://localhost:5001/api';
      console.log('🔍 DEBUG: Login URL:', `${apiUrl}/auth/login`);
      const resp = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!resp.ok) throw new Error('Usuario o contraseña incorrectos');
      const data = await resp.json();
      if (!data?.token) throw new Error('Token no recibido');
      setToken(data.token);
      setUser(data.user || { username });
      
      // Refrescar caché de dominios después del login exitoso (solo si está disponible)
      if (typeof refrescarCacheDominios === 'function') {
        refrescarCacheDominios().catch(e => console.log('Error refrescando caché:', e));
      } else {
        console.log('ℹ️ refrescarCacheDominios no está disponible (normal en login)');
      }
      
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

  // Monkey patch fetch para añadir Authorization automáticamente
  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init={}) => {
    try {
      let url = typeof input === 'string' ? input : (input?.url || '');
      const isApiCall = (url.startsWith('/api/') || url.includes('/api/'));
      
      console.log('🔍 Auth Debug V2.1 - URL original:', url, 'isApiCall:', isApiCall);
      
      if (isApiCall){
        const token = getToken();
        console.log('🔍 Auth Debug - Token exists:', !!token);
        init.headers = Object.assign({}, init.headers || {});
        if (token) {
          init.headers['Authorization'] = `Bearer ${token}`;
          console.log('✅ Auth Debug - Authorization header added');
        } else {
          console.log('❌ Auth Debug - No token available');
        }
        
        // CRITICAL FIX: Reescribir URLs relativas a absolutas del backend
        if (url.startsWith('/api/')) {
          const apiBaseUrl = window.CONFIG?.API_BASE_URL || 'http://localhost:5001/api';
          url = apiBaseUrl + url.substring(4); // Quitar '/api' y agregar al base URL
          console.log('🔧 Auth Debug - URL reescrita a:', url);
        }
      }
      
      const response = await origFetch(url, init);
      
      // Si es una petición API que devuelve 401, el token está expirado
      // Pero NO redirigir en páginas públicas (web-publica.html)
      if (isApiCall && response.status === 401) {
        const isPublicPage = window.location.pathname.includes('web-publica') || window.location.pathname.includes('detalle-publico');
        if (!isPublicPage) {
          clearToken();
          setUser(null);
          setPostLoginRedirect(window.location.pathname.split('/').pop());
          window.location.href = 'login.html';
        } else {
          console.log('⚠️ Auth Debug - 401 en página pública, no redirigiendo');
        }
        return response;
      }
      
      return response;
    } catch (e) {
      console.log('❌ Auth Debug - Error:', e);
      return origFetch(input, init);
    }
  };

  window.Auth = { login, logout, requireAuth, getToken, setPostLoginRedirect, getPostLoginRedirect, getUser };
})();


