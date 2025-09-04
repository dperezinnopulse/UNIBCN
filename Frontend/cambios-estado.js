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

// Actualizar descripción en la cabecera
function actualizarDescripcionEnCabecera() {
    const ultimoCambio = cambiosEstadoActuales[0]; // El más reciente
    const descripcionElement = document.getElementById('descripcionEstado');
    
    if (descripcionElement && ultimoCambio && ultimoCambio.descripcionMotivos) {
        const descripcion = ultimoCambio.descripcionMotivos;
        const preview = descripcion.length > 50 ? descripcion.substring(0, 50) + '...' : descripcion;
        
        descripcionElement.textContent = preview;
        descripcionElement.title = descripcion; // Tooltip con texto completo
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar estados disponibles
    cargarEstadosDisponibles();
    
    // Cargar cambios de estado si estamos en una actividad existente
    if (obtenerActividadId()) {
        cargarCambiosEstado();
    }
});
