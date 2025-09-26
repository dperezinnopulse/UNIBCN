// UB Actividad 1 - Scripts de Integración Frontend-Backend
// Versión: scripts.js?v=1.0.21
// Configuración de la API
// Usar same-origin para app integrada (y compatible con proxy del WebServer)
const API_BASE_URL = '';

// Clase principal para manejar las operaciones de la API
class UBActividadAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Método genérico para hacer peticiones HTTP
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        console.log('🚀 DEBUG: makeRequest - Versión del script: scripts.js?v=1.0.6');
        console.log('🚀 DEBUG: makeRequest - URL completa:', url);
        // Solo mostrar puerto si la URL es absoluta
        if (url.startsWith('http')) {
            console.log('🚀 DEBUG: makeRequest - Puerto:', new URL(url).port);
        } else {
            console.log('🚀 DEBUG: makeRequest - URL relativa:', url);
        }
        console.log('🚀 DEBUG: makeRequest - Método:', options.method || 'GET');
        if (options.body) {
            console.log('🚀 DEBUG: makeRequest - Datos a enviar:', options.body);
        }

        try {
            const response = await fetch(url, defaultOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ DEBUG: makeRequest - Error completo:', error);
            console.error('❌ DEBUG: makeRequest - Tipo de error:', error.name);
            console.error('❌ DEBUG: makeRequest - Mensaje:', error.message);
            throw error;
        }
    }

    // ===== ACTIVIDADES =====
    
    // Obtener listado de actividades
    async getActividades(page = 1, pageSize = 10, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...filters
        });
        return await this.makeRequest(`/api/actividades?${params}`);
    }

    // Obtener actividad por ID
    async getActividad(id) {
        return await this.makeRequest(`/api/actividades/${id}`);
    }

    // Crear nueva actividad
    async createActividad(actividadData) {
        console.log('🚀 DEBUG: createActividad - Versión del script: scripts.js?v=1.0.6');
        console.log('🚀 DEBUG: createActividad - Datos a enviar:', JSON.stringify(actividadData, null, 2));
        
        return await this.makeRequest('/api/actividades', {
            method: 'POST',
            body: JSON.stringify(actividadData)
        });
    }

    // Actualizar actividad
    async updateActividad(id, actividadData) {
        return await this.makeRequest(`/api/actividades/${id}`, {
            method: 'PUT',
            body: JSON.stringify(actividadData)
        });
    }

    // Cambiar estado de actividad
    async changeEstado(id, estadoData) {
        return await this.makeRequest(`/api/actividades/${id}/estado`, {
            method: 'PATCH',
            body: JSON.stringify(estadoData)
        });
    }

    // ===== ESTADOS =====
    
    // Obtener lista de estados
    async getEstados() {
        console.log('🚀 DEBUG: getEstados - Versión del script: scripts.js?v=1.0.6');
        return await this.makeRequest('/api/estados');
    }

    // ===== UNIDADES DE GESTIÓN =====
    
    // Obtener unidades de gestión
    async getUnidadesGestion() {
        console.log('🚀 DEBUG: getUnidadesGestion - Versión del script: scripts.js?v=1.0.6');
        return await this.makeRequest('/api/unidades-gestion');
    }

    // ===== DOMINIOS =====
    
    // Obtener valores de un dominio específico
    async getValoresDominio(nombreDominio) {
        console.log(`🚀 DEBUG: getValoresDominio - Dominio: ${nombreDominio}`);
        try {
            const response = await this.makeRequest(`/api/dominios/${nombreDominio}/valores`);
            console.log(`✅ DEBUG: getValoresDominio - Respuesta para ${nombreDominio}:`, response);
            
            // La respuesta tiene la estructura { dominio: {...}, valores: [...] }
            // Devolver solo el array de valores
            if (response && response.valores) {
                console.log(`📊 DEBUG: getValoresDominio - Devolviendo ${response.valores.length} valores`);
                return response.valores;
            } else if (Array.isArray(response)) {
                // En caso de que sea directamente un array
                console.log(`📊 DEBUG: getValoresDominio - Respuesta es array directo con ${response.length} valores`);
                return response;
            } else {
                console.warn(`⚠️ DEBUG: getValoresDominio - Estructura de respuesta inesperada:`, response);
                return [];
            }
        } catch (error) {
            console.error(`❌ DEBUG: getValoresDominio - Error para ${nombreDominio}:`, error);
            throw error;
        }
    }

    // ===== SUBACTIVIDADES =====
    
    // Obtener subactividades de una actividad
    async getSubactividades(actividadId) {
        return await this.makeRequest(`/api/actividades/${actividadId}/subactividades`);
    }

    // Crear subactividad
    async createSubactividad(actividadId, subactividadData) {
        return await this.makeRequest(`/api/actividades/${actividadId}/subactividades`, {
            method: 'POST',
            body: JSON.stringify(subactividadData)
        });
    }

    // ===== PARTICIPANTES =====
    
    // Obtener participantes de una actividad
    async getParticipantes(actividadId) {
        return await this.makeRequest(`/api/actividades/${actividadId}/participantes`);
    }

    // Crear participante
    async createParticipante(actividadId, participanteData) {
        return await this.makeRequest(`/api/actividades/${actividadId}/participantes`, {
            method: 'POST',
            body: JSON.stringify(participanteData)
        });
    }
}

// Instancia global de la API
const api = new UBActividadAPI();

// ===== FUNCIONES DE INTERFAZ =====

// Función para mostrar mensajes de estado
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del contenedor principal
    const mainContainer = document.querySelector('main') || document.body;
    mainContainer.insertBefore(alertDiv, mainContainer.firstChild);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Función para cargar estados en un select
async function loadEstados(selectElement) {
    try {
        const estados = await api.getEstados();
        selectElement.innerHTML = '<option value="">Seleccionar estado...</option>';
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.id;
            option.textContent = estado.nombre;
            selectElement.appendChild(option);
        });
    } catch (error) {
        showMessage(`Error cargando estados: ${error.message}`, 'danger');
    }
}

// Función para cargar unidades de gestión en un select
async function loadUnidadesGestion(selectElement) {
    try {
        const unidades = await api.getUnidadesGestion();
        selectElement.innerHTML = '<option value="">Seleccionar unidad...</option>';
        unidades.forEach(unidad => {
            const option = document.createElement('option');
            option.value = unidad.id;
            option.textContent = unidad.nombre;
            selectElement.appendChild(option);
        });
    } catch (error) {
        showMessage(`Error cargando unidades de gestión: ${error.message}`, 'danger');
    }
}

// Función para cargar valores de dominio en un select
async function loadValoresDominio(selectElement, nombreDominio) {
    try {
        console.log(`🔍 DEBUG: loadValoresDominio - Cargando ${nombreDominio} en elemento:`, selectElement);
        
        // PRESERVAR las opciones existentes como respaldo ANTES de hacer la llamada API
        const opcionesExistentes = Array.from(selectElement.options).map(o => ({
            value: o.value,
            text: o.textContent
        }));
        
        const valores = await api.getValoresDominio(nombreDominio);
        console.log(`📊 DEBUG: loadValoresDominio - Valores obtenidos para ${nombreDominio}:`, valores);
        
        if (!valores || valores.length === 0) {
            console.warn(`⚠️ DEBUG: loadValoresDominio - No se encontraron valores para ${nombreDominio}, manteniendo opciones existentes`);
            // Restaurar opciones existentes si no hay valores de la API
            if (opcionesExistentes.length > 0) {
                console.log(`🔧 DEBUG: loadValoresDominio - Restaurando ${opcionesExistentes.length} opciones existentes`);
                // Limpiar select
                selectElement.innerHTML = '';
                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Seleccionar...';
                selectElement.appendChild(defaultOption);
                // Restaurar opciones originales
                opcionesExistentes.forEach(opcion => {
                    if (opcion.value !== '') { // Evitar duplicar la opción por defecto
                        const option = document.createElement('option');
                        option.value = opcion.value;
                        option.textContent = opcion.text;
                        selectElement.appendChild(option);
                    }
                });
            }
            return;
        }
        
        // Limpiar select
        selectElement.innerHTML = '';
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccionar...';
        selectElement.appendChild(defaultOption);
        
                        // Agregar opciones
                let opcionesAgregadas = 0;
                valores.forEach(valor => {
                    const option = document.createElement('option');
                    
                    // Usar siempre ID para todos los campos de dominio
                    option.value = valor.id || valor.Id || valor.valor || valor.Valor || valor.value || valor.Value;
                    option.textContent = valor.descripcion || valor.Descripcion || valor.valor || valor.Valor || valor.value || valor.Value;
                    
                    selectElement.appendChild(option);
                    opcionesAgregadas++;
                });
        console.log(`✅ DEBUG: loadValoresDominio - ${opcionesAgregadas} opciones agregadas para ${nombreDominio}`);
    } catch (error) {
        console.error(`❌ DEBUG: loadValoresDominio - Error cargando dominio ${nombreDominio}:`, error);
        // No mostrar error al usuario, solo log
    }
}

// ===== FUNCIONES AUXILIARES PARA CARGA ROBUSTA =====

// Función para asegurar que los elementos DOM estén listos
async function ensureElementsReady() {
    console.log('🔍 DEBUG: ensureElementsReady - Verificando elementos DOM...');
    
    const requiredElements = [
        'tipoActividad', 'lineaEstrategica', 'objetivoEstrategico', 
        'actividadReservada', 'modalidadGestion', 'centroUnidadUBDestinataria'
    ];
    
    const maxWaitTime = 10000; // 10 segundos máximo
    const checkInterval = 100; // Verificar cada 100ms
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
        let allElementsReady = true;
        
        for (const elementId of requiredElements) {
            const element = document.getElementById(elementId);
            if (!element) {
                allElementsReady = false;
                break;
            }
        }
        
        if (allElementsReady) {
            console.log(`✅ DEBUG: ensureElementsReady - Todos los elementos listos después de ${Date.now() - startTime}ms`);
            return true;
        }
        
        // Esperar antes del siguiente check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    console.warn(`⚠️ DEBUG: ensureElementsReady - Timeout después de ${maxWaitTime}ms`);
    return false;
}

// Función para cargar dominios de forma robusta con reintentos
async function cargarDominiosRobust(dominiosACargar) {
    console.log('🚀 DEBUG: cargarDominiosRobust - Iniciando carga robusta...');
    
    let exitos = 0;
    let fallos = 0;
    
    for (const item of dominiosACargar) {
        try {
            console.log(`🔍 DEBUG: cargarDominiosRobust - Procesando ${item.dominio}...`);
            
            // Verificar elemento con reintentos
            const element = await waitForElement(item.elementId, 5000);
            
            if (!element) {
                console.error(`❌ DEBUG: cargarDominiosRobust - Elemento ${item.elementId} no encontrado después de espera`);
                fallos++;
                continue;
            }
            
            // Cargar dominio con reintentos
            const success = await loadValoresDominioRobust(element, item.dominio);
            
            if (success) {
                console.log(`✅ DEBUG: cargarDominiosRobust - ${item.dominio} cargado exitosamente en ${item.elementId}`);
                exitos++;
            } else {
                console.error(`❌ DEBUG: cargarDominiosRobust - Falló carga de ${item.dominio} en ${item.elementId}`);
                fallos++;
            }
            
        } catch (error) {
            console.error(`❌ DEBUG: cargarDominiosRobust - Error procesando ${item.dominio}:`, error);
            fallos++;
        }
    }
    
    console.log(`📊 DEBUG: cargarDominiosRobust - Completado: ${exitos} éxitos, ${fallos} fallos`);
    return { exitos, fallos };
}

// Función para esperar a que un elemento específico esté disponible
async function waitForElement(elementId, maxWaitTime = 5000) {
    const checkInterval = 100;
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ DEBUG: waitForElement - Elemento ${elementId} encontrado después de ${Date.now() - startTime}ms`);
            return element;
        }
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    console.warn(`⚠️ DEBUG: waitForElement - Timeout esperando elemento ${elementId} después de ${maxWaitTime}ms`);
    return null;
}

// Función robusta para cargar valores de dominio con reintentos
async function loadValoresDominioRobust(selectElement, nombreDominio, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 DEBUG: loadValoresDominioRobust - Intento ${attempt}/${maxRetries} para ${nombreDominio}`);
            
            // Verificar que el elemento sigue existiendo
            if (!selectElement || !selectElement.parentNode) {
                throw new Error(`Elemento ${selectElement?.id || 'unknown'} ya no existe en DOM`);
            }
            
            // Intentar cargar valores
            const valores = await api.getValoresDominio(nombreDominio);
            console.log(`📊 DEBUG: loadValoresDominioRobust - Obtenidos ${valores.length} valores para ${nombreDominio}`);
            
            if (!valores || valores.length === 0) {
                console.warn(`⚠️ DEBUG: loadValoresDominioRobust - Sin valores para ${nombreDominio}, manteniendo opciones existentes`);
                return true; // No es un error, solo no hay datos
            }
            
            // Limpiar y llenar select
            selectElement.innerHTML = '';
            
            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccionar...';
            selectElement.appendChild(defaultOption);
            
            // Agregar opciones de valores
            let opcionesAgregadas = 0;
            valores.forEach(valor => {
                const option = document.createElement('option');
                
                // Usar valor.valor para campos SAE, ID para el resto
                if (selectElement.id === 'tipusEstudiSAE' || selectElement.id === 'categoriaSAE') {
                    option.value = valor.valor || valor.Valor || valor.value || valor.Value;
                } else {
                    option.value = valor.id || valor.Id || valor.valor || valor.Valor || valor.value || valor.Value;
                }
                option.textContent = valor.descripcion || valor.Descripcion || valor.valor || valor.Valor || valor.value || valor.Value;
                
                selectElement.appendChild(option);
                opcionesAgregadas++;
            });
            
            console.log(`✅ DEBUG: loadValoresDominioRobust - ${opcionesAgregadas} opciones agregadas para ${nombreDominio}`);
            
            // Verificar que las opciones se agregaron correctamente
            if (selectElement.options.length > 1) {
                console.log(`🎯 DEBUG: loadValoresDominioRobust - Verificación: ${selectElement.options.length} opciones en ${selectElement.id}`);
                return true;
            } else {
                throw new Error(`Las opciones no se agregaron correctamente: ${selectElement.options.length} opciones`);
            }
            
        } catch (error) {
            console.error(`❌ DEBUG: loadValoresDominioRobust - Intento ${attempt} falló para ${nombreDominio}:`, error);
            
            if (attempt === maxRetries) {
                console.error(`💥 DEBUG: loadValoresDominioRobust - Agotados todos los intentos para ${nombreDominio}`);
                return false;
            }
            
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
    
    return false;
}

