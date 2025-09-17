// Funcionalidad de cambios de estado para actividades

let cambiosEstadoActuales = [];
let transicionesPermitidas = [];

// Cargar transiciones permitidas para la actividad y el rol actual
async function cargarTransicionesPermitidas() {
    try {
        const actividadId = obtenerActividadId();
        if (!actividadId) {
            console.log('🔍 DEBUG: No se pudo obtener el ID de la actividad');
            return [];
        }
        
        const token = typeof Auth !== 'undefined' ? Auth.getToken() : null;
        console.log('🔍 DEBUG: Token disponible:', !!token);
        console.log('🔍 DEBUG: Token (primeros 50 chars):', token ? token.substring(0, 50) + '...' : 'null');
        console.log('🔍 DEBUG: URL de transiciones:', `${CONFIG.API_BASE_URL}/actividades/${actividadId}/transiciones`);
        
        const headers = {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        
        console.log('🔍 DEBUG: Headers enviados:', headers);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/transiciones`, {
            headers: headers
        });
        
        console.log('🔍 DEBUG: Respuesta del servidor:', response.status, response.statusText);
        console.log('🔍 DEBUG: Headers de respuesta:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            transicionesPermitidas = await response.json();
            console.log('🔍 DEBUG: Transiciones permitidas recibidas:', transicionesPermitidas);
        } else {
            const txt = await response.text().catch(()=> '');
            console.error('🔍 DEBUG: Error cargando transiciones:', response.status, response.statusText, txt);
        }
    } catch (error) {
        console.error('🔍 DEBUG: Error cargando transiciones:', error);
    }
}

// Cargar cambios de estado de la actividad
async function cargarCambiosEstado() {
    try {
        const actividadId = obtenerActividadId();
        if (!actividadId) {
            console.warn('No se pudo obtener el ID de la actividad');
            return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/cambios-estado`, {
            headers: {
                'Accept': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            }
        });
        if (response.ok) {
            cambiosEstadoActuales = await response.json();
            actualizarDescripcionEnCabecera();
        } else {
            const txt = await response.text().catch(()=>'');
            console.error('Error cargando cambios de estado:', response.status, response.statusText, txt);
        }
    } catch (error) {
        console.error('Error cargando cambios de estado:', error);
    }
}

// Mostrar modal para cambiar estado
async function mostrarModalCambioEstado() {
    const modal = document.getElementById('modalCambioEstado');
    if (!modal) return;
    // Limpiar formulario
    const sel = document.getElementById('nuevoEstadoSelect');
    if (sel) sel.value = '';
    const txt = document.getElementById('descripcionMotivos');
    if (txt) txt.value = '';
    // Cargar transiciones y poblar select
    await cargarTransicionesPermitidas();
    cargarEstadosEnSelect();
    // Mostrar modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Cargar estados en el select del modal
function cargarEstadosEnSelect() {
    const select = document.getElementById('nuevoEstadoSelect');
    if (!select) {
        console.log('🔍 DEBUG: No se encontró el select nuevoEstadoSelect');
        return;
    }
    
    console.log('🔍 DEBUG: Transiciones permitidas para poblar select:', transicionesPermitidas);
    
    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Selecciona un estado...</option>';
    
    // Agregar solo destinos permitidos
    (transicionesPermitidas || []).forEach(estado => {
        console.log('🔍 DEBUG: Agregando estado al select:', estado);
        const option = document.createElement('option');
        option.value = estado.id;
        option.textContent = estado.nombre;
        option.dataset.color = estado.color || '';
        option.dataset.codigo = estado.codigo || '';
        select.appendChild(option);
    });
    
    console.log('🔍 DEBUG: Select poblado con', select.options.length - 1, 'opciones');
}

// Cambiar estado de la actividad
async function cambiarEstadoActividad() {
    const nuevoEstadoId = document.getElementById('nuevoEstadoSelect').value;
    const descripcionMotivos = document.getElementById('descripcionMotivos').value;

    if (!nuevoEstadoId) {
        alert('Por favor selecciona un estado');
        return;
    }

    const actividadId = obtenerActividadId();
    if (!actividadId) {
        alert('No se pudo obtener el ID de la actividad');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/cambiar-estado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            },
            body: JSON.stringify({
                actividadId: parseInt(actividadId),
                estadoNuevoId: parseInt(nuevoEstadoId),
                descripcionMotivos: descripcionMotivos || null
            })
        });

        if (response.ok) {
            const cambio = await response.json();
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCambioEstado'));
            if (modal) {
                modal.hide();
            }
            
            // Sincronizar estado en la UI inmediatamente
            try {
                // Actualizar hidden/inputs si existen
                const hiddenEstado = document.getElementById('actividadEstadoId');
                if (hiddenEstado) hiddenEstado.value = parseInt(nuevoEstadoId, 10);
                const sel = document.getElementById('estadoSelect');
                if (sel) sel.value = String(parseInt(nuevoEstadoId, 10));

                // Actualizar badge directamente si existe
                const badge = document.getElementById('estadoBadge');
                let estadoInfo = (transicionesPermitidas || []).find(e => e.id === parseInt(nuevoEstadoId, 10));
                if (!estadoInfo && sel) {
                    const opt = sel.querySelector(`option[value="${parseInt(nuevoEstadoId,10)}"]`);
                    if (opt) {
                        estadoInfo = { nombre: opt.textContent, color: opt.dataset.color };
                    }
                }
                if (badge && estadoInfo) {
                    const nombre = estadoInfo.nombre || '—';
                    const color = estadoInfo.color || (nombre === 'Borrador' ? '#6c757d' : nombre === 'Enviada' ? '#fd7e14' : nombre === 'Subsanar' ? '#dc3545' : '#2ecc71');
                    badge.style.background = color;
                    badge.innerHTML = `<i class="bi bi-check-circle me-2"></i>${nombre}`;
                }

                // Si existe helper de la página, reutilizarlo
                if (typeof actualizarBadgeEstadoDesdeSelect === 'function') {
                    actualizarBadgeEstadoDesdeSelect();
                }
            } catch {}

            // Recargar datos con tolerancia si no existen helpers globales
            if (typeof cargarCambiosEstado === 'function') {
                await cargarCambiosEstado();
            }
            if (typeof cargarActividad === 'function') {
                await cargarActividad(); // Recargar la actividad para actualizar el estado
            } else {
                // Fallback: recargar la página para reflejar el nuevo estado
                location.reload();
            }
            
            alert('Estado cambiado correctamente');
        } else {
            const error = await response.text();
            alert('Error cambiando estado: ' + (error || (response.status + ' ' + response.statusText)));
        }
    } catch (error) {
        console.error('Error cambiando estado:', error);
        alert('Error cambiando estado');
    }
}

