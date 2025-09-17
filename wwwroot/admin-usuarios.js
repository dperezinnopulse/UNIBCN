(() => {
  const baseApi = '/api';
  const API = (path) => `${baseApi}${path}`;
  const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.getToken()}` });

  let modal, modalEl;
  let UG_CACHE = [];

  async function cargarUGs(){
    const res = await fetch(API('/unidades-gestion'), { headers: { 'Authorization': `Bearer ${Auth.getToken()}` } });
    if (!res.ok) throw new Error('Error cargando UGs');
    UG_CACHE = await res.json();
    const sel = document.getElementById('ug');
    sel.innerHTML = '<option value="">Seleccione UG</option>' + UG_CACHE.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('');
  }

  async function cargarUsuarios(){
    const res = await fetch(API('/usuarios'), { headers: headers() });
    if (!res.ok) throw new Error('Error cargando usuarios');
    const data = await res.json();
    const tbody = document.querySelector('#tablaUsuarios tbody');
    tbody.innerHTML = '';
    data.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.username}</td><td>${u.rol}</td><td>${u.unidadGestionId ?? ''}</td><td>${u.email ?? ''}</td><td>${u.activo ? 'Sí':'No'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" data-edit='${u.id}'><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-del='${u.id}'><i class="bi bi-trash"></i></button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  async function abrirNuevo(){
    document.getElementById('userId').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('rol').value = 'Gestor';
    document.getElementById('ug').value = '';
    document.getElementById('email').value = '';
    document.getElementById('activo').value = 'true';
    modal.show();
  }

  async function abrirEditar(id){
    const res = await fetch(API(`/usuarios/${id}`), { headers: headers() });
    if (!res.ok) return;
    const u = await res.json();
    document.getElementById('userId').value = u.id;
    document.getElementById('username').value = u.username;
    document.getElementById('password').value = '';
    document.getElementById('rol').value = u.rol;
    const ugSel = document.getElementById('ug');
    ugSel.value = u.unidadGestionId ?? '';
    // Si es Admin, bloquear UG
    if ((u.rol||'').toLowerCase()==='admin') {
      ugSel.disabled = true;
    } else {
      ugSel.disabled = false;
    }
    document.getElementById('email').value = u.email ?? '';
    document.getElementById('activo').value = u.activo ? 'true' : 'false';
    modal.show();
  }

  async function guardar(){
    const id = document.getElementById('userId').value.trim();
    const body = {
      username: document.getElementById('username').value.trim(),
      rol: document.getElementById('rol').value,
      unidadGestionId: document.getElementById('ug').value ? parseInt(document.getElementById('ug').value,10) : null,
      email: document.getElementById('email').value.trim() || null,
      activo: document.getElementById('activo').value === 'true'
    };
    const pwd = document.getElementById('password').value;
    if (id) {
      if (pwd) body.newPassword = pwd;
      const res = await fetch(API(`/usuarios/${id}`), { method:'PUT', headers: headers(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Error al actualizar');
    } else {
      if (!pwd) return alert('Contraseña requerida para crear');
      body.password = pwd;
      const res = await fetch(API('/usuarios'), { method:'POST', headers: headers(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Error al crear');
    }
    modal.hide();
    await cargarUsuarios();
  }

  async function eliminar(id){
    if (!confirm('¿Desactivar usuario?')) return;
    const res = await fetch(API(`/usuarios/${id}`), { method:'DELETE', headers: headers() });
    if (!res.ok) return;
    await cargarUsuarios();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    modalEl = document.getElementById('modalUsuario');
    modal = new bootstrap.Modal(modalEl);
    document.getElementById('btnNuevo').addEventListener('click', abrirNuevo);
    document.getElementById('btnRefrescar').addEventListener('click', cargarUsuarios);
    document.getElementById('btnGuardar').addEventListener('click', guardar);
    document.querySelector('#tablaUsuarios tbody').addEventListener('click', (e)=>{
      const editId = e.target.closest('[data-edit]')?.getAttribute('data-edit');
      const delId = e.target.closest('[data-del]')?.getAttribute('data-del');
      if (editId) abrirEditar(editId);
      if (delId) eliminar(delId);
    });
    try { await Promise.all([cargarUGs(), cargarUsuarios()]); } catch(e){ console.error(e); alert('Error cargando datos'); }
  });
})();