// Función para cargar todos los dominios requeridos en los selects
async function cargarDominios() {
    try {
        console.log('🚀 DEBUG: cargarDominios - Iniciando carga de dominios...');
        
        const dominiosACargar = [
            { elementId: 'tipoActividad', dominio: 'TIPOS_ACTIVIDAD' },
            { elementId: 'lineaEstrategica', dominio: 'LINEAS_ESTRATEGICAS' },
            { elementId: 'objetivoEstrategico', dominio: 'OBJETIVOS_ESTRATEGICOS' },
            { elementId: 'actividadReservada', dominio: 'ACTIVIDADES_RESERVADAS' },
            { elementId: 'modalidadGestion', dominio: 'MODALIDADES_GESTION' },
            { elementId: 'centroUnidadUBDestinataria', dominio: 'CENTROS_UB' },
            { elementId: 'imp_tipo', dominio: 'TIPOS_IMPUESTO' },
            { elementId: 'actividadUnidadGestion', dominio: 'UNIDADES_GESTION' },
            { elementId: 'centroTrabajoRequerido', dominio: 'OPCIONES_SI_NO' },
            { elementId: 'tipusEstudiSAE', dominio: 'TIPUS_ESTUDI_SAE' },
            { elementId: 'categoriaSAE', dominio: 'CATEGORIAS_SAE' },
            // NUEVOS DOMINIOS - CAMPOS CONVERTIDOS A SELECT
            { elementId: 'jefeUnidadGestora', dominio: 'JEFES_UNIDAD_GESTORA' },
            { elementId: 'gestorActividad', dominio: 'GESTORES_ACTIVIDAD' },
            { elementId: 'facultadDestinataria', dominio: 'FACULTADES_DESTINATARIAS' },
            { elementId: 'departamentoDestinatario', dominio: 'DEPARTAMENTOS_DESTINATARIOS' },
            { elementId: 'coordinadorCentreUnitat', dominio: 'COORDINADORES_CENTRE_UNITAT_IDP' },
            // NUEVOS DOMINIOS
            { elementId: 'asignaturaId', dominio: 'Asignatura' },
            { elementId: 'disciplinaRelacionadaId', dominio: 'DisciplinaRelacionada' },
            { elementId: 'idiomaImparticionId', dominio: 'IdiomaImparticion' },
            { elementId: 'tiposCertificacionId', dominio: 'TiposCertificacion' },
            { elementId: 'materiaDisciplinaId', dominio: 'MateriaDisciplina' },
            { elementId: 'ambitoFormacionId', dominio: 'AmbitoFormacion' },
            { elementId: 'tiposFinanciacionId', dominio: 'TiposFinanciacion' },
            { elementId: 'tiposInscripcionId', dominio: 'TiposInscripcion' },
            { elementId: 'denominacionDescuentoIds', dominio: 'DenominacionDescuento' },
            { elementId: 'estadoActividad', dominio: 'EstadoActividad' },
            { elementId: 'remesa', dominio: 'Remesa' }
        ];

        let elementosEncontrados = 0;
        let dominiosCargados = 0;
        let elementosNoEncontrados = [];

        for (const item of dominiosACargar) {
            console.log(`🔍 DEBUG: cargarDominios - Procesando dominio: ${item.dominio} para elemento: ${item.elementId}`);
            
            // Intentar encontrar el elemento con múltiples intentos
            let select = null;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!select && attempts < maxAttempts) {
                attempts++;
                select = document.getElementById(item.elementId);
                if (!select) {
                    console.log(`⏳ DEBUG: cargarDominios - Elemento ${item.elementId} no encontrado en intento ${attempts}, esperando...`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    console.log(`✅ DEBUG: cargarDominios - Elemento encontrado en intento ${attempts}: ${item.elementId}`);
                }
            }
            
            if (!select) {
                console.warn(`⚠️ DEBUG: cargarDominios - Elemento no encontrado después de ${maxAttempts} intentos: ${item.elementId}`);
                elementosNoEncontrados.push(item.elementId);
                continue;
            }
            
            elementosEncontrados++;
            console.log(`✅ DEBUG: cargarDominios - Elemento encontrado: ${item.elementId}`, select);
            console.log(`🔍 DEBUG: cargarDominios - Cargando ${item.dominio} en ${item.elementId}`);
            
            // Verificar estado del select antes de cargar
            console.log(`📊 DEBUG: cargarDominios - Estado del select antes de cargar:`, {
                id: select.id,
                options: select.options.length,
                innerHTML: select.innerHTML.substring(0, 100) + '...'
            });
            
            // ESPECÍFICO para actividadUnidadGestion
            if (item.elementId === 'actividadUnidadGestion') {
                console.log(`🎯 DEBUG: cargarDominios - PROCESANDO actividadUnidadGestion específicamente`);
                console.log(`🎯 DEBUG: cargarDominios - Elemento DOM:`, select);
                console.log(`🎯 DEBUG: cargarDominios - ID del elemento:`, select.id);
                console.log(`🎯 DEBUG: cargarDominios - Clases del elemento:`, select.className);
            }
            
            try {
                await loadValoresDominio(item.elementId, item.dominio);
                dominiosCargados++;
                
                // Verificar estado del select después de cargar
                console.log(`📊 DEBUG: cargarDominios - Estado del select después de cargar:`, {
                    id: select.id,
                    options: select.options.length,
                    innerHTML: select.innerHTML.substring(0, 100) + '...'
                });
                
                // ESPECÍFICO para actividadUnidadGestion
                if (item.elementId === 'actividadUnidadGestion') {
                    console.log(`🎯 DEBUG: cargarDominios - DESPUÉS de cargar actividadUnidadGestion`);
                    console.log(`🎯 DEBUG: cargarDominios - Opciones después de cargar:`, select.options.length);
                    console.log(`🎯 DEBUG: cargarDominios - HTML después de cargar:`, select.innerHTML);
                }
                
            } catch (error) {
                console.error(`❌ DEBUG: cargarDominios - Error cargando ${item.dominio}:`, error);
            }
        }
        
        console.log(`✅ DEBUG: cargarDominios - Completado. ${dominiosCargados} dominios cargados, ${elementosNoEncontrados.length} elementos no encontrados`);
        if (elementosNoEncontrados.length > 0) {
            console.warn(`⚠️ DEBUG: cargarDominios - Elementos no encontrados:`, elementosNoEncontrados);
        }
        
        // Auto-seleccionar unidad gestora después de cargar todos los dominios
        await autoSeleccionarUnidadGestion();
        
        // Auto-rellenar persona solicitante con el nombre del usuario
        await autoRellenarPersonaSolicitante();
        
    } catch (error) {
        console.error('❌ DEBUG: cargarDominios - Error:', error);
    }
}

// Función para guardar actividad desde el formulario
// Función para validar campos obligatorios
function validarCamposObligatorios() {
    const errores = [];
    const camposObligatorios = [
        { id: 'actividadTitulo', nombre: 'Título' }
    ];
    
    // Limpiar estilos de error previos
    camposObligatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (elemento) {
            elemento.classList.remove('is-invalid');
            elemento.style.borderColor = '';
        }
    });
    
    // Validar cada campo obligatorio
    camposObligatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        const valor = elemento?.value?.trim();
        
        if (!valor) {
            errores.push(campo.nombre);
            if (elemento) {
                elemento.classList.add('is-invalid');
                elemento.style.borderColor = '#dc3545';
            }
        }
    });
    
    return errores;
}

async function guardarActividad() {
    console.log('🚀 DEBUG: guardarActividad - Versión del script: scripts.js?v=1.0.40');
    console.log('🚀 DEBUG: guardarActividad - Iniciando guardado de actividad...');
    
    // Validar campos obligatorios
    const errores = validarCamposObligatorios();
    if (errores.length > 0) {
        const mensaje = `Los siguientes campos son obligatorios: ${errores.join(', ')}`;
        alert(mensaje);
        console.log('❌ Validación fallida:', errores);
        return;
    }
    
    // Verificar si estamos en modo edición
    const actividadId = document.getElementById('actividadId')?.value;
    const isUpdate = actividadId && actividadId.trim() !== '';
    
    console.log('🚀 DEBUG: guardarActividad - Modo:', isUpdate ? 'Actualización' : 'Creación');
    console.log('🚀 DEBUG: guardarActividad - ID de actividad:', actividadId);
    
    try {
        // Recopilar datos del formulario - Formato PascalCase para CreateActividadDto
        const ugRaw = document.getElementById('actividadUnidadGestion')?.value || '';
        console.log('🔍 DEBUG: guardarActividad - ugRaw:', ugRaw);
        
        // Mapear los IDs del dominio a los IDs reales de la tabla UnidadesGestion
        let unidadGestionId = null;
        if (ugRaw && !isNaN(parseInt(ugRaw))) {
            // Mapear IDs del dominio (35, 36, 37) a IDs reales (1, 2, 3)
            const dominioToRealMap = { '35': 1, '36': 2, '37': 3 };
            unidadGestionId = dominioToRealMap[ugRaw] || null;
            console.log('🔍 DEBUG: guardarActividad - Mapeo dominio a real:', ugRaw, '->', unidadGestionId);
        } else {
            // Mapear códigos de texto (compatibilidad con versión anterior)
            const ugMap = { 'IDP': 1, 'CRAI': 2, 'SAE': 3 };
            unidadGestionId = ugMap[ugRaw.toUpperCase()] || null;
            console.log('🔍 DEBUG: guardarActividad - Mapeo de código:', ugRaw, '->', unidadGestionId);
        }
        const formData = {
            // Básicos
            Codigo: document.getElementById('actividadCodigo')?.value || '',
            Titulo: limpiarCaracteresEspeciales(document.getElementById('actividadTitulo')?.value) || '',
            Descripcion: limpiarCaracteresEspeciales(document.getElementById('descripcion')?.value) || '',
            AnioAcademico: document.getElementById('actividadAnioAcademico')?.value || '',
            UnidadGestionId: unidadGestionId,

            // Información general
            TipoActividad: limpiarCaracteresEspeciales(document.getElementById('tipoActividad')?.value) || '',
            LineaEstrategica: document.getElementById('lineaEstrategica')?.value || '',
            ObjetivoEstrategico: document.getElementById('objetivoEstrategico')?.value || '',
            CodigoRelacionado: document.getElementById('codigoRelacionado')?.value || '',
            ActividadReservada: (() => {
                const valor = document.getElementById('actividadReservada')?.value;
                console.log('🔍 DEBUG: ActividadReservada - valor raw:', valor);
                const resultado = valor ? parseInt(valor) : null;
                console.log('🔍 DEBUG: ActividadReservada - valor final:', resultado);
                return resultado;
            })(),
            ActividadPago: document.getElementById('actividadPago')?.checked ?? false,
            FechaActividad: document.getElementById('fechaActividad')?.value ? new Date(document.getElementById('fechaActividad').value).toISOString() : null,
            MotivoCierre: document.getElementById('motivoCierre')?.value || '',
            PersonaSolicitante: document.getElementById('personaSolicitante')?.value || '',
            Coordinador: document.getElementById('coordinador')?.value || '',
            JefeUnidadGestora: document.getElementById('jefeUnidadGestora')?.value || '',
            GestorActividad: document.getElementById('gestorActividad')?.value || '',
            FacultadDestinataria: document.getElementById('facultadDestinataria')?.value || '',
            DepartamentoDestinatario: document.getElementById('departamentoDestinatario')?.value || '',
            CentroUnidadUBDestinataria: document.getElementById('centroUnidadUBDestinataria')?.value || '',
            OtrosCentrosInstituciones: document.getElementById('otrosCentrosInstituciones')?.value || '',
            PlazasTotales: parseInt(document.getElementById('plazasTotales')?.value) || null,
            HorasTotales: parseFloat(document.getElementById('horasTotales')?.value) || null,
            CentroTrabajoRequerido: document.getElementById('centroTrabajoRequerido')?.value || '',
            ModalidadGestion: document.getElementById('modalidadGestion')?.value || '',
            FechaInicioImparticion: document.getElementById('fechaInicioImparticion')?.value ? new Date(document.getElementById('fechaInicioImparticion').value).toISOString() : null,
            FechaFinImparticion: document.getElementById('fechaFinImparticion')?.value ? new Date(document.getElementById('fechaFinImparticion').value).toISOString() : null,
            CondicionesEconomicas: document.getElementById('condicionesEconomicas')?.value || '',

            // Campos UG específicos
            CoordinadorCentreUnitat: limpiarCaracteresEspeciales(document.getElementById('coordinadorCentreUnitat')?.value) || '',
            CentreTreballeAlumne: limpiarCaracteresEspeciales(document.getElementById('centreTreballeAlumne')?.value) || '',
            CreditosTotalesCRAI: parseFloat(document.getElementById('creditosTotalesCRAI')?.value) || null,
            CreditosTotalesSAE: parseFloat(document.getElementById('creditosTotalesSAE')?.value) || null,
            CreditosMinimosSAE: parseFloat(document.getElementById('creditosMinimosSAE')?.value) || null,
            CreditosMaximosSAE: parseFloat(document.getElementById('creditosMaximosSAE')?.value) || null,
            TipusEstudiSAE: document.getElementById('tipusEstudiSAE')?.value || null,
            CategoriaSAE: document.getElementById('categoriaSAE')?.value || null,
            CompetenciesSAE: limpiarCaracteresEspeciales(document.getElementById('competenciesSAE')?.value) || '',

            // Inscripción
            InscripcionInicio: document.getElementById('insc_inicio')?.value ? new Date(document.getElementById('insc_inicio').value).toISOString() : null,
            InscripcionFin: document.getElementById('insc_fin')?.value ? new Date(document.getElementById('insc_fin').value).toISOString() : null,
            InscripcionPlazas: parseInt(document.getElementById('insc_plazas')?.value) || null,
            InscripcionListaEspera: document.getElementById('insc_lista_espera')?.checked || false,
            InscripcionModalidad: limpiarCaracteresEspeciales(document.getElementById('insc_modalidad')?.value) || '',
            InscripcionRequisitosES: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_es')?.value) || '',
            InscripcionRequisitosCA: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_ca')?.value) || '',
            InscripcionRequisitosEN: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_en')?.value) || '',

            // Programa
            ProgramaDescripcionES: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_es')?.value) || '',
            ProgramaDescripcionCA: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_ca')?.value) || '',
            ProgramaDescripcionEN: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_en')?.value) || '',
            ProgramaContenidosES: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_es')?.value) || '',
            ProgramaContenidosCA: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_ca')?.value) || '',
            ProgramaContenidosEN: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_en')?.value) || '',
            ProgramaObjetivosES: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_es')?.value) || '',
            ProgramaObjetivosCA: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_ca')?.value) || '',
            ProgramaObjetivosEN: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_en')?.value) || '',
            ProgramaDuracion: parseFloat(document.getElementById('programa_duracion')?.value) || null,
            ProgramaInicio: document.getElementById('programa_inicio')?.value ? new Date(document.getElementById('programa_inicio').value).toISOString() : null,
            ProgramaFin: document.getElementById('programa_fin')?.value ? new Date(document.getElementById('programa_fin').value).toISOString() : null,

            // NUEVOS CAMPOS - INFORMACIÓN GENERAL
            Preinscripcion: document.getElementById('preinscripcion')?.checked || false,
            EstadoActividad: limpiarCaracteresEspeciales(document.getElementById('estadoActividad')?.value) || '',
            AsignaturaId: document.getElementById('asignaturaId')?.value ? parseInt(document.getElementById('asignaturaId').value) : null,
            GrupoAsignatura: limpiarCaracteresEspeciales(document.getElementById('grupoAsignatura')?.value) || '',
            DisciplinaRelacionadaId: document.getElementById('disciplinaRelacionadaId')?.value ? parseInt(document.getElementById('disciplinaRelacionadaId').value) : null,

            // NUEVOS CAMPOS - PROGRAMA
            Metodologia: limpiarCaracteresEspeciales(document.getElementById('metodologia')?.value) || '',
            SistemaEvaluacion: limpiarCaracteresEspeciales(document.getElementById('sistemaEvaluacion')?.value) || '',
            HorarioYCalendario: limpiarCaracteresEspeciales(document.getElementById('horarioYCalendario')?.value) || '',
            IdiomaImparticionId: document.getElementById('idiomaImparticionId')?.value ? parseInt(document.getElementById('idiomaImparticionId').value) : null,
            TiposCertificacionId: document.getElementById('tiposCertificacionId')?.value ? parseInt(document.getElementById('tiposCertificacionId').value) : null,
            Observaciones: limpiarCaracteresEspeciales(document.getElementById('observaciones')?.value) || '',
            MateriaDisciplinaId: document.getElementById('materiaDisciplinaId')?.value ? parseInt(document.getElementById('materiaDisciplinaId').value) : null,
            EspacioImparticion: limpiarCaracteresEspeciales(document.getElementById('espacioImparticion')?.value) || '',
            LugarImparticion: limpiarCaracteresEspeciales(document.getElementById('lugarImparticion')?.value) || '',
            OtrasUbicaciones: limpiarCaracteresEspeciales(document.getElementById('otrasUbicaciones')?.value) || '',
            UrlPlataformaVirtual: limpiarCaracteresEspeciales(document.getElementById('urlPlataformaVirtual')?.value) || '',
            UrlCuestionarioSatisfaccion: limpiarCaracteresEspeciales(document.getElementById('urlCuestionarioSatisfaccion')?.value) || '',
            AmbitoFormacionId: document.getElementById('ambitoFormacionId')?.value ? parseInt(document.getElementById('ambitoFormacionId').value) : null,

            // NUEVOS CAMPOS - IMPORTE Y DESCUENTOS
            TipoImpuesto: document.getElementById('imp_tipo')?.value || null,
            CosteEstimadoActividad: document.getElementById('costeEstimadoActividad')?.value ? parseFloat(document.getElementById('costeEstimadoActividad').value) : null,
            TiposFinanciacionId: document.getElementById('tiposFinanciacionId')?.value ? parseInt(document.getElementById('tiposFinanciacionId').value) : null,
            AnoInicialFinanciacion: document.getElementById('anoInicialFinanciacion')?.value ? parseInt(document.getElementById('anoInicialFinanciacion').value) : null,
            AnoFinalFinanciacion: document.getElementById('anoFinalFinanciacion')?.value ? parseInt(document.getElementById('anoFinalFinanciacion').value) : null,
            PlazasAfectadasDescuento: document.getElementById('plazasAfectadasDescuento')?.value ? parseInt(document.getElementById('plazasAfectadasDescuento').value) : null,
            DenominacionDescuentoIds: obtenerDenominacionDescuentoIds(),

            // NUEVOS CAMPOS - INSCRIPCIÓN
            FechaLimitePago: document.getElementById('fechaLimitePago')?.value ? new Date(document.getElementById('fechaLimitePago').value).toISOString() : null,
            TPV: document.getElementById('tpv')?.checked || false,
            Remesa: limpiarCaracteresEspeciales(document.getElementById('remesa')?.value) || '',
            TiposInscripcionId: document.getElementById('tiposInscripcionId')?.value ? parseInt(document.getElementById('tiposInscripcionId').value) : null,
            FechaAdjudicacionPreinscripcion: document.getElementById('fechaAdjudicacionPreinscripcion')?.value ? new Date(document.getElementById('fechaAdjudicacionPreinscripcion').value).toISOString() : null
        };

        // Nota: Participantes y subactividades se manejarán en futuras versiones

        console.log('🚀 DEBUG: guardarActividad - Datos recopilados:', formData);
        console.log('🔍 DEBUG: guardarActividad - UnidadGestionId específico:', formData.UnidadGestionId);

        // Determinar si es crear o actualizar
        const actividadId = document.getElementById('actividadId')?.value;
        
        let resultado;
        if (actividadId) {
            console.log('🚀 DEBUG: guardarActividad - Actualizando actividad con ID:', actividadId);
            resultado = await api.updateActividad(actividadId, formData);
            mostrarMensajeExito('¡Actividad actualizada correctamente!');
        } else {
            console.log('🚀 DEBUG: guardarActividad - Creando nueva actividad');
            resultado = await api.createActividad(formData);
            mostrarMensajeExito('¡Actividad creada correctamente!');
            
            // Encadenar guardado de colecciones relacionadas (si existen)
            try {
                const newId = resultado.id || resultado.Id;
                const subacts = obtenerSubactividadesFormulario();
                const parts = obtenerParticipantesFormulario();
                const cols = obtenerEntidadesFormulario();
                const imps = obtenerImportesFormulario();
                const hasRelated = (subacts && subacts.length) || (parts && parts.length) || (cols && cols.length) || (imps && imps.length);
                if (hasRelated) {
                    const payloadUpdate = {
                        Titulo: formData.Titulo,
                        Subactividades: subacts,
                        Participantes: parts,
                        Colaboradoras: cols,
                        Importes: imps
                    };
                    console.log('🔗 DEBUG: Encadenando PUT con colecciones relacionadas:', payloadUpdate);
                    await api.updateActividad(newId, payloadUpdate);
                    console.log('✅ DEBUG: Colecciones relacionadas guardadas');
                } else {
                    console.log('ℹ️ DEBUG: No hay colecciones relacionadas que guardar');
                }
            } catch (e) {
                console.error('⚠️ DEBUG: Error guardando colecciones relacionadas:', e);
            }
            
            // Redirigir a la página de edición con el ID de la actividad
            setTimeout(() => {
                window.location.href = `editar-actividad.html?id=${resultado.id}`;
            }, 2000);
            
            // Actualizar el ID en el formulario
            if (document.getElementById('actividadId')) {
                document.getElementById('actividadId').value = resultado.id;
            }
        }

        console.log('✅ DEBUG: guardarActividad - Resultado:', resultado);
        return resultado;
    } catch (error) {
        console.error('❌ DEBUG: guardarActividad - Error:', error);
        mostrarMensajeError(`Error guardando actividad: ${error.message}`);
        throw error;
    }
}