// Función para editar descripción de cambio de estado
async function editarDescripcionEstado(cambioId) {
    const nuevaDescripcion = prompt('Editar descripción/motivos:', '');
    
    if (nuevaDescripcion === null) return; // Usuario canceló
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/cambios-estado/${cambioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            },
            body: JSON.stringify({
                DescripcionMotivos: nuevaDescripcion.trim() || null
            })
        });

        if (response.ok) {
            console.log('Descripción actualizada correctamente');
            // Recargar la descripción en la cabecera e historial
            if (typeof cargarCambiosEstado === 'function') {
                await cargarCambiosEstado();
            }
            if (typeof obtenerActividadId === 'function') {
                const actId = obtenerActividadId();
                if (actId) {
                    // Si el modal de historial está abierto, refrescar su contenido
                    const modalAbierto = document.getElementById('modalHistorialEstados');
                    if (modalAbierto) {
                        await mostrarHistorialEstados();
                    }
                }
            }
        } else if (response.status === 403) {
            alert('No tienes permisos para editar esta descripción');
        } else {
            const error = await response.text();
            console.error('Error actualizando descripción:', error);
            alert('Error actualizando descripción: ' + error);
        }
    } catch (error) {
        console.error('Error actualizando descripción:', error);
        alert('Error actualizando descripción');
    }
}

// Borrar (vaciar) descripción del cambio de estado (autor o Admin)
async function borrarDescripcionEstado(cambioId) {
    if (!confirm('¿Deseas borrar la descripción de este cambio de estado?')) return;
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/cambios-estado/${cambioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            },
            body: JSON.stringify({ DescripcionMotivos: null })
        });

        if (response.ok) {
            console.log('Descripción borrada correctamente');
            if (typeof cargarCambiosEstado === 'function') {
                await cargarCambiosEstado();
            }
            const modalAbierto = document.getElementById('modalHistorialEstados');
            if (modalAbierto) {
                await mostrarHistorialEstados();
            }
        } else if (response.status === 403) {
            alert('No tienes permisos para borrar esta descripción');
        } else {
            const error = await response.text();
            console.error('Error borrando descripción:', error);
            alert('Error borrando descripción: ' + error);
        }
    } catch (error) {
        console.error('Error borrando descripción:', error);
        alert('Error borrando descripción');
    }
}

