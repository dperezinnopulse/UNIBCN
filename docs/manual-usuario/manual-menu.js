(() => {
  const MENU_HTML = `
<aside class="manual-sidebar">
  <div class="brand-mini"><img src="/img/logo_ub.png" alt="UB"/></div>
  <nav class="manual-nav">
    <a href="./login.html"><i class="bi bi-box-arrow-in-right"></i><span>Login</span></a>
    <a href="./crear-actividad.html"><i class="bi bi-plus-square"></i><span>Crear Actividad</span></a>
    <a href="./editar-actividad.html"><i class="bi bi-pencil-square"></i><span>Editar Actividad</span></a>
    <a href="./historico.html"><i class="bi bi-clock-history"></i><span>Histórico</span></a>
    <a href="./mensajes.html"><i class="bi bi-envelope"></i><span>Mensajes</span></a>
    <a href="./adjuntos.html"><i class="bi bi-paperclip"></i><span>Adjuntos</span></a>
    <a href="./cambios-estado.html"><i class="bi bi-arrow-repeat"></i><span>Cambios de estado</span></a>
    <a href="./admin-usuarios.html"><i class="bi bi-people"></i><span>Admin usuarios</span></a>
    <a href="./perfil.html"><i class="bi bi-person"></i><span>Perfil</span></a>
    <hr style="border:0;border-top:1px solid #e5e7eb;margin:8px 0"/>
    <a href="../workflow_ub.html" target="_blank"><i class="bi bi-diagram-3"></i><span>Workflow Completo</span></a>
    <a href="../permisos-edicion-completos.html" target="_blank"><i class="bi bi-shield-check"></i><span>Permisos de Edición</span></a>
    <a href="./soporte-tecnico.html"><i class="bi bi-question-circle"></i><span>Soporte Técnico</span></a>
  </nav>
</aside>`;

  function injectManualMenu() {
    // create container if missing
    let host = document.getElementById('manualMenuContainer');
    if (!host) {
      host = document.createElement('div');
      host.id = 'manualMenuContainer';
      document.body.prepend(host);
    }
    host.innerHTML = MENU_HTML;

    // highlight current
    const current = location.pathname.split('/').pop().toLowerCase();
    host.querySelectorAll('.manual-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.toLowerCase().endsWith(current)) a.classList.add('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectManualMenu);
  } else {
    injectManualMenu();
  }
})();