// Helpers: serializar colecciones del formulario para guardado encadenado
function obtenerParticipantesFormulario() {
    const cont = document.getElementById('participantesContainer');
    if (!cont) return [];
    const participantes = [];
    const nombreInputs = cont.querySelectorAll('input[id$="_nombre"]');
    nombreInputs.forEach(input => {
        const baseId = input.id.replace(/_nombre$/, '');
        const nombre = (input.value || '').trim();
        const rol = (document.getElementById(baseId + '_rol')?.value || '').trim();
        const email = (document.getElementById(baseId + '_email')?.value || '').trim();
        if (nombre) {
            participantes.push({ Nombre: nombre, Rol: rol || null, Email: email || null });
        }
    });
    return participantes;
}

function obtenerSubactividadesFormulario() {
    const cont = document.getElementById('subactividadesContainer');
    if (!cont) return [];
    const subacts = [];
    const tituloInputs = cont.querySelectorAll('input[id^="subactividad_"][id$="_titulo"]');
    tituloInputs.forEach(input => {
        const baseId = input.id.replace(/_titulo$/, '');
        const titulo = (input.value || '').trim();
        const modalidad = (document.getElementById(baseId + '_modalidad')?.value || '').trim();
        const docente = (document.getElementById(baseId + '_docente')?.value || '').trim();
        const descripcion = (document.getElementById(baseId + '_descripcion')?.value || '').trim();
        const fechaInicio = (document.getElementById(baseId + '_fechaInicio')?.value || '').trim();
        const fechaFin = (document.getElementById(baseId + '_fechaFin')?.value || '').trim();
        const horaInicio = (document.getElementById(baseId + '_horaInicio')?.value || '').trim();
        const horaFin = (document.getElementById(baseId + '_horaFin')?.value || '').trim();
        const duracion = (document.getElementById(baseId + '_duracion')?.value || '').trim();
        const ubicacion = (document.getElementById(baseId + '_ubicacion')?.value || '').trim();
        const aforo = (document.getElementById(baseId + '_aforo')?.value || '').trim();
        const idioma = (document.getElementById(baseId + '_idioma')?.selectedOptions[0]?.textContent || '').trim();
        if (titulo) {
            subacts.push({ 
                Titulo: titulo, 
                Modalidad: modalidad || null, 
                Docente: docente || null, 
                Descripcion: descripcion || null,
                FechaInicio: fechaInicio || null,
                FechaFin: fechaFin || null,
                HoraInicio: horaInicio || null,
                HoraFin: horaFin || null,
                Duracion: duracion ? parseFloat(duracion) : null,
                Ubicacion: ubicacion || null,
                Aforo: aforo ? parseInt(aforo) : null,
                Idioma: idioma || null
            });
        }
    });
    return subacts;
}

function obtenerDenominacionDescuentoIds() {
    const select = document.getElementById('denominacionDescuentoIds');
    if (!select) return [];
    
    const selectedOptions = Array.from(select.selectedOptions);
    return selectedOptions.map(option => parseInt(option.value)).filter(id => !isNaN(id));
}

function obtenerEntidadesFormulario() {
    const nombre = (document.getElementById('org_principal')?.value || '').trim();
    const nif = (document.getElementById('org_nif')?.value || '').trim();
    const web = (document.getElementById('org_web')?.value || '').trim();
    const contacto = (document.getElementById('org_contacto')?.value || '').trim();
    const email = (document.getElementById('org_email')?.value || '').trim();
    const tel = (document.getElementById('org_tel')?.value || '').trim();
    if (!nombre && !nif && !web && !contacto && !email && !tel) return [];
    return [{ Nombre: nombre || 'Entidad', NifCif: nif || null, Web: web || null, PersonaContacto: contacto || null, Email: email || null, Telefono: tel || null }];
}

function obtenerImportesFormulario() {
    const pago = !!document.getElementById('actividadPago')?.checked;
    const base = document.getElementById('imp_base')?.value;
    const tipo = document.getElementById('imp_tipo')?.value;
    const pct = document.getElementById('imp_descuento_pct')?.value;
    const codigo = document.getElementById('imp_codigo')?.value;
    const condES = document.getElementById('imp_condiciones_es')?.value;
    const condCA = document.getElementById('imp_condiciones_ca')?.value;
    const condEN = document.getElementById('imp_condiciones_en')?.value;
    const anyValue = base || tipo || pct || codigo || condES || condCA || condEN;
    if (!pago && !anyValue) return [];
    const importe = {
        ImporteBase: base ? parseFloat(base) : null,
        TipoImpuesto: (tipo || '').trim() || null,
        PorcentajeDescuento: pct ? parseFloat(pct) : null,
        CodigoPromocional: (codigo || '').trim() || null,
        CondicionesES: (condES || '').trim() || null,
        CondicionesCA: (condCA || '').trim() || null,
        CondicionesEN: (condEN || '').trim() || null
    };
    return [importe];
}

// Función para cargar actividad en el formulario
async function cargarActividad(id) {
    try {
        const actividad = await api.getActividad(id);
        
        // Llenar el formulario con los datos
        if (document.getElementById('actividadId')) {
            document.getElementById('actividadId').value = actividad.id;
        }
        if (document.getElementById('actividadTitulo')) {
            document.getElementById('actividadTitulo').value = actividad.titulo || '';
        }
        if (document.getElementById('actividadDescripcion')) {
            document.getElementById('actividadDescripcion').value = actividad.descripcion || '';
        }
        if (document.getElementById('actividadFechaInicio')) {
            document.getElementById('actividadFechaInicio').value = actividad.fechaInicio || '';
        }
        if (document.getElementById('actividadFechaFin')) {
            document.getElementById('actividadFechaFin').value = actividad.fechaFin || '';
        }
        if (document.getElementById('actividadEstado')) {
            document.getElementById('actividadEstado').value = actividad.estadoId || '';
        }
        if (document.getElementById('actividadUnidadGestion')) {
            document.getElementById('actividadUnidadGestion').value = actividad.unidadGestionId || '';
        }

        return actividad;
    } catch (error) {
        mostrarMensajeError(`Error cargando actividad: ${error.message}`);
        throw error;
    }
}

// Función para cambiar estado de actividad
async function cambiarEstado(actividadId, nuevoEstadoId) {
    try {
        await api.changeEstado(actividadId, { estadoId: nuevoEstadoId });
        mostrarMensajeExito('Estado actualizado correctamente');
    } catch (error) {
        mostrarMensajeError(`Error cambiando estado: ${error.message}`);
        throw error;
    }
}

// Función para inicializar la página
async function initializePage() {
    console.log('🚀 DEBUG: initializePage - Versión del script: scripts.js?v=1.0.6');
    console.log('🚀 DEBUG: initializePage - Iniciando inicialización de la página...');
    
    try {
        // Cargar datos iniciales
        const estadosSelect = document.getElementById('actividadEstado');
        const unidadesSelect = document.getElementById('actividadUnidadGestion');
        
        if (estadosSelect) {
            console.log('🚀 DEBUG: initializePage - Cargando estados...');
            await loadEstados(estadosSelect);
        }
        
        // Las unidades de gestión se cargan automáticamente en cargarDominios()
        // No es necesario cargarlas aquí

        // Verificar si hay un ID en la URL para cargar actividad existente
        const urlParams = new URLSearchParams(window.location.search);
        const actividadId = urlParams.get('id');
        
        // Cargar dominios solo si no estamos en modo edición
        if (!actividadId) {
            console.log('🚀 DEBUG: initializePage - Cargando dominios (modo creación)...');
            await cargarDominios();
        } else {
            console.log('🚀 DEBUG: initializePage - Saltando carga de dominios (modo edición)...');
            // NO cargar dominios en modo edición para evitar sobrescribir valores
        }
        
        if (actividadId) {
            console.log('🚀 DEBUG: initializePage - Modo edición detectado, ID:', actividadId);
            // NO cargar actividad aquí, se hará en el evento DOMContentLoaded
            // para evitar conflictos con la carga de dominios
        }

        showMessage('Página inicializada correctamente', 'success');
    } catch (error) {
        console.error('❌ DEBUG: initializePage - Error:', error);
        showMessage(`Error inicializando página: ${error.message}`, 'danger');
    }
}

// Función duplicada eliminada - se usa la primera versión más robusta

// Función para probar conexión con el backend
async function testBackendConnection() {
    try {
        await api.getEstados();
        showMessage('Conexión con el backend establecida correctamente', 'success');
        return true;
    } catch (error) {
        showMessage(`Error de conexión con el backend: ${error.message}`, 'danger');
        return false;
    }
}

// Función para mostrar/ocultar la sección de importes
function toggleImporte() {
    const actividadPago = document.getElementById('actividadPago');
    const importeCampos = document.getElementById('importeCampos');
    
    if (actividadPago && importeCampos) {
        if (actividadPago.checked) {
            importeCampos.classList.remove('d-none');
        } else {
            importeCampos.classList.add('d-none');
        }
    }
}

// Función para probar el guardado con datos de prueba
async function testGuardarActividad() {
    console.log('🚀 DEBUG: testGuardarActividad - Iniciando prueba de guardado...');
    
    try {
        const testData = {
            titulo: 'Actividad de Prueba Frontend Completa',
            descripcion: 'Esta actividad fue creada automáticamente para probar el frontend con todos los campos',
            fechaInicio: '2025-01-20',
            fechaFin: '2025-01-25',
            lugar: 'Aula Virtual',
            codigo: 'TEST-002',
            anioAcademico: '2024-25',
            estadoId: 1,
            unidadGestionId: 1,
            
            // Campos adicionales del formulario
            actividadPago: true,
            org_principal: 'Universidad de Barcelona',
            org_nif: 'Q0818001A',
            org_web: 'https://www.ub.edu',
            org_contacto: 'Departamento de Formación',
            org_email: 'formacion@ub.edu',
            org_tel: '934021100',
            
            // Campos de inscripción
            inscripcionInicio: '2025-01-15',
            inscripcionFin: '2025-01-19',
            inscripcionPlazas: 50,
            inscripcionListaEspera: true,
            inscripcionModalidad: 'Presencial',
            inscripcionRequisitosES: 'Estudiantes de la UB',
            inscripcionRequisitosCA: 'Estudiants de la UB',
            inscripcionRequisitosEN: 'UB students',
            
            // Campos de programa
            programaDescripcionES: 'Programa completo de formación',
            programaDescripcionCA: 'Programa complet de formació',
            programaDescripcionEN: 'Complete training program',
            programaContenidosES: 'Contenidos del programa',
            programaContenidosCA: 'Continguts del programa',
            programaContenidosEN: 'Program contents',
            programaObjetivosES: 'Objetivos del programa',
            programaObjetivosCA: 'Objectius del programa',
            programaObjetivosEN: 'Program objectives',
            programaDuracion: 20.5,
            programaInicio: '2025-01-20',
            programaFin: '2025-01-25',
            
            // Campos de importes
            imp_base: 150.00,
            imp_tipo: 'IVA 21%',
            imp_descuento_pct: 10,
            imp_codigo: 'DESCUENTO10',
            imp_condiciones_es: 'Condiciones en español',
            imp_condiciones_ca: 'Condicions en català',
            imp_condiciones_en: 'Terms in English'
        };

        console.log('🚀 DEBUG: testGuardarActividad - Datos de prueba:', testData);
        
        const resultado = await api.createActividad(testData);
        console.log('✅ DEBUG: testGuardarActividad - Resultado:', resultado);
        showMessage('Actividad de prueba creada exitosamente con todos los campos', 'success');
        
        return resultado;
    } catch (error) {
        console.error('❌ DEBUG: testGuardarActividad - Error:', error);
        showMessage(`Error en prueba de guardado: ${error.message}`, 'danger');
        throw error;
    }
}

// Exportar funciones para uso global
window.UBActividadAPI = UBActividadAPI;
window.api = api;
window.showMessage = showMessage;
window.loadEstados = loadEstados;
window.loadUnidadesGestion = loadUnidadesGestion;
window.loadValoresDominio = loadValoresDominio;
window.cargarDominios = cargarDominios;
window.getValoresDominio = getValoresDominio;
window.toggleImporte = toggleImporte;
window.guardarActividad = guardarActividad;
window.cargarActividad = cargarActividad;
window.cambiarEstado = cambiarEstado;
window.initializePage = initializePage;
window.testBackendConnection = testBackendConnection;
window.testGuardarActividad = testGuardarActividad;
window.guardarBorrador = guardarBorrador;
window.restaurarBorrador = restaurarBorrador;
window.vaciarBorrador = vaciarBorrador;
window.rellenarConDatosPrueba = rellenarConDatosPrueba;

// Función de prueba para aplicar todos los estilos de Admin
function testAdminStyles() {
    console.log('🔧 DEBUG: testAdminStyles - Aplicando estilos de Admin...');
    
        // Los estilos CSS se encargan de los bordes
    
    // CRAI - Azul
    document.querySelectorAll('[data-ug="CRAI"]').forEach(element => {
        element.style.display = 'block';
    });
    
    // IDP - Amarillento
    document.querySelectorAll('[data-ug="IDP"]').forEach(element => {
        element.style.display = 'block';
    });
    
    // SAE - Verde
    document.querySelectorAll('[data-ug="SAE"]').forEach(element => {
        element.style.display = 'block';
    });
    
    console.log('🔧 DEBUG: testAdminStyles - Estilos aplicados');
}

// Hacer la función disponible globalmente
window.testAdminStyles = testAdminStyles;

// Funciones para gestión de borradores
function guardarBorrador() {
    console.log('🚀 DEBUG: guardarBorrador - Versión del script: scripts.js?v=1.0.6');
    console.log('🚀 DEBUG: guardarBorrador - Guardando borrador en localStorage...');
    
    try {
        const formData = {};
        
        // Recopilar todos los campos del formulario
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id) {
                if (input.type === 'checkbox') {
                    formData[input.id] = input.checked;
                } else {
                    formData[input.id] = input.value;
                }
            }
        });
        
        // Guardar en localStorage
        localStorage.setItem('borrador_actividad', JSON.stringify(formData));
        
        showMessage('Borrador guardado correctamente', 'success');
        console.log('✅ DEBUG: guardarBorrador - Borrador guardado:', formData);
    } catch (error) {
        console.error('❌ DEBUG: guardarBorrador - Error:', error);
        showMessage(`Error guardando borrador: ${error.message}`, 'danger');
    }
}

function restaurarBorrador() {
    console.log('🚀 DEBUG: restaurarBorrador - Versión del script: scripts.js?v=1.0.6');
    console.log('🚀 DEBUG: restaurarBorrador - Restaurando borrador desde localStorage...');
    
    try {
        const borrador = localStorage.getItem('borrador_actividad');
        
        if (!borrador) {
            showMessage('No hay borrador guardado', 'warning');
            return;
        }
        
        const formData = JSON.parse(borrador);
        
        // Restaurar todos los campos del formulario
        Object.keys(formData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = formData[id];
                } else {
                    element.value = formData[id];
                }
            }
        });
        
        showMessage('Borrador restaurado correctamente', 'success');
        console.log('✅ DEBUG: restaurarBorrador - Borrador restaurado:', formData);
    } catch (error) {
        console.error('❌ DEBUG: restaurarBorrador - Error:', error);
        showMessage(`Error restaurando borrador: ${error.message}`, 'danger');
    }
}

function vaciarBorrador() {
    console.log('🚀 DEBUG: vaciarBorrador - Versión del script: scripts.js?v=1.0.6');
    console.log('🚀 DEBUG: vaciarBorrador - Vaciamdo borrador...');
    
    try {
        localStorage.removeItem('borrador_actividad');
        
        // Limpiar todos los campos del formulario
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        
        showMessage('Borrador vaciado correctamente', 'success');
        console.log('✅ DEBUG: vaciarBorrador - Borrador vaciado');
    } catch (error) {
        console.error('❌ DEBUG: vaciarBorrador - Error:', error);
        showMessage(`Error vaciando borrador: ${error.message}`, 'danger');
    }
}

