/**
 * Editar Actividad - Sistema de Gestión de Actividades Formativas UB
 * Implementación completa en JavaScript moderno con conexión al backend real
 * NO carga datos de ejemplo - solo datos reales de la base de datos
 */

// ===== CONFIGURACIÓN GLOBAL =====
const __proto = (typeof window !== 'undefined' && window.location) ? window.location.protocol : 'http:';
const __host = (typeof window !== 'undefined' && window.location) ? window.location.hostname : 'localhost';
const __apiBase = '/api';
const CONFIG = {
                API_BASE_URL: __apiBase,
                DEBUG: true,
                TIMEOUT: 30000
            };

// ===== ESTADO GLOBAL =====
let globalState = {
    actividad: {},
    estados: [],
    unidadesGestion: [],
    loading: false,
    initialized: false
};

// ===== UTILIDADES =====
const Utils = {
    log: (message, data = null) => {
        if (CONFIG.DEBUG) {
            console.log(`[EditarActividad] ${message}`, data);
        }
    },
    
    error: (message, error = null) => {
        console.error(`[EditarActividad] ERROR: ${message}`, error);
    },
    
    showAlert: (type, message, duration = 5000) => {
        const alertId = `${type}Alert`;
        const alert = document.getElementById(alertId);
        const messageSpan = document.getElementById(`${type}Message`);
        
        if (alert && messageSpan) {
            messageSpan.textContent = message;
            alert.classList.remove('d-none');
            
            setTimeout(() => {
                alert.classList.add('d-none');
            }, duration);
        }
    },
    
    showLoading: (message = 'Cargando...') => {
        const loadingAlert = document.getElementById('loadingAlert');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (loadingAlert && loadingMessage) {
            loadingMessage.textContent = message;
            loadingAlert.classList.remove('d-none');
        }
        
        globalState.loading = true;
        document.body.classList.add('loading');
    },
    
    hideLoading: () => {
        const loadingAlert = document.getElementById('loadingAlert');
        if (loadingAlert) {
            loadingAlert.classList.add('d-none');
        }
        
        globalState.loading = false;
        document.body.classList.remove('loading');
    },
    
    getUrlParameter: (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
};

// ===== FUNCIONES DE TRADUCCIÓN =====
function toggleTraduccion(type) {
    const traduccionId = `traduccion${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const traduccion = document.getElementById(traduccionId);
    
    if (traduccion) {
        traduccion.classList.toggle('d-none');
    }
}

// ===== FUNCIONES DE MÁSCARAS =====
function aplicarMascaraDecimal(elemento) {
    if (!elemento) return;
    
    elemento.addEventListener('input', function(e) {
        let valor = e.target.value;
        
        // Permitir solo números, comas y puntos
        valor = valor.replace(/[^\d,.-]/g, '');
        
        // Asegurar que solo haya una coma decimal
        const partes = valor.split(',');
        if (partes.length > 2) {
            valor = partes[0] + ',' + partes.slice(1).join('');
        }
        
        // Limitar a 2 decimales después de la coma
        if (partes.length === 2 && partes[1].length > 2) {
            valor = partes[0] + ',' + partes[1].substring(0, 2);
        }
        
        // No permitir más de un punto (para miles)
        const puntos = valor.split('.');
        if (puntos.length > 2) {
            valor = puntos[0] + '.' + puntos.slice(1).join('');
        }
        
        e.target.value = valor;
    });
    
    elemento.addEventListener('blur', function(e) {
        let valor = e.target.value;
        
        // Convertir coma a punto para cálculos internos
        if (valor.includes(',')) {
            valor = valor.replace(',', '.');
        }
        
        // Validar que sea un número válido
        const numero = parseFloat(valor);
        if (!isNaN(numero) && numero >= 0) {
            // Formatear con coma como separador decimal
            e.target.value = numero.toFixed(2).replace('.', ',');
        } else if (valor !== '') {
            // Si no es válido, limpiar
            e.target.value = '';
        }
    });
    
    elemento.addEventListener('focus', function(e) {
        // Al hacer focus, convertir coma a punto para edición
        let valor = e.target.value;
        if (valor.includes(',')) {
            e.target.value = valor.replace(',', '.');
        }
    });
}

// Aplicar máscaras a todos los campos decimales
function aplicarMascarasDecimales() {
    const camposDecimales = document.querySelectorAll('[data-mask="decimal"]');
    camposDecimales.forEach(campo => {
        aplicarMascaraDecimal(campo);
    });
}

// ===== FUNCIONES DE FORMULARIOS DINÁMICOS =====
function addSubactividad() {
    const container = document.getElementById('subactividadesContainer');
    if (!container) return;
    
    const subactividadId = `subactividad_${Date.now()}`;
    const subactividadDiv = document.createElement('div');
    subactividadDiv.className = 'card-dynamic mb-3';
    subactividadDiv.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Subactividad</h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="duplicarSubactividad(this)">
                    <i class="bi bi-copy"></i> Duplicar
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarSubactividad(this)">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Título *</label>
                    <input class="form-control" id="${subactividadId}_titulo" required/>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Modalidad</label>
                    <select class="form-select" id="${subactividadId}_modalidad">
                        <option value="">Seleccionar...</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Online">Online</option>
                        <option value="Mixta">Mixta</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Docente/s</label>
                    <input class="form-control" id="${subactividadId}_docente"/>
                </div>
                <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" rows="2" id="${subactividadId}_descripcion"></textarea>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(subactividadDiv);
}

function addParticipante() {
    const container = document.getElementById('participantesContainer');
    if (!container) return;
    
    const participanteId = `participante_${Date.now()}`;
    const participanteDiv = document.createElement('div');
    participanteDiv.className = 'card-dynamic mb-3';
    participanteDiv.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Participante</h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="duplicarParticipante(this)">
                    <i class="bi bi-copy"></i> Duplicar
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarParticipante(this)">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Nombre *</label>
                    <input class="form-control" id="${participanteId}_nombre" required/>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Rol</label>
                    <select class="form-select" id="${participanteId}_rol">
                        <option value="">Seleccionar...</option>
                        <option value="Ponente">Ponente</option>
                        <option value="Coordinación">Coordinación</option>
                        <option value="Invitado">Invitado</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="${participanteId}_email"/>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(participanteDiv);
}

function addColaboradora() {
    const container = document.getElementById('colaboradorasContainer');
    if (!container) return;
    
    const colaboradoraId = `colaboradora_${Date.now()}`;
    const colaboradoraDiv = document.createElement('div');
    colaboradoraDiv.className = 'card-dynamic mb-3';
    colaboradoraDiv.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Entidad Colaboradora</h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarColaboradora(this)">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Nombre *</label>
                    <input class="form-control" id="${colaboradoraId}_nombre" required/>
                </div>
                <div class="col-md-3">
                    <label class="form-label">NIF/CIF</label>
                    <input class="form-control" id="${colaboradoraId}_nif"/>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Web</label>
                    <input class="form-control" id="${colaboradoraId}_web" placeholder="https://..."/>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Persona de contacto</label>
                    <input class="form-control" id="${colaboradoraId}_contacto"/>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="${colaboradoraId}_email"/>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Teléfono</label>
                    <input class="form-control" id="${colaboradoraId}_telefono"/>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(colaboradoraDiv);
}

// Funciones de eliminación
function eliminarSubactividad(button) {
    const card = button.closest('.card-dynamic');
    if (card) card.remove();
}

function eliminarParticipante(button) {
    const card = button.closest('.card-dynamic');
    if (card) card.remove();
}

function eliminarColaboradora(button) {
    const card = button.closest('.card-dynamic');
    if (card) card.remove();
}

function duplicarSubactividad(button) {
    const card = button.closest('.card-dynamic');
    if (card) {
        const newCard = card.cloneNode(true);
        const newId = `subactividad_${Date.now()}`;
        
        newCard.querySelectorAll('[id]').forEach(element => {
            element.id = element.id.replace(/subactividad_\d+/, newId);
        });
        
        newCard.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        
        card.parentNode.insertBefore(newCard, card.nextSibling);
    }
}

function duplicarParticipante(button) {
    const card = button.closest('.card-dynamic');
    if (card) {
        const newCard = card.cloneNode(true);
        const newId = `participante_${Date.now()}`;
        
        newCard.querySelectorAll('[id]').forEach(element => {
            element.id = element.id.replace(/participante_\d+/, newId);
        });
        
        newCard.querySelectorAll('input, select').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        
        card.parentNode.insertBefore(newCard, card.nextSibling);
    }
}

// ===== FUNCIONES PRINCIPALES =====
async function cargarDominios() {
    Utils.log('Cargando dominios para los selects...');
    
    try {
        // Mapeo de campos a nombres de dominio
        const mapeoDominios = {
            'lineaEstrategica': 'LINEAS_ESTRATEGICAS',
            'objetivoEstrategico': 'OBJETIVOS_ESTRATEGICOS',
            // ActividadReservada es boolean en backend → usar Sí/No
            'actividadReservada': 'OPCIONES_SI_NO',
            'centroUnidadUBDestinataria': 'CENTROS_UB',
            'centroTrabajoRequerido': 'OPCIONES_SI_NO',
            'tipoActividad': 'TIPOS_ACTIVIDAD',
            'modalidadGestion': 'MODALIDADES_GESTION'
        };
        
        // Cargar cada dominio
        for (const [campoId, nombreDominio] of Object.entries(mapeoDominios)) {
            try {
                Utils.log(`Intentando cargar dominio ${nombreDominio} para campo ${campoId}...`);
                const response = await fetch(`${CONFIG.API_BASE_URL}/dominios/${nombreDominio}/valores`);
                if (response.ok) {
                    const valores = await response.json();
                    Utils.log(`Dominio ${nombreDominio} recibido:`, valores);
                    await poblarSelect(campoId, valores);
                    Utils.log(`Dominio ${nombreDominio} cargado: ${valores.length} opciones`);
                } else {
                    Utils.error(`Error HTTP cargando dominio ${nombreDominio}: ${response.status}`);
                }
            } catch (error) {
                Utils.error(`Error cargando dominio ${nombreDominio}:`, error);
            }
        }
        
        // Cargar unidades de gestión
        await cargarUnidadesGestion();
        // Cargar estados para selector de cabecera
        await cargarEstadosActividad();
        
        Utils.log('Dominios cargados correctamente');
        
    } catch (error) {
        Utils.error('Error cargando dominios:', error);
    }
}

// Cargar estados (para uso interno del badge) - sin renderizar select
async function cargarEstadosActividad() {
    try {
        // Usar siempre la ruta de la API para leer estados (sin depender del select)
        const headers = { 'Accept': 'application/json' };
        try {
            if (typeof Auth !== 'undefined' && Auth.getToken()) {
                headers['Authorization'] = `Bearer ${Auth.getToken()}`;
            }
        } catch {}
        const response = await fetch(`${CONFIG.API_BASE_URL}/estados`, { headers });
        if (response.ok) {
            const estados = await response.json();
            if (Array.isArray(estados) && estados.length) {
                window.__estadosCache = estados;
            }
        }
        // Actualizar siempre el badge aunque el select no exista
        actualizarBadgeEstadoDesdeBD();
    } catch (e) {
        Utils.error('Error cargando estados', e);
    }
}

function actualizarBadgeEstadoDesdeBD() {
    const badge = document.getElementById('estadoBadge');
    if (!badge) return;
    const hiddenEstado = document.getElementById('actividadEstadoId')?.value;
    let nombre = '—';
    let color = '#6c757d';
    if (hiddenEstado) {
        const idNum = parseInt(hiddenEstado, 10);
        const estados = Array.isArray(window.__estadosCache) ? window.__estadosCache : [];
        const est = estados.find(e => Number(e.id) === idNum);
        if (est) {
            nombre = est.nombre ?? `Estado ${hiddenEstado}`;
            color = est.color || color;
        } else {
            nombre = `Estado ${hiddenEstado}`;
        }
    }
    badge.style.background = color;
    badge.innerHTML = `<i class="bi bi-check-circle me-2"></i>${nombre}`;
}

async function onCambioEstado() {
    try {
        const sel = document.getElementById('estadoSelect');
        const actividadId = Utils.getUrlParameter('id') || '0';
        const estadoId = parseInt(sel.value, 10);
        if (!estadoId || !actividadId) return;
        Utils.showLoading('Actualizando estado...');
        const resp = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ estadoId })
        });
        Utils.hideLoading();
        if (!resp.ok) {
            const txt = await resp.text();
            Utils.showAlert('error', `Error cambiando estado: ${txt || resp.status}`);
            return;
        }
        actualizarBadgeEstadoDesdeSelect();
        // Refrescar reloj con último cambio de estado
        try {
            const respHist = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/estado/historial/ultimo`);
            if (respHist.ok) {
                const h = await respHist.json();
                const reloj = document.getElementById('fechaUpdate');
                if (reloj && h?.fechaCambio) {
                    const f = new Date(h.fechaCambio);
                    reloj.textContent = isNaN(f.getTime()) ? h.fechaCambio : f.toLocaleString();
                }
            }
        } catch {}
        Utils.showAlert('success', 'Estado actualizado');
    } catch (e) {
        Utils.hideLoading();
        Utils.showAlert('error', 'Error cambiando estado');
        Utils.error('onCambioEstado', e);
    }
}

