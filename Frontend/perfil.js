(() => {
  const baseApi = '/api';
  const API = (path) => `${baseApi}${path}`;
  const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.getToken()}` });

  async function cargar(){
    const res = await fetch(API('/usuarios/yo'), { headers: headers() });
    if (!res.ok) throw new Error('No se pudo cargar el perfil');
    const u = await res.json();
    document.getElementById('username').value = u.username || '';
    document.getElementById('email').value = u.email || '';
  }

  async function guardar(){
    const body = {
      username: document.getElementById('username').value.trim() || null,
      email: document.getElementById('email').value.trim() || null,
    };
    const pwd = document.getElementById('password').value;
    if (pwd) body.newPassword = pwd;
    const res = await fetch(API('/usuarios/yo'), { method:'PUT', headers: headers(), body: JSON.stringify(body) });
    if (!res.ok) return alert('Error guardando');
    alert('Guardado');
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    document.getElementById('btnGuardar').addEventListener('click', guardar);
    try { await cargar(); } catch(e){ console.error(e); alert('Error cargando perfil'); }
  });
})();