// Función para actualizar campos específicos por UG
function actualizarCamposUG() {
    console.log('🔧 DEBUG: actualizarCamposUG - Iniciando función...');
    
    // Verificar si es Admin (desde sessionStorage)
    let userData = JSON.parse(sessionStorage.getItem('ub_user_data') || '{}');
    
    // Si no hay datos del usuario, intentar obtenerlos del header
    if (!userData.rol) {
        // Buscar en el DOM si hay información del usuario
        const userInfoElement = document.querySelector('[data-user-info]');
        if (userInfoElement) {
            try {
                userData = JSON.parse(userInfoElement.dataset.userInfo);
            } catch (e) {
                console.log('🔧 DEBUG: No se pudo parsear userInfo del DOM');
            }
        }
    }
    
    const isAdmin = userData.rol === 'Admin';
    console.log('🔧 DEBUG: actualizarCamposUG - Es Admin:', isAdmin);
    console.log('🔧 DEBUG: actualizarCamposUG - UserData:', userData);
    
    // Si no tenemos datos del usuario, usar función de prueba directa
    if (!userData.rol) {
        console.log('🔧 DEBUG: No hay datos del usuario, usando función de prueba directa...');
        testAdminStyles();
        return;
    }
    
    const unidadGestionId = document.getElementById('actividadUnidadGestion');
    if (!unidadGestionId) {
        console.log('❌ DEBUG: actualizarCamposUG - No se encontró actividadUnidadGestion');
        return;
    }
    
    const value = unidadGestionId.value;
    console.log('🔧 DEBUG: actualizarCamposUG - Valor seleccionado:', value);
    
    // Si es Admin, mostrar todos los campos con sus colores
    if (isAdmin) {
        console.log('🔧 DEBUG: actualizarCamposUG - Modo Admin: mostrando todos los campos con colores');
        
        // Aplicar estilo gris a todos los inputs comunes (sin data-ug)
        document.querySelectorAll('.col-md-3:not([data-ug]) input, .col-md-3:not([data-ug]) select, .col-md-3:not([data-ug]) textarea, .col-md-4:not([data-ug]) input, .col-md-4:not([data-ug]) select, .col-md-4:not([data-ug]) textarea, .col-md-6:not([data-ug]) input, .col-md-6:not([data-ug]) select, .col-md-6:not([data-ug]) textarea, .col-md-12:not([data-ug]) input, .col-md-12:not([data-ug]) select, .col-md-12:not([data-ug]) textarea').forEach(input => {
            input.style.borderColor = '#6b7280';
            input.style.borderWidth = '2px';
        });
        
        // Mostrar y colorear todos los campos específicos
        // CRAI - Azul
        document.querySelectorAll('[data-ug="CRAI"]').forEach(element => {
            element.style.display = 'block';
        });
        
        // IDP - Amarillento
        document.querySelectorAll('[data-ug="IDP"]').forEach(element => {
            element.style.display = 'block';
        });
        
        // SAE - Verde
        document.querySelectorAll('[data-ug="SAE"]').forEach(element => {
            element.style.display = 'block';
        });
        
        return; // Salir de la función para Admin
    }
    
    // Los estilos CSS se encargan de los bordes
    
    // Ocultar todos los campos específicos primero
    document.querySelectorAll('[data-ug]').forEach(element => {
        element.style.display = 'none';
    });
    
    // Mostrar campos según la unidad de gestión seleccionada
    if (value === '1') { // IDP
        document.querySelectorAll('[data-ug="IDP"]').forEach(element => {
            element.style.display = 'block';
        });
    }
    
    if (value === '2') { // CRAI
        console.log('🔧 DEBUG: actualizarCamposUG - Aplicando estilos CRAI...');
        const craiElements = document.querySelectorAll('[data-ug="CRAI"]');
        console.log('🔧 DEBUG: actualizarCamposUG - Elementos CRAI encontrados:', craiElements.length);
        
        craiElements.forEach(element => {
            element.style.display = 'block';
        });
    }
    
    if (value === '3') { // SAE
        document.querySelectorAll('[data-ug="SAE"]').forEach(element => {
            element.style.display = 'block';
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DEBUG: DOMContentLoaded - Versión del script: scripts.js?v=1.0.6');
    console.log('🚀 DEBUG: DOMContentLoaded - Iniciando aplicación...');
    
    // Probar conexión al cargar
    testBackendConnection();
    
    // Inicializar página
    initializePage();
    
    // Configurar eventos para los botones
    const btnGuardarActividad = document.getElementById('btnGuardarActividad');
    const btnTestGuardar = document.getElementById('btnTestGuardar');
    const btnGuardarBorrador = document.getElementById('btnGuardarBorrador');
    const btnRestaurarBorrador = document.getElementById('btnRestaurarBorrador');
    const btnVaciarBorrador = document.getElementById('btnVaciarBorrador');
    
    if (btnGuardarActividad) {
        btnGuardarActividad.addEventListener('click', guardarActividad);
        console.log('✅ DEBUG: DOMContentLoaded - Evento click configurado para btnGuardarActividad');
    }
    
    if (btnTestGuardar) {
        btnTestGuardar.addEventListener('click', testGuardarActividad);
        console.log('✅ DEBUG: DOMContentLoaded - Evento click configurado para btnTestGuardar');
    }
    
    if (btnGuardarBorrador) {
        btnGuardarBorrador.addEventListener('click', guardarBorrador);
        console.log('✅ DEBUG: DOMContentLoaded - Evento click configurado para btnGuardarBorrador');
    }
    
    if (btnRestaurarBorrador) {
        btnRestaurarBorrador.addEventListener('click', restaurarBorrador);
        console.log('✅ DEBUG: DOMContentLoaded - Evento click configurado para btnRestaurarBorrador');
    }
    
    if (btnVaciarBorrador) {
        btnVaciarBorrador.addEventListener('click', vaciarBorrador);
        console.log('✅ DEBUG: DOMContentLoaded - Evento click configurado para btnVaciarBorrador');
    }
    
    // Event listener para cambio de unidad de gestión
    const unidadGestionSelect = document.getElementById('actividadUnidadGestion');
    if (unidadGestionSelect) {
        unidadGestionSelect.addEventListener('change', function() {
            actualizarCamposUG();
        });
        console.log('✅ DEBUG: DOMContentLoaded - Evento change configurado para actividadUnidadGestion');
        
        // Llamar inicialmente para aplicar estilos
        actualizarCamposUG();
    }
});

// Función para rellenar el formulario con datos de prueba
async function rellenarConDatosPrueba() {
    console.log('🚀 DEBUG: rellenarConDatosPrueba - Rellenando formulario con datos de prueba...');
    
    try {
        // Función auxiliar para obtener el primer valor de un select
        function getPrimerValorSelect(elementId) {
            const element = document.getElementById(elementId);
            if (element && element.options.length > 1) {
                // Saltar la primera opción (que suele ser "Seleccionar...")
                return element.options[1].value;
            }
            return '';
        }
        
        // Datos de prueba para TODOS los campos del formulario
        const datosPrueba = {
            // === INFORMACIÓN GENERAL ===
            'actividadCodigo': `TEST-${new Date().getTime()}`,
            'actividadTitulo': 'Jornada de Innovación Tecnológica 2025',
            'actividadTituloCA': 'Jornada d\'Innovació Tecnològica 2025',
            'actividadTituloES': 'Jornada de Innovación Tecnológica 2025',
            'actividadTituloEN': 'Technology Innovation Day 2025',
            'tipoActividad': getPrimerValorSelect('tipoActividad'),
            'actividadUnidadGestion': getPrimerValorSelect('actividadUnidadGestion'),
            'condicionesEconomicas': 'Gratuita para miembros UB',
            'actividadAnioAcademico': '2024-25',
            'lineaEstrategica': getPrimerValorSelect('lineaEstrategica'),
            'objetivoEstrategico': getPrimerValorSelect('objetivoEstrategico'),
            'codigoRelacionado': 'REL-2025-001',
            'actividadReservada': getPrimerValorSelect('actividadReservada'),
            'fechaActividad': '2025-03-15',
            'motivoCierre': '',
            'personaSolicitante': 'Dr. Carlos López',
            'coordinador': 'Dr. Ana García',
            'jefeUnidadGestora': 'Prof. María Rodríguez',
            'gestorActividad': 'Dr. Ana García',
            'facultadDestinataria': 'Facultad de Informática',
            'departamentoDestinatario': 'Departamento de Ingeniería Informática',
            'centroUnidadUBDestinataria': getPrimerValorSelect('centroUnidadUBDestinataria'),
            'otrosCentrosInstituciones': 'Universidad Politécnica de Cataluña',
            'plazasTotales': '50',
            'horasTotales': '8',
            'centroTrabajoRequerido': getPrimerValorSelect('centroTrabajoRequerido'),
            'modalidadGestion': getPrimerValorSelect('modalidadGestion'),
            'fechaInicioImparticion': '2025-03-15',
            'fechaFinImparticion': '2025-03-15',
            'actividadPago': 'true',
            
            // === CAMPOS ESPECÍFICOS POR UG ===
            'coordinadorCentreUnitat': 'Dr. Ana García',
            'centreTreballeAlumne': 'Campus Nord - Edificio Omega',
            'creditosTotalesCRAI': '2.0',
            'creditosTotalesSAE': '3.0',
            'creditosMinimosSAE': '1.0',
            'creditosMaximosSAE': '5.0',
            
            // === ENTIDADES ORGANIZADORAS ===
            'org_principal': 'Universidad de Barcelona',
            'org_nif': 'Q0818000A',
            'org_web': 'https://www.ub.edu',
            'org_contacto': 'Dr. Ana García',
            'org_email': 'ana.garcia@ub.edu',
            'org_tel': '+34 934 021 100',
            
            // === IMPORTE Y DESCUENTOS ===
            'imp_base': '0.00',
            'imp_tipo': getPrimerValorSelect('imp_tipo'),
            'imp_descuento_pct': '0',
            'imp_codigo': '',
            'imp_condiciones_es': 'Actividad gratuita para miembros de la UB',
            'imp_condiciones_ca': 'Activitat gratuïta per a membres de la UB',
            'imp_condiciones_en': 'Free activity for UB members',
            
            // === INSCRIPCIÓN ===
            'insc_inicio': '2025-02-01',
            'insc_fin': '2025-03-10',
            'insc_plazas': '50',
            'insc_lista_espera': 'true',
            'insc_modalidad': 'Presencial',
            'insc_requisitos_es': 'Conocimientos básicos de programación',
            'insc_requisitos_ca': 'Coneixements bàsics de programació',
            'insc_requisitos_en': 'Basic programming knowledge',
            
            // === PROGRAMA ===
            'programa_descripcion_es': 'Jornada completa sobre las últimas tendencias en innovación tecnológica',
            'programa_descripcion_ca': 'Jornada completa sobre les últimes tendències en innovació tecnològica',
            'programa_descripcion_en': 'Full day on the latest trends in technological innovation',
            'programa_contenidos_es': 'Inteligencia Artificial, Machine Learning, Blockchain, IoT',
            'programa_contenidos_ca': 'Intel·ligència Artificial, Machine Learning, Blockchain, IoT',
            'programa_contenidos_en': 'Artificial Intelligence, Machine Learning, Blockchain, IoT',
            'programa_objetivos_es': 'Conocer las últimas tecnologías y sus aplicaciones prácticas',
            'programa_objetivos_ca': 'Conèixer les últimes tecnologies i les seves aplicacions pràctiques',
            'programa_objetivos_en': 'Learn about the latest technologies and their practical applications',
            'programa_duracion': '8.0',
            'programa_inicio': '2025-03-15',
            'programa_fin': '2025-03-15',
            'tipusEstudiSAE': 'Màster',
            'categoriaSAE': 'Avançat',
            'competenciesSAE': 'Análisis de datos, Programación avanzada, Pensamiento crítico'
        };
        
        // Rellenar campos básicos
        Object.keys(datosPrueba).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = datosPrueba[id] === 'true';
                } else {
                    element.value = datosPrueba[id];
                }
            } else {
                console.log(`⚠️ Campo no encontrado: ${id}`);
            }
        });
        
        // Rellenar participantes (si existen)
        const participantesContainer = document.getElementById('participantesContainer');
        if (participantesContainer && typeof addParticipante === 'function') {
            try {
                participantesContainer.innerHTML = ''; // Limpiar participantes existentes
                
                const participantesPrueba = [
                    { nombre: 'Dr. Ana García', rol: 'Coordinación', email: 'ana.garcia@ub.edu' },
                    { nombre: 'Prof. Carlos López', rol: 'Ponente', email: 'carlos.lopez@ub.edu' },
                    { nombre: 'Dra. María Rodríguez', rol: 'Ponente', email: 'maria.rodriguez@ub.edu' }
                ];
                
                participantesPrueba.forEach((participante, index) => {
                    // Crear el participante
                    addParticipante();
                    
                    // Esperar un momento para que se cree el DOM
                    setTimeout(() => {
                        // Buscar todos los elementos con IDs que empiecen con participante_
                        const participanteElements = document.querySelectorAll('[id^="participante_"]');
                        const participanteIds = [...new Set(Array.from(participanteElements).map(el => el.id.split('_')[1]))];
                        
                        // Ordenar los IDs y tomar el correspondiente al índice actual
                        const sortedIds = participanteIds.map(id => parseInt(id)).sort((a, b) => a - b);
                        const targetParticipanteId = sortedIds[index];
                        const participanteId = `participante_${targetParticipanteId}`;
                        
                        console.log(`🔍 Buscando participante ${index + 1} con ID: ${participanteId} (IDs disponibles: ${sortedIds.join(', ')})`);
                        
                        // Rellenar campos de forma segura
                        const campos = ['nombre', 'rol', 'email'];
                        let camposRellenados = 0;
                        campos.forEach(campo => {
                            const elementId = `${participanteId}_${campo}`;
                            const element = document.getElementById(elementId);
                            if (element && participante[campo]) {
                                element.value = participante[campo];
                                camposRellenados++;
                                console.log(`✅ Campo ${campo} rellenado: ${participante[campo]} (ID: ${elementId})`);
                            } else {
                                console.log(`⚠️ Campo ${campo} no encontrado o sin valor (ID: ${elementId})`);
                            }
                        });
                        
                        console.log(`📊 Participante ${index + 1}: ${camposRellenados}/${campos.length} campos rellenados`);
                    }, 300 * (index + 1)); // Delay más largo para cada participante
                });
                console.log('✅ Participantes rellenados correctamente');
            } catch (error) {
                console.log('⚠️ Error rellenando participantes:', error.message);
            }
        }
        
        // Rellenar subactividades (si existen)
        const subactividadesContainer = document.getElementById('subactividadesContainer');
        if (subactividadesContainer && typeof addSubactividad === 'function') {
            try {
                subactividadesContainer.innerHTML = ''; // Limpiar subactividades existentes
                
                const subactividadesPrueba = [
                    {
                        titulo: 'Inteligencia Artificial',
                        modalidad: 'Presencial',
                        docente: 'Dr. Carlos López',
                        fechaInicio: '2025-03-15',
                        fechaFin: '2025-03-15',
                        horaInicio: '09:00',
                        horaFin: '11:00',
                        duracion: '2.0',
                        ubicacion: 'Aula 201',
                        aforo: '25',
                        idioma: 'English',
                        descripcion: 'Introducción a la IA y sus aplicaciones'
                    },
                    {
                        titulo: 'Machine Learning Avanzado',
                        modalidad: 'Online',
                        docente: 'Dra. María Rodríguez',
                        fechaInicio: '2025-03-15',
                        fechaFin: '2025-03-15',
                        horaInicio: '11:30',
                        horaFin: '13:30',
                        duracion: '2.0',
                        ubicacion: 'Zoom Meeting',
                        aforo: '30',
                        idioma: 'English',
                        descripcion: 'Aplicaciones prácticas de Machine Learning'
                    }
                ];
                
                // Crear subactividades y rellenarlas
                subactividadesPrueba.forEach((subactividad, index) => {
                    // Crear la subactividad
                    addSubactividad();
                    
                    // Esperar un momento para que se cree el DOM
                    setTimeout(() => {
                        // Buscar todos los elementos con IDs que empiecen con subactividad_
                        const subactividadElements = document.querySelectorAll('[id^="subactividad_"]');
                        const subactividadIds = [...new Set(Array.from(subactividadElements).map(el => el.id.split('_')[1]))];
                        
                        // Ordenar los IDs y tomar el correspondiente al índice actual
                        const sortedIds = subactividadIds.map(id => parseInt(id)).sort((a, b) => a - b);
                        const targetSubactividadId = sortedIds[index];
                        const subactividadId = `subactividad_${targetSubactividadId}`;
                        
                        console.log(`🔍 Buscando subactividad ${index + 1} con ID: ${subactividadId} (IDs disponibles: ${sortedIds.join(', ')})`);
                        
                        // Rellenar campos de forma segura
                        const campos = ['titulo', 'modalidad', 'docente', 'fechaInicio', 'fechaFin', 'horaInicio', 'horaFin', 'duracion', 'ubicacion', 'aforo', 'idioma', 'descripcion'];
                        let camposRellenados = 0;
                        campos.forEach(campo => {
                            const elementId = `${subactividadId}_${campo}`;
                            const element = document.getElementById(elementId);
                            if (element && subactividad[campo]) {
                                element.value = subactividad[campo];
                                camposRellenados++;
                                console.log(`✅ Campo ${campo} rellenado: ${subactividad[campo]} (ID: ${elementId})`);
                            } else {
                                console.log(`⚠️ Campo ${campo} no encontrado o sin valor (ID: ${elementId})`);
                            }
                        });
                        
                        console.log(`📊 Subactividad ${index + 1}: ${camposRellenados}/${campos.length} campos rellenados`);
                    }, 300 * (index + 1)); // Delay más largo para cada subactividad
                });
                
                console.log('✅ Subactividades rellenadas correctamente');
            } catch (error) {
                console.log('⚠️ Error rellenando subactividades:', error.message);
            }
        }
        
        showMessage('Formulario rellenado con datos de prueba', 'success');
        console.log('✅ DEBUG: rellenarConDatosPrueba - Formulario rellenado correctamente');
        
    } catch (error) {
        console.error('❌ DEBUG: rellenarConDatosPrueba - Error:', error);
        showMessage(`Error rellenando formulario: ${error.message}`, 'danger');
    }
}

