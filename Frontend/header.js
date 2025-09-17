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

  /**
   * Inserta la cabecera en el elemento de destino y configura los menús.
   * @param {string} containerId ID del contenedor donde se insertará la cabecera.
   */
  // Función para inicializar Weglot
  function initializeWeglot() {
    // Cargar script de Weglot si no está cargado
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
      // Si ya está cargado, reinicializar
      Weglot.initialize({
        api_key: 'wg_b2253dca073d4e70fd4476374ae59e149'
      });
    }
  }

  window.loadHeader = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = headerHTML;
    
    // Inicializar Weglot después de cargar el header
    setTimeout(initializeWeglot, 100);
    // Lógica de menús y selector de UG
    (function(){
      const $ = (s, r=document) => r.querySelector(s);
      // Resolver URL de ayuda según la página
      try {
        const path = (location.pathname || '').toLowerCase();
        const help = $('#helpLink');
        if (help) {
          let manual = '/manual/index.html';
          if (path.endsWith('/index.html')) manual = '/manual/crear-actividad.html';
          else if (path.endsWith('/historico.html')) manual = '/manual/historico.html';
          else if (path.endsWith('/mensajes.html')) manual = '/manual/mensajes.html';
          else if (path.endsWith('/admin-usuarios.html')) manual = '/manual/admin-usuarios.html';
          else if (path.endsWith('/perfil.html')) manual = '/manual/perfil.html';
          else if (path.endsWith('/editar-actividad.html')) manual = '/manual/crear-actividad.html';
          help.setAttribute('href', manual);
        }
      } catch {}
      const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
      const menu = $('#userMenuOverlay');
      const sub = $('#ugSubmenu');
      const adminSub = $('#adminSubmenu');
      const userIcon = $('#userIcon');
      const userLabel = $('#userLabel');
      let UG = 'TODAS';
      const ugLabel = $('#ugActual');
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
        // Texto legible para la UG actual
        if (ugLabel) ugLabel.textContent = UG === 'TODAS' ? 'Todas' : UG;
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
      // Abre el submenú al clicar en la opción de UG
      $('#openUG')?.addEventListener('click', (e) => openSub(e));
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