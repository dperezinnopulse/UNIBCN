/*
 * Cabecera reutilizable para todas las páginas.
 * Este script define la plantilla HTML de la cabecera, que incluye el selector de idioma,
 * campana de notificaciones y menú de usuario con selector de Unidad Gestora (UG).
 * También expone una función global `loadHeader(containerId)` que inserta la cabecera
 * en el elemento indicado y configura su funcionamiento (mostrar/ocultar menús y
 * aplicar filtros de UG a los elementos con el atributo `data-ug`).
 */

(function(){
  // Plantilla HTML de la cabecera y los menús asociados
  const headerHTML = `
<header class="d-flex justify-content-end align-items-center gap-3 p-3">
  <a class="text-decoration-none" id="helpLink" title="Ayuda" href="#" target="_blank">
    <i class="bi bi-question-circle fs-5 text-secondary"></i>
  </a>
  <div id="weglot_here"></div>
  <a class="position-relative" id="bellWrap" href="#">
    <i class="bi bi-bell fs-5 text-secondary"></i>
    <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle d-none" id="bellBadge"></span>
  </a>
  <i class="bi bi-person-circle fs-4 text-secondary" id="userIcon" style="cursor:pointer"></i>
  <span class="text-muted" id="userLabel">Usuario</span>
</header>
<!-- Menú del usuario -->
<div class="usermenu d-none" id="userMenuOverlay">
  <div class="usermenu-card">
    <button class="userItem" data-action="editar">Editar Datos Usuario</button>
    <button class="userItem" data-action="modulo">Cambiar Módulo</button>
    <div class="userItem with-sub" id="openUG">Unidad Gestora: <span id="ugActual">Todas</span></div>
    <div class="userItem with-sub" id="openAdmin">Administración <i class="bi bi-chevron-right"></i></div>
    <button class="userItem" data-action="logout">Cerrar Sesión</button>
  </div>
</div>
<!-- Submenú de unidades gestoras -->
<div class="usersubmenu d-none" id="ugSubmenu">
  <button class="ugOption" data-ug="Todas"><span class="chip"></span>Todas</button>
  <button class="ugOption" data-ug="IDP"><span class="chip"></span>IDP</button>
  <button class="ugOption" data-ug="SAE"><span class="chip"></span>SAE</button>
  <button class="ugOption" data-ug="CRAI"><span class="chip"></span>CRAI</button>
  <button class="ugOption" data-ug="SL" disabled><span class="chip"></span>SL</button>
</div>
<!-- Submenú de administración -->
<div class="usersubmenu d-none" id="adminSubmenu">
  <button class="ugOption" data-admin="usuarios"><span class="chip"></span>Usuarios</button>
  <button class="ugOption" data-admin="roles"><span class="chip"></span>Roles</button>
</div>`;

  // Bandera para habilitar/deshabilitar Weglot (desactivado para mejorar rendimiento)
  const ENABLE_WEGLOT = false;

  // Función para inicializar Weglot
  function initializeWeglot() {
    if (!ENABLE_WEGLOT) return; // Desactivado por rendimiento
    if (!window.Weglot && !document.querySelector('script[src*="weglot.min.js"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.weglot.com/weglot.min.js';
      script.onload = function() {
        Weglot.initialize({
          api_key: 'wg_b2253dca073d4e70fd4476374ae59e149'
        });
      };
      document.head.appendChild(script);
    } else if (window.Weglot) {
      Weglot.initialize({
        api_key: 'wg_b2253dca073d4e70fd4476374ae59e149'
      });
    }
  }

  window.loadHeader = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = headerHTML;
    // Inicializar Weglot (opcional)
    setTimeout(initializeWeglot, 100);
    // Lógica de menús y selector de UG
    (function(){
      const $ = (s, r=document) => r.querySelector(s);
      // Resolver URL de ayuda según la página
      try {
        const path = (location.pathname || '').toLowerCase();
        const help = $('#helpLink');
        if (help) {
          let manual = '/actividades/manual/index.html';
          if (path.endsWith('/index.html')) manual = '/actividades/manual/crear-actividad.html';
          else if (path.endsWith('/historico.html')) manual = '/actividades/manual/historico.html';
          else if (path.endsWith('/mensajes.html')) manual = '/actividades/manual/mensajes.html';
          else if (path.endsWith('/admin-usuarios.html')) manual = '/actividades/manual/admin-usuarios.html';
          else if (path.endsWith('/perfil.html')) manual = '/actividades/manual/perfil.html';
          else if (path.endsWith('/editar-actividad.html')) manual = '/actividades/manual/crear-actividad.html';
          help.setAttribute('href', manual);
        }
      } catch {}
      const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
      const menu = $('#userMenuOverlay');
      const sub = $('#ugSubmenu');
      const adminSub = $('#adminSubmenu');
      const userIcon = $('#userIcon');
      const userLabel = $('#userLabel');
      
      // Obtener información del usuario logueado
      function getUserInfo() {
        try {
          console.log('🔍 DEBUG: Obteniendo información del usuario...');
          
          // Intentar obtener desde sessionStorage (auth.js)
          const userData = sessionStorage.getItem('ub_user');
          console.log('🔍 DEBUG: userData desde sessionStorage:', userData);
          if (userData) {
            const parsed = JSON.parse(userData);
            console.log('🔍 DEBUG: Usuario parseado desde sessionStorage:', parsed);
            return parsed;
          }
          
          // Fallback: intentar obtener desde localStorage
          const userDataLocal = localStorage.getItem('ub_user');
          console.log('🔍 DEBUG: userData desde localStorage:', userDataLocal);
          if (userDataLocal) {
            const parsed = JSON.parse(userDataLocal);
            console.log('🔍 DEBUG: Usuario parseado desde localStorage:', parsed);
            return parsed;
          }
          
          // Fallback: intentar decodificar el token JWT
          const token = sessionStorage.getItem('ub_token') || localStorage.getItem('ub_token');
          console.log('🔍 DEBUG: Token encontrado:', !!token);
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('🔍 DEBUG: Payload del token:', payload);
              const userInfo = {
                Id: payload.sub,
                Username: payload.username,
                Rol: payload.rol,
                UnidadGestionId: payload.ugId ? parseInt(payload.ugId) : null,
                // También incluir en camelCase para compatibilidad
                id: payload.sub,
                username: payload.username,
                rol: payload.rol,
                unidadGestionId: payload.ugId ? parseInt(payload.ugId) : null
              };
              console.log('🔍 DEBUG: Usuario extraído del token:', userInfo);
              return userInfo;
            } catch (e) {
              console.warn('Error decodificando token:', e);
            }
          }
          
          console.log('🔍 DEBUG: No se pudo obtener información del usuario');
          return null;
        } catch (e) {
          console.warn('Error obteniendo información del usuario:', e);
          return null;
        }
      }
      
      // Mapear ID de UG a nombre
      function getUGName(ugId) {
        const ugMap = {
          1: 'IDP',
          2: 'CRAI', 
          3: 'SAE'
        };
        return ugMap[ugId] || 'Todas';
      }
      
      // Estado de UG - inicializar con la UG del usuario
      const userInfo = getUserInfo();
      console.log('🔍 DEBUG: userInfo obtenido:', userInfo);
      
      // Obtener UnidadGestionId (puede estar en camelCase o PascalCase)
      const unidadGestionId = userInfo?.UnidadGestionId || userInfo?.unidadGestionId;
      console.log('🔍 DEBUG: unidadGestionId encontrado:', unidadGestionId);
      
      let UG = userInfo && unidadGestionId ? getUGName(unidadGestionId) : 'TODAS';
      console.log('🔍 DEBUG: UG calculada:', UG);
      const ugLabel = $('#ugActual');
      const isAdmin = userInfo && (userInfo.Rol === 'Admin' || userInfo.rol === 'Admin');
      console.log('🔍 DEBUG: isAdmin:', isAdmin);
      
      // Establecer la UG del usuario en la etiqueta
      if (ugLabel && userInfo && unidadGestionId) {
        const ugName = getUGName(unidadGestionId);
        console.log('🔍 DEBUG: Estableciendo UG en etiqueta:', ugName);
        ugLabel.textContent = ugName;
        ugLabel.dataset.userSet = 'true'; // Marcar como establecido por el usuario
        console.log('🔍 DEBUG: Etiqueta UG actualizada:', ugLabel.textContent);
      } else {
        console.log('🔍 DEBUG: No se pudo establecer UG del usuario:', {
          ugLabel: !!ugLabel,
          userInfo: !!userInfo,
          unidadGestionId: unidadGestionId
        });
      }
      
      // Actualizar etiqueta del usuario
      if (userInfo && userLabel) {
        userLabel.textContent = userInfo.Username || userInfo.username || 'Usuario';
      }
      
      // Configurar estilo visual del selector de UG según permisos
      const openUGElement = $('#openUG');
      if (openUGElement) {
        if (isAdmin) {
          openUGElement.style.cursor = 'pointer';
          openUGElement.title = 'Hacer clic para cambiar unidad gestora';
        } else {
          openUGElement.style.cursor = 'default';
          openUGElement.style.opacity = '0.7';
          openUGElement.title = 'Unidad gestora asignada (solo Admin puede cambiar)';
        }
      }
      // Aplica el filtro de UG a todos los elementos con atributo data-ug
      function applyUG(){
        const blocks = document.querySelectorAll('[data-ug]');
        blocks.forEach(el => {
          // No ocultamos los botones del submenú UG
          if (el.closest('#ugSubmenu')) return;
          const appliesTo = (el.getAttribute('data-ug') || '')
            .split(',')
            .map(v => v.trim().toUpperCase());
          const show = UG === 'TODAS' || appliesTo.includes(UG);
          el.style.display = show ? '' : 'none';
        });
        // Texto legible para la UG actual (solo si no se ha establecido previamente)
        if (ugLabel && !ugLabel.dataset.userSet) {
          ugLabel.textContent = UG === 'TODAS' ? 'Todas' : UG;
        }
        // Establece estado activo en las opciones del submenú
        $$('.ugOption').forEach(btn => btn.classList.toggle('active', (btn.dataset.ug || '').toUpperCase() === UG));
      }
      // Abre el menú principal
      function openMenu(){
        menu?.classList.remove('d-none');
        sub?.classList.add('d-none');
        adminSub?.classList.add('d-none');
      }
      // Cierra ambos menús
      function closeAll(){
        menu?.classList.add('d-none');
        sub?.classList.add('d-none');
        adminSub?.classList.add('d-none');
      }
      // Abre el submenú de UG
      function openSub(e){
        if (e) e.stopPropagation();
        sub?.classList.remove('d-none');
      }
      // Evita que los clics dentro de los menús propaguen fuera
      menu?.addEventListener('click', e => e.stopPropagation());
      sub?.addEventListener('click', e => e.stopPropagation());
      adminSub?.addEventListener('click', e => e.stopPropagation());
      // Muestra el menú al clicar en el icono de usuario
      userIcon?.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
      });
      // Navegación desde menú
      menu?.querySelector('[data-action="editar"]')?.addEventListener('click', () => {
        window.location.href = 'perfil.html';
      });
      adminSub?.addEventListener('click', (e) => e.stopPropagation());
      adminSub?.querySelector('[data-admin="usuarios"]')?.addEventListener('click', () => {
        window.location.href = 'admin-usuarios.html';
      });
      // Logout
      menu?.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
        if (typeof Auth !== 'undefined') Auth.logout();
      });
      // Etiqueta de usuario y permisos
      function updateUserLabel() {
        try {
          const token = (typeof Auth !== 'undefined') ? Auth.getToken() : '';
          const user = (typeof Auth !== 'undefined') ? Auth.getUser() : {};
          
          if (userLabel) {
            if (token && user?.username) {
              userLabel.textContent = user.username;
              console.log('✅ Usuario mostrado en header:', user.username);
            } else if (token) {
              userLabel.textContent = 'Usuario';
              console.log('⚠️ Token presente pero sin nombre de usuario');
            } else {
              userLabel.textContent = 'No conectado';
              console.log('⚠️ Sin token de autenticación');
            }
          }
          
          // Ocultar opciones de admin si no es admin
          if (((user?.rol||user?.Rol||'').toString().toLowerCase() !== 'admin')){
            const adminBtn = document.getElementById('openAdmin');
            if (adminBtn) adminBtn.style.display = 'none';
          }
        } catch (error) {
          console.error('Error actualizando etiqueta de usuario:', error);
          if (userLabel) userLabel.textContent = 'Error';
        }
      }
      
      // Actualizar inmediatamente
      updateUserLabel();
      
      // También actualizar después de un pequeño delay para asegurar que Auth esté disponible
      setTimeout(updateUserLabel, 500);
      // Abre el submenú al clicar en la opción de UG (solo Admin)
      $('#openUG')?.addEventListener('click', (e) => {
        if (isAdmin) {
          openSub(e);
        } else {
          // Para usuarios no-Admin, mostrar mensaje informativo
          e.preventDefault();
          e.stopPropagation();
          alert('Solo los administradores pueden cambiar la unidad gestora.');
        }
      });
      // Abre submenú de administración (solo admin visible)
      $('#openAdmin')?.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        const u = (typeof Auth !== 'undefined') ? Auth.getUser() : {};
        if ((u?.rol||u?.Rol||'').toString().toLowerCase() !== 'admin') return;
        adminSub?.classList.remove('d-none');
      });
      // Maneja la selección de UG
      $$('.ugOption').forEach(btn => {
        if (btn.disabled) return;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          UG = (btn.dataset.ug || 'Todas').toUpperCase();
          
          // Actualizar la etiqueta cuando Admin cambia la UG
          if (ugLabel && isAdmin) {
            ugLabel.textContent = UG === 'TODAS' ? 'Todas' : UG;
            ugLabel.dataset.userSet = 'true';
          }
          
          applyUG();
          if (menu && !menu.classList.contains('d-none')) {
            sub?.classList.add('d-none');
          }
        });
      });
      // Cierra los menús al hacer clic fuera de ellos
      document.addEventListener('click', (e) => {
        if (!menu?.contains(e.target) && !sub?.contains(e.target) && !adminSub?.contains(e.target) && e.target.id !== 'userIcon') {
          closeAll();
        }
      });
      // Inicializa mostrando todas las UGs
      applyUG();
    })();
  };
})();