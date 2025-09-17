/**
 * Sistema de mensajería para UB Formación
 * Gestiona hilos de mensajes, notificaciones y adjuntos
 */

const Mensajeria = {
    API_BASE_URL: '/api',
    usuarioActual: null,
    
    // Inicializar módulo de mensajería
    init() {
        this.obtenerUsuarioActual();
    },
    
    // Obtener información del usuario actual
    obtenerUsuarioActual() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                this.usuarioActual = JSON.parse(userData);
            }
        } catch (e) {
            console.error('Error obteniendo usuario actual:', e);
        }
    },
    
    // Crear nuevo hilo de mensajes
    async crearHilo(actividadId, titulo, descripcion, contenidoPrimerMensaje) {
        try {
            const resp = await fetch(`${this.API_BASE_URL}/mensajes/hilos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    ActividadId: actividadId,
                    Titulo: titulo,
                    Descripcion: descripcion,
                    ContenidoPrimerMensaje: contenidoPrimerMensaje
                })
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error creando hilo:', e);
            throw e;
        }
    },
    
    // Obtener hilos de mensajes
    async obtenerHilos(actividadId = null) {
        try {
            let url = `${this.API_BASE_URL}/mensajes/hilos`;
            const params = new URLSearchParams();
            
            if (actividadId) params.append('actividadId', actividadId);
            if (this.usuarioActual) params.append('usuarioId', this.usuarioActual.id);
            
            if (params.toString()) url += '?' + params.toString();
            
            const resp = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error obteniendo hilos:', e);
            throw e;
        }
    },
    
    // Obtener mensajes de un hilo
    async obtenerMensajes(hiloId) {
        try {
            let url = `${this.API_BASE_URL}/mensajes/hilos/${hiloId}/mensajes`;
            if (this.usuarioActual) {
                url += `?usuarioId=${this.usuarioActual.id}`;
            }
            
            const resp = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error obteniendo mensajes:', e);
            throw e;
        }
    },
    
    // Enviar nuevo mensaje
    async enviarMensaje(hiloId, contenido, asunto = null, adjuntos = null) {
        try {
            const formData = new FormData();
            formData.append('HiloMensajeId', hiloId);
            formData.append('Contenido', contenido);
            if (asunto) formData.append('Asunto', asunto);
            
            if (adjuntos) {
                for (let i = 0; i < adjuntos.length; i++) {
                    formData.append('Adjuntos', adjuntos[i]);
                }
            }
            
            const resp = await fetch(`${this.API_BASE_URL}/mensajes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: formData
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error enviando mensaje:', e);
            throw e;
        }
    },
    
    // Marcar mensaje como leído
    async marcarComoLeido(mensajeId) {
        try {
            if (!this.usuarioActual) return;
            
            const resp = await fetch(`${this.API_BASE_URL}/mensajes/${mensajeId}/leer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({
                    MensajeId: mensajeId,
                    UsuarioId: this.usuarioActual.id
                })
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error marcando mensaje como leído:', e);
            throw e;
        }
    },
    
    // Obtener resumen de mensajes para una actividad
    async obtenerResumenActividad(actividadId) {
        try {
            let url = `${this.API_BASE_URL}/mensajes/actividad/${actividadId}/resumen`;
            if (this.usuarioActual) {
                url += `?usuarioId=${this.usuarioActual.id}`;
            }
            
            const resp = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${Auth.getToken()}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            return await resp.json();
        } catch (e) {
            console.error('Error obteniendo resumen:', e);
            throw e;
        }
    },
    
    // Funciones auxiliares
    formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    formatearTamaño(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    
    escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
};

// Inicializar automáticamente cuando se carga el script
if (typeof window !== 'undefined') {
    window.Mensajeria = Mensajeria;
    document.addEventListener('DOMContentLoaded', () => Mensajeria.init());
}