// ===== DOMINIOS =====

// Obtener valores de un dominio específico
async function getValoresDominio(nombreDominio) {
    console.log('🚀 DEBUG: getValoresDominio - Dominio:', nombreDominio);
    try {
        const response = await fetch(`${API_BASE_URL}/api/dominios/${nombreDominio}/valores`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('✅ DEBUG: getValoresDominio - Respuesta para', nombreDominio + ':', data);
        return data;
    } catch (error) {
        console.error('❌ DEBUG: getValoresDominio - Error:', error);
        throw error;
    }
}

// Cargar valores de dominio en un elemento select
async function loadValoresDominio(elementId, nombreDominio) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.log('⚠️ Elemento no encontrado:', elementId);
            return;
        }
        
        console.log('🔍 DEBUG: loadValoresDominio - Cargando', nombreDominio, 'en elemento:', element);
        
        const response = await getValoresDominio(nombreDominio);
        console.log('📊 DEBUG: loadValoresDominio - Respuesta obtenida para', nombreDominio + ':', response);
        
        // Extraer los valores del array dentro de la respuesta
        const valores = response.valores || response;
        console.log('📊 DEBUG: loadValoresDominio - Valores extraídos para', nombreDominio + ':', valores);
        
        if (!valores || !Array.isArray(valores) || valores.length === 0) {
            console.warn('⚠️ DEBUG: loadValoresDominio - No se encontraron valores válidos para', nombreDominio);
            return;
        }
        
        // Limpiar select pero preservar la primera opción si existe
        const firstOption = element.querySelector('option');
        element.innerHTML = '';
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccionar...';
        element.appendChild(defaultOption);
        
        // Agregar opciones
        valores.forEach(valor => {
            const option = document.createElement('option');
            
            // Usar siempre ID para todos los campos de dominio
            option.value = valor.id || valor.Id || valor.valor || valor.Valor || valor.value || valor.Value;
            option.textContent = valor.descripcion || valor.Descripcion || valor.valor || valor.Valor || valor.value || valor.Value;
            
            element.appendChild(option);
        });
        
        console.log('✅ DEBUG: loadValoresDominio - Select', elementId, 'llenado con', valores.length, 'opciones');
        
    } catch (error) {
        console.error('❌ DEBUG: loadValoresDominio - Error:', error);
    }
}

// Función duplicada eliminada - usar la primera función cargarDominios()

// v=1.0.53

// Función para limpiar caracteres especiales problemáticos
function limpiarCaracteresEspeciales(texto) {
    if (!texto) return texto;
    return texto
        .replace(/·/g, '') // Eliminar punto medio
        .replace(/à/g, 'a') // Reemplazar caracteres acentuados
        .replace(/è/g, 'e')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ò/g, 'o')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/ç/g, 'c');
}

// Función para mostrar mensajes de éxito
function mostrarMensajeExito(mensaje) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alert alert-success alert-dismissible fade show';
    mensajeDiv.innerHTML = `
        <strong>¡Éxito!</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del body
    document.body.insertBefore(mensajeDiv, document.body.firstChild);
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        if (mensajeDiv.parentNode) {
            mensajeDiv.remove();
        }
    }, 3000);
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alert alert-danger alert-dismissible fade show';
    mensajeDiv.innerHTML = `
        <strong>Error:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar al inicio del body
    document.body.insertBefore(mensajeDiv, document.body.firstChild);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (mensajeDiv.parentNode) {
            mensajeDiv.remove();
        }
    }, 5000);
}

// Función para cargar actividad para edición
async function cargarActividadParaEdicion(id) {
    try {
        console.log('🚀 DEBUG: cargarActividadParaEdicion - Cargando actividad con ID:', id);
        console.log('🚀 DEBUG: cargarActividadParaEdicion - URL:', `${API_BASE_URL}/api/actividades/${id}`);
        
        // Llamar al endpoint para obtener la actividad
        const response = await fetch(`${API_BASE_URL}/api/actividades/${id}`);
        console.log('🚀 DEBUG: cargarActividadParaEdicion - Response status:', response.status);
        console.log('🚀 DEBUG: cargarActividadParaEdicion - Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const actividad = await response.json();
        console.log('✅ DEBUG: cargarActividadParaEdicion - Actividad cargada:', actividad);
        
        // Llenar el formulario con los datos
        llenarFormularioConActividad(actividad);
        
    } catch (error) {
        console.error('❌ DEBUG: cargarActividadParaEdicion - Error:', error);
        console.error('❌ DEBUG: cargarActividadParaEdicion - Error stack:', error.stack);
        mostrarMensajeError(`Error cargando actividad: ${error.message}`);
    }
}

// Función para cargar actividad para edición SIN cargar dominios
async function cargarActividadParaEdicionSinDominios(id) {
    try {
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Cargando actividad con ID:', id);
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - URL:', `${API_BASE_URL}/api/actividades/${id}`);
        
        // Establecer bandera para evitar que llenarFormularioConActividad cargue dominios
        window.cargandoSinDominios = true;
        
        // Llamar al endpoint para obtener la actividad
        const response = await fetch(`${API_BASE_URL}/api/actividades/${id}`);
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Response status:', response.status);
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const actividad = await response.json();
        console.log('✅ DEBUG: cargarActividadParaEdicionSinDominios - Actividad cargada:', actividad);
        
        // PRIMERO: Esperar a que el DOM esté completamente cargado antes de cargar dominios
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Esperando a que el DOM esté listo...');
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
        
        // SEGUNDO: Cargar los dominios para que los dropdowns tengan opciones
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Cargando dominios después de DOM listo...');
        
        // Sistema de carga diferida con reintentos robustos
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Iniciando carga robusta de dominios...');
        
        // Esperar hasta que todos los elementos DOM estén disponibles
        await ensureElementsReady();
        
        // Lista de dominios a cargar con sus elementos
        const dominiosACargar = [
            { elementId: 'tipoActividad', dominio: 'TIPOS_ACTIVIDAD' },
            { elementId: 'lineaEstrategica', dominio: 'LINEAS_ESTRATEGICAS' },
            { elementId: 'objetivoEstrategico', dominio: 'OBJETIVOS_ESTRATEGICOS' },
            { elementId: 'actividadReservada', dominio: 'ACTIVIDADES_RESERVADAS' },
            { elementId: 'modalidadGestion', dominio: 'MODALIDADES_GESTION' },
            { elementId: 'centroUnidadUBDestinataria', dominio: 'CENTROS_UB' }
        ];
        
        // Cargar dominios de forma robusta
        await cargarDominiosRobust(dominiosACargar);
        
        // SEGUNDO: Llenar el formulario con los datos
        llenarFormularioConActividad(actividad);
        
        // TERCERO: Establecer valores en los dropdowns (ahora que tienen opciones)
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Estableciendo valores en dropdowns...');
        establecerValoresDropdowns(actividad);
        
        // Cargar datos adicionales (entidades, importes, participantes, subactividades) SIN dominios
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Cargando datos adicionales sin dominios...');
        const _idAdicional = actividad.id || actividad.Id || document.getElementById('actividadId')?.value || new URLSearchParams(window.location.search).get('id');
        console.log('🚀 DEBUG: cargarDatosAdicionalesSinDominios - ID utilizado:', _idAdicional);
        await cargarDatosAdicionalesSinDominios(_idAdicional);
        
        // Limpiar bandera
        window.cargandoSinDominios = false;
        
    } catch (error) {
        console.error('❌ DEBUG: cargarActividadParaEdicionSinDominios - Error:', error);
        console.error('❌ DEBUG: cargarActividadParaEdicionSinDominios - Error stack:', error.stack);
        mostrarMensajeError(`Error cargando actividad: ${error.message}`);
        // Limpiar bandera en caso de error
        window.cargandoSinDominios = false;
    }
}

// Función para llenar el formulario con los datos de la actividad
function llenarFormularioConActividad(actividad) {
    console.log('🚀 DEBUG: llenarFormularioConActividad - Llenando formulario...');
    
    // Campos básicos - Usar propiedades con ambos casos (mayúsculas y minúsculas)
    const titulo = actividad.Titulo || actividad.titulo;
    const codigo = actividad.Codigo || actividad.codigo;
    const anioAcademico = actividad.AnioAcademico || actividad.anioAcademico;
    const descripcion = actividad.Descripcion || actividad.descripcion;
    const lugar = actividad.Lugar || actividad.lugar;
    const condicionesEconomicas = actividad.CondicionesEconomicas || actividad.condicionesEconomicas;
    const lineaEstrategica = actividad.LineaEstrategica || actividad.lineaEstrategica;
    const objetivoEstrategico = actividad.ObjetivoEstrategico || actividad.objetivoEstrategico;
    const codigoRelacionado = actividad.CodigoRelacionado || actividad.codigoRelacionado;
    const fechaActividad = actividad.FechaActividad || actividad.fechaActividad;
    const personaSolicitante = actividad.PersonaSolicitante || actividad.personaSolicitante;
    const coordinador = actividad.Coordinador || actividad.coordinador;
    const jefeUnidadGestora = actividad.JefeUnidadGestora || actividad.jefeUnidadGestora;
    const gestorActividad = actividad.GestorActividad || actividad.gestorActividad;
    const facultadDestinataria = actividad.FacultadDestinataria || actividad.facultadDestinataria;
    const departamentoDestinatario = actividad.DepartamentoDestinatario || actividad.departamentoDestinatario;
    const centroUnidadUBDestinataria = actividad.CentroUnidadUBDestinataria || actividad.centroUnidadUBDestinataria;
    const otrosCentros = actividad.OtrosCentrosInstituciones || actividad.otrosCentrosInstituciones;
    const plazasTotales = actividad.PlazasTotales || actividad.plazasTotales;
    const horasTotales = actividad.HorasTotales || actividad.horasTotales;
    const centroTrabajoRequerido = actividad.CentroTrabajoRequerido || actividad.centroTrabajoRequerido;
    const modalidadGestion = actividad.ModalidadGestion || actividad.modalidadGestion;
    const actividadPago = actividad.ActividadPago || actividad.actividadPago;
    const unidadGestionId = actividad.UnidadGestionId || actividad.unidadGestionId;
    
    console.log('🔍 DEBUG: llenarFormularioConActividad - Título recibido:', titulo);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Código recibido:', codigo);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Año académico recibido:', anioAcademico);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Descripción recibida:', descripcion);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Lugar recibido:', lugar);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Condiciones económicas recibidas:', condicionesEconomicas);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Línea estratégica recibida:', lineaEstrategica);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Objetivo estratégico recibido:', objetivoEstrategico);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Código relacionado recibido:', codigoRelacionado);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Fecha actividad recibida:', fechaActividad);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Persona solicitante recibida:', personaSolicitante);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Coordinador recibido:', coordinador);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Jefe unidad gestora recibido:', jefeUnidadGestora);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Gestor actividad recibido:', gestorActividad);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Facultad destinataria recibida:', facultadDestinataria);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Departamento destinatario recibido:', departamentoDestinatario);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Centro unidad UB destinataria recibido:', centroUnidadUBDestinataria);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Otros centros recibidos:', otrosCentros);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Plazas totales recibidas:', plazasTotales);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Horas totales recibidas:', horasTotales);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Centro trabajo requerido recibido:', centroTrabajoRequerido);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Modalidad gestión recibida:', modalidadGestion);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Actividad pago recibida:', actividadPago);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Unidad gestión ID recibido:', unidadGestionId);
    
    if (document.getElementById('actividadTitulo')) {
        document.getElementById('actividadTitulo').value = titulo || '';
        console.log('✅ DEBUG: llenarFormularioConActividad - Título establecido en:', document.getElementById('actividadTitulo').value);
    } else {
        console.log('❌ DEBUG: llenarFormularioConActividad - Elemento actividadTitulo no encontrado');
    }
    if (document.getElementById('actividadCodigo')) {
        document.getElementById('actividadCodigo').value = codigo || '';
    }
    if (document.getElementById('actividadAnioAcademico')) {
        document.getElementById('actividadAnioAcademico').value = anioAcademico || '';
    }
    if (document.getElementById('actividadUnidadGestion')) {
        document.getElementById('actividadUnidadGestion').value = unidadGestionId || '';
    }
    
    // Campos adicionales básicos - Usar tanto mayúsculas como minúsculas
    if (document.getElementById('condicionesEconomicas')) {
        document.getElementById('condicionesEconomicas').value = condicionesEconomicas || '';
    }
    if (document.getElementById('lineaEstrategica')) {
        document.getElementById('lineaEstrategica').value = lineaEstrategica || '';
    }
    if (document.getElementById('objetivoEstrategico')) {
        document.getElementById('objetivoEstrategico').value = objetivoEstrategico || '';
    }
    if (document.getElementById('codigoRelacionado')) {
        document.getElementById('codigoRelacionado').value = codigoRelacionado || '';
    }
    if (document.getElementById('fechaActividad')) {
        document.getElementById('fechaActividad').value = fechaActividad ? fechaActividad.split('T')[0] : '';
    }
    if (document.getElementById('motivoCierre')) {
        document.getElementById('motivoCierre').value = actividad.MotivoCierre || actividad.motivoCierre || '';
    }
    if (document.getElementById('personaSolicitante')) {
        document.getElementById('personaSolicitante').value = personaSolicitante || '';
    }
    if (document.getElementById('coordinador')) {
        document.getElementById('coordinador').value = coordinador || '';
    }
    if (document.getElementById('jefeUnidadGestora')) {
        document.getElementById('jefeUnidadGestora').value = jefeUnidadGestora || '';
    }
    if (document.getElementById('gestorActividad')) {
        document.getElementById('gestorActividad').value = gestorActividad || '';
    }
    if (document.getElementById('facultadDestinataria')) {
        document.getElementById('facultadDestinataria').value = facultadDestinataria || '';
    }
    if (document.getElementById('departamentoDestinatario')) {
        document.getElementById('departamentoDestinatario').value = departamentoDestinatario || '';
    }
    if (document.getElementById('centroUnidadUBDestinataria')) {
        document.getElementById('centroUnidadUBDestinataria').value = centroUnidadUBDestinataria || '';
    }
    if (document.getElementById('otrosCentrosInstituciones')) {
        document.getElementById('otrosCentrosInstituciones').value = otrosCentros || '';
    }
    
    // CAMPOS ADICIONALES CRÍTICOS - Usar variables locales ya definidas
    if (document.getElementById('plazasTotales')) {
        document.getElementById('plazasTotales').value = plazasTotales || '';
    }
    if (document.getElementById('horasTotales')) {
        document.getElementById('horasTotales').value = horasTotales || '';
    }
    if (document.getElementById('otrosCentrosInstituciones')) {
        document.getElementById('otrosCentrosInstituciones').value = otrosCentros || '';
    }
    if (document.getElementById('centroTrabajoRequerido')) {
        document.getElementById('centroTrabajoRequerido').value = centroTrabajoRequerido || '';
    }
    if (document.getElementById('modalidadGestion')) {
        document.getElementById('modalidadGestion').value = modalidadGestion || '';
    }
    if (document.getElementById('actividadPago')) {
        document.getElementById('actividadPago').checked = actividadPago || false;
    }
    
    // Campos de coordinación y centros
    if (document.getElementById('coordinadorCentreUnitat')) {
        const coordinadorCentro = actividad.coordinadorCentreUnitat || actividad.CoordinadorCentreUnitat;
        document.getElementById('coordinadorCentreUnitat').value = coordinadorCentro || '';
    }
    if (document.getElementById('centreTreballeAlumne')) {
        const centreTreballe = actividad.centreTreballeAlumne || actividad.CentreTreballeAlumne;
        document.getElementById('centreTreballeAlumne').value = centreTreballe || '';
    }
    
    // Campos de créditos
    if (document.getElementById('creditosTotalesCRAI')) {
        const creditosCRAI = actividad.creditosTotalesCRAI || actividad.CreditosTotalesCRAI;
        document.getElementById('creditosTotalesCRAI').value = creditosCRAI || '';
    }
    if (document.getElementById('creditosTotalesSAE')) {
        const creditosSAE = actividad.creditosTotalesSAE || actividad.CreditosTotalesSAE;
        document.getElementById('creditosTotalesSAE').value = creditosSAE || '';
    }
    if (document.getElementById('creditosMinimosSAE')) {
        const creditosMin = actividad.creditosMinimosSAE || actividad.CreditosMinimosSAE;
        document.getElementById('creditosMinimosSAE').value = creditosMin || '';
    }
    if (document.getElementById('creditosMaximosSAE')) {
        const creditosMax = actividad.creditosMaximosSAE || actividad.CreditosMaximosSAE;
        document.getElementById('creditosMaximosSAE').value = creditosMax || '';
    }
    
    // Campos de inscripción
    if (document.getElementById('insc_inicio')) {
        const inscInicio = actividad.inscripcionInicio || actividad.InscripcionInicio;
        document.getElementById('insc_inicio').value = inscInicio ? inscInicio.split('T')[0] : '';
    }
    if (document.getElementById('insc_fin')) {
        const inscFin = actividad.inscripcionFin || actividad.InscripcionFin;
        document.getElementById('insc_fin').value = inscFin ? inscFin.split('T')[0] : '';
    }
    if (document.getElementById('insc_plazas')) {
        const inscPlazas = actividad.inscripcionPlazas || actividad.InscripcionPlazas;
        document.getElementById('insc_plazas').value = inscPlazas || '';
    }
    if (document.getElementById('insc_lista_espera')) {
        const inscListaEspera = actividad.inscripcionListaEspera || actividad.InscripcionListaEspera;
        document.getElementById('insc_lista_espera').checked = inscListaEspera || false;
    }
    if (document.getElementById('insc_modalidad')) {
        const inscModalidad = actividad.inscripcionModalidad || actividad.InscripcionModalidad;
        document.getElementById('insc_modalidad').value = inscModalidad || '';
    }
    
    // Campos de requisitos multiidioma
    if (document.getElementById('insc_requisitos_es')) {
        const reqES = actividad.inscripcionRequisitosES || actividad.InscripcionRequisitosES;
        document.getElementById('insc_requisitos_es').value = reqES || '';
    }
    if (document.getElementById('insc_requisitos_ca')) {
        const reqCA = actividad.inscripcionRequisitosCA || actividad.InscripcionRequisitosCA;
        document.getElementById('insc_requisitos_ca').value = reqCA || '';
    }
    if (document.getElementById('insc_requisitos_en')) {
        const reqEN = actividad.inscripcionRequisitosEN || actividad.InscripcionRequisitosEN;
        document.getElementById('insc_requisitos_en').value = reqEN || '';
    }
    
    // Campos de programa multiidioma
    if (document.getElementById('programa_descripcion_es')) {
        const progDescES = actividad.programaDescripcionES || actividad.ProgramaDescripcionES;
        document.getElementById('programa_descripcion_es').value = progDescES || '';
    }
    if (document.getElementById('programa_descripcion_ca')) {
        const progDescCA = actividad.programaDescripcionCA || actividad.ProgramaDescripcionCA;
        document.getElementById('programa_descripcion_ca').value = progDescCA || '';
    }
    if (document.getElementById('programa_descripcion_en')) {
        const progDescEN = actividad.programaDescripcionEN || actividad.ProgramaDescripcionEN;
        document.getElementById('programa_descripcion_en').value = progDescEN || '';
    }
    
    // Campos de contenidos multiidioma
    if (document.getElementById('programa_contenidos_es')) {
        const progContES = actividad.programaContenidosES || actividad.ProgramaContenidosES;
        document.getElementById('programa_contenidos_es').value = progContES || '';
    }
    if (document.getElementById('programa_contenidos_ca')) {
        const progContCA = actividad.programaContenidosCA || actividad.ProgramaContenidosCA;
        document.getElementById('programa_contenidos_ca').value = progContCA || '';
    }
    if (document.getElementById('programa_contenidos_en')) {
        const progContEN = actividad.programaContenidosEN || actividad.ProgramaContenidosEN;
        document.getElementById('programa_contenidos_en').value = progContEN || '';
    }
    
    // Campos de objetivos multiidioma
    if (document.getElementById('programa_objetivos_es')) {
        const progObjES = actividad.programaObjetivosES || actividad.ProgramaObjetivosES;
        document.getElementById('programa_objetivos_es').value = progObjES || '';
    }
    if (document.getElementById('programa_objetivos_ca')) {
        const progObjCA = actividad.programaObjetivosCA || actividad.ProgramaObjetivosCA;
        document.getElementById('programa_objetivos_ca').value = progObjCA || '';
    }
    if (document.getElementById('programa_objetivos_en')) {
        const progObjEN = actividad.programaObjetivosEN || actividad.ProgramaObjetivosEN;
        document.getElementById('programa_objetivos_en').value = progObjEN || '';
    }
    
    // Campos de duración y fechas del programa
    if (document.getElementById('programa_duracion')) {
        const progDuracion = actividad.programaDuracion || actividad.ProgramaDuracion;
        document.getElementById('programa_duracion').value = progDuracion || '';
    }
    if (document.getElementById('programa_inicio')) {
        const progInicio = actividad.programaInicio || actividad.ProgramaInicio;
        document.getElementById('programa_inicio').value = progInicio ? progInicio.split('T')[0] : '';
    }
    if (document.getElementById('programa_fin')) {
        const progFin = actividad.programaFin || actividad.ProgramaFin;
        document.getElementById('programa_fin').value = progFin ? progFin.split('T')[0] : '';
    }
    
    // Campos SAE
    if (document.getElementById('tipusEstudiSAE')) {
        const tipusEstudi = actividad.tipusEstudiSAE || actividad.TipusEstudiSAE;
        document.getElementById('tipusEstudiSAE').value = tipusEstudi || '';
    }
    if (document.getElementById('categoriaSAE')) {
        const categoria = actividad.categoriaSAE || actividad.CategoriaSAE;
        document.getElementById('categoriaSAE').value = categoria || '';
    }
    if (document.getElementById('competenciesSAE')) {
        const competencies = actividad.competenciesSAE || actividad.CompetenciesSAE;
        document.getElementById('competenciesSAE').value = competencies || '';
    }
    
    // Campos de fechas adicionales
    if (document.getElementById('fechaInicioImparticion')) {
        const fechaInicioImp = actividad.fechaInicioImparticion || actividad.FechaInicioImparticion;
        document.getElementById('fechaInicioImparticion').value = fechaInicioImp ? fechaInicioImp.split('T')[0] : '';
    }
    if (document.getElementById('fechaFinImparticion')) {
        const fechaFinImp = actividad.fechaFinImparticion || actividad.FechaFinImparticion;
        document.getElementById('fechaFinImparticion').value = fechaFinImp ? fechaFinImp.split('T')[0] : '';
    }
    if (document.getElementById('fechaInicio')) {
        const fechaInicio = actividad.fechaInicio || actividad.FechaInicio;
        document.getElementById('fechaInicio').value = fechaInicio ? fechaInicio.split('T')[0] : '';
    }
    if (document.getElementById('fechaFin')) {
        const fechaFin = actividad.fechaFin || actividad.FechaFin;
        document.getElementById('fechaFin').value = fechaFin ? fechaFin.split('T')[0] : '';
    }
    if (document.getElementById('lugar')) {
        document.getElementById('lugar').value = lugar || '';
    }
    
    // Campos adicionales que faltan
    if (document.getElementById('descripcion')) {
        document.getElementById('descripcion').value = descripcion || '';
    }
    if (document.getElementById('estado')) {
        document.getElementById('estado').value = actividad.estadoId || actividad.EstadoId || '';
    }
    
    // Campos adicionales - Usar variables ya definidas
    if (document.getElementById('tipoActividad')) {
        const tipoAct = actividad.tipoActividad || actividad.TipoActividad;
        document.getElementById('tipoActividad').value = tipoAct || '';
    }
    if (document.getElementById('actividadReservada')) {
        const actividadReserv = actividad.actividadReservada || actividad.ActividadReservada;
        document.getElementById('actividadReservada').value = actividadReserv ? 'PDI' : '';
    }
    
    // Campos de entidades organizadoras (temporalmente comentados hasta resolver el problema de relaciones)
    // if (document.getElementById('org_principal')) {
    //     document.getElementById('org_principal').value = actividad.EntidadesOrganizadoras?.[0]?.Nombre || '';
    // }
    // if (document.getElementById('org_nif')) {
    //     document.getElementById('org_nif').value = actividad.EntidadesOrganizadoras?.[0]?.NifCif || '';
    // }
    // if (document.getElementById('org_web')) {
    //     document.getElementById('org_web').value = actividad.EntidadesOrganizadoras?.[0]?.Web || '';
    // }
    // if (document.getElementById('org_contacto')) {
    //     document.getElementById('org_contacto').value = actividad.EntidadesOrganizadoras?.[0]?.PersonaContacto || '';
    // }
    // if (document.getElementById('org_email')) {
    //     document.getElementById('org_email').value = actividad.EntidadesOrganizadoras?.[0]?.Email || '';
    // }
    // if (document.getElementById('org_tel')) {
    //     document.getElementById('org_tel').value = actividad.EntidadesOrganizadoras?.[0]?.Telefono || '';
    // }
    
    // Campos de importes y descuentos (temporalmente comentados hasta resolver el problema de relaciones)
    // if (document.getElementById('imp_base')) {
    //     document.getElementById('imp_base').value = actividad.ImportesDescuentos?.[0]?.ImporteBase || '';
    // }
    // if (document.getElementById('imp_tipo')) {
    //     document.getElementById('imp_tipo').value = actividad.ImportesDescuentos?.[0]?.TipoImpuesto || '';
    // }
    // if (document.getElementById('imp_descuento_pct')) {
    //     document.getElementById('imp_descuento_pct').value = actividad.ImportesDescuentos?.[0]?.PorcentajeDescuento || '';
    // }
    // if (document.getElementById('imp_codigo')) {
    //     document.getElementById('imp_codigo').value = actividad.ImportesDescuentos?.[0]?.CodigoPromocional || '';
    // }
    // if (document.getElementById('imp_condiciones_es')) {
    //     document.getElementById('imp_condiciones_es').value = actividad.ImportesDescuentos?.[0]?.CondicionesES || '';
    // }
    // if (document.getElementById('imp_condiciones_ca')) {
    //     document.getElementById('imp_condiciones_ca').value = actividad.ImportesDescuentos?.[0]?.CondicionesCA || '';
    // }
    // if (document.getElementById('imp_condiciones_en')) {
    //     document.getElementById('imp_condiciones_en').value = actividad.ImportesDescuentos?.[0]?.CondicionesEN || '';
    // }
    
    console.log('✅ DEBUG: llenarFormularioConActividad - Formulario llenado correctamente');
    
    // Debug: Verificar qué campos se llenaron
    verificarCamposLlenados(actividad);
    
    // Solo cargar datos adicionales y establecer valores si NO se llama desde cargarActividadParaEdicionSinDominios
    if (!window.cargandoSinDominios) {
        // Cargar datos adicionales (entidades, importes, participantes, subactividades)
        cargarDatosAdicionales(actividad.Id);
        
        // Esperar a que los dominios se carguen y luego establecer los valores de los dropdowns
        setTimeout(() => {
            establecerValoresDropdowns(actividad);
        }, 1000);
    }
}