// Actualizar descripción en la cabecera
function actualizarDescripcionEnCabecera() {
    const ultimoCambio = cambiosEstadoActuales[0]; // El más reciente
    const descripcionElement = document.getElementById('descripcionEstado');
    
    if (descripcionElement && ultimoCambio && ultimoCambio.descripcionMotivos) {
        const descripcion = ultimoCambio.descripcionMotivos;
        const preview = descripcion.length > 50 ? descripcion.substring(0, 50) + '...' : descripcion;
        
        // Verificar si el usuario puede editar (es el creador o Admin)
        const user = Auth.getUser();
        const canEdit = ultimoCambio.usuarioCambioId === user?.id || user?.rol === 'Admin';
        
        descripcionElement.innerHTML = `
            <i class="bi bi-chat-quote me-1"></i>
            <span title="${descripcion}">${preview}</span>
            ${canEdit ? `<button class="btn btn-sm btn-link p-0 ms-2" onclick="editarDescripcionEstado(${ultimoCambio.id})" title="Editar descripción">
                <i class="bi bi-pencil"></i>
            </button>` : ''}
        `;
        descripcionElement.style.display = 'inline';
    } else if (descripcionElement) {
        descripcionElement.style.display = 'none';
    }
}

// Obtener ID de la actividad desde la URL
function obtenerActividadId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Función para mostrar historial completo de cambios de estado
async function mostrarHistorialEstados() {
    try {
        const actividadId = obtenerActividadId();
        if (!actividadId) {
            alert('No se pudo obtener el ID de la actividad');
            return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/historial-estados`, {
            headers: {
                'Accept': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            }
        });
        if (!response.ok) {
            const txt = await response.text().catch(()=> '');
            throw new Error('Error obteniendo historial: ' + (txt || (response.status + ' ' + response.statusText)));
        }

        const historial = await response.json();
        
        // Crear modal para mostrar historial
        const modalHtml = `
            <div class="modal fade" id="modalHistorialEstados" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Historial de Cambios de Estado</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${historial.length === 0 ? 
                                '<div class="text-center text-muted py-4">No hay cambios de estado registrados</div>' :
                                historial.map(cambio => `
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <span class="badge bg-secondary me-2">${cambio.estadoAnterior.codigo}</span>
                                                    <i class="bi bi-arrow-right"></i>
                                                    <span class="badge bg-primary ms-2">${cambio.estadoNuevo.codigo}</span>
                                                </div>
                                                <small class="text-muted">${new Date(cambio.fechaCambio).toLocaleString()}</small>
                                            </div>
                                            <div class="mb-2">
                                                <strong>De:</strong> ${cambio.estadoAnterior.nombre}<br>
                                                <strong>A:</strong> ${cambio.estadoNuevo.nombre}
                                            </div>
                                            <div class="mb-2">
                                                <strong>Descripción:</strong><br>
                                                <span class="text-muted">${cambio.descripcionMotivos ? cambio.descripcionMotivos : '<em>Sin descripción</em>'}</span>
                                            </div>
                                            ${(() => {
                                                try {
                                                    const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
                                                    const autorId = (typeof cambio.usuarioCambioId !== 'undefined' && cambio.usuarioCambioId !== null)
                                                        ? cambio.usuarioCambioId
                                                        : (cambio.usuarioCambio && typeof cambio.usuarioCambio.id !== 'undefined' ? cambio.usuarioCambio.id : null);
                                                    const canEdit = user && ((autorId === user.id) || user.rol === 'Admin');
                                                    return canEdit ? `
                                                        <div class="d-flex gap-2 mb-2">
                                                            <button class="btn btn-sm btn-outline-primary" onclick="editarDescripcionEstado(${cambio.id})">
                                                                <i class="bi bi-pencil me-1"></i>Editar descripción
                                                            </button>
                                                            <button class="btn btn-sm btn-outline-danger" onclick="borrarDescripcionEstado(${cambio.id})">
                                                                <i class="bi bi-trash me-1"></i>Borrar descripción
                                                            </button>
                                                        </div>
                                                    ` : '';
                                                } catch { return ''; }
                                            })()}
                                            <div class="text-muted small">
                                                <i class="bi bi-person me-1"></i>Cambiado por ${cambio.usuarioCambio.username} (${cambio.usuarioCambio.rol})
                                            </div>
                                        </div>
                                    </div>
                                `).join('')
                            }
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente si existe
        const existingModal = document.getElementById('modalHistorialEstados');
        if (existingModal) {
            existingModal.remove();
        }

        // Añadir nuevo modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalHistorialEstados'));
        modal.show();

        // Limpiar modal cuando se cierre
        document.getElementById('modalHistorialEstados').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });

    } catch (error) {
        console.error('Error mostrando historial:', error);
        alert('Error mostrando historial de estados');
    }
}

// Exportar funciones globalmente
window.mostrarModalCambioEstado = mostrarModalCambioEstado;
window.cambiarEstadoActividad = cambiarEstadoActividad;
window.editarDescripcionEstado = editarDescripcionEstado;
window.mostrarHistorialEstados = mostrarHistorialEstados;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Las transiciones se cargan después de cargar los datos de la actividad
    // para asegurar que se tenga el estado actual correcto

    // Cargar cambios de estado si estamos en una actividad existente
    if (obtenerActividadId()) {
        cargarCambiosEstado();
    }
});
