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
  <div class="dropdown">
    <button class="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown">CAS</button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><a class="dropdown-item" href="#">CAS</a></li>
      <li><a class="dropdown-item" href="#">CAT</a></li>
      <li><a class="dropdown-item" href="#">ENG</a></li>
    </ul>
  </div>
  <a class="position-relative" id="bellWrap" href="#">
    <i class="bi bi-bell fs-5 text-secondary"></i>
    <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle d-none" id="bellBadge"></span>
  </a>
  <i class="bi bi-person-circle fs-4 text-secondary" id="userIcon" style="cursor:pointer"></i>
  <span class="text-muted">Docente</span>
</header>
<!-- Menú del usuario -->
<div class="usermenu d-none" id="userMenuOverlay">
  <div class="usermenu-card">
    <button class="userItem" data-action="editar">Editar Datos Usuario</button>
    <button class="userItem" data-action="modulo">Cambiar Módulo</button>
    <div class="userItem with-sub" id="openUG">Unidad Gestora: <span id="ugActual">Todas</span></div>
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
</div>`;

  /**
   * Inserta la cabecera en el elemento de destino y configura los menús.
   * @param {string} containerId ID del contenedor donde se insertará la cabecera.
   */
  window.loadHeader = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = headerHTML;
    // Lógica de menús y selector de UG
    (function(){
      const $ = (s, r=document) => r.querySelector(s);
      const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
      const menu = $('#userMenuOverlay');
      const sub = $('#ugSubmenu');
      const userIcon = $('#userIcon');
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
      }
      // Cierra ambos menús
      function closeAll(){
        menu?.classList.add('d-none');
        sub?.classList.add('d-none');
      }
      // Abre el submenú de UG
      function openSub(e){
        if (e) e.stopPropagation();
        sub?.classList.remove('d-none');
      }
      // Evita que los clics dentro de los menús propaguen fuera
      menu?.addEventListener('click', e => e.stopPropagation());
      sub?.addEventListener('click', e => e.stopPropagation());
      // Muestra el menú al clicar en el icono de usuario
      userIcon?.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
      });
      // Abre el submenú al clicar en la opción de UG
      $('#openUG')?.addEventListener('click', (e) => openSub(e));
      // Maneja la selección de UG
      $$('.ugOption').forEach(btn => {
        if (btn.disabled) return;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          UG = (btn.dataset.ug || 'Todas').toUpperCase();
          applyUG();
          // Si el menú principal está abierto, oculta el submenú tras seleccionar
          if (menu && !menu.classList.contains('d-none')) {
            sub?.classList.add('d-none');
          }
        });
      });
      // Cierra los menús al hacer clic fuera de ellos
      document.addEventListener('click', (e) => {
        if (!menu?.contains(e.target) && !sub?.contains(e.target) && e.target.id !== 'userIcon') {
          closeAll();
        }
      });
      // Inicializa mostrando todas las UGs
      applyUG();
    })();
  };
})();