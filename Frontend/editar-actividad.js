/**
 * Editar Actividad - Sistema de Gestión de Actividades Formativas UB
 * Implementación completa en JavaScript moderno con conexión al backend real
 * NO carga datos de ejemplo - solo datos reales de la base de datos
 */

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
                API_BASE_URL: 'http://localhost:5001/api',
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
            'actividadReservada': 'ACTIVIDADES_RESERVADAS',
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
        
        Utils.log('Dominios cargados correctamente');
        
    } catch (error) {
        Utils.error('Error cargando dominios:', error);
    }
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
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
        
        Utils.log('Datos reales aplicados correctamente');
        
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
        'codigoPropuesta': 'codigoPropuesta',
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
                        valorComparar = valor.toString();
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
                } else {
                    elemento.value = valor.toString();
                }
                Utils.log(`Campo ${campoFormulario} configurado con valor real: ${valor}`);
            } else {
                Utils.log(`Campo del formulario no encontrado: ${campoFormulario}`);
            }
        }
    });
    
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
                    // Si el valor es "true" o "false", convertirlo a "S"/"N"
                    if (valor === 'true') {
                        valor = 'S';
                    } else if (valor === 'false') {
                        valor = 'N';
                    }
                }
            } else if (elemento.type === 'date') {
                valor = elemento.value || null;
            } else {
                valor = elemento.value || null;
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