// Simular contador de mensajes (placeholder)
function actualizarMensajesHeader(noLeidos, total) {
    const badge = document.getElementById('mensajesBadge');
    if (!badge) return;
    badge.textContent = String(noLeidos ?? 0);
    badge.classList.toggle('d-none', !noLeidos);
}

async function poblarSelect(campoId, valores) {
    Utils.log(`Poblando select ${campoId} con ${valores.length} valores`);
    
    const select = document.getElementById(campoId);
    if (!select) {
        Utils.log(`Select no encontrado: ${campoId}`);
        return;
    }
    
    // Limpiar opciones existentes
    select.innerHTML = '';
    
    // Agregar opción por defecto
    const opcionDefault = document.createElement('option');
    opcionDefault.value = '';
    opcionDefault.textContent = 'Seleccionar...';
    select.appendChild(opcionDefault);
    
    // Agregar opciones del dominio
    valores.forEach((valor, index) => {
        const option = document.createElement('option');
        option.value = valor.valor;
        option.textContent = valor.descripcion || valor.valor;
        select.appendChild(option);
        Utils.log(`  Opción ${index + 1}: ${valor.valor} - ${valor.descripcion || valor.valor}`);
    });
    
    Utils.log(`Select ${campoId} poblado con ${valores.length + 1} opciones (incluyendo "Seleccionar...")`);
}

async function cargarUnidadesGestion() {
    try {
        Utils.log('Cargando unidades de gestión...');
        const response = await fetch(`${CONFIG.API_BASE_URL}/unidades-gestion`);
        if (response.ok) {
            const unidades = await response.json();
            Utils.log(`Unidades de gestión recibidas:`, unidades);
            await poblarSelect('actividadUnidadGestion', unidades.map(u => ({ valor: u.id.toString(), descripcion: u.nombre })));
            Utils.log(`Unidades de gestión cargadas: ${unidades.length}`);
        } else {
            Utils.log(`Error HTTP cargando unidades de gestión: ${response.status}`);
        }
    } catch (error) {
        Utils.error('Error cargando unidades de gestión:', error);
    }
}

async function guardarActividad() {
    if (globalState.loading) return;
    
    try {
        Utils.showLoading('Guardando actividad...');
        
        // Recoger todos los datos del formulario
        const datosActividad = recogerDatosFormulario();
        
        // Validar datos obligatorios
        if (!validarDatosObligatorios(datosActividad)) {
            Utils.hideLoading();
            return;
        }
        
        // Obtener ID de la actividad
        const actividadId = Utils.getUrlParameter('id') || '60';
        
        // Log de datos que se van a enviar
        Utils.log('Datos que se van a enviar al backend:', datosActividad);
        
        // Log completo de la llamada API
        const url = `${CONFIG.API_BASE_URL}/actividades/${actividadId}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        console.log('=== LLAMADA API COMPLETA ===');
        console.log('URL:', url);
        console.log('Method:', 'PUT');
        console.log('Headers:', headers);
        console.log('Body (JSON):', JSON.stringify(datosActividad, null, 2));
        console.log('Body (string):', JSON.stringify(datosActividad));
        console.log('============================');
        
        // Enviar datos al backend
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosActividad)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            Utils.hideLoading();
            Utils.showAlert('success', 'Actividad guardada correctamente');
            Utils.log('Actividad guardada:', resultado);
            
            // Recargar datos para confirmar cambios
            await cargarDatosReales(actividadId);
        } else {
            let detalle = '';
            try {
                detalle = await response.text();
            } catch {}
            Utils.error('Respuesta de error del backend:', { status: response.status, statusText: response.statusText, body: detalle });
            throw new Error(`HTTP ${response.status}: ${detalle || response.statusText}`);
        }
        
    } catch (error) {
        Utils.hideLoading();
        Utils.error('Error guardando actividad:', error);
        Utils.showAlert('error', `Error guardando actividad: ${error.message}`);
        
        // Log completo del error
        console.log('=== ERROR COMPLETO ===');
        console.log('Error:', error);
        console.log('Error.message:', error.message);
        console.log('Error.stack:', error.stack);
        console.log('=====================');
    }
}

async function guardarBorrador() {
    if (globalState.loading) return;
    
    try {
        Utils.showLoading('Guardando borrador...');
        
        // Recoger todos los datos del formulario
        const datosActividad = recogerDatosFormulario();
        
        // Para borrador, no validamos campos obligatorios
        datosActividad.esBorrador = true;
        
        // Obtener ID de la actividad
        const actividadId = Utils.getUrlParameter('id') || '60';
        
        // Enviar datos al backend como borrador
        const response = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/borrador`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(datosActividad)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            Utils.hideLoading();
            Utils.showAlert('success', 'Borrador guardado correctamente');
            Utils.log('Borrador guardado:', resultado);
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        Utils.hideLoading();
        Utils.error('Error guardando borrador:', error);
        Utils.showAlert('error', `Error guardando borrador: ${error.message}`);
    }
}

function rellenarConDatosPrueba() {
    if (globalState.loading) return;
    
    Utils.showAlert('warning', 'Función deshabilitada - Solo se cargan datos reales de la base de datos');
    // NO cargar datos de prueba - solo datos reales del backend
}

// ===== INICIALIZACIÓN =====
async function initEditarActividad() {
    try {
        Utils.log('Inicializando página de edición de actividad');
        
        // Obtener ID de la actividad desde la URL
        const actividadId = Utils.getUrlParameter('id') || '60';
        Utils.log('ID de actividad obtenido:', actividadId);
        
        // Asignar a variable global para uso en mensajería
        window.ACTIVIDAD_ID = actividadId;
        
        // Establecer ID en el formulario
        const idField = document.getElementById('actividadId');
        if (idField) {
            idField.value = actividadId;
        }
        
        // PRIMERO: Cargar dominios para los selects
        Utils.showLoading('Cargando dominios y opciones...');
        await cargarDominios();
        
        // SEGUNDO: Intentar cargar datos reales desde el backend
        Utils.showLoading('Conectando con el backend para recuperar datos...');
        
        try {
            await cargarDatosReales(actividadId);
            Utils.hideLoading();
            Utils.showAlert('success', `Actividad ${actividadId} cargada correctamente desde el backend`);
        } catch (error) {
            Utils.hideLoading();
            Utils.log('Error conectando con backend:', error);
            Utils.showAlert('error', 'No se pudo conectar con el backend. Los campos permanecen en blanco.');
            
            // NO CARGAR DATOS DE EJEMPLO - Dejar campos en blanco
            limpiarFormulario();
        }
        
        // Marcar como inicializado
        globalState.initialized = true;
        Utils.log('Página de edición inicializada correctamente');
        
        // Cargar resumen de mensajes después de la inicialización
        setTimeout(() => {
            cargarResumenMensajes();
        }, 500);
        
    } catch (error) {
        Utils.error('Error inicializando página de edición', error);
        Utils.showAlert('error', 'Error inicializando la página: ' + error.message);
    }
}

// NUEVA FUNCIÓN: Cargar datos reales desde el backend
async function cargarDatosReales(actividadId) {
    Utils.log(`Intentando cargar datos reales de actividad ${actividadId} desde el backend...`);
    
    try {
        // Construir URL de la API
        const apiUrl = `${CONFIG.API_BASE_URL}/actividades/${actividadId}`;
        Utils.log('Conectando a:', apiUrl);
        
        // Realizar petición HTTP al backend
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const actividad = await response.json();
        Utils.log('Datos recibidos del backend:', actividad);
        
        // Aplicar los datos reales al formulario
        await aplicarDatosReales(actividad);
        
        // Cargar entidades relacionadas
        await cargarEntidadesRelacionadasReales(actividadId);

        // Nota: no consultar historial en carga inicial para evitar 404 si aún no hay registros
        
        Utils.log('Datos reales aplicados correctamente');
        
        // Cargar transiciones permitidas después de cargar los datos de la actividad
        if (typeof cargarTransicionesPermitidas === 'function') {
            // Esperar un poco para asegurar que todo esté cargado
            await new Promise(resolve => setTimeout(resolve, 100));
            await cargarTransicionesPermitidas();
        }
        
        // Aplicar permisos de edición según estado/rol
        try {
            const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
            const userRole = user?.rol || user?.Rol || '';
            const normalizedRole = normalizeRoleForWorkflow(userRole);
            const estadoId = (actividad.estadoId ?? actividad.EstadoId ?? actividad.estado?.id ?? actividad.Estado?.Id);
            let estadoCodigo = null;
            try {
                const cache = (window.__estadosCache || []);
                if (cache && cache.length) {
                    const found = cache.find(e => e.id === parseInt(estadoId, 10));
                    estadoCodigo = found ? (found.codigo || found.Codigo) : null;
                }
            } catch {}
            await aplicarPermisosEdicion(normalizedRole, estadoCodigo);
        } catch (e) { Utils.log('Aplicación de permisos de edición omitida:', e); }
        
    } catch (error) {
        Utils.error('Error cargando datos reales:', error);
        throw error; // Re-lanzar para que se maneje en el catch superior
    }
}