// Función para establecer valores en dropdowns después de que se carguen los dominios
function establecerValoresDropdowns(actividad) {
    console.log('🔧 DEBUG: establecerValoresDropdowns - Estableciendo valores en dropdowns...');
    
    // Establecer valores en dropdowns
    if (document.getElementById('actividadUnidadGestion')) {
        const select = document.getElementById('actividadUnidadGestion');
        const valor = actividad.UnidadGestionId || actividad.unidadGestionId;
        console.log('🔧 DEBUG: establecerValoresDropdowns - actividadUnidadGestion, valor:', valor);
        
        let codigo = '';
        if (valor === 1 || valor === '1') codigo = 'IDP';
        if (valor === 2 || valor === '2') codigo = 'CRAI';
        if (valor === 3 || valor === '3') codigo = 'SAE';

        const candidatos = [String(valor || ''), codigo].filter(Boolean);
        for (let option of select.options) {
            if (candidatos.includes(option.value) || candidatos.includes(option.text)) {
                option.selected = true;
                console.log('✅ DEBUG: establecerValoresDropdowns - actividadUnidadGestion establecido:', option.text || option.value);
                break;
            }
        }
    }
    
    if (document.getElementById('lineaEstrategica')) {
        const select = document.getElementById('lineaEstrategica');
        const valor = actividad.LineaEstrategica || actividad.lineaEstrategica;
        console.log('🔧 DEBUG: establecerValoresDropdowns - lineaEstrategica, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - lineaEstrategica establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('objetivoEstrategico')) {
        const select = document.getElementById('objetivoEstrategico');
        const valor = actividad.ObjetivoEstrategico || actividad.objetivoEstrategico;
        console.log('🔧 DEBUG: establecerValoresDropdowns - objetivoEstrategico, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - objetivoEstrategico establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('centroUnidadUBDestinataria')) {
        const select = document.getElementById('centroUnidadUBDestinataria');
        const valor = actividad.CentroUnidadUBDestinataria || actividad.centroUnidadUBDestinataria;
        console.log('🔧 DEBUG: establecerValoresDropdowns - centroUnidadUBDestinataria, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - centroUnidadUBDestinataria establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('centroTrabajoRequerido')) {
        const select = document.getElementById('centroTrabajoRequerido');
        const valor = actividad.CentroTrabajoRequerido || actividad.centroTrabajoRequerido;
        console.log('🔧 DEBUG: establecerValoresDropdowns - centroTrabajoRequerido, valor:', valor);
        if (valor) {
            // Mapeo específico para centroTrabajoRequerido
            const mapeo = {
                'Si': 'Sí',
                'si': 'Sí',
                'No': 'No',
                'no': 'No'
            };
            const valorMapeado = mapeo[valor] || valor;
            
            for (let option of select.options) {
                if (option.value === valorMapeado || option.text === valorMapeado || 
                    option.value.toLowerCase() === valorMapeado.toLowerCase() || 
                    option.text.toLowerCase() === valorMapeado.toLowerCase()) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - centroTrabajoRequerido establecido:', option.text);
                    break;
                }
            }
        }
    }

    if (document.getElementById('tipoActividad')) {
        const select = document.getElementById('tipoActividad');
        const valor = actividad.TipoActividad || actividad.tipoActividad;
        console.log('🔧 DEBUG: establecerValoresDropdowns - tipoActividad, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - tipoActividad establecido:', option.text);
                    break;
                }
            }
        }
    }

    if (document.getElementById('modalidadGestion')) {
        const select = document.getElementById('modalidadGestion');
        const valor = actividad.ModalidadGestion || actividad.modalidadGestion;
        console.log('🔧 DEBUG: establecerValoresDropdowns - modalidadGestion, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - modalidadGestion establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('tipusEstudiSAE')) {
        const select = document.getElementById('tipusEstudiSAE');
        const valor = actividad.TipusEstudiSAE || actividad.tipusEstudiSAE;
        console.log('🔧 DEBUG: establecerValoresDropdowns - tipusEstudiSAE, valor:', valor);
        if (valor) {
            // Mapeo específico para tipusEstudiSAE
            const mapeo = {
                'Master': 'Màster',
                'master': 'Màster',
                'Grau': 'Grau',
                'grau': 'Grau',
                'Doctorat': 'Doctorat',
                'doctorat': 'Doctorat'
            };
            const valorMapeado = mapeo[valor] || valor;
            
            for (let option of select.options) {
                if (option.value === valorMapeado || option.text === valorMapeado || 
                    option.value.toLowerCase() === valorMapeado.toLowerCase() || 
                    option.text.toLowerCase() === valorMapeado.toLowerCase()) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - tipusEstudiSAE establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('categoriaSAE')) {
        const select = document.getElementById('categoriaSAE');
        const valor = actividad.CategoriaSAE || actividad.categoriaSAE;
        console.log('🔧 DEBUG: establecerValoresDropdowns - categoriaSAE, valor:', valor);
        if (valor) {
            // Mapeo específico para categoriaSAE
            const mapeo = {
                'Avancat': 'Avançat',
                'avancat': 'Avançat',
                'Basic': 'Bàsic',
                'basic': 'Bàsic',
                'Especialitzacio': 'Especialització',
                'especialitzacio': 'Especialització'
            };
            const valorMapeado = mapeo[valor] || valor;
            
            for (let option of select.options) {
                if (option.value === valorMapeado || option.text === valorMapeado || 
                    option.value.toLowerCase() === valorMapeado.toLowerCase() || 
                    option.text.toLowerCase() === valorMapeado.toLowerCase()) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - categoriaSAE establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    console.log('✅ DEBUG: establecerValoresDropdowns - Valores de dropdowns establecidos');
}

// Función para verificar qué campos se llenaron correctamente
function verificarCamposLlenados(actividad) {
    console.log('🔍 DEBUG: verificarCamposLlenados - Verificando campos...');
    
    const camposEsperados = [
        'actividadTitulo', 'actividadCodigo', 'actividadAnioAcademico', 'actividadUnidadGestion',
        'condicionesEconomicas', 'lineaEstrategica', 'objetivoEstrategico', 'codigoRelacionado',
        'fechaActividad', 'motivoCierre', 'personaSolicitante', 'coordinador', 'jefeUnidadGestora',
        'gestorActividad', 'facultadDestinataria', 'departamentoDestinatario', 'centroUnidadUBDestinataria',
        'otrosCentrosInstituciones', 'plazasTotales', 'horasTotales', 'centroTrabajoRequerido',
        'modalidadGestion', 'fechaInicioImparticion', 'fechaFinImparticion', 'actividadPago',
        'coordinadorCentreUnitat', 'centreTreballeAlumne', 'creditosTotalesCRAI', 'creditosTotalesSAE',
        'creditosMinimosSAE', 'creditosMaximosSAE', 'insc_inicio', 'insc_fin', 'insc_plazas',
        'insc_lista_espera', 'insc_modalidad', 'insc_requisitos_es', 'insc_requisitos_ca', 'insc_requisitos_en',
        'programa_descripcion_es', 'programa_descripcion_ca', 'programa_descripcion_en',
        'programa_contenidos_es', 'programa_contenidos_ca', 'programa_contenidos_en',
        'programa_objetivos_es', 'programa_objetivos_ca', 'programa_objetivos_en',
        'programa_duracion', 'programa_inicio', 'programa_fin', 'tipusEstudiSAE', 'categoriaSAE', 'competenciesSAE'
    ];
    
    camposEsperados.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            let valor = elemento.value;
            
            // Para actividadUnidadGestion, verificar también el texto seleccionado
            if (campo === 'actividadUnidadGestion' && elemento.tagName === 'SELECT') {
                const selectedOption = elemento.options[elemento.selectedIndex];
                if (selectedOption && selectedOption.text && selectedOption.text !== 'Seleccionar...' && selectedOption.text !== 'Seleccionar unidad...') {
                    valor = selectedOption.text;
                }
            }
            
            if (valor && valor !== '') {
                console.log(`✅ Campo ${campo}: "${valor}"`);
            } else {
                console.log(`❌ Campo ${campo}: VACÍO`);
            }
        } else {
            console.log(`⚠️ Campo ${campo}: NO ENCONTRADO en el DOM`);
        }
    });
}

// Función para cargar datos adicionales de la actividad
async function cargarDatosAdicionales(actividadId) {
    try {
        console.log('🚀 DEBUG: cargarDatosAdicionales - Iniciando carga de datos adicionales...');
        
        // Cargar entidades organizadoras
        const entidadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/entidades`);
        if (entidadesResponse.ok) {
            const entidades = await entidadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Entidades cargadas:', entidades);
            llenarEntidadesOrganizadoras(entidades);
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/importes`);
        if (importesResponse.ok) {
            const importes = await importesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Importes cargados:', importes);
            llenarImportesDescuentos(importes);
        }
        
        // Cargar participantes
        const participantesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Participantes cargados:', participantes);
            llenarParticipantes(participantes);
        }
        
        // Cargar subactividades
        const subactividadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/subactividades`);
        if (subactividadesResponse.ok) {
            const subactividades = await subactividadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Subactividades cargadas:', subactividades);
            llenarSubactividades(subactividades);
        }
        
    } catch (error) {
        console.error('❌ DEBUG: cargarDatosAdicionales - Error:', error);
    }
}

// Función para cargar datos adicionales SIN cargar dominios
async function cargarDatosAdicionalesSinDominios(actividadId) {
    try {
        console.log('🚀 DEBUG: cargarDatosAdicionalesSinDominios - Iniciando carga de datos adicionales sin dominios...');
        
        // Cargar entidades organizadoras
        const entidadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/entidades-organizadoras`);
        if (entidadesResponse.ok) {
            const entidades = await entidadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Entidades cargadas:', entidades);
            llenarEntidadesOrganizadoras(entidades);
        } else {
            console.log('⚠️ DEBUG: cargarDatosAdicionalesSinDominios - No se encontraron entidades organizadoras');
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/importes-descuentos`);
        if (importesResponse.ok) {
            const importes = await importesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Importes cargados:', importes);
            llenarImportesDescuentos(importes);
        } else {
            console.log('⚠️ DEBUG: cargarDatosAdicionalesSinDominios - No se encontraron importes/descuentos');
        }
        
        // Cargar participantes
        const participantesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Participantes cargados:', participantes);
            llenarParticipantes(participantes);
        } else {
            console.log('⚠️ DEBUG: cargarDatosAdicionalesSinDominios - No se encontraron participantes');
        }
        
        // Cargar subactividades
        const subactividadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/subactividades`);
        if (subactividadesResponse.ok) {
            const subactividades = await subactividadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Subactividades cargadas:', subactividades);
            llenarSubactividades(subactividades);
        } else {
            console.log('⚠️ DEBUG: cargarDatosAdicionalesSinDominios - No se encontraron subactividades');
        }
        
        console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Datos adicionales cargados correctamente');
        
    } catch (error) {
        console.error('❌ DEBUG: cargarDatosAdicionalesSinDominios - Error:', error);
        mostrarMensajeError(`Error cargando datos adicionales: ${error.message}`);
    }
}

