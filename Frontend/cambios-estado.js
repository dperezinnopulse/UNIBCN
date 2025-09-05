// Funcionalidad de cambios de estado para actividades

let cambiosEstadoActuales = [];
let estadosDisponibles = [];

// Cargar estados disponibles según el rol del usuario
async function cargarEstadosDisponibles() {
    try {
        const response = await fetch('/api/estados');
        if (response.ok) {
            estadosDisponibles = await response.json();
            console.log('Estados disponibles:', estadosDisponibles);
        } else {
            console.error('Error cargando estados:', response.statusText);
        }
    } catch (error) {
        console.error('Error cargando estados:', error);
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

        const response = await fetch(`/api/actividades/${actividadId}/cambios-estado`);
        if (response.ok) {
            cambiosEstadoActuales = await response.json();
            actualizarDescripcionEnCabecera();
        } else {
            console.error('Error cargando cambios de estado:', response.statusText);
        }
    } catch (error) {
        console.error('Error cargando cambios de estado:', error);
    }
}

// Mostrar modal para cambiar estado
function mostrarModalCambioEstado() {
    const modal = document.getElementById('modalCambioEstado');
    if (modal) {
        // Limpiar formulario
        document.getElementById('nuevoEstadoSelect').value = '';
        document.getElementById('descripcionMotivos').value = '';
        
        // Cargar estados en el select
        cargarEstadosEnSelect();
        
        // Mostrar modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Cargar estados en el select del modal
function cargarEstadosEnSelect() {
    const select = document.getElementById('nuevoEstadoSelect');
    if (!select) return;
    
    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Selecciona un estado...</option>';
    
    // Agregar estados disponibles
    estadosDisponibles.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.id;
        option.textContent = estado.nombre;
        select.appendChild(option);
    });
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
        const response = await fetch('/api/actividades/cambiar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            
            // Recargar datos
            await cargarCambiosEstado();
            await cargarActividad(); // Recargar la actividad para actualizar el estado
            
            alert('Estado cambiado correctamente');
        } else {
            const error = await response.text();
            alert('Error cambiando estado: ' + error);
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DescripcionMotivos: nuevaDescripcion.trim() || null
            })
        });

        if (response.ok) {
            console.log('Descripción actualizada correctamente');
            // Recargar la descripción en la cabecera
            await cargarUltimoCambioEstado(ACTIVIDAD_ID);
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

        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/historial-estados`);
        if (!response.ok) {
            throw new Error('Error obteniendo historial');
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
                                            ${cambio.descripcionMotivos ? `
                                                <div class="mb-2">
                                                    <strong>Descripción:</strong><br>
                                                    <span class="text-muted">${cambio.descripcionMotivos}</span>
                                                </div>
                                            ` : ''}
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
    // Cargar estados disponibles
    cargarEstadosDisponibles();
    
    // Cargar cambios de estado si estamos en una actividad existente
    if (obtenerActividadId()) {
        cargarCambiosEstado();
    }
});