// NUEVA FUNCIÓN: Aplicar datos reales al formulario
async function aplicarDatosReales(actividad) {
    Utils.log('Aplicando datos reales al formulario...');
    
    // Mapeo de campos del backend a IDs del formulario
    const mapeoCampos = {
        // Campos principales
        'codigo': 'actividadCodigo',
        'titulo': 'actividadTitulo',
        'descripcion': 'descripcion',
        'tipoActividad': 'tipoActividad',
        'unidadGestionId': 'actividadUnidadGestion',
        'condicionesEconomicas': 'condicionesEconomicas',
        'anioAcademico': 'actividadAnioAcademico',
        'lineaEstrategica': 'lineaEstrategica',
        'objetivoEstrategico': 'objetivoEstrategico',
        'codigoRelacionado': 'codigoRelacionado',
        'actividadReservada': 'actividadReservada',
        'fechaActividad': 'fechaActividad',
        'motivoCierre': 'motivoCierre',
        'personaSolicitante': 'personaSolicitante',
        'coordinador': 'coordinador',
        'jefeUnidadGestora': 'jefeUnidadGestora',
        'gestorActividad': 'gestorActividad',
        'facultadDestinataria': 'facultadDestinataria',
        'departamentoDestinatario': 'departamentoDestinatario',
        'centroUnidadUBDestinataria': 'centroUnidadUBDestinataria',
        'otrosCentrosInstituciones': 'otrosCentrosInstituciones',
        'plazasTotales': 'plazasTotales',
        'horasTotales': 'horasTotales',
        'centroTrabajoRequerido': 'centroTrabajoRequerido',
        'modalidadGestion': 'modalidadGestion',
        'fechaInicioImparticion': 'fechaInicioImparticion',
        'fechaFinImparticion': 'fechaFinImparticion',
        'actividadPago': 'actividadPago',
        'fechaInicio': 'fechaInicio',
        'fechaFin': 'fechaFin',
        'lugar': 'lugar',
        
        // Campos específicos por UG
        'coordinadorCentreUnitat': 'coordinadorCentreUnitat',
        'centreTreballeAlumne': 'centreTreballeAlumne',
        'creditosTotalesCRAI': 'creditosTotalesCRAI',
        'creditosTotalesSAE': 'creditosTotalesSAE',
        'creditosMinimosSAE': 'creditosMinimosSAE',
        'creditosMaximosSAE': 'creditosMaximosSAE',
        'tipusEstudiSAE': 'tipusEstudiSAE',
        'categoriaSAE': 'categoriaSAE',
        'competenciesSAE': 'competenciesSAE',
        
        // Campos de inscripción
        'inscripcionInicio': 'inscripcionInicio',
        'inscripcionFin': 'inscripcionFin',
        'inscripcionPlazas': 'inscripcionPlazas',
        'inscripcionListaEspera': 'inscripcionListaEspera',
        'inscripcionModalidad': 'inscripcionModalidad',
        'inscripcionRequisitosES': 'inscripcionRequisitosES',
        'inscripcionRequisitosCA': 'inscripcionRequisitosCA',
        'inscripcionRequisitosEN': 'inscripcionRequisitosEN',
        
        // Campos de programa
        'programaDescripcionES': 'programaDescripcionES',
        'programaDescripcionCA': 'programaDescripcionCA',
        'programaDescripcionEN': 'programaDescripcionEN',
        'programaContenidosES': 'programaContenidosES',
        'programaContenidosCA': 'programaContenidosCA',
        'programaContenidosEN': 'programaContenidosEN',
        'programaObjetivosES': 'programaObjetivosES',
        'programaObjetivosCA': 'programaObjetivosCA',
        'programaObjetivosEN': 'programaObjetivosEN',
        'programaDuracion': 'programaDuracion',
        'programaInicio': 'programaInicio',
        'programaFin': 'programaFin',
        
        // Campos de traducción del título
        'tituloCA': 'actividadTituloCA',
        'tituloES': 'actividadTituloES',
        'tituloEN': 'actividadTituloEN',
        
        // Campos de estado
        'estadoId': 'actividadEstadoId',
        'fechaCreacion': 'fechaCreacion',
        'fechaModificacion': 'fechaUpdate',
        // Estado: guardar el id en hidden para pintar el badge
        'estadoId': 'actividadEstadoId',
        'responsablePropuesta': 'responsablePropuesta',
        
        // Campos adicionales que faltaban
        'lugar': 'lugar',
        'actividadPago': 'actividadPago',
        'actividadReservada': 'actividadReservada',
        'motivoCierre': 'motivoCierre',
        'lineaEstrategica': 'lineaEstrategica',
        'objetivoEstrategico': 'objetivoEstrategico',
        'centroUnidadUBDestinataria': 'centroUnidadUBDestinataria',
        'centroTrabajoRequerido': 'centroTrabajoRequerido',
        'unidadGestionId': 'actividadUnidadGestion'
    };
    
    // Aplicar cada campo del backend al formulario
    Object.keys(mapeoCampos).forEach(campoBackend => {
        const campoFormulario = mapeoCampos[campoBackend];
        const valor = actividad[campoBackend];
        
        if (valor !== undefined && valor !== null) {
            const elemento = document.getElementById(campoFormulario);
            if (elemento) {
                if (elemento.type === 'checkbox') {
                    elemento.checked = Boolean(valor);
                } else if (elemento.tagName === 'SELECT') {
                    // Para selects, buscar la opción que coincida con el valor
                    const opciones = Array.from(elemento.options);
                    
                    // Convertir valor a string para comparación
                    let valorComparar = valor;
                    if (typeof valor === 'boolean') {
                        valorComparar = valor ? 'S' : 'N'; // Convertir True/False a S/N
                    } else if (valor === null || valor === undefined) {
                        valorComparar = ''; // Dejar en "Seleccionar..."
                    } else {
                        // Caso especial: estadoId -> IDs 6..9
                        if (campoFormulario === 'actividadEstadoId') {
                            valorComparar = String(parseInt(valor, 10));
                        } else {
                            valorComparar = valor.toString();
                        }
                    }
                    
                    Utils.log(`Buscando opción para select ${campoFormulario}: valor=${valor}, valorComparar=${valorComparar}`);
                    
                                         // Búsqueda más flexible: por valor exacto, por texto, y por coincidencia parcial
                     const opcionEncontrada = opciones.find(opcion => {
                         // Opción 1: Para booleanos, buscar "Sí"/"No" o "S"/"N" (excluir "Seleccionar...") - PRIORIDAD ALTA
                         if (typeof valor === 'boolean') {
                             const textoOpcion = opcion.textContent.toLowerCase();
                             // Solo buscar en opciones que no sean "Seleccionar..."
                             if (opcion.value !== '' && opcion.textContent !== 'Seleccionar...') {
                                 const buscaS = valor && (textoOpcion.includes('sí') || textoOpcion.includes('si') || textoOpcion.includes('s'));
                                 const buscaN = !valor && (textoOpcion.includes('no') || textoOpcion.includes('n'));
                                 if (buscaS || buscaN) {
                                     Utils.log(`  Opción encontrada por booleano: "${opcion.textContent}" para valor ${valor}`);
                                     return true;
                                 }
                             }
                         }
                         
                         // Opción 2: Valor exacto
                         if (opcion.value === valorComparar) {
                             Utils.log(`  Opción encontrada por valor exacto: "${opcion.value}"`);
                             return true;
                         }
                         
                         // Opción 3: Texto exacto
                         if (opcion.textContent === valorComparar) {
                             Utils.log(`  Opción encontrada por texto exacto: "${opcion.textContent}"`);
                             return true;
                         }
                         
                         // Opción 4: Incluye el valor (PRIORIDAD BAJA - solo si no es booleano)
                         if (typeof valor !== 'boolean' && opcion.textContent.includes(valorComparar)) {
                             Utils.log(`  Opción encontrada por inclusión: "${opcion.textContent}" incluye "${valorComparar}"`);
                             return true;
                         }
                         
                         return false;
                     });
                    
                    if (opcionEncontrada) {
                        elemento.value = opcionEncontrada.value;
                        Utils.log(`Select ${campoFormulario} configurado con valor: ${valor} -> ${opcionEncontrada.value} ("${opcionEncontrada.textContent}")`);
                    } else {
                        // Si no se encuentra, dejar en "Seleccionar..." y loggear
                        elemento.value = '';
                        Utils.log(`Valor no encontrado en select ${campoFormulario}: ${valor} (tipo: ${typeof valor})`);
                        Utils.log(`Opciones disponibles:`, opciones.map(op => ({ value: op.value, text: op.textContent })));
                    }
                } else if (elemento.type === 'date' && valor) {
                    // Convertir fechas ISO a formato yyyy-MM-dd para inputs de tipo date
                    try {
                        const fecha = new Date(valor);
                        if (!isNaN(fecha.getTime())) {
                            elemento.value = fecha.toISOString().split('T')[0];
                        } else {
                            elemento.value = valor.toString();
                        }
                    } catch (e) {
                        elemento.value = valor.toString();
                    }
                } else if (elemento.id === 'fechaUpdate' && valor) {
                    // Mostrar fecha legible (última modificación o cambio de estado) en el bloque de reloj
                    try {
                        const fecha = new Date(valor);
                        elemento.textContent = isNaN(fecha.getTime()) ? valor.toString() : fecha.toLocaleString();
                    } catch {
                        elemento.textContent = valor.toString();
                    }
                } else if (elemento.id === 'fechaCreacion' && valor) {
                    // Mostrar fecha de creación en el bloque de calendario
                    try {
                        const fecha = new Date(valor);
                        elemento.textContent = isNaN(fecha.getTime()) ? valor.toString() : fecha.toLocaleString();
                    } catch {
                        elemento.textContent = valor.toString();
                    }
                } else {
                    elemento.value = valor.toString();
                }
                Utils.log(`Campo ${campoFormulario} configurado con valor real: ${valor}`);
            } else {
                Utils.log(`Campo del formulario no encontrado: ${campoFormulario}`);
            }
        }
    });

    // Mostrar información del usuario autor
    const responsableSpan = document.getElementById('responsablePropuesta');
    if (responsableSpan) {
        let usernameAutor = null;
        // 1) Preferir username anidado en la navegación del autor
        try {
            const autorObj = actividad.usuarioAutor || actividad.UsuarioAutor;
            if (autorObj) {
                usernameAutor = autorObj.username || autorObj.Username || autorObj.nombre || autorObj.Nombre || null;
            }
        } catch {}
        // 2) Username/Nombre plano si el backend lo envía
        if (!usernameAutor) {
            if (actividad.usuarioAutorUsername && String(actividad.usuarioAutorUsername).trim().length > 0) {
                usernameAutor = actividad.usuarioAutorUsername;
            } else if (actividad.usuarioAutorNombre && String(actividad.usuarioAutorNombre).trim().length > 0) {
                usernameAutor = actividad.usuarioAutorNombre;
            }
        }
        // 3) Fallback: usuario autenticado si coincide con autorId
        if (!usernameAutor) {
            try {
                const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
                const autorIdPlano = actividad.usuarioAutorId || actividad.UsuarioAutorId;
                if (user && autorIdPlano && Number(user.id) === Number(autorIdPlano)) {
                    usernameAutor = user.username || user.nombre || user.name || null;
                }
            } catch {}
        }
        responsableSpan.textContent = usernameAutor || 'Usuario';
    }
    
    // Aplicar campos de entidad organizadora si existen
    if (actividad.entidadOrganizadora) {
        const entidad = actividad.entidadOrganizadora;
        const camposEntidad = {
            'nombre': 'org_principal',
            'nif': 'org_nif',
            'web': 'org_web',
            'personaContacto': 'org_contacto',
            'email': 'org_email',
            'telefono': 'org_tel'
        };
        
        Object.keys(camposEntidad).forEach(campoBackend => {
            const campoFormulario = camposEntidad[campoBackend];
            const valor = entidad[campoBackend];
            
            if (valor !== undefined && valor !== null) {
                const elemento = document.getElementById(campoFormulario);
                if (elemento) {
                    elemento.value = valor.toString();
                    Utils.log(`Entidad organizadora ${campoFormulario}: ${valor}`);
                }
            }
        });
    }
    
    // Aplicar campos de importe si existen
    if (actividad.importeDescuento) {
        const importe = actividad.importeDescuento;
        const camposImporte = {
            'importeBase': 'imp_base',
            'tipoImpuesto': 'imp_tipo',
            'porcentajeDescuento': 'imp_descuento_pct',
            'codigoPromocional': 'imp_codigo',
            'condicionesES': 'imp_condiciones_es',
            'condicionesCA': 'imp_condiciones_ca',
            'condicionesEN': 'imp_condiciones_en'
        };
        
        Object.keys(camposImporte).forEach(campoBackend => {
            const campoFormulario = camposImporte[campoBackend];
            const valor = importe[campoBackend];
            
            if (valor !== undefined && valor !== null) {
                const elemento = document.getElementById(campoFormulario);
                if (elemento) {
                    elemento.value = valor.toString();
                    Utils.log(`Importe ${campoFormulario}: ${valor}`);
                }
            }
        });
    }
    
    // Actualizar campos específicos por UG
    actualizarCamposUG();
    
    // Aplicar máscaras decimales después de cargar los datos
    aplicarMascarasDecimales();
    
    // Debug específico para los 3 campos problemáticos
    Utils.log('=== DEBUG CAMPOS PROBLEMÁTICOS ===');
    const camposProblema = ['actividadUnidadGestion', 'actividadReservada', 'centroTrabajoRequerido'];
    camposProblema.forEach(campoId => {
        const elemento = document.getElementById(campoId);
        if (elemento) {
            Utils.log(`Campo ${campoId}: valor="${elemento.value}", opciones=${elemento.options.length}`);
            if (elemento.tagName === 'SELECT') {
                Array.from(elemento.options).forEach((opcion, index) => {
                    Utils.log(`  Opción ${index}: "${opcion.value}" - "${opcion.textContent}"`);
                });
            }
        } else {
            Utils.log(`Campo ${campoId}: NO ENCONTRADO`);
        }
    });
    
    // Debug adicional para valores del backend
    Utils.log('=== DEBUG VALORES BACKEND ===');
    Utils.log(`unidadGestionId: ${actividad.unidadGestionId} (tipo: ${typeof actividad.unidadGestionId})`);
    Utils.log(`actividadReservada: ${actividad.actividadReservada} (tipo: ${typeof actividad.actividadReservada})`);
    Utils.log(`centroTrabajoRequerido: ${actividad.centroTrabajoRequerido} (tipo: ${typeof actividad.centroTrabajoRequerido})`);
    
    Utils.log('Datos reales aplicados al formulario correctamente');

    // Pintar el badge usando el caché de estados (si no está cargado aún, se cargará en paralelo)
    try {
        actualizarBadgeEstadoDesdeBD();
    } catch {}
}

