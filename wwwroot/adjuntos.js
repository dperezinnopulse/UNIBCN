// Funcionalidad de adjuntos para actividades

let adjuntosActuales = [];

// Cargar adjuntos de la actividad
async function cargarAdjuntos() {
    try {
        const actividadId = obtenerActividadId();
        if (!actividadId) {
            console.warn('No se pudo obtener el ID de la actividad');
            return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/adjuntos`);
        if (response.ok) {
            adjuntosActuales = await response.json();
            renderizarAdjuntos();
        } else {
            console.error('Error cargando adjuntos:', response.statusText);
        }
    } catch (error) {
        console.error('Error cargando adjuntos:', error);
    }
}

// Renderizar la lista de adjuntos
function renderizarAdjuntos() {
    const container = document.getElementById('adjuntosContainer');
    if (!container) return;

    if (adjuntosActuales.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No hay archivos adjuntos para esta actividad.
            </div>
        `;
        return;
    }

    container.innerHTML = adjuntosActuales.map(adjunto => `
        <div class="card mb-2" data-adjunto-id="${adjunto.id}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-file-earmark me-2 text-primary"></i>
                            <strong>${adjunto.nombreArchivo}</strong>
                            <span class="badge bg-secondary ms-2">${formatearTamaño(adjunto.tamañoBytes)}</span>
                        </div>
                        ${adjunto.descripcion ? `<p class="text-muted mb-2">${adjunto.descripcion}</p>` : ''}
                        <div class="text-muted small">
                            <i class="bi bi-person me-1"></i>Subido por ${adjunto.usuarioSubidaNombre}
                            <i class="bi bi-calendar me-1 ms-2"></i>${formatearFecha(adjunto.fechaSubida)}
                        </div>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="descargarAdjunto(${adjunto.id})" title="Descargar">
                            <i class="bi bi-download"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="eliminarAdjunto(${adjunto.id})" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Subir adjuntos
async function subirAdjuntos() {
    const archivosInput = document.getElementById('archivosInput');
    const descripcionInput = document.getElementById('descripcionAdjuntos');
    
    if (!archivosInput.files || archivosInput.files.length === 0) {
        mostrarAlerta('error', 'Por favor selecciona al menos un archivo');
        return;
    }

    const actividadId = obtenerActividadId();
    if (!actividadId) {
        mostrarAlerta('error', 'No se pudo obtener el ID de la actividad');
        return;
    }

    try {
        mostrarAlerta('loading', 'Subiendo archivos...');

        const formData = new FormData();
        
        // Agregar archivos
        for (let i = 0; i < archivosInput.files.length; i++) {
            formData.append('archivos', archivosInput.files[i]);
        }
        
        // Agregar descripción si existe
        if (descripcionInput.value.trim()) {
            formData.append('descripciones', descripcionInput.value.trim());
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/adjuntos`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const nuevosAdjuntos = await response.json();
            adjuntosActuales = [...adjuntosActuales, ...nuevosAdjuntos];
            renderizarAdjuntos();
            
            // Limpiar formulario
            archivosInput.value = '';
            descripcionInput.value = '';
            
            mostrarAlerta('success', `${nuevosAdjuntos.length} archivo(s) subido(s) correctamente`);
        } else {
            const error = await response.text();
            mostrarAlerta('error', `Error subiendo archivos: ${error}`);
        }
    } catch (error) {
        console.error('Error subiendo adjuntos:', error);
        mostrarAlerta('error', 'Error subiendo archivos');
    }
}

// Descargar adjunto
async function descargarAdjunto(adjuntoId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/adjuntos/${adjuntoId}/descargar`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Obtener el nombre del archivo del header Content-Disposition
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'archivo';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            mostrarAlerta('error', 'Error descargando archivo');
        }
    } catch (error) {
        console.error('Error descargando adjunto:', error);
        mostrarAlerta('error', 'Error descargando archivo');
    }
}

// Eliminar adjunto
async function eliminarAdjunto(adjuntoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/adjuntos/${adjuntoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remover del array local
            adjuntosActuales = adjuntosActuales.filter(a => a.id !== adjuntoId);
            renderizarAdjuntos();
            mostrarAlerta('success', 'Archivo eliminado correctamente');
        } else {
            const error = await response.text();
            mostrarAlerta('error', `Error eliminando archivo: ${error}`);
        }
    } catch (error) {
        console.error('Error eliminando adjunto:', error);
        mostrarAlerta('error', 'Error eliminando archivo');
    }
}

// Obtener ID de la actividad desde la URL
function obtenerActividadId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Formatear tamaño de archivo
function formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar alertas
function mostrarAlerta(tipo, mensaje) {
    // Ocultar todas las alertas
    document.querySelectorAll('.alert-fixed').forEach(alert => {
        alert.classList.add('d-none');
    });

    // Mostrar la alerta correspondiente
    const alertId = tipo + 'Alert';
    const alert = document.getElementById(alertId);
    if (alert) {
        const messageElement = alert.querySelector('span');
        if (messageElement) {
            messageElement.textContent = mensaje;
        }
        alert.classList.remove('d-none');
        
        // Auto-ocultar después de 3 segundos (excepto loading)
        if (tipo !== 'loading') {
            setTimeout(() => {
                alert.classList.add('d-none');
            }, 3000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar adjuntos si estamos en una actividad existente
    if (obtenerActividadId()) {
        cargarAdjuntos();
    }
});
