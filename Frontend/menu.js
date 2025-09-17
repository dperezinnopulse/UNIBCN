/*
 * Archivo de menú reutilizable para todas las páginas.
 * Contiene el HTML del menú lateral y una función para insertarlo
 * dentro de un contenedor especificado. El menú se carga una sola
 * vez en este archivo, por lo que cualquier modificación futura
 * únicamente necesita realizarse aquí para reflejarse en todas
 * las páginas que lo usan.
 */

(function(){
  // Definimos el HTML del menú como una plantilla de cadena.
  const menuHTML = `
<aside id="appSidebar" class="sidebar collapsed p-2 d-flex flex-column">
  <div class="text-center mb-4">
    <img alt="Logo UB" src="img/logo_ub.png" class="img-fluid" style="max-height: 50px;"/>
  </div>
  <!-- Botón de alternancia para expandir/contraer el menú -->
  <button id="sidebarToggle" class="mb-3" type="button">
    <i class="bi bi-list"></i>
  </button>
  <nav class="nav flex-column px-2">
    <a class="nav-link" href="historico.html">
      <i class="bi bi-clock-history"></i> <span class="link-text">Histórico</span>
    </a>
    <a class="nav-link" href="index.html">
      <i class="bi bi-plus-square"></i> <span class="link-text">Crear nuevo</span>
    </a>
    <a class="nav-link" href="mensajes.html">
      <i class="bi bi-envelope"></i> <span class="link-text">Ver mensajes</span>
    </a>
  </nav>
  <!-- Elemento flexible para empujar el enlace de desconexión al final -->
  <div class="flex-grow-1"></div>
  <a class="nav-link mt-auto" href="#" onclick="desconectarUsuario(); return false;">
    <i class="bi bi-box-arrow-right"></i> <span class="link-text">Desconectar</span>
  </a>
</aside>`;

  /**
   * Inserta el menú en el contenedor indicado y configura el
   * comportamiento de colapso/expansión y resaltado del enlace activo.
   * @param {string} containerId - ID del elemento donde se insertará el menú.
   */
  window.loadSidebarMenu = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    // Insertamos el HTML del menú
    container.innerHTML = menuHTML;
    const sidebar = container.querySelector('#appSidebar');
    const toggleBtn = container.querySelector('#sidebarToggle');
    // Configuramos el botón de alternancia
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function(){
        sidebar.classList.toggle('collapsed');
      });
    }
    // Resaltamos el enlace activo basándonos en el nombre de archivo
    // Determinamos la página actual por nombre de fichero. Para páginas de detalle
    // (como 'mensaje.html') podemos asignar la misma entrada que su lista ('mensajes.html')
    let currentPage = location.pathname.split('/').pop().toLowerCase();
    if (currentPage === 'mensaje.html') {
      currentPage = 'mensajes.html';
    }
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPage === href.toLowerCase()) {
        link.classList.add('active');
      }
    });
  };

  /**
   * Función para desconectar al usuario y redirigir al login
   */
  window.desconectarUsuario = function() {
    // Limpiar el token de autenticación
    if (typeof Auth !== 'undefined') {
      Auth.logout();
    }
    
    // Limpiar cualquier dato de sesión almacenado
    localStorage.removeItem('ub_token');
    localStorage.removeItem('ub_user');
    sessionStorage.clear();
    
    // Redirigir al login
    window.location.href = 'login.html';
  };
})();