// Normalización de roles a los del workflow
function normalizeRoleForWorkflow(rol) {
    if (!rol) return '';
    switch (rol) {
        case 'Admin': return 'Admin';
        case 'Gestor': return 'Coordinador/Técnico';
        case 'Usuario': return 'Docente/Dinamizador';
        default: return rol;
    }
}

function canEditByRoleAndState(normalizedRole, estadoCodigo) {
    if (!normalizedRole) return false;
    if (normalizedRole === 'Admin') return true;
    if (!estadoCodigo) return false;
    if (estadoCodigo === 'BORRADOR') {
        return normalizedRole === 'Docente/Dinamizador' || normalizedRole === 'Coordinador/Técnico';
    }
    if (estadoCodigo === 'DEFINICION') {
        return normalizedRole === 'Coordinador/Técnico';
    }
    return false;
}

async function aplicarPermisosEdicion(normalizedRole, estadoCodigo) {
    const editable = canEditByRoleAndState(normalizedRole, estadoCodigo);
    const container = document.querySelector('main');
    if (!container) return;
    const inputs = container.querySelectorAll('.form-section input, .form-section select, .form-section textarea');
    inputs.forEach(el => {
        const id = el.id || '';
        const isStateControl = id === 'nuevoEstadoSelect' || id === 'descripcionMotivos' || id === 'actividadId' || id === 'actividadEstadoId';
        if (isStateControl) return;
        el.disabled = !editable;
    });
    const actionButtons = container.querySelectorAll('#btnSubirAdjuntos, [onclick^="addSubactividad"], [onclick^="addParticipante"]');
    actionButtons.forEach(btn => btn.disabled = !editable);
    const root = document.getElementById('statusHeader');
    if (root) {
        const noteId = 'permisoNota';
        let note = document.getElementById(noteId);
        if (!editable) {
            if (!note) {
                note = document.createElement('div');
                note.id = noteId;
                note.className = 'text-muted small';
                note.innerHTML = '<i class="bi bi-lock"></i> Edición bloqueada para tu rol en este estado';
                root.appendChild(note);
            }
        } else if (note) {
            note.remove();
        }
    }
}

// NUEVA FUNCIÓN: Cargar entidades relacionadas reales
async function cargarEntidadesRelacionadasReales(actividadId) {
    Utils.log('Cargando entidades relacionadas reales...');
    
    try {
        // Cargar subactividades
        const subactividadesResponse = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/subactividades`);
        if (subactividadesResponse.ok) {
            const subactividades = await subactividadesResponse.json();
            await aplicarSubactividadesReales(subactividades);
        }
        
        // Cargar participantes
        const participantesResponse = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            await aplicarParticipantesReales(participantes);
        }
        
        // Cargar entidades colaboradoras
        const colaboradorasResponse = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/colaboradoras`);
        if (colaboradorasResponse.ok) {
            const colaboradoras = await colaboradorasResponse.json();
            await aplicarColaboradorasReales(colaboradoras);
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`${CONFIG.API_BASE_URL}/actividades/${actividadId}/importes`);
        if (importesResponse.ok) {
            const importes = await importesResponse.json();
            await aplicarImportesReales(importes);
        }
        
        Utils.log('Entidades relacionadas reales cargadas correctamente');
        
    } catch (error) {
        Utils.log('Error cargando entidades relacionadas:', error);
        // NO cargar datos de ejemplo - dejar en blanco
    }
}

// Funciones auxiliares para aplicar entidades relacionadas reales
async function aplicarSubactividadesReales(subactividades) {
    const container = document.getElementById('subactividadesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    subactividades.forEach(subactividad => {
        const subactividadId = `subactividad_${subactividad.id || Date.now()}`;
        const subactividadDiv = document.createElement('div');
        subactividadDiv.className = 'card-dynamic mb-3';
        subactividadDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Subactividad</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary btn-sm" onclick="duplicarSubactividad(this)">
                        <i class="bi bi-copy"></i> Duplicar
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarSubactividad(this)">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Título *</label>
                        <input class="form-control" id="${subactividadId}_titulo" value="${subactividad.titulo || ''}" required/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Modalidad</label>
                        <select class="form-select" id="${subactividadId}_modalidad">
                            <option value="">Seleccionar...</option>
                            <option value="Presencial" ${subactividad.modalidad === 'Presencial' ? 'selected' : ''}>Presencial</option>
                            <option value="Online" ${subactividad.modalidad === 'Online' ? 'selected' : ''}>Online</option>
                            <option value="Mixta" ${subactividad.modalidad === 'Mixta' ? 'selected' : ''}>Mixta</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Docente/s</label>
                        <input class="form-control" id="${subactividadId}_docente" value="${subactividad.docente || ''}"/>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Descripción</label>
                        <textarea class="form-control" rows="2" id="${subactividadId}_descripcion">${subactividad.descripcion || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(subactividadDiv);
    });
    
    Utils.log(`Subactividades cargadas: ${subactividades.length}`);
}

async function aplicarParticipantesReales(participantes) {
    const container = document.getElementById('participantesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    participantes.forEach(participante => {
        const participanteId = `participante_${participante.id || Date.now()}`;
        const participanteDiv = document.createElement('div');
        participanteDiv.className = 'card-dynamic mb-3';
        participanteDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Participante</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary btn-sm" onclick="duplicarParticipante(this)">
                        <i class="bi bi-copy"></i> Duplicar
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarParticipante(this)">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Nombre *</label>
                        <input class="form-control" id="${participanteId}_nombre" value="${participante.nombre || ''}" required/>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Rol</label>
                        <select class="form-select" id="${participanteId}_rol">
                            <option value="">Seleccionar...</option>
                            <option value="Ponente" ${participante.rol === 'Ponente' ? 'selected' : ''}>Ponente</option>
                            <option value="Coordinación" ${participante.rol === 'Coordinación' ? 'selected' : ''}>Coordinación</option>
                            <option value="Invitado" ${participante.rol === 'Invitado' ? 'selected' : ''}>Invitado</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="${participanteId}_email" value="${participante.email || ''}"/>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(participanteDiv);
    });
    
    Utils.log(`Participantes cargados: ${participantes.length}`);
}

async function aplicarColaboradorasReales(colaboradoras) {
    const container = document.getElementById('colaboradorasContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    colaboradoras.forEach(colaboradora => {
        const colaboradoraId = `colaboradora_${colaboradora.id || Date.now()}`;
        const colaboradoraDiv = document.createElement('div');
        colaboradoraDiv.className = 'card-dynamic mb-3';
        colaboradoraDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Entidad Colaboradora</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="eliminarColaboradora(this)">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Nombre *</label>
                        <input class="form-control" id="${colaboradoraId}_nombre" value="${colaboradora.nombre || ''}" required/>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">NIF/CIF</label>
                        <input class="form-control" id="${colaboradoraId}_nif" value="${colaboradora.nifCif || ''}"/>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Web</label>
                        <input class="form-control" id="${colaboradoraId}_web" placeholder="https://..." value="${colaboradora.web || ''}"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Persona de contacto</label>
                        <input class="form-control" id="${colaboradoraId}_contacto" value="${colaboradora.personaContacto || ''}"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="${colaboradoraId}_email" value="${colaboradora.email || ''}"/>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Teléfono</label>
                        <input class="form-control" id="${colaboradoraId}_telefono" value="${colaboradora.telefono || ''}"/>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(colaboradoraDiv);
    });
    
    Utils.log(`Colaboradoras cargadas: ${colaboradoras.length}`);
}

async function aplicarImportesReales(importes) {
    if (!importes || importes.length === 0) return;
    
    // Tomar el primer importe (asumiendo que solo hay uno por actividad)
    const importe = importes[0];
    
    // Mapear campos de importe a IDs del formulario
    const camposImporte = {
        'importeBase': 'imp_base',
        'tipoImpuesto': 'imp_tipo',
        'porcentajeDescuento': 'imp_descuento_pct',
        'codigoPromocional': 'imp_codigo',
        'condicionesES': 'imp_condiciones_es',
        'condicionesCA': 'imp_condiciones_ca',
        'condicionesEN': 'imp_condiciones_en'
    };
    
    Object.keys(camposImporte).forEach(campoBackend => {
        const campoFormulario = camposImporte[campoBackend];
        const valor = importe[campoBackend];
        
        if (valor !== undefined && valor !== null) {
            const elemento = document.getElementById(campoFormulario);
            if (elemento) {
                elemento.value = valor.toString();
                Utils.log(`Importe ${campoFormulario}: ${valor}`);
            }
        }
    });
    
    Utils.log(`Importes aplicados correctamente`);
}

// NUEVA FUNCIÓN: Recoger todos los datos del formulario
function recogerDatosFormulario() {
    Utils.log('Recogiendo datos del formulario...');
    
    const datos = {};
    
    // Mapeo inverso: del formulario al backend
    const mapeoInverso = {
        'actividadCodigo': 'codigo',
        'actividadTitulo': 'titulo',
        'descripcion': 'descripcion',
        'tipoActividad': 'tipoActividad',
        'actividadUnidadGestion': 'unidadGestionId',
        'condicionesEconomicas': 'condicionesEconomicas',
        'actividadAnioAcademico': 'anioAcademico',
        'lineaEstrategica': 'lineaEstrategica',
        'objetivoEstrategico': 'objetivoEstrategico',
        'codigoRelacionado': 'codigoRelacionado',
        'actividadReservada': 'actividadReservada',
        'fechaActividad': 'fechaActividad',
        'motivoCierre': 'motivoCierre',
        'personaSolicitante': 'personaSolicitante',
        'coordinador': 'coordinador',
        'jefeUnidadGestora': 'jefeUnidadGestora',
        'gestorActividad': 'gestorActividad',
        'facultadDestinataria': 'facultadDestinataria',
        'departamentoDestinatario': 'departamentoDestinatario',
        'centroUnidadUBDestinataria': 'centroUnidadUBDestinataria',
        'otrosCentrosInstituciones': 'otrosCentrosInstituciones',
        'plazasTotales': 'plazasTotales',
        'horasTotales': 'horasTotales',
        'centroTrabajoRequerido': 'centroTrabajoRequerido',
        'modalidadGestion': 'modalidadGestion',
        'fechaInicioImparticion': 'fechaInicioImparticion',
        'fechaFinImparticion': 'fechaFinImparticion',
        'actividadPago': 'actividadPago',
        'fechaInicio': 'fechaInicio',
        'fechaFin': 'fechaFin',
        'lugar': 'lugar',
        
        // Campos específicos por UG
        'coordinadorCentreUnitat': 'coordinadorCentreUnitat',
        'centreTreballeAlumne': 'centreTreballeAlumne',
        'creditosTotalesCRAI': 'creditosTotalesCRAI',
        'creditosTotalesSAE': 'creditosTotalesSAE',
        'creditosMinimosSAE': 'creditosMinimosSAE',
        'creditosMaximosSAE': 'creditosMaximosSAE',
        'tipusEstudiSAE': 'tipusEstudiSAE',
        'categoriaSAE': 'categoriaSAE',
        'competenciesSAE': 'competenciesSAE',
        
        // Campos de inscripción
        'inscripcionInicio': 'inscripcionInicio',
        'inscripcionFin': 'inscripcionFin',
        'inscripcionPlazas': 'inscripcionPlazas',
        'inscripcionListaEspera': 'inscripcionListaEspera',
        'inscripcionModalidad': 'inscripcionModalidad',
        'inscripcionRequisitosES': 'inscripcionRequisitosES',
        'inscripcionRequisitosCA': 'inscripcionRequisitosCA',
        'inscripcionRequisitosEN': 'inscripcionRequisitosEN',
        
        // Campos de programa
        'programaDescripcionES': 'programaDescripcionES',
        'programaDescripcionCA': 'programaDescripcionCA',
        'programaDescripcionEN': 'programaDescripcionEN',
        'programaContenidosES': 'programaContenidosES',
        'programaContenidosCA': 'programaContenidosCA',
        'programaContenidosEN': 'programaContenidosEN',
        'programaObjetivosES': 'programaObjetivosES',
        'programaObjetivosCA': 'programaObjetivosCA',
        'programaObjetivosEN': 'programaObjetivosEN',
        'programaDuracion': 'programaDuracion',
        'programaInicio': 'programaInicio',
        'programaFin': 'programaFin',
        
        // Campos de traducción del título
        'actividadTituloCA': 'tituloCA',
        'actividadTituloES': 'tituloES',
        'actividadTituloEN': 'tituloEN'
    };
    
    // Recoger datos de campos principales
    Object.keys(mapeoInverso).forEach(campoFormulario => {
        const campoBackend = mapeoInverso[campoFormulario];
        const elemento = document.getElementById(campoFormulario);
        
        if (elemento) {
            let valor = null;
            
            if (elemento.type === 'checkbox') {
                valor = elemento.checked;
                
                // Convertir checkboxes booleanos a strings "S"/"N" para campos específicos
                if (campoBackend === 'actividadPago' || 
                    campoBackend === 'inscripcionListaEspera') {
                    valor = valor ? 'S' : 'N';
                }
            } else if (elemento.tagName === 'SELECT') {
                valor = elemento.value || null;
                
                // Convertir campos booleanos de "S"/"N" a "S"/"N" (mantener como string)
                if (campoBackend === 'actividadReservada' || 
                    campoBackend === 'actividadPago' || 
                    campoBackend === 'inscripcionListaEspera') {
                    // Normalizar: Sí/Si/true -> 'S'; No/false -> 'N'; vacío -> 'N'
                    if (valor === 'true' || valor === 'Si' || valor === 'Sí' || valor === 'S') valor = 'S';
                    else if (valor === 'false' || valor === 'No' || valor === 'N') valor = 'N';
                    else if (!valor) valor = 'N';
                }
            } else if (elemento.type === 'date') {
                valor = elemento.value || null;
            } else {
                valor = elemento.value || null;
            }
            
            // Conversión de tipos numéricos antes de asignar
            if (valor !== null && valor !== '') {
                // Campos enteros
                if (campoBackend === 'plazasTotales' ||
                    campoBackend === 'inscripcionPlazas' ||
                    campoBackend === 'unidadGestionId') {
                    const n = parseInt(valor, 10);
                    if (!isNaN(n)) {
                        valor = n;
                    }
                }
                // Campos decimales
                else if (campoBackend === 'horasTotales' ||
                         campoBackend === 'creditosTotalesCRAI' ||
                         campoBackend === 'creditosTotalesSAE' ||
                         campoBackend === 'creditosMinimosSAE' ||
                         campoBackend === 'creditosMaximosSAE' ||
                         campoBackend === 'programaDuracion') {
                    // Convertir coma a punto para parseFloat
                    let valorNumerico = valor;
                    if (typeof valor === 'string' && valor.includes(',')) {
                        valorNumerico = valor.replace(',', '.');
                    }
                    const f = parseFloat(valorNumerico);
                    if (!isNaN(f)) {
                        valor = f;
                    }
                }
            }
            
            // Solo incluir campos que tengan valores válidos (no null, no vacíos)
            if (valor !== null && valor !== undefined && valor !== '') {
                datos[campoBackend] = valor;
            }
        }
    });
    
    // Recoger subactividades
    datos.subactividades = recogerSubactividades();
    
    // Recoger participantes
    datos.participantes = recogerParticipantes();
    
    // Recoger colaboradoras
    datos.colaboradoras = recogerColaboradoras();
    
    // Recoger importes
    datos.importes = recogerImportes();
    
    Utils.log('Datos recogidos del formulario:', datos);
    return datos;
}

// NUEVA FUNCIÓN: Validar datos obligatorios
function validarDatosObligatorios(datos) {
    const camposObligatorios = [
        'codigo', 'titulo', 'descripcion', 'tipoActividad'
    ];
    
    const camposFaltantes = camposObligatorios.filter(campo => 
        !datos[campo] || datos[campo].toString().trim() === ''
    );
    
    if (camposFaltantes.length > 0) {
        Utils.showAlert('error', `Campos obligatorios faltantes: ${camposFaltantes.join(', ')}`);
        return false;
    }
    
    return true;
}

// NUEVA FUNCIÓN: Recoger subactividades
function recogerSubactividades() {
    const subactividades = [];
    const container = document.getElementById('subactividadesContainer');
    
    if (container) {
        container.querySelectorAll('.card-dynamic').forEach(card => {
            const subactividad = {
                titulo: card.querySelector('[id*="_titulo"]')?.value || '',
                modalidad: card.querySelector('[id*="_modalidad"]')?.value || '',
                docente: card.querySelector('[id*="_docente"]')?.value || '',
                descripcion: card.querySelector('[id*="_descripcion"]')?.value || ''
            };
            
            if (subactividad.titulo.trim()) {
                subactividades.push(subactividad);
            }
        });
    }
    
    return subactividades;
}

// NUEVA FUNCIÓN: Recoger participantes
function recogerParticipantes() {
    const participantes = [];
    const container = document.getElementById('participantesContainer');
    
    if (container) {
        container.querySelectorAll('.card-dynamic').forEach(card => {
            const participante = {
                nombre: card.querySelector('[id*="_nombre"]')?.value || '',
                rol: card.querySelector('[id*="_rol"]')?.value || '',
                email: card.querySelector('[id*="_email"]')?.value || ''
            };
            
            if (participante.nombre.trim()) {
                participantes.push(participante);
            }
        });
    }
    
    return participantes;
}

// NUEVA FUNCIÓN: Recoger colaboradoras
function recogerColaboradoras() {
    const colaboradoras = [];
    const container = document.getElementById('colaboradorasContainer');
    
    if (container) {
        container.querySelectorAll('.card-dynamic').forEach(card => {
            const colaboradora = {
                nombre: card.querySelector('[id*="_nombre"]')?.value || '',
                nifCif: card.querySelector('[id*="_nif"]')?.value || '',
                web: card.querySelector('[id*="_web"]')?.value || '',
                personaContacto: card.querySelector('[id*="_contacto"]')?.value || '',
                email: card.querySelector('[id*="_email"]')?.value || '',
                telefono: card.querySelector('[id*="_telefono"]')?.value || ''
            };
            
            if (colaboradora.nombre.trim()) {
                colaboradoras.push(colaboradora);
            }
        });
    }
    
    // Soporte para sección estática (org_*) si existe y el usuario la usa
    const orgNombre = document.getElementById('org_principal')?.value || '';
    const orgNif = document.getElementById('org_nif')?.value || '';
    const orgWeb = document.getElementById('org_web')?.value || '';
    const orgContacto = document.getElementById('org_contacto')?.value || '';
    const orgEmail = document.getElementById('org_email')?.value || '';
    const orgTel = document.getElementById('org_tel')?.value || '';
    
    if (orgNombre.trim()) {
        colaboradoras.push({
            nombre: orgNombre,
            nifCif: orgNif,
            web: orgWeb,
            personaContacto: orgContacto,
            email: orgEmail,
            telefono: orgTel
        });
    }
    
    return colaboradoras;
}

// NUEVA FUNCIÓN: Recoger importes
function recogerImportes() {
    const importes = [];
    
    const importe = {
        importeBase: document.getElementById('imp_base')?.value || null,
        tipoImpuesto: document.getElementById('imp_tipo')?.value || null,
        porcentajeDescuento: document.getElementById('imp_descuento_pct')?.value || null,
        codigoPromocional: document.getElementById('imp_codigo')?.value || null,
        condicionesES: document.getElementById('imp_condiciones_es')?.value || null,
        condicionesCA: document.getElementById('imp_condiciones_ca')?.value || null,
        condicionesEN: document.getElementById('imp_condiciones_en')?.value || null
    };
    
    // Convertir numéricos si tienen valor
    if (importe.importeBase !== null && importe.importeBase !== '') {
        const f = parseFloat(importe.importeBase);
        if (!isNaN(f)) {
            importe.importeBase = f;
        }
    }
    if (importe.porcentajeDescuento !== null && importe.porcentajeDescuento !== '') {
        const f = parseFloat(importe.porcentajeDescuento);
        if (!isNaN(f)) {
            importe.porcentajeDescuento = f;
        }
    }
    
    // Solo incluir si hay al menos un campo con valor
    if (Object.values(importe).some(valor => valor && valor.toString().trim() !== '')) {
        importes.push(importe);
    }
    
    return importes;
}

// NUEVA FUNCIÓN: Limpiar formulario (dejar en blanco)
function limpiarFormulario() {
    Utils.log('Limpiando formulario - campos en blanco');
    
    // Limpiar todos los inputs, selects y textareas
    document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'checkbox') {
            element.checked = false;
        } else {
            element.value = '';
        }
    });
    
    // Limpiar contenedores de entidades relacionadas
    const subactividadesContainer = document.getElementById('subactividadesContainer');
    if (subactividadesContainer) {
        subactividadesContainer.innerHTML = '';
    }
    
    const participantesContainer = document.getElementById('participantesContainer');
    if (participantesContainer) {
        participantesContainer.innerHTML = '';
    }
    
    const colaboradorasContainer = document.getElementById('colaboradorasContainer');
    if (colaboradorasContainer) {
        colaboradorasContainer.innerHTML = '';
    }
    
    Utils.log('Formulario limpiado - todos los campos en blanco');
}

// Función para actualizar campos específicos por UG
function actualizarCamposUG() {
    const unidadGestionId = document.getElementById('actividadUnidadGestion');
    if (!unidadGestionId) return;
    
    const value = unidadGestionId.value;
    
    if (value === '1') { // IDP
        document.querySelectorAll('[data-ug="IDP"]').forEach(element => {
            element.style.display = 'block';
        });
    }
    
    if (value === '2') { // CRAI
        document.querySelectorAll('[data-ug="CRAI"]').forEach(element => {
            element.style.display = 'block';
        });
    }
    
    if (value === '3') { // SAE
        document.querySelectorAll('[data-ug="SAE"]').forEach(element => {
            element.style.display = 'block';
        });
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar cuando el DOM esté listo
    if (typeof initEditarActividad === 'function') {
        initEditarActividad();
    }
    
    // El resumen de mensajes se carga desde initEditarActividad()
    
    // Test rápido de dominios (para debugging)
    setTimeout(async () => {
        Utils.log('=== TEST RÁPIDO DE DOMINIOS ===');
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/dominios/OPCIONES_SI_NO/valores`);
            if (response.ok) {
                const valores = await response.json();
                Utils.log('Test OPCIONES_SI_NO:', valores);
            }
        } catch (error) {
            Utils.error('Test falló:', error);
        }
    }, 2000);
    
    // Aplicar máscaras decimales
    aplicarMascarasDecimales();
    
    // Event listeners adicionales
    const unidadGestionSelect = document.getElementById('actividadUnidadGestion');
    if (unidadGestionSelect) {
        unidadGestionSelect.addEventListener('change', function() {
            actualizarCamposUG();
        });
    }
    
    // Toggle de campos de importe según actividad de pago
    const actividadPagoCheckbox = document.getElementById('actividadPago');
    if (actividadPagoCheckbox) {
        actividadPagoCheckbox.addEventListener('change', function() {
            const importeCampos = document.getElementById('importeCampos');
            if (importeCampos) {
                importeCampos.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
});

// Función para eliminar mensaje
async function eliminarMensaje(mensajeId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/mensajes/${mensajeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Recargar el contenido del modal para actualizar la lista
            await cargarContenidoModalMensajes();
            console.log('Mensaje eliminado correctamente');
        } else if (response.status === 403) {
            alert('No tienes permisos para eliminar este mensaje');
        } else {
            const error = await response.text();
            console.error('Error eliminando mensaje:', error);
            alert('Error eliminando mensaje: ' + error);
        }
    } catch (error) {
        console.error('Error eliminando mensaje:', error);
        alert('Error eliminando mensaje');
    }
}

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.guardarActividad = guardarActividad;
window.guardarBorrador = guardarBorrador;
window.rellenarConDatosPrueba = rellenarConDatosPrueba;
window.addSubactividad = addSubactividad;
window.addParticipante = addParticipante;
window.addColaboradora = addColaboradora;
window.toggleTraduccion = toggleTraduccion;
window.eliminarSubactividad = eliminarSubactividad;
window.eliminarParticipante = eliminarParticipante;
window.eliminarColaboradora = eliminarColaboradora;
window.duplicarSubactividad = duplicarSubactividad;
window.duplicarParticipante = duplicarParticipante;
window.abrirMensajes = abrirMensajes;
window.cargarContenidoModalMensajes = cargarContenidoModalMensajes;
window.mostrarHiloEnModal = mostrarHiloEnModal;
window.mostrarFormularioNuevoHilo = mostrarFormularioNuevoHilo;
window.crearNuevoHiloDesdeModal = crearNuevoHiloDesdeModal;
window.enviarNuevoMensaje = enviarNuevoMensaje;
window.descargarAdjunto = descargarAdjunto;
window.cerrarModalMensajes = cerrarModalMensajes;
window.eliminarMensaje = eliminarMensaje;

// ===== FUNCIONES DE MENSAJERÍA =====

// Variable para almacenar información del usuario actual
let usuarioActual = null;

// Función para obtener el token de autenticación
function getToken() {
    return localStorage.getItem('ub_token');
}

// Cargar resumen de mensajes para la actividad actual
async function cargarResumenMensajes() {
    try {
        if (!ACTIVIDAD_ID) return;
        
        const resp = await fetch(`${CONFIG.API_BASE_URL}/mensajes/actividad/${ACTIVIDAD_ID}/no-leidos`, {
            headers: {
                'Accept': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            }
        });
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        
        const data = await resp.json();
        actualizarBadgeMensajes(data.mensajesNoLeidos);
    } catch (e) {
        console.error('Error cargando resumen de mensajes:', e);
    }
}

// Actualizar badge de mensajes
function actualizarBadgeMensajes(mensajesNoLeidos) {
    const badge = document.getElementById('mensajesBadge');
    const mensajesBtn = document.getElementById('mensajesBtn');
    const icono = mensajesBtn?.querySelector('i');
    
    if (!badge || !mensajesBtn || !icono) return;
    
    if (mensajesNoLeidos > 0) {
        badge.textContent = mensajesNoLeidos;
        badge.classList.remove('d-none');
        // Cambiar color del icono a azul
        icono.style.color = '#007bff';
        mensajesBtn.style.borderColor = '#007bff';
    } else {
        badge.classList.add('d-none');
        // Restaurar color gris del icono
        icono.style.color = '';
        mensajesBtn.style.borderColor = '';
    }
}

// Abrir mensajes de la actividad
async function abrirMensajes() {
    console.log('🔍 DEBUG: abrirMensajes() llamada');
    console.log('🔍 DEBUG: ACTIVIDAD_ID =', ACTIVIDAD_ID);
    console.log('🔍 DEBUG: window.ACTIVIDAD_ID =', window.ACTIVIDAD_ID);
    
    if (!ACTIVIDAD_ID && !window.ACTIVIDAD_ID) {
        console.error('❌ ERROR: ACTIVIDAD_ID no está definido');
        alert('No se puede abrir mensajes sin una actividad válida');
        return;
    }
    
    // Usar window.ACTIVIDAD_ID si ACTIVIDAD_ID no está disponible
    const actividadId = ACTIVIDAD_ID || window.ACTIVIDAD_ID;
    console.log('🔍 DEBUG: Usando actividadId =', actividadId);
    console.log('🔍 DEBUG: typeof actividadId =', typeof actividadId);
    console.log('🔍 DEBUG: actividadId === "60" =', actividadId === "60");
    console.log('🔍 DEBUG: actividadId === 60 =', actividadId === 60);
    
    try {
        // Mostrar modal de carga
        const modal = new bootstrap.Modal(document.getElementById('mensajesModal'));
        modal.show();
        
        // Cargar contenido del modal
        await cargarContenidoModalMensajes();
        
    } catch (e) {
        console.error('Error abriendo mensajes:', e);
        alert('Error abriendo mensajes: ' + e.message);
    }
}

// Cargar contenido del modal de mensajes
async function cargarContenidoModalMensajes() {
    try {
        const actividadId = ACTIVIDAD_ID || window.ACTIVIDAD_ID;
        console.log('🔍 DEBUG: cargarContenidoModalMensajes() - actividadId =', actividadId);
        console.log('🔍 DEBUG: CONFIG.API_BASE_URL =', CONFIG.API_BASE_URL);
        console.log('🔍 DEBUG: getToken() =', Auth.getToken() ? 'Token disponible' : 'Sin token');
        
        // Obtener información del usuario actual
        if (Auth.getUser()) {
            usuarioActual = Auth.getUser();
            console.log('🔍 DEBUG: Usuario actual =', usuarioActual);
        }
        
        // Verificar si ya existe un hilo para esta actividad
        const url = `${CONFIG.API_BASE_URL}/mensajes/hilos?actividadId=${actividadId}`;
        console.log('🔍 DEBUG: URL de petición =', url);
        console.log('🔍 DEBUG: actividadId =', actividadId);
        console.log('🔍 DEBUG: typeof actividadId =', typeof actividadId);
        
        const resp = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        console.log('🔍 DEBUG: Respuesta HTTP =', resp.status, resp.statusText);
        
        if (!resp.ok) {
            let serverMsg = '';
            try { serverMsg = await resp.text(); } catch {}
            throw new Error(`HTTP ${resp.status}: ${resp.statusText}${serverMsg ? ' - ' + serverMsg : ''}`);
        }
        
        const hilos = await resp.json();
        console.log('🔍 DEBUG: Hilos recibidos =', hilos);
        console.log('🔍 DEBUG: hilos.length =', hilos ? hilos.length : 'hilos es null/undefined');
        
        if (hilos && hilos.length > 0) {
            // Ya existe un hilo, mostrar en modal
            console.log('🔍 DEBUG: Mostrando hilo existente:', hilos[0]);
            await mostrarHiloEnModal(hilos[0]);
            
            // Marcar mensajes como leídos
            await marcarMensajesComoLeidos(hilos[0].id);
        } else {
            // No existe hilo, mostrar formulario para crear uno nuevo
            console.log('🔍 DEBUG: No hay hilos, mostrando formulario para crear nuevo');
            await mostrarFormularioNuevoHilo();
        }
    } catch (e) {
        console.error('Error cargando contenido del modal:', e);
        mostrarErrorEnModal('Error cargando mensajes: ' + e.message);
    }
}

// Marcar mensajes como leídos
async function marcarMensajesComoLeidos(hiloId) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/mensajes/${hiloId}/marcar-leido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(typeof Auth !== 'undefined' && Auth.getToken() ? { 'Authorization': `Bearer ${Auth.getToken()}` } : {})
            }
        });

        if (response.ok) {
            // Actualizar el badge de mensajes
            await cargarResumenMensajes();
        }
    } catch (e) {
        console.error('Error marcando mensajes como leídos:', e);
    }
}

// Mostrar hilo existente en el modal
async function mostrarHiloEnModal(hilo) {
    try {
        console.log('🔍 DEBUG: mostrarHiloEnModal() - hilo recibido =', hilo);
        console.log('🔍 DEBUG: hilo.Id =', hilo.Id);
        console.log('🔍 DEBUG: hilo.id =', hilo.id);
        console.log('🔍 DEBUG: Object.keys(hilo) =', Object.keys(hilo));
        
        // Intentar diferentes formas de acceder al ID
        const hiloId = hilo.Id || hilo.id || hilo.ID;
        console.log('🔍 DEBUG: hiloId final =', hiloId);
        
        if (!hiloId) {
            throw new Error('No se pudo obtener el ID del hilo');
        }
        
        // Cargar mensajes del hilo
        const url = `${CONFIG.API_BASE_URL}/mensajes/hilos/${hiloId}/mensajes`;
        console.log('🔍 DEBUG: URL para cargar mensajes =', url);
        
        const resp = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        console.log('🔍 DEBUG: Respuesta HTTP para mensajes =', resp.status, resp.statusText);
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        
        const mensajes = await resp.json();
        console.log('🔍 DEBUG: Mensajes recibidos =', mensajes);
        console.log('🔍 DEBUG: Primer mensaje =', mensajes[0]);
        console.log('🔍 DEBUG: Keys del primer mensaje =', mensajes[0] ? Object.keys(mensajes[0]) : 'No hay mensajes');
        
        // Obtener título de la actividad
        const tituloActividad = document.getElementById('actividadTitulo')?.value || 'Mensajes de Actividad';
        const fechaCreacion = new Date().toLocaleDateString('es-ES');
        
        // Filtrar mensajes válidos (que tengan contenido) - usar camelCase
        const mensajesValidos = mensajes && mensajes.length > 0 ? 
            mensajes.filter(mensaje => mensaje.contenido && mensaje.contenido !== 'undefined' && mensaje.contenido.trim() !== '') : [];
        
        console.log('🔍 DEBUG: Mensajes válidos filtrados =', mensajesValidos);
        
        // Renderizar mensajes en el modal
        const modalContent = document.getElementById('mensajesModalContent');
        console.log('🔍 DEBUG: Renderizando contenido del modal...');
        modalContent.innerHTML = `
            <div class="mb-3">
                <h6 class="text-muted">${tituloActividad}</h6>
                <p class="text-muted small">Hilo creado el ${fechaCreacion}</p>
            </div>
            <div class="mensajes-container" style="max-height: 400px; overflow-y: auto;">
                ${mensajesValidos.length > 0 ? 
                    mensajesValidos.map(mensaje => `
                        <div class="mensaje mb-3 p-3 border rounded ${mensaje.usuarioId === usuarioActual?.id ? 'bg-light' : 'bg-white'}">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <strong class="text-primary">${mensaje.usuarioNombre || 'Usuario'}</strong>
                                <div class="d-flex align-items-center gap-2">
                                    <small class="text-muted">${mensaje.fechaCreacion ? new Date(mensaje.fechaCreacion).toLocaleString() : fechaCreacion}</small>
                                    ${(((mensaje.usuarioId ?? mensaje.UsuarioId ?? (mensaje.usuario && mensaje.usuario.id)) === usuarioActual?.id) || usuarioActual?.rol === 'Admin') ? `
                                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMensaje(${mensaje.id})" title="Eliminar mensaje">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="mensaje-contenido">${mensaje.contenido}</div>
                            ${mensaje.adjuntos && mensaje.adjuntos.length > 0 ? `
                                <div class="adjuntos mt-2">
                                    <small class="text-muted">Adjuntos:</small>
                                    ${mensaje.adjuntos.map(adjunto => `
                                        <a href="#" class="btn btn-sm btn-outline-secondary ms-2" onclick="descargarAdjunto(${adjunto.id})">
                                            <i class="bi bi-paperclip"></i> ${adjunto.nombreArchivo}
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('') :
                    `<div class="text-center text-muted py-4">
                        <i class="bi bi-chat-dots" style="font-size: 2rem;"></i>
                        <p class="mt-2">No hay mensajes en este hilo</p>
                        <small>Escribe el primer mensaje abajo</small>
                    </div>`
                }
            </div>
            <div class="mt-3">
                <form id="formNuevoMensaje" onsubmit="enviarNuevoMensaje(event, ${hiloId})">
                    <div class="mb-3">
                        <textarea class="form-control" id="nuevoMensajeContenido" rows="3" placeholder="Escribe tu mensaje..." required></textarea>
                    </div>
                    <div class="mb-3">
                        <input type="file" class="form-control" id="nuevoMensajeAdjuntos" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png">
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-send me-2"></i>Enviar Mensaje
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="probarCampoMensaje()">
                            <i class="bi bi-bug me-2"></i>Probar Campo
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Verificar que el campo se creó correctamente
        setTimeout(() => {
            const campoMensaje = document.getElementById('nuevoMensajeContenido');
            console.log('🔍 DEBUG: Campo de mensaje encontrado =', campoMensaje);
            console.log('🔍 DEBUG: Campo disabled =', campoMensaje?.disabled);
            console.log('🔍 DEBUG: Campo readonly =', campoMensaje?.readOnly);
            console.log('🔍 DEBUG: Campo style =', campoMensaje?.style.cssText);
            console.log('🔍 DEBUG: Campo classList =', campoMensaje?.classList.toString());
            console.log('🔍 DEBUG: Campo parentElement =', campoMensaje?.parentElement);
            console.log('🔍 DEBUG: Campo visible =', campoMensaje?.offsetParent !== null);
            console.log('🔍 DEBUG: Campo offsetParent =', campoMensaje?.offsetParent);
            console.log('🔍 DEBUG: Campo offsetWidth =', campoMensaje?.offsetWidth);
            console.log('🔍 DEBUG: Campo offsetHeight =', campoMensaje?.offsetHeight);
            console.log('🔍 DEBUG: Campo getBoundingClientRect =', campoMensaje?.getBoundingClientRect());
            
            // Verificar estilos CSS aplicados
            const computedStyle = window.getComputedStyle(campoMensaje);
            console.log('🔍 DEBUG: CSS display =', computedStyle.display);
            console.log('🔍 DEBUG: CSS visibility =', computedStyle.visibility);
            console.log('🔍 DEBUG: CSS opacity =', computedStyle.opacity);
            console.log('🔍 DEBUG: CSS position =', computedStyle.position);
            console.log('🔍 DEBUG: CSS z-index =', computedStyle.zIndex);
            
            if (campoMensaje) {
                // Intentar habilitar el campo explícitamente
                campoMensaje.disabled = false;
                campoMensaje.readOnly = false;
                campoMensaje.style.pointerEvents = 'auto';
                campoMensaje.style.opacity = '1';
                campoMensaje.style.display = 'block';
                campoMensaje.style.visibility = 'visible';
                campoMensaje.style.position = 'relative';
                campoMensaje.style.zIndex = '9999';
                campoMensaje.style.width = '100%';
                campoMensaje.style.height = 'auto';
                campoMensaje.style.minHeight = '80px';
                
                // Forzar que el campo sea visible
                campoMensaje.style.setProperty('display', 'block', 'important');
                campoMensaje.style.setProperty('visibility', 'visible', 'important');
                campoMensaje.style.setProperty('opacity', '1', 'important');
                campoMensaje.style.setProperty('width', '100%', 'important');
                campoMensaje.style.setProperty('height', '80px', 'important');
                campoMensaje.style.setProperty('min-height', '80px', 'important');
                campoMensaje.style.setProperty('max-height', '200px', 'important');
                campoMensaje.style.setProperty('position', 'relative', 'important');
                campoMensaje.style.setProperty('z-index', '9999', 'important');
                campoMensaje.style.setProperty('background-color', 'white', 'important');
                campoMensaje.style.setProperty('border', '1px solid #ccc', 'important');
                campoMensaje.style.setProperty('padding', '8px', 'important');
                campoMensaje.style.setProperty('margin', '0', 'important');
                campoMensaje.style.setProperty('box-sizing', 'border-box', 'important');
                
                // Forzar que el contenedor padre también sea visible
                const parentDiv = campoMensaje.parentElement;
                if (parentDiv) {
                    parentDiv.style.setProperty('display', 'block', 'important');
                    parentDiv.style.setProperty('visibility', 'visible', 'important');
                    parentDiv.style.setProperty('opacity', '1', 'important');
                    parentDiv.style.setProperty('width', '100%', 'important');
                    parentDiv.style.setProperty('height', 'auto', 'important');
                    parentDiv.style.setProperty('min-height', '100px', 'important');
                    
                    console.log('🔍 DEBUG: Contenedor padre encontrado:', parentDiv);
                    console.log('🔍 DEBUG: Contenedor padre classList:', parentDiv.classList.toString());
                    console.log('🔍 DEBUG: Contenedor padre offsetParent:', parentDiv.offsetParent);
                    console.log('🔍 DEBUG: Contenedor padre offsetWidth:', parentDiv.offsetWidth);
                    console.log('🔍 DEBUG: Contenedor padre offsetHeight:', parentDiv.offsetHeight);
                }
                
                // Verificar el modal completo
                const modal = document.getElementById('mensajesModal');
                if (modal) {
                    console.log('🔍 DEBUG: Modal encontrado:', modal);
                    console.log('🔍 DEBUG: Modal classList:', modal.classList.toString());
                    console.log('🔍 DEBUG: Modal offsetParent:', modal.offsetParent);
                    console.log('🔍 DEBUG: Modal offsetWidth:', modal.offsetWidth);
                    console.log('🔍 DEBUG: Modal offsetHeight:', modal.offsetHeight);
                    console.log('🔍 DEBUG: Modal getBoundingClientRect:', modal.getBoundingClientRect());
                    
                    // Forzar que el modal sea visible
                    modal.style.setProperty('display', 'block', 'important');
                    modal.style.setProperty('visibility', 'visible', 'important');
                    modal.style.setProperty('opacity', '1', 'important');
                    modal.style.setProperty('position', 'fixed', 'important');
                    modal.style.setProperty('top', '0', 'important');
                    modal.style.setProperty('left', '0', 'important');
                    modal.style.setProperty('width', '100%', 'important');
                    modal.style.setProperty('height', '100%', 'important');
                    modal.style.setProperty('z-index', '9999', 'important');
                    modal.style.setProperty('background-color', 'rgba(0,0,0,0.5)', 'important');
                    
                    // Forzar que el modal-dialog sea visible
                    const modalDialog = modal.querySelector('.modal-dialog');
                    if (modalDialog) {
                        modalDialog.style.setProperty('display', 'block', 'important');
                        modalDialog.style.setProperty('visibility', 'visible', 'important');
                        modalDialog.style.setProperty('opacity', '1', 'important');
                        modalDialog.style.setProperty('position', 'relative', 'important');
                        modalDialog.style.setProperty('width', '80%', 'important');
                        modalDialog.style.setProperty('max-width', '800px', 'important');
                        modalDialog.style.setProperty('height', 'auto', 'important');
                        modalDialog.style.setProperty('min-height', '400px', 'important');
                        modalDialog.style.setProperty('margin', '50px auto', 'important');
                        modalDialog.style.setProperty('background-color', 'white', 'important');
                        modalDialog.style.setProperty('border-radius', '8px', 'important');
                        modalDialog.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.3)', 'important');
                        
                        console.log('🔍 DEBUG: Modal-dialog encontrado y configurado:', modalDialog);
                    }
                    
                    // Forzar que el modal-content sea visible
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.style.setProperty('display', 'block', 'important');
                        modalContent.style.setProperty('visibility', 'visible', 'important');
                        modalContent.style.setProperty('opacity', '1', 'important');
                        modalContent.style.setProperty('width', '100%', 'important');
                        modalContent.style.setProperty('height', '100%', 'important');
                        modalContent.style.setProperty('background-color', 'white', 'important');
                        modalContent.style.setProperty('border', 'none', 'important');
                        modalContent.style.setProperty('border-radius', '8px', 'important');
                        
                        console.log('🔍 DEBUG: Modal-content encontrado y configurado:', modalContent);
                    }
                    
                    console.log('🔍 DEBUG: Modal configurado para ser visible');
                    
                    // Forzar que el modal sea visible inmediatamente
                    modal.classList.remove('fade');
                    modal.classList.add('show');
                    modal.setAttribute('aria-hidden', 'false');
                    modal.setAttribute('aria-modal', 'true');
                    
                    // Forzar que el body no tenga scroll
                    document.body.classList.add('modal-open');
                    
                    // Crear un backdrop si no existe
                    let backdrop = document.querySelector('.modal-backdrop');
                    if (!backdrop) {
                        backdrop = document.createElement('div');
                        backdrop.className = 'modal-backdrop fade show';
                        backdrop.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 1040; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.5);';
                        document.body.appendChild(backdrop);
                    }
                    
                    console.log('🔍 DEBUG: Modal forzado a ser visible');
                }
                
                // Intentar enfocar
                campoMensaje.focus();
                console.log('🔍 DEBUG: Campo habilitado y enfocado');
                
                // Agregar evento de prueba
                campoMensaje.addEventListener('input', () => {
                    console.log('🔍 DEBUG: Campo recibió input');
                });
                
                // Agregar evento de click
                campoMensaje.addEventListener('click', () => {
                    console.log('🔍 DEBUG: Campo recibió click');
                });
                
                // Agregar evento de focus
                campoMensaje.addEventListener('focus', () => {
                    console.log('🔍 DEBUG: Campo recibió focus');
                });
            } else {
                console.error('❌ ERROR: Campo de mensaje no encontrado');
            }
        }, 100);
        
        // Hacer scroll automático al último mensaje
        setTimeout(() => {
            const mensajesContainer = modalContent.querySelector('.mensajes-container');
            console.log('🔍 DEBUG: mensajesContainer encontrado =', mensajesContainer);
            if (mensajesContainer) {
                console.log('🔍 DEBUG: scrollHeight =', mensajesContainer.scrollHeight);
                console.log('🔍 DEBUG: clientHeight =', mensajesContainer.clientHeight);
                
                // Si las dimensiones son 0, esperar un poco más
                if (mensajesContainer.scrollHeight === 0 || mensajesContainer.clientHeight === 0) {
                    console.log('🔍 DEBUG: Dimensiones 0, esperando más tiempo...');
                    setTimeout(() => {
                        console.log('🔍 DEBUG: scrollHeight (segundo intento) =', mensajesContainer.scrollHeight);
                        console.log('🔍 DEBUG: clientHeight (segundo intento) =', mensajesContainer.clientHeight);
                        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
                        console.log('🔍 DEBUG: scrollTop después (segundo intento) =', mensajesContainer.scrollTop);
                    }, 300);
                } else {
                    mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
                    console.log('🔍 DEBUG: scrollTop después =', mensajesContainer.scrollTop);
                }
            } else {
                console.error('❌ ERROR: No se encontró .mensajes-container');
            }
        }, 200);
        
    } catch (e) {
        console.error('Error mostrando hilo en modal:', e);
        mostrarErrorEnModal('Error cargando mensajes del hilo');
    }
}

// Mostrar formulario para crear nuevo hilo
async function mostrarFormularioNuevoHilo() {
    const titulo = document.getElementById('actividadTitulo')?.value || 'Mensajes de actividad';
    const modalContent = document.getElementById('mensajesModalContent');
    
    modalContent.innerHTML = `
        <div class="text-center py-4">
            <i class="bi bi-chat-dots text-muted" style="font-size: 3rem;"></i>
            <h6 class="mt-3 text-muted">No hay mensajes para esta actividad</h6>
            <p class="text-muted">Crea el primer hilo de mensajes para comenzar la conversación.</p>
        </div>
        <form id="formNuevoHilo" onsubmit="crearNuevoHiloDesdeModal(event)">
            <div class="mb-3">
                <label class="form-label">Título del hilo</label>
                <input type="text" class="form-control" id="nuevoHiloTitulo" value="${titulo}" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" id="nuevoHiloDescripcion" rows="3" placeholder="Describe el propósito de este hilo de mensajes"></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Primer mensaje</label>
                <textarea class="form-control" id="nuevoHiloPrimerMensaje" rows="4" placeholder="Escribe el primer mensaje..." required></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Adjuntos (opcional)</label>
                <input type="file" class="form-control" id="nuevoHiloAdjuntos" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png">
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-plus-circle me-2"></i>Crear Hilo de Mensajes
            </button>
        </form>
    `;
}

// Mostrar error en el modal
function mostrarErrorEnModal(mensaje) {
    const modalContent = document.getElementById('mensajesModalContent');
    modalContent.innerHTML = `
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${mensaje}
        </div>
    `;
}

// Crear nuevo hilo desde el modal
async function crearNuevoHiloDesdeModal(event) {
    event.preventDefault();
    
    try {
        const titulo = document.getElementById('nuevoHiloTitulo').value;
        const descripcion = document.getElementById('nuevoHiloDescripcion').value;
        const contenidoPrimerMensaje = document.getElementById('nuevoHiloPrimerMensaje').value;
        
        const resp = await fetch(`${CONFIG.API_BASE_URL}/mensajes/hilos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ActividadId: parseInt(ACTIVIDAD_ID),
                Titulo: titulo,
                Descripcion: descripcion,
                ContenidoPrimerMensaje: contenidoPrimerMensaje
            })
        });
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        
        const nuevoHilo = await resp.json();
        
        // Mostrar el hilo creado en el modal
        await mostrarHiloEnModal(nuevoHilo);
        
        // Recargar resumen de mensajes
        cargarResumenMensajes();
        
    } catch (e) {
        console.error('Error creando hilo desde modal:', e);
        mostrarErrorEnModal('Error creando el hilo de mensajes');
    }
}

// Función para cerrar el modal correctamente
function cerrarModalMensajes() {
    const modal = document.getElementById('mensajesModal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('fade');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'false');
        modal.style.display = 'none';
        
        // Remover backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        // Restaurar scroll del body
        document.body.classList.remove('modal-open');
        
        console.log('🔍 DEBUG: Modal cerrado correctamente');
    }
}

// Función de prueba para verificar el campo de mensaje
function probarCampoMensaje() {
    console.log('🔍 DEBUG: Probando campo de mensaje...');
    const campo = document.getElementById('nuevoMensajeContenido');
    
    if (!campo) {
        console.error('❌ ERROR: Campo no encontrado');
        return false;
    }
    
    console.log('🔍 DEBUG: Campo encontrado, probando interacción...');
    
    // Intentar hacer clic en el campo
    campo.click();
    console.log('🔍 DEBUG: Click ejecutado');
    
    // Intentar enfocar
    campo.focus();
    console.log('🔍 DEBUG: Focus ejecutado');
    
    // Intentar escribir
    campo.value = 'Prueba de escritura';
    console.log('🔍 DEBUG: Valor establecido:', campo.value);
    
    // Disparar evento de input
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('🔍 DEBUG: Evento input disparado');
    
    return true;
}

// Función para verificar autenticación
function verificarAutenticacion() {
    console.log('🔍 DEBUG: Verificando autenticación...');
    console.log('🔍 DEBUG: typeof Auth =', typeof Auth);
    
    if (typeof Auth === 'undefined') {
        console.error('❌ ERROR: Auth no está disponible');
        return false;
    }
    
    const token = Auth.getToken();
    console.log('🔍 DEBUG: Token =', token);
    console.log('🔍 DEBUG: Token length =', token ? token.length : 0);
    
    if (!token || token.trim() === '') {
        console.error('❌ ERROR: No hay token válido');
        return false;
    }
    
    // Verificar si el token está expirado
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        
        console.log('🔍 DEBUG: Token expira:', expDate);
        console.log('🔍 DEBUG: Ahora:', now);
        console.log('🔍 DEBUG: Expirado:', now > expDate);
        
        if (now > expDate) {
            console.error('❌ ERROR: Token expirado');
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            Auth.requireAuth();
            return false;
        }
    } catch (e) {
        console.error('❌ ERROR: No se pudo verificar la expiración del token:', e);
        // Continuar con el token aunque no se pueda verificar la expiración
    }
    
    console.log('✅ DEBUG: Autenticación OK');
    return true;
}

// Enviar nuevo mensaje en el modal
async function enviarNuevoMensaje(event, hiloId) {
    event.preventDefault();
    
    // Sin verificación de autenticación para simplificar
    console.log('🔍 DEBUG: Enviando mensaje sin autenticación');
    
    try {
        const contenido = document.getElementById('nuevoMensajeContenido').value;
        const adjuntos = document.getElementById('nuevoMensajeAdjuntos').files;
        
        console.log('🔍 DEBUG: enviarNuevoMensaje() - hiloId =', hiloId);
        console.log('🔍 DEBUG: contenido =', contenido);
        console.log('🔍 DEBUG: adjuntos =', adjuntos.length, 'archivos');
        console.log('🔍 DEBUG: Auth.getToken() =', Auth.getToken() ? 'Token disponible' : 'Sin token');
        console.log('🔍 DEBUG: typeof Auth =', typeof Auth);
        console.log('🔍 DEBUG: Token completo =', Auth.getToken());
        console.log('🔍 DEBUG: localStorage.getItem("ub_token") =', localStorage.getItem('ub_token'));
        
        // Verificar si el usuario está logueado
        const user = Auth.getUser();
        console.log('🔍 DEBUG: Usuario =', user);
        console.log('🔍 DEBUG: Usuario username =', user?.username);
        
        // Crear FormData para enviar contenido y adjuntos
        const formData = new FormData();
        formData.append('Contenido', contenido);
        formData.append('HiloMensajeId', parseInt(hiloId));
        
        // Agregar adjuntos si los hay
        if (adjuntos && adjuntos.length > 0) {
            for (let i = 0; i < adjuntos.length; i++) {
                formData.append('Adjuntos', adjuntos[i]);
                console.log('🔍 DEBUG: Adjunto agregado =', adjuntos[i].name, 'Tamaño:', adjuntos[i].size);
            }
        }
        
        console.log('🔍 DEBUG: FormData creado con', adjuntos.length, 'adjuntos');
        console.log('🔍 DEBUG: URL completa =', `${CONFIG.API_BASE_URL}/mensajes`);
        
        const token = Auth.getToken();
        console.log('🔍 DEBUG: Token obtenido =', token ? 'Token disponible' : 'Sin token');
        console.log('🔍 DEBUG: Token completo =', token);
        
        const resp = await fetch(`${CONFIG.API_BASE_URL}/mensajes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        console.log('🔍 DEBUG: Respuesta HTTP =', resp.status, resp.statusText);
        
        if (!resp.ok) {
            const errorText = await resp.text();
            console.error('🔍 DEBUG: Error response =', errorText);
            throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
        
        const resultado = await resp.json();
        console.log('🔍 DEBUG: Resultado =', resultado);
        
        // Limpiar formulario
        document.getElementById('nuevoMensajeContenido').value = '';
        document.getElementById('nuevoMensajeAdjuntos').value = '';
        
        // Recargar mensajes del hilo
        const hilo = { Id: hiloId };
        await mostrarHiloEnModal(hilo);
        
        // Hacer scroll al último mensaje después de enviar
        setTimeout(() => {
            const modalContent = document.getElementById('mensajesModalContent');
            const mensajesContainer = modalContent.querySelector('.mensajes-container');
            console.log('🔍 DEBUG: mensajesContainer encontrado (después de enviar) =', mensajesContainer);
            if (mensajesContainer) {
                console.log('🔍 DEBUG: scrollHeight (después de enviar) =', mensajesContainer.scrollHeight);
                console.log('🔍 DEBUG: clientHeight (después de enviar) =', mensajesContainer.clientHeight);
                
                // Si las dimensiones son 0, esperar un poco más
                if (mensajesContainer.scrollHeight === 0 || mensajesContainer.clientHeight === 0) {
                    console.log('🔍 DEBUG: Dimensiones 0 (después de enviar), esperando más tiempo...');
                    setTimeout(() => {
                        console.log('🔍 DEBUG: scrollHeight (segundo intento después de enviar) =', mensajesContainer.scrollHeight);
                        console.log('🔍 DEBUG: clientHeight (segundo intento después de enviar) =', mensajesContainer.clientHeight);
                        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
                        console.log('🔍 DEBUG: scrollTop después (segundo intento después de enviar) =', mensajesContainer.scrollTop);
                    }, 300);
                } else {
                    mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
                    console.log('🔍 DEBUG: scrollTop después (después de enviar) =', mensajesContainer.scrollTop);
                }
            } else {
                console.error('❌ ERROR: No se encontró .mensajes-container (después de enviar)');
            }
        }, 300);
        
        // Recargar resumen de mensajes
        cargarResumenMensajes();
        
    } catch (e) {
        console.error('Error enviando mensaje:', e);
        alert('Error enviando mensaje: ' + e.message);
    }
}

// Descargar adjunto
async function descargarAdjunto(adjuntoId) {
    try {
        const resp = await fetch(`${CONFIG.API_BASE_URL}/mensajes/adjuntos/${adjuntoId}/descargar`, {
            headers: {
                'Authorization': `Bearer ${Auth.getToken()}`
            }
        });
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        
        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adjunto_${adjuntoId}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
    } catch (e) {
        console.error('Error descargando adjunto:', e);
        alert('Error descargando adjunto');
    }
}

// Crear nuevo hilo de mensajes
async function crearNuevoHilo(titulo) {
    try {
        const resp = await fetch(`${CONFIG.API_BASE_URL}/mensajes/hilos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify({
                ActividadId: parseInt(ACTIVIDAD_ID),
                Titulo: titulo,
                Descripcion: 'Hilo de mensajes para la actividad',
                ContenidoPrimerMensaje: 'Hilo de mensajes creado automáticamente para esta actividad.'
            })
        });
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        
        const nuevoHilo = await resp.json();
        window.open(`mensaje.html?id=${nuevoHilo.id}`, '_blank');
        
        // Recargar resumen de mensajes
        cargarResumenMensajes();
    } catch (e) {
        console.error('Error creando hilo de mensajes:', e);
        alert('Error creando hilo de mensajes');
    }
}