// Función para llenar entidades organizadoras
function llenarEntidadesOrganizadoras(entidades) {
    if (entidades && entidades.length > 0) {
        const entidad = entidades[0]; // Tomar la primera entidad
        if (document.getElementById('org_principal')) {
            document.getElementById('org_principal').value = entidad.nombre || '';
        }
        if (document.getElementById('org_nif')) {
            document.getElementById('org_nif').value = entidad.nifCif || '';
        }
        if (document.getElementById('org_web')) {
            document.getElementById('org_web').value = entidad.web || '';
        }
        if (document.getElementById('org_contacto')) {
            document.getElementById('org_contacto').value = entidad.personaContacto || '';
        }
        if (document.getElementById('org_email')) {
            document.getElementById('org_email').value = entidad.email || '';
        }
        if (document.getElementById('org_tel')) {
            document.getElementById('org_tel').value = entidad.telefono || '';
        }
    }
}

// Función para llenar importes y descuentos
function llenarImportesDescuentos(importes) {
    if (importes && importes.length > 0) {
        const importe = importes[0]; // Tomar el primer importe
        if (document.getElementById('imp_base')) {
            document.getElementById('imp_base').value = importe.importeBase || '';
        }
        if (document.getElementById('imp_tipo')) {
            document.getElementById('imp_tipo').value = importe.tipoImpuesto || '';
        }
        if (document.getElementById('imp_descuento_pct')) {
            document.getElementById('imp_descuento_pct').value = importe.porcentajeDescuento || '';
        }
        if (document.getElementById('imp_codigo')) {
            document.getElementById('imp_codigo').value = importe.codigoPromocional || '';
        }
        if (document.getElementById('imp_condiciones_es')) {
            document.getElementById('imp_condiciones_es').value = importe.condicionesES || '';
        }
        if (document.getElementById('imp_condiciones_ca')) {
            document.getElementById('imp_condiciones_ca').value = importe.condicionesCA || '';
        }
        if (document.getElementById('imp_condiciones_en')) {
            document.getElementById('imp_condiciones_en').value = importe.condicionesEN || '';
        }
    }
}

// Función para llenar participantes
function llenarParticipantes(participantes) {
    console.log('📝 DEBUG: llenarParticipantes - Iniciando llenado de participantes:', participantes);
    
    // Guardar participantes en variable global para acceso en modales
    window.participantesCargados = participantes;
    
    if (participantes && participantes.length > 0) {
        // Buscar el contenedor de participantes existente
        let participantesContainer = document.getElementById('participantesContainer');
        
        if (participantesContainer) {
            // Limpiar el contenedor existente
            participantesContainer.innerHTML = '';
            
            // Reemplazar el botón existente con el nuevo
            const seccionParticipantes = participantesContainer.closest('section');
            if (seccionParticipantes) {
                const headerDiv = seccionParticipantes.querySelector('h2').parentElement;
                if (headerDiv) {
                    // Buscar y reemplazar el botón existente
                    const botonExistente = headerDiv.querySelector('button');
                    if (botonExistente) {
                        botonExistente.outerHTML = `
                            <button class="btn btn-sm btn-success" onclick="agregarParticipante()">
                                <i class="fas fa-plus"></i> Agregar Participante
                            </button>
                        `;
                    }
                }
            }
            
            // Llenar con los participantes
            participantes.forEach((participante, index) => {
                const participanteHTML = `
                    <div class="card mb-3" id="participante-${participante.id}">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <strong>Nombre:</strong> ${participante.nombre || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Email:</strong> ${participante.email || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Rol:</strong> ${participante.rol || 'N/A'}
                                </div>
                                <div class="col-md-3 text-end">
                                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editarParticipante(${participante.id})">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarParticipante(${participante.id})">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                participantesContainer.insertAdjacentHTML('beforeend', participanteHTML);
            });
            
            console.log('✅ DEBUG: llenarParticipantes - Participantes mostrados correctamente');
        } else {
            console.log('⚠️ DEBUG: llenarParticipantes - No se pudo encontrar el contenedor');
        }
    } else {
        console.log('⚠️ DEBUG: llenarParticipantes - No hay participantes para mostrar');
    }
}

// Función para llenar subactividades
function llenarSubactividades(subactividades) {
    console.log('📝 DEBUG: llenarSubactividades - Iniciando llenado de subactividades:', subactividades);
    
    // Guardar subactividades en variable global para acceso en modales
    window.subactividadesCargadas = subactividades;
    
    if (subactividades && subactividades.length > 0) {
        // Buscar el contenedor de subactividades existente
        let subactividadesContainer = document.getElementById('subactividadesContainer');
        
        if (subactividadesContainer) {
            // Limpiar el contenedor existente
            subactividadesContainer.innerHTML = '';
            
            // Reemplazar el botón existente con el nuevo
            const seccionSubactividades = subactividadesContainer.closest('section');
            if (seccionSubactividades) {
                const headerDiv = seccionSubactividades.querySelector('h2').parentElement;
                if (headerDiv) {
                    // Buscar y reemplazar el botón existente
                    const botonExistente = headerDiv.querySelector('button');
                    if (botonExistente) {
                        botonExistente.outerHTML = `
                            <button class="btn btn-sm btn-success" onclick="agregarSubactividad()">
                                <i class="fas fa-plus"></i> Agregar Subactividad
                            </button>
                        `;
                    }
                }
            }
            
            // Llenar con las subactividades
            subactividades.forEach((subactividad, index) => {
                const subactividadHTML = `
                    <div class="card mb-3" id="subactividad-${subactividad.id}">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">${subactividad.titulo || 'Sin título'}</h6>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editarSubactividad(${subactividad.id})">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarSubactividad(${subactividad.id})">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Descripción:</strong> ${subactividad.descripcion || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Modalidad:</strong> ${subactividad.modalidad || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Docente:</strong> ${subactividad.docente || 'N/A'}
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-md-3">
                                    <strong>Fecha Inicio:</strong> ${subactividad.fechaInicio ? new Date(subactividad.fechaInicio).toLocaleDateString() : 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Fecha Fin:</strong> ${subactividad.fechaFin ? new Date(subactividad.fechaFin).toLocaleDateString() : 'N/A'}
                                </div>
                                <div class="col-md-2">
                                    <strong>Hora Inicio:</strong> ${subactividad.horaInicio || 'N/A'}
                                </div>
                                <div class="col-md-2">
                                    <strong>Hora Fin:</strong> ${subactividad.horaFin || 'N/A'}
                                </div>
                                <div class="col-md-2">
                                    <strong>Duración:</strong> ${subactividad.duracion || 'N/A'}h
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-md-4">
                                    <strong>Ubicación:</strong> ${subactividad.ubicacion || 'N/A'}
                                </div>
                                <div class="col-md-4">
                                    <strong>Aforo:</strong> ${subactividad.aforo || 'N/A'}
                                </div>
                                <div class="col-md-4">
                                    <strong>Idioma:</strong> ${subactividad.idioma || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                subactividadesContainer.insertAdjacentHTML('beforeend', subactividadHTML);
            });
            
            console.log('✅ DEBUG: llenarSubactividades - Subactividades mostradas correctamente');
        } else {
            console.log('⚠️ DEBUG: llenarSubactividades - No se pudo encontrar o crear el contenedor');
        }
    } else {
        console.log('⚠️ DEBUG: llenarSubactividades - No hay subactividades para mostrar');
    }
}

// Función para editar participante
function editarParticipante(participanteId) {
    console.log('📝 DEBUG: editarParticipante - Editando participante ID:', participanteId);
    
    // Buscar el participante en los datos cargados
    const participante = window.participantesCargados?.find(p => p.id === participanteId);
    
    if (!participante) {
        alert('No se encontró el participante para editar');
        return;
    }
    
    // Crear modal de edición
    const modalHTML = `
        <div class="modal fade" id="modalEditarParticipante" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Participante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarParticipante">
                            <div class="mb-3">
                                <label for="editNombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="editNombre" value="${participante.nombre || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="editEmail" value="${participante.email || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="editRol" class="form-label">Rol</label>
                                <select class="form-select" id="editRol" required>
                                    <option value="">Seleccione un rol</option>
                                    <option value="Coordinador" ${participante.rol === 'Coordinador' ? 'selected' : ''}>Coordinador</option>
                                    <option value="Docente" ${participante.rol === 'Docente' ? 'selected' : ''}>Docente</option>
                                    <option value="Ponente" ${participante.rol === 'Ponente' ? 'selected' : ''}>Ponente</option>
                                    <option value="Organizador" ${participante.rol === 'Organizador' ? 'selected' : ''}>Organizador</option>
                                    <option value="Participante" ${participante.rol === 'Participante' ? 'selected' : ''}>Participante</option>
                                    <option value="Otro" ${participante.rol === 'Otro' ? 'selected' : ''}>Otro</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarParticipante(${participanteId})">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('modalEditarParticipante');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarParticipante'));
    modal.show();
}

// Función para guardar participante editado
async function guardarParticipante(participanteId) {
    console.log('📝 DEBUG: guardarParticipante - Guardando participante ID:', participanteId);
    
    const nombre = document.getElementById('editNombre').value;
    const email = document.getElementById('editEmail').value;
    const rol = document.getElementById('editRol').value;
    
    if (!nombre || !email || !rol) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/participantes/${participanteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                rol: rol
            })
        });
        
        if (response.ok) {
            alert('Participante actualizado correctamente');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarParticipante'));
            modal.hide();
            
            // Recargar participantes
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al actualizar participante');
        }
    } catch (error) {
        console.error('Error al guardar participante:', error);
        alert('Error al guardar participante');
    }
}

// Función para eliminar participante
async function eliminarParticipante(participanteId) {
    console.log('📝 DEBUG: eliminarParticipante - Eliminando participante ID:', participanteId);
    
    if (!confirm('¿Está seguro de que desea eliminar este participante?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/participantes/${participanteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Participante eliminado correctamente');
            
            // Recargar participantes
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al eliminar participante');
        }
    } catch (error) {
        console.error('Error al eliminar participante:', error);
        alert('Error al eliminar participante');
    }
}

// Función para editar subactividad
function editarSubactividad(subactividadId) {
    console.log('📝 DEBUG: editarSubactividad - Editando subactividad ID:', subactividadId);
    
    // Buscar la subactividad en los datos cargados
    const subactividad = window.subactividadesCargadas?.find(s => s.id === subactividadId);
    
    if (!subactividad) {
        alert('No se encontró la subactividad para editar');
        return;
    }
    
    // Crear modal de edición
    const modalHTML = `
        <div class="modal fade" id="modalEditarSubactividad" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Subactividad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarSubactividad">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editTitulo" class="form-label">Título</label>
                                        <input type="text" class="form-control" id="editTitulo" value="${subactividad.titulo || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editModalidad" class="form-label">Modalidad</label>
                                        <select class="form-select" id="editModalidad" required>
                                            <option value="">Seleccione modalidad</option>
                                            <option value="Presencial" ${subactividad.modalidad === 'Presencial' ? 'selected' : ''}>Presencial</option>
                                            <option value="Virtual" ${subactividad.modalidad === 'Virtual' ? 'selected' : ''}>Virtual</option>
                                            <option value="Híbrida" ${subactividad.modalidad === 'Híbrida' ? 'selected' : ''}>Híbrida</option>
                                            <option value="Semi-presencial" ${subactividad.modalidad === 'Semi-presencial' ? 'selected' : ''}>Semi-presencial</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editDescripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="editDescripcion" rows="3" required>${subactividad.descripcion || ''}</textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editDocente" class="form-label">Docente</label>
                                        <input type="text" class="form-control" id="editDocente" value="${subactividad.docente || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editIdioma" class="form-label">Idioma</label>
                                        <select class="form-select" id="editIdioma" required>
                                            <option value="">Seleccione idioma</option>
                                            <option value="Español" ${subactividad.idioma === 'Español' ? 'selected' : ''}>Español</option>
                                            <option value="Català" ${subactividad.idioma === 'Català' ? 'selected' : ''}>Català</option>
                                            <option value="English" ${subactividad.idioma === 'English' ? 'selected' : ''}>English</option>
                                            <option value="Français" ${subactividad.idioma === 'Français' ? 'selected' : ''}>Français</option>
                                            <option value="Deutsch" ${subactividad.idioma === 'Deutsch' ? 'selected' : ''}>Deutsch</option>
                                            <option value="Italiano" ${subactividad.idioma === 'Italiano' ? 'selected' : ''}>Italiano</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editFechaInicio" class="form-label">Fecha Inicio</label>
                                        <input type="date" class="form-control" id="editFechaInicio" value="${subactividad.fechaInicio ? subactividad.fechaInicio.split('T')[0] : ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editFechaFin" class="form-label">Fecha Fin</label>
                                        <input type="date" class="form-control" id="editFechaFin" value="${subactividad.fechaFin ? subactividad.fechaFin.split('T')[0] : ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editDuracion" class="form-label">Duración (horas)</label>
                                        <input type="number" class="form-control" id="editDuracion" value="${subactividad.duracion || ''}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editHoraInicio" class="form-label">Hora Inicio</label>
                                        <input type="time" class="form-control" id="editHoraInicio" value="${subactividad.horaInicio || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editHoraFin" class="form-label">Hora Fin</label>
                                        <input type="time" class="form-control" id="editHoraFin" value="${subactividad.horaFin || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editAforo" class="form-label">Aforo</label>
                                        <input type="number" class="form-control" id="editAforo" value="${subactividad.aforo || ''}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editUbicacion" class="form-label">Ubicación</label>
                                <input type="text" class="form-control" id="editUbicacion" value="${subactividad.ubicacion || ''}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarSubactividad(${subactividadId})">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('modalEditarSubactividad');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarSubactividad'));
    modal.show();
}

// Función para guardar subactividad editada
async function guardarSubactividad(subactividadId) {
    console.log('📝 DEBUG: guardarSubactividad - Guardando subactividad ID:', subactividadId);
    
    const titulo = document.getElementById('editTitulo').value;
    const descripcion = document.getElementById('editDescripcion').value;
    const modalidad = document.getElementById('editModalidad').value;
    const docente = document.getElementById('editDocente').value;
    const idioma = document.getElementById('editIdioma').value;
    const fechaInicio = document.getElementById('editFechaInicio').value;
    const fechaFin = document.getElementById('editFechaFin').value;
    const duracion = document.getElementById('editDuracion').value;
    const horaInicio = document.getElementById('editHoraInicio').value;
    const horaFin = document.getElementById('editHoraFin').value;
    const aforo = document.getElementById('editAforo').value;
    const ubicacion = document.getElementById('editUbicacion').value;
    
    if (!titulo || !descripcion || !modalidad || !docente || !idioma || !fechaInicio || !fechaFin || !duracion || !horaInicio || !horaFin || !aforo || !ubicacion) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/subactividades/${subactividadId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: titulo,
                descripcion: descripcion,
                modalidad: modalidad,
                docente: docente,
                idioma: idioma,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                duracion: parseInt(duracion),
                horaInicio: horaInicio,
                horaFin: horaFin,
                aforo: parseInt(aforo),
                ubicacion: ubicacion
            })
        });
        
        if (response.ok) {
            alert('Subactividad actualizada correctamente');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarSubactividad'));
            modal.hide();
            
            // Recargar subactividades
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al actualizar subactividad');
        }
    } catch (error) {
        console.error('Error al guardar subactividad:', error);
        alert('Error al guardar subactividad');
    }
}

// Función para eliminar subactividad
async function eliminarSubactividad(subactividadId) {
    console.log('📝 DEBUG: eliminarSubactividad - Eliminando subactividad ID:', subactividadId);
    
    if (!confirm('¿Está seguro de que desea eliminar esta subactividad?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/subactividades/${subactividadId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Subactividad eliminada correctamente');
            
            // Recargar subactividades
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al eliminar subactividad');
        }
    } catch (error) {
        console.error('Error al eliminar subactividad:', error);
        alert('Error al eliminar subactividad');
    }
}

// Función para agregar nuevo participante
function agregarParticipante() {
    console.log('📝 DEBUG: agregarParticipante - Abriendo modal para agregar participante');
    
    // Crear modal de agregar
    const modalHTML = `
        <div class="modal fade" id="modalAgregarParticipante" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar Participante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAgregarParticipante">
                            <div class="mb-3">
                                <label for="nuevoNombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nuevoNombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="nuevoEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoRol" class="form-label">Rol</label>
                                <select class="form-select" id="nuevoRol" required>
                                    <option value="">Seleccione un rol</option>
                                    <option value="Coordinador">Coordinador</option>
                                    <option value="Docente">Docente</option>
                                    <option value="Ponente">Ponente</option>
                                    <option value="Organizador">Organizador</option>
                                    <option value="Participante">Participante</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarNuevoParticipante()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('modalAgregarParticipante');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgregarParticipante'));
    modal.show();
}

// Función para guardar nuevo participante
async function guardarNuevoParticipante() {
    console.log('📝 DEBUG: guardarNuevoParticipante - Guardando nuevo participante');
    
    const nombre = document.getElementById('nuevoNombre').value;
    const email = document.getElementById('nuevoEmail').value;
    const rol = document.getElementById('nuevoRol').value;
    
    if (!nombre || !email || !rol) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    const actividadId = document.getElementById('actividadId').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/participantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                actividadId: parseInt(actividadId),
                nombre: nombre,
                email: email,
                rol: rol
            })
        });
        
        if (response.ok) {
            alert('Participante agregado correctamente');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarParticipante'));
            modal.hide();
            
            // Recargar participantes
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al agregar participante');
        }
    } catch (error) {
        console.error('Error al guardar participante:', error);
        alert('Error al guardar participante');
    }
}

// Función para agregar nueva subactividad
function agregarSubactividad() {
    console.log('📝 DEBUG: agregarSubactividad - Abriendo modal para agregar subactividad');
    
    // Crear modal de agregar
    const modalHTML = `
        <div class="modal fade" id="modalAgregarSubactividad" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar Subactividad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAgregarSubactividad">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoTitulo" class="form-label">Título</label>
                                        <input type="text" class="form-control" id="nuevoTitulo" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoModalidad" class="form-label">Modalidad</label>
                                        <select class="form-select" id="nuevoModalidad" required>
                                            <option value="">Seleccione modalidad</option>
                                            <option value="Presencial">Presencial</option>
                                            <option value="Virtual">Virtual</option>
                                            <option value="Híbrida">Híbrida</option>
                                            <option value="Semi-presencial">Semi-presencial</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoDescripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="nuevoDescripcion" rows="3" required></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoDocente" class="form-label">Docente</label>
                                        <input type="text" class="form-control" id="nuevoDocente" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoIdioma" class="form-label">Idioma</label>
                                        <select class="form-select" id="nuevoIdioma" required>
                                            <option value="">Seleccione idioma</option>
                                            <option value="Español">Español</option>
                                            <option value="Català">Català</option>
                                            <option value="English">English</option>
                                            <option value="Français">Français</option>
                                            <option value="Deutsch">Deutsch</option>
                                            <option value="Italiano">Italiano</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoFechaInicio" class="form-label">Fecha Inicio</label>
                                        <input type="date" class="form-control" id="nuevoFechaInicio" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoFechaFin" class="form-label">Fecha Fin</label>
                                        <input type="date" class="form-control" id="nuevoFechaFin" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoDuracion" class="form-label">Duración (horas)</label>
                                        <input type="number" class="form-control" id="nuevoDuracion" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoHoraInicio" class="form-label">Hora Inicio</label>
                                        <input type="time" class="form-control" id="nuevoHoraInicio" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoHoraFin" class="form-label">Hora Fin</label>
                                        <input type="time" class="form-control" id="nuevoHoraFin" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoAforo" class="form-label">Aforo</label>
                                        <input type="number" class="form-control" id="nuevoAforo" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoUbicacion" class="form-label">Ubicación</label>
                                <input type="text" class="form-control" id="nuevoUbicacion" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarNuevaSubactividad()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('modalAgregarSubactividad');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgregarSubactividad'));
    modal.show();
}

// Función para guardar nueva subactividad
async function guardarNuevaSubactividad() {
    console.log('📝 DEBUG: guardarNuevaSubactividad - Guardando nueva subactividad');
    
    const titulo = document.getElementById('nuevoTitulo').value;
    const descripcion = document.getElementById('nuevoDescripcion').value;
    const modalidad = document.getElementById('nuevoModalidad').value;
    const docente = document.getElementById('nuevoDocente').value;
    const idioma = document.getElementById('nuevoIdioma').value;
    const fechaInicio = document.getElementById('nuevoFechaInicio').value;
    const fechaFin = document.getElementById('nuevoFechaFin').value;
    const duracion = document.getElementById('nuevoDuracion').value;
    const horaInicio = document.getElementById('nuevoHoraInicio').value;
    const horaFin = document.getElementById('nuevoHoraFin').value;
    const aforo = document.getElementById('nuevoAforo').value;
    const ubicacion = document.getElementById('nuevoUbicacion').value;
    
    if (!titulo || !descripcion || !modalidad || !docente || !idioma || !fechaInicio || !fechaFin || !duracion || !horaInicio || !horaFin || !aforo || !ubicacion) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    const actividadId = document.getElementById('actividadId').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/subactividades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                actividadId: parseInt(actividadId),
                titulo: titulo,
                descripcion: descripcion,
                modalidad: modalidad,
                docente: docente,
                idioma: idioma,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                duracion: parseInt(duracion),
                horaInicio: horaInicio,
                horaFin: horaFin,
                aforo: parseInt(aforo),
                ubicacion: ubicacion
            })
        });
        
        if (response.ok) {
            alert('Subactividad agregada correctamente');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarSubactividad'));
            modal.hide();
            
            // Recargar subactividades
            await cargarDatosAdicionalesSinDominios();
        } else {
            alert('Error al agregar subactividad');
        }
    } catch (error) {
        console.error('Error al guardar subactividad:', error);
        alert('Error al guardar subactividad');
    }
}

// Inicializar dominios cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DEBUG: DOMContentLoaded - Inicializando dominios...');
    console.log('🚀 DEBUG: DOMContentLoaded - URL actual:', window.location.href);
    console.log('🚀 DEBUG: DOMContentLoaded - Pathname:', window.location.pathname);
    
    // Verificar si estamos en la página de edición
    const urlParams = new URLSearchParams(window.location.search);
    const actividadId = urlParams.get('id');
    console.log('🚀 DEBUG: DOMContentLoaded - Parámetros de URL:', Object.fromEntries(urlParams));
    console.log('🚀 DEBUG: DOMContentLoaded - ID de actividad:', actividadId);
    
    if (actividadId && window.location.pathname.includes('editar-actividad.html')) {
        console.log('🚀 DEBUG: DOMContentLoaded - Modo edición detectado, ID:', actividadId);
        // Establecer el ID en el campo oculto
        if (document.getElementById('actividadId')) {
            document.getElementById('actividadId').value = actividadId;
            console.log('🚀 DEBUG: DOMContentLoaded - ID establecido en campo oculto:', actividadId);
        } else {
            console.error('❌ DEBUG: DOMContentLoaded - Campo actividadId no encontrado');
        }
        // Cargar los datos de la actividad SIN cargar dominios
        console.log('🚀 DEBUG: DOMContentLoaded - Llamando a cargarActividadParaEdicion...');
        cargarActividadParaEdicionSinDominios(actividadId);
    } else {
        console.log('🚀 DEBUG: DOMContentLoaded - No es modo edición o no hay ID');
        // Solo cargar dominios si NO estamos en modo edición
        setTimeout(() => {
            if (typeof cargarDominios === 'function') {
                cargarDominios();
            } else {
                console.log('⚠️ Función cargarDominios no disponible, esperando...');
                setTimeout(() => {
                    if (typeof cargarDominios === 'function') {
                        cargarDominios();
                    } else {
                        console.error('❌ Función cargarDominios no encontrada');
                    }
                }, 2000);
            }
        }, 1500);
    }
});

// Función para auto-seleccionar la unidad gestora del usuario logueado
async function autoSeleccionarUnidadGestion() {
    console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Iniciando auto-selección...');
    
    try {
        // Obtener información del usuario desde sessionStorage
        const userInfo = JSON.parse(sessionStorage.getItem('ub_user') || '{}');
        console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - User info:', userInfo);
        
        // Verificar si el usuario es Admin
        const userRole = userInfo.rol || userInfo.Rol;
        const isAdmin = userRole === 'Admin';
        console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Rol del usuario:', userRole, 'Es Admin:', isAdmin);
        
        // Buscar UnidadGestionId en camelCase o PascalCase
        const unidadGestionId = userInfo.unidadGestionId || userInfo.UnidadGestionId;
        
        if (!unidadGestionId) {
            console.log('⚠️ DEBUG: autoSeleccionarUnidadGestion - No se encontró unidadGestionId en userInfo');
            return;
        }
        
        // Mapear ID del usuario a código y al valor del select
        const ugMap = { 
            1: { codigo: 'IDP', selectValue: '35' }, 
            2: { codigo: 'CRAI', selectValue: '36' }, 
            3: { codigo: 'SAE', selectValue: '37' } 
        };
        const ugInfo = ugMap[unidadGestionId];
        
        if (!ugInfo) {
            console.log('⚠️ DEBUG: autoSeleccionarUnidadGestion - Código UG no encontrado para ID:', unidadGestionId);
            return;
        }
        
        const ugCodigo = ugInfo.codigo;
        const selectValue = ugInfo.selectValue;
        
        console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Código UG:', ugCodigo);
        console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - ID del usuario:', unidadGestionId);
        console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Valor del select:', selectValue);
        
        // Esperar a que se cargue el select
        let intentos = 0;
        const maxIntentos = 20;
        
        while (intentos < maxIntentos) {
            const select = document.getElementById('actividadUnidadGestion');
            if (select && select.options.length > 1) {
                console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Select encontrado, opciones:', select.options.length);
                console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Buscando opción con selectValue:', selectValue, 'ugCodigo:', ugCodigo);
                
                // Mostrar todas las opciones disponibles para debug
                for (let i = 0; i < select.options.length; i++) {
                    const option = select.options[i];
                    console.log(`🎯 DEBUG: autoSeleccionarUnidadGestion - Opción ${i}: value="${option.value}", text="${option.text}"`);
                }
                
                // Buscar y seleccionar la opción por valor del select o por código
                for (let option of select.options) {
                    if (option.value === selectValue || 
                        option.value === unidadGestionId.toString() || 
                        option.value === ugCodigo || 
                        option.text === ugCodigo ||
                        option.text.includes(ugCodigo)) {
                        
                        // Seleccionar la opción
                        select.value = option.value;
                        
                        // Solo deshabilitar si NO es Admin
                        if (!isAdmin) {
                            select.disabled = true;
                            select.style.backgroundColor = '#f8f9fa';
                            select.style.cursor = 'not-allowed';
                            
                            // Añadir texto explicativo
                            const label = document.querySelector('label[for="actividadUnidadGestion"]');
                            if (label && !label.querySelector('.text-muted')) {
                                const explicacion = document.createElement('small');
                                explicacion.className = 'text-muted ms-2';
                                explicacion.textContent = '(Auto-asignado según tu unidad)';
                                label.appendChild(explicacion);
                            }
                            
                            console.log('✅ DEBUG: autoSeleccionarUnidadGestion - Unidad gestora seleccionada y bloqueada para usuario no-Admin:', ugCodigo);
                        } else {
                            console.log('✅ DEBUG: autoSeleccionarUnidadGestion - Unidad gestora preseleccionada para Admin (editable):', ugCodigo);
                        }
                        
                        console.log('✅ DEBUG: autoSeleccionarUnidadGestion - Valor seleccionado:', select.value);
                        return;
                    }
                }
                
                console.log('⚠️ DEBUG: autoSeleccionarUnidadGestion - Opción no encontrada en el select');
                break;
            }
            
            console.log(`🎯 DEBUG: autoSeleccionarUnidadGestion - Esperando select... intento ${intentos + 1}/${maxIntentos}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            intentos++;
        }
        
        console.log('❌ DEBUG: autoSeleccionarUnidadGestion - No se pudo encontrar o cargar el select');
        
    } catch (error) {
        console.error('❌ DEBUG: autoSeleccionarUnidadGestion - Error:', error);
    }
}

// Función para auto-rellenar el campo Persona solicitante con el nombre del usuario
async function autoRellenarPersonaSolicitante() {
    console.log('👤 DEBUG: autoRellenarPersonaSolicitante - Iniciando auto-relleno...');
    
    try {
        // Obtener información del usuario desde sessionStorage
        const userInfo = JSON.parse(sessionStorage.getItem('ub_user') || '{}');
        console.log('👤 DEBUG: autoRellenarPersonaSolicitante - User info:', userInfo);
        
        // Construir el nombre completo del usuario
        let nombreCompleto = '';
        
        // Intentar obtener los campos de nombre y apellidos
        const nombre = userInfo.nombre || userInfo.Nombre || '';
        const apellido1 = userInfo.apellido1 || userInfo.Apellido1 || '';
        const apellido2 = userInfo.apellido2 || userInfo.Apellido2 || '';
        
        // Si tenemos los campos individuales, construir el nombre completo
        if (nombre || apellido1 || apellido2) {
            const partes = [nombre, apellido1, apellido2].filter(parte => parte && parte.trim());
            nombreCompleto = partes.join(' ');
            console.log('👤 DEBUG: autoRellenarPersonaSolicitante - Nombre construido desde campos individuales:', nombreCompleto);
        } else {
            // Fallback: usar el username si no hay campos de nombre
            nombreCompleto = userInfo.username || userInfo.Username || '';
            console.log('👤 DEBUG: autoRellenarPersonaSolicitante - Usando username como fallback:', nombreCompleto);
        }
        
        if (!nombreCompleto) {
            console.log('⚠️ DEBUG: autoRellenarPersonaSolicitante - No se encontró información del usuario para rellenar');
            return;
        }
        
        // Buscar el campo Persona solicitante
        let intentos = 0;
        const maxIntentos = 20;
        
        while (intentos < maxIntentos) {
            const campoPersonaSolicitante = document.getElementById('personaSolicitante');
            if (campoPersonaSolicitante) {
                console.log('👤 DEBUG: autoRellenarPersonaSolicitante - Campo encontrado, rellenando con:', nombreCompleto);
                
                // Solo rellenar si el campo está vacío
                if (!campoPersonaSolicitante.value || campoPersonaSolicitante.value.trim() === '') {
                    campoPersonaSolicitante.value = nombreCompleto;
                    console.log('✅ DEBUG: autoRellenarPersonaSolicitante - Campo rellenado correctamente');
                } else {
                    console.log('ℹ️ DEBUG: autoRellenarPersonaSolicitante - Campo ya tiene valor, no se modifica');
                }
                return;
            }
            
            console.log(`👤 DEBUG: autoRellenarPersonaSolicitante - Esperando campo... intento ${intentos + 1}/${maxIntentos}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            intentos++;
        }
        
        console.log('❌ DEBUG: autoRellenarPersonaSolicitante - No se pudo encontrar el campo personaSolicitante');
        
    } catch (error) {
        console.error('❌ DEBUG: autoRellenarPersonaSolicitante - Error:', error);
    }
}

// Función para cargar idiomas en un select específico (para CrearActividad)
async function cargarIdiomasEnSelectCrear(selectId) {
    try {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const response = await fetch(`${API_BASE_URL}/api/dominios/IdiomaImparticion/valores`);
        if (response.ok) {
            const idiomas = await response.json();
            
            // Limpiar opciones existentes (excepto "Seleccionar...")
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
            
            // Agregar opciones de idiomas
            idiomas.forEach(idioma => {
                const option = document.createElement('option');
                option.value = idioma.id || idioma.Id || idioma.valor || idioma.Valor || idioma.value || idioma.Value;
                option.textContent = idioma.descripcion || idioma.Descripcion || idioma.valor || idioma.Valor || idioma.value || idioma.Value;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando idiomas en select:', error);
    }
}
