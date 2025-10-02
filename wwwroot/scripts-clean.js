// UB Actividad 1 - Scripts de Integración Frontend-Backend
// Versión: scripts.js?v=1.0.21
// Configuración de la API
// Usar same-origin para app integrada (y compatible con proxy del WebServer)
const API_BASE_URL = '';

// Utilidades de rendimiento (medición sencilla)
(function(){
    if (!window.__perf) {
        window.__perf = { marks: {}, measures: [] };
    }
    try { window.__perf.scriptStart = performance.now(); } catch {}
    window.perfStart = function(name){ try { window.__perf.marks[name] = performance.now(); } catch {} };
    window.perfEnd = function(name){ try { const t0 = window.__perf.marks[name]; if (t0!=null){ const dt = performance.now()-t0; window.__perf.measures.push({ name, ms: Math.round(dt) }); delete window.__perf.marks[name]; } } catch {} };
    window.dumpPerf = function(){
        try {
            const list = (window.__perf.measures||[]).slice().sort((a,b)=>b.ms-a.ms);
            let total = 0; list.forEach(m=> total+=m.ms);
            console.error(`⏱️ PERF total: ${total} ms, items: ${list.length}`);
            list.forEach(m => {
                const tag = m.ms >= 200 ? 'SLOW' : 'OK';
                console.error(` - [${tag}] ${m.name}: ${m.ms} ms`);
            });
            return list;
        } catch { return []; }
    };

    // Long Task observer (para detectar bloqueos del hilo >50ms)
    try {
        if ('PerformanceObserver' in window) {
            const po = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const ms = Math.round(entry.duration);
                    // Registrar solo bloqueos relevantes
                    if (ms >= 100) {
                        console.error(`⛔ LONGTASK ${ms} ms @ ${Math.round(entry.startTime)}ms`);
                    }
                }
            });
            // Tipo de entrada 'longtask' (Chrome/Edge)
            try { po.observe({ type: 'longtask', buffered: true }); } catch {}
        }
    } catch {}

    // Medición al abrir selects (click/focus inicial)
    try {
        document.addEventListener('mousedown', (e) => {
            const el = e.target;
            if (el && el.tagName === 'SELECT') {
                const key = `ui:select-open:${el.id||'(sin-id)'}`;
                perfStart(key);
                setTimeout(() => perfEnd(key), 0);
                // Tiempos relativos
                try {
                    const t = performance.now();
                    const done = window.__dominiosDoneTs||t;
                    console.error(`⏱️ UI select '${el.id}': t=${Math.round(t)}ms, since dominios=${Math.round(t-done)}ms`);
                } catch {}
            }
        }, true);
        document.addEventListener('DOMContentLoaded', () => {
            try {
                const t = performance.now();
                console.error(`⏱️ page:dom-ready @ ${Math.round(t)}ms`);
            } catch {}
        });
        window.addEventListener('load', () => {
            try {
                const t = performance.now();
                console.error(`⏱️ page:load @ ${Math.round(t)}ms (desde scriptStart ${Math.round(t-(window.__perf.scriptStart||0))}ms)`);
            } catch {}
        });
    } catch {}
})();

// Wrappers de inicialización para medir tiempos de funciones globales
(function(){
    const tryWrap = (name) => {
        try {
            const g = window;
            const orig = g[name];
            if (typeof orig === 'function' && !orig.__wrapped) {
                g[name] = async function wrappedInit(){
                    const k = `init:${name}`;
                    perfStart(k);
                    const t0 = performance.now();
                    try { return await orig.apply(this, arguments); }
                    finally {
                        perfEnd(k);
                        const t1 = performance.now();
                        console.error(`⏱️ ${name}:done @ ${Math.round(t1)}ms (dur=${Math.round(t1-t0)}ms, since dominios=${Math.round(t1-(window.__dominiosDoneTs||t0))}ms)`);
                    }
                };
                g[name].__wrapped = true;
            }
        } catch {}
    };
    const poll = () => {
        tryWrap('initEditarActividad');
        tryWrap('initializeUGSpecificFields');
        tryWrap('preselectUserUG');
    };
    try {
        poll();
        const id = setInterval(() => {
            poll();
            if (window.initEditarActividad && window.initializeUGSpecificFields) {
                clearInterval(id);
            }
        }, 200);
    } catch {}
})();

// Observador ligero de cambios en opciones de selects (para detectar cuándo quedan listos)
(function(){
    try {
        const lastLens = new Map();
        const logChange = (sel) => {
            const len = sel.options ? sel.options.length : 0;
            const prev = lastLens.get(sel) || -1;
            if (len !== prev) {
                lastLens.set(sel, len);
                const t = performance.now();
                const done = window.__dominiosDoneTs||t;
                console.error(`⏱️ select:options '${sel.id||'(sin-id)'}' = ${len} @ ${Math.round(t)}ms (since dominios ${Math.round(t-done)}ms)`);
            }
        };
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.target && m.target.tagName === 'SELECT' && (m.addedNodes.length>0 || m.removedNodes.length>0)) {
                    logChange(m.target);
                }
                // Cambios dentro del select (options añadidas)
                if (m.type === 'childList' && m.target && m.target.tagName === 'SELECT') {
                    logChange(m.target);
                }
                // También detectar cambios en children de un select si target es OPTION
                if (m.type === 'childList' && m.target && m.target.parentElement && m.target.parentElement.tagName === 'SELECT') {
                    logChange(m.target.parentElement);
                }
            }
        });
        observer.observe(document.documentElement, { subtree: true, childList: true });
        // Primer muestreo de selects existentes
        Array.from(document.getElementsByTagName('select')).forEach(logChange);
    } catch {}
})();

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
            
            // Log especial para PUT requests (actualizaciones)
            if (options.method === 'PUT') {
                console.log('🔥 ===== JSON PARA ANALIZAR ERROR 500 =====');
                console.log('📋 COPIA ESTE JSON COMPLETO:');
                console.log(options.body);
                console.log('🔥 ========================================');
            }
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
        const CACHE_KEY = `dominio_cache_${nombreDominio}`;
        const CACHE_TS_KEY = `dominio_cache_${nombreDominio}_ts`;
        const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
        try {
            perfStart(`dominio:${nombreDominio}`);
            // 1) Intentar leer de caché válida
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
                if (raw && ts && (Date.now() - ts) < TTL_MS) {
                    const cached = JSON.parse(raw);
                    if (Array.isArray(cached)) {
                        perfEnd(`dominio:${nombreDominio}`);
                        console.log(`💾 DEBUG: getValoresDominio - Usando caché para ${nombreDominio} con ${cached.length} valores (edad ${(Date.now()-ts)/1000}s)`);
                        return cached;
                    }
                }
            } catch (e) {
                console.warn(`⚠️ DEBUG: getValoresDominio - Error leyendo caché de ${nombreDominio}:`, e);
            }

            // 2) Fallback a petición de red
            const response = await this.makeRequest(`/api/dominios/${nombreDominio}/valores`);
            console.log(`✅ DEBUG: getValoresDominio - Respuesta para ${nombreDominio}:`, response);
            let valores = [];
            if (response && response.valores) {
                valores = response.valores;
            } else if (Array.isArray(response)) {
                valores = response;
            } else {
                console.warn(`⚠️ DEBUG: getValoresDominio - Estructura inesperada`, response);
            }

            // 3) Guardar en caché si hay datos
            try {
                if (Array.isArray(valores) && valores.length >= 0) {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(valores));
                    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
                    console.log(`💾 DEBUG: getValoresDominio - Caché actualizada para ${nombreDominio} (${valores.length} valores)`);
                }
            } catch (e) {
                console.warn(`⚠️ DEBUG: getValoresDominio - No se pudo escribir caché para ${nombreDominio}:`, e);
            }
            perfEnd(`dominio:${nombreDominio}`);
            return valores;
        } catch (error) {
            console.error(`❌ DEBUG: getValoresDominio - Error para ${nombreDominio}:`, error);
            // Si hay error de red, intentar devolver caché aunque esté expirada
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                if (raw) {
                    console.log(`💾 DEBUG: getValoresDominio - Devolviendo caché (expirada) para ${nombreDominio}`);
                    return JSON.parse(raw);
                }
            } catch {}
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
        // Si el select ya tiene un valor bloqueado y opciones cargadas, no repoblar
        if (selectElement?.dataset?.lockedValue && selectElement.options.length > 1) {
            console.log(`⏭️ DEBUG: loadValoresDominio - Omitido ${nombreDominio} por lockedValue en #${selectElement.id}`);
            return;
        }
        // Preservar selección actual
        const valorSeleccionadoPrevio = selectElement.value;
        
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
                    option.value = valor.id || valor.Id;
                    option.textContent = valor.descripcion || valor.Descripcion || valor.valor || valor.Valor || valor.value || valor.Value;
                    
                    selectElement.appendChild(option);
                    opcionesAgregadas++;
                });
        // Restaurar selección previa si existe entre las nuevas opciones
        if (valorSeleccionadoPrevio && valorSeleccionadoPrevio !== '') {
            const exists = Array.from(selectElement.options).some(o => o.value == valorSeleccionadoPrevio);
            if (exists) {
                selectElement.value = valorSeleccionadoPrevio;
                console.log(`🔁 DEBUG: loadValoresDominio - Selección preservada para ${nombreDominio}:`, valorSeleccionadoPrevio);
            }
        }
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
            
            // Preservar selección previa y lock
            const lockedValue = selectElement.dataset.lockedValue;
            const valorSeleccionadoPrevio = selectElement.value;

            // Si ya está bloqueado y tiene opciones, no repoblar
            if (lockedValue && selectElement.options.length > 1) {
                console.log(`⏭️ DEBUG: loadValoresDominioRobust - Omitido ${nombreDominio} por lockedValue en #${selectElement.id}`);
                return true;
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
                
                // Usar siempre ID para todos los campos de dominio
                option.value = valor.id || valor.Id;
                option.textContent = valor.descripcion || valor.Descripcion || valor.valor || valor.Valor || valor.value || valor.Value;
                
                selectElement.appendChild(option);
                opcionesAgregadas++;
            });
            // Restaurar selección previa (prioridad a lockedValue)
            const restoreValue = lockedValue || valorSeleccionadoPrevio;
            if (restoreValue && restoreValue !== '') {
                const exists = Array.from(selectElement.options).some(o => o.value == restoreValue);
                if (exists) {
                    selectElement.value = restoreValue;
                    console.log(`🔁 DEBUG: loadValoresDominioRobust - Selección preservada para ${nombreDominio}:`, restoreValue);
                }
            }

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
        try {
            const now = performance.now();
            if (window.__dominiosStartTs && (now - window.__dominiosStartTs) > 1000) {
                console.warn(`⏭️ DEBUG: cargarDominios - Reentrada tardía ignorada (since first ${Math.round(now - window.__dominiosStartTs)}ms)`);
                return;
            }
        } catch {}
        if (window.__cargarDominiosInFlight) {
            console.log('⏭️ DEBUG: cargarDominios - Llamada ignorada (ya en curso)');
            return;
        }
        if (window.__dominiosCargados) {
            console.log('⏭️ DEBUG: cargarDominios - Llamada ignorada (ya cargados)');
            return;
        }
        window.__cargarDominiosInFlight = true;
        try { window.__dominiosStartTs = performance.now(); } catch {}

        const dominiosACargar = [
            { elementId: 'tipoActividad', dominio: 'TIPOS_ACTIVIDAD' },
            { elementId: 'lineaEstrategica', dominio: 'LINEAS_ESTRATEGICAS' },
            { elementId: 'objetivoEstrategico', dominio: 'OBJETIVOS_ESTRATEGICOS' },
            { elementId: 'actividadReservada', dominio: 'ACTIVIDADES_RESERVADAS' },
            { elementId: 'modalidadGestion', dominio: 'MODALIDADES_GESTION' },
            { elementId: 'inscripcionModalidad', dominio: 'MODALIDAD_IMPARTICION' },
            { elementId: 'centroUnidadUBDestinataria', dominio: 'CENTROS_UB' },
            { elementId: 'imp_tipo', dominio: 'TIPOS_IMPUESTO' },
            { elementId: 'centroTrabajoRequerido', dominio: 'OPCIONES_SI_NO' },
            { elementId: 'tipusEstudiSAE', dominio: 'TIPUS_ESTUDI_SAE' },
            { elementId: 'categoriaSAE', dominio: 'CATEGORIAS_SAE' },
            { elementId: 'competenciesSAE', dominio: 'COMPETENCIAS_SAE' },
            { elementId: 'jefeUnidadGestora', dominio: 'JEFES_UNIDAD_GESTORA' },
            { elementId: 'unidadGestoraDetalle', dominio: 'SUBUNIDAD_GESTORA' },
            { elementId: 'gestorActividad', dominio: 'GESTORES_ACTIVIDAD' },
            { elementId: 'facultadDestinataria', dominio: 'FACULTADES_DESTINATARIAS' },
            { elementId: 'departamentoDestinatario', dominio: 'DEPARTAMENTOS_DESTINATARIOS' },
            { elementId: 'coordinadorCentreUnitat', dominio: 'COORDINADORES_CENTRE_UNITAT_IDP' },
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

        // Filtrar solo los selects presentes para evitar esperas con retries
        const itemsPresentes = dominiosACargar.filter(item => {
            const el = document.getElementById(item.elementId);
            if (!el) { elementosNoEncontrados.push(item.elementId); return false; }
            elementosEncontrados++; return true;
        });

        perfStart('dominios:paralelo');

        // Cargar todos los dominios presentes en paralelo
        const t0 = performance.now();
        await Promise.allSettled(itemsPresentes.map(item =>
            (async () => {
                const k = `dom:fill:${item.elementId}`;
                perfStart(k);
                await loadValoresDominio(item.elementId, item.dominio);
                perfEnd(k);
                dominiosCargados++;
            })()
        ));
        window.__dominiosDoneTs = performance.now();
        // Marcar dominios como cargados ANTES de cargas auxiliares para evitar reentradas
        window.__dominiosCargados = true;
        console.error(`⏱️ dominios:done @ ${Math.round(window.__dominiosDoneTs)}ms (dur=${Math.round(window.__dominiosDoneTs-t0)}ms)`);

        perfEnd('dominios:paralelo');
        console.log(`✅ DEBUG: cargarDominios - Completado. ${dominiosCargados} dominios cargados, ${elementosNoEncontrados.length} elementos no encontrados`);
        dumpPerf();
        if (elementosNoEncontrados.length > 0) {
            console.warn(`⚠️ DEBUG: cargarDominios - Elementos no encontrados:`, elementosNoEncontrados);
        }

        // Ejecutar cargas auxiliares inmediatamente (con guardas internas de "once")
        try { cargarUnidadesGestion(); } catch {}
        try { autoSeleccionarUnidadGestion(); } catch {}
        try { autoRellenarPersonaSolicitante(); } catch {}
        try { cargarRolesParticipantes(); } catch {}
        try { cargarModalidadesSubactividades(); } catch {}

    } catch (error) {
        console.error('❌ DEBUG: cargarDominios - Error:', error);
    } finally {
        window.__cargarDominiosInFlight = false;
    }
}

// Función para cargar roles de participantes desde el dominio TIPOS_PARTICIPANTE_ROL
async function cargarRolesParticipantes() {
    try {
        if (window.__rolesLoaded) { console.log('⏭️ DEBUG: cargarRolesParticipantes - ya cargado (skip)'); return; }
        if (window.__rolesStarted) { console.log('⏭️ DEBUG: cargarRolesParticipantes - ya iniciado (skip)'); return; }
        window.__rolesStarted = true;
        try { const now=performance.now(); if (window.__dominiosDoneTs && (now-window.__dominiosDoneTs)>1000){ console.warn('🧵 TRACE cargarRolesParticipantes tardío'); console.trace(); } } catch {}
        console.log('🚀 DEBUG: cargarRolesParticipantes - Iniciando carga de roles...');
        
        // Obtener valores cacheados del dominio TIPOS_PARTICIPANTE_ROL
        const resp = await getValoresDominio('TIPOS_PARTICIPANTE_ROL');
        const roles = resp?.valores || resp || [];
        console.log('📊 DEBUG: cargarRolesParticipantes - Roles obtenidos:', roles);
        
        // Función para poblar un select con roles
        function poblarSelectRoles(selectElement) {
            if (!selectElement) return;
            
            // Limpiar opciones existentes
            selectElement.innerHTML = '';
            
            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccionar...';
            selectElement.appendChild(defaultOption);
            
            // Agregar roles del dominio
            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id || rol.Id;
                option.textContent = rol.descripcion || rol.Descripcion;
                selectElement.appendChild(option);
            });
        }
        
        // Aplicar a todos los selects de rol de participantes existentes
        const selectsRol = document.querySelectorAll('select[id*="_rol"]');
        console.log(`🔍 DEBUG: cargarRolesParticipantes - Encontrados ${selectsRol.length} selects de rol`);
        
        selectsRol.forEach(select => { poblarSelectRoles(select); });
        
        console.log('✅ DEBUG: cargarRolesParticipantes - Completado');
        window.__rolesLoaded = true;
        window.__rolesStarted = false;
        
    } catch (error) {
        console.error('❌ DEBUG: cargarRolesParticipantes - Error:', error);
    }
}

// Función para cargar modalidades de subactividades desde el dominio MODALIDAD_IMPARTICION
async function cargarModalidadesSubactividades() {
    try {
        if (window.__modalidadesLoaded) { console.log('⏭️ DEBUG: cargarModalidadesSubactividades - ya cargado (skip)'); return; }
        if (window.__modalidadesStarted) { console.log('⏭️ DEBUG: cargarModalidadesSubactividades - ya iniciado (skip)'); return; }
        window.__modalidadesStarted = true;
        try { const now=performance.now(); if (window.__dominiosDoneTs && (now-window.__dominiosDoneTs)>1000){ console.warn('🧵 TRACE cargarModalidadesSubactividades tardío'); console.trace(); } } catch {}
        console.log('🚀 DEBUG: cargarModalidadesSubactividades - Iniciando carga de modalidades...');
        
        // Obtener valores cacheados del dominio MODALIDAD_IMPARTICION
        const resp = await getValoresDominio('MODALIDAD_IMPARTICION');
        const modalidades = resp?.valores || resp || [];
        console.log('📊 DEBUG: cargarModalidadesSubactividades - Modalidades obtenidas:', modalidades);
        
        // Función para poblar un select con modalidades
        function poblarSelectModalidades(selectElement) {
            if (!selectElement) return;
            
            // Limpiar opciones existentes
            selectElement.innerHTML = '';
            
            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccionar...';
            selectElement.appendChild(defaultOption);
            
            // Agregar modalidades del dominio
            modalidades.forEach(modalidad => {
                const option = document.createElement('option');
                option.value = modalidad.id || modalidad.Id;
                option.textContent = modalidad.descripcion || modalidad.Descripcion;
                selectElement.appendChild(option);
            });
        }
        
        // Aplicar a todos los selects de modalidad de subactividades existentes
        const selectsModalidad = document.querySelectorAll('select[id*="_modalidad"]');
        console.log(`🔍 DEBUG: cargarModalidadesSubactividades - Encontrados ${selectsModalidad.length} selects de modalidad`);
        
        selectsModalidad.forEach(select => {
            poblarSelectModalidades(select);
        });
        
        console.log('✅ DEBUG: cargarModalidadesSubactividades - Completado');
        window.__modalidadesLoaded = true;
        window.__modalidadesStarted = false;
        
    } catch (error) {
        console.error('❌ DEBUG: cargarModalidadesSubactividades - Error:', error);
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
        
        // Para actividadUnidadGestion, usar directamente el valor ya que viene de la tabla UnidadesGestion (1, 2, 3)
        let unidadGestionId = null;
        if (ugRaw && !isNaN(parseInt(ugRaw))) {
            unidadGestionId = parseInt(ugRaw);
            console.log('🔍 DEBUG: guardarActividad - UnidadGestionId directo:', ugRaw, '->', unidadGestionId);
        }
        
        // Función auxiliar para limpiar valores vacíos
        const limpiarValor = (valor) => {
            if (valor === null || valor === undefined || valor === '') return undefined;
            return valor;
        };
        
        const formData = {
            // Básicos - solo campos con valores
            Titulo: limpiarCaracteresEspeciales(document.getElementById('actividadTitulo')?.value) || '',
            Descripcion: limpiarValor(limpiarCaracteresEspeciales(document.getElementById('descripcion')?.value)),
            Codigo: limpiarValor(document.getElementById('actividadCodigo')?.value),
            AnioAcademico: limpiarValor(document.getElementById('actividadAnioAcademico')?.value),
            UnidadGestionId: unidadGestionId,

            // Información general
            TipoActividad: limpiarValor(limpiarCaracteresEspeciales(document.getElementById('tipoActividad')?.value)),
            LineaEstrategica: limpiarValor(document.getElementById('lineaEstrategica')?.value),
            ObjetivoEstrategico: limpiarValor(document.getElementById('objetivoEstrategico')?.value),
            CodigoRelacionado: limpiarValor(document.getElementById('codigoRelacionado')?.value),
            ActividadReservada: (() => {
                const valor = document.getElementById('actividadReservada')?.value;
                console.log('🔍 DEBUG: ActividadReservada - valor raw:', valor);
                const resultado = valor ? parseInt(valor) : undefined;
                console.log('🔍 DEBUG: ActividadReservada - valor final:', resultado);
                return resultado;
            })(),
            ActividadPago: (function(){
                const checked = document.getElementById('actividadPago')?.checked || false;
                return isUpdate ? (checked ? "S" : "N") : checked;
            })(),
            FechaActividad: document.getElementById('fechaActividad')?.value ? new Date(document.getElementById('fechaActividad').value).toISOString() : undefined,
            MotivoCierre: limpiarValor(document.getElementById('motivoCierre')?.value),
            PersonaSolicitante: limpiarValor(document.getElementById('personaSolicitante')?.value),
            Coordinador: limpiarValor(document.getElementById('coordinador')?.value),
            JefeUnidadGestora: limpiarValor(document.getElementById('jefeUnidadGestora')?.value),
            UnidadGestoraDetalle: limpiarValor(document.getElementById('unidadGestoraDetalle')?.value),
            GestorActividad: limpiarValor(document.getElementById('gestorActividad')?.value),
            FacultadDestinataria: limpiarValor(document.getElementById('facultadDestinataria')?.value),
            DepartamentoDestinatario: limpiarValor(document.getElementById('departamentoDestinatario')?.value),
            CentroUnidadUBDestinataria: limpiarValor(document.getElementById('centroUnidadUBDestinataria')?.value),
            OtrosCentrosInstituciones: limpiarValor(document.getElementById('otrosCentrosInstituciones')?.value),
            PlazasTotales: (() => {
                const valor = document.getElementById('plazasTotales')?.value;
                return valor ? parseInt(valor) : undefined;
            })(),
            HorasTotales: (() => {
                const valor = document.getElementById('horasTotales')?.value;
                return valor ? parseFloat(valor) : undefined;
            })(),
            CentroTrabajoRequerido: limpiarValor(document.getElementById('centroTrabajoRequerido')?.value),
            ModalidadGestion: limpiarValor(document.getElementById('modalidadGestion')?.value),
            FechaInicioImparticion: document.getElementById('fechaInicioImparticion')?.value ? new Date(document.getElementById('fechaInicioImparticion').value).toISOString() : undefined,
            FechaFinImparticion: document.getElementById('fechaFinImparticion')?.value ? new Date(document.getElementById('fechaFinImparticion').value).toISOString() : undefined,
            CondicionesEconomicas: limpiarValor(document.getElementById('condicionesEconomicas')?.value),

            // Campos UG específicos
            CoordinadorCentreUnitat: limpiarValor(limpiarCaracteresEspeciales(document.getElementById('coordinadorCentreUnitat')?.value)),
            CentreTreballeAlumne: limpiarValor(limpiarCaracteresEspeciales(document.getElementById('centreTreballeAlumne')?.value)),
            CreditosTotalesCRAI: (() => {
                const valor = document.getElementById('creditosTotalesCRAI')?.value;
                return valor ? parseFloat(valor) : undefined;
            })(),
            CreditosTotalesSAE: (() => {
                const valor = document.getElementById('creditosTotalesSAE')?.value;
                return valor ? parseFloat(valor) : undefined;
            })(),
            CreditosMinimosSAE: (() => {
                const valor = document.getElementById('creditosMinimosSAE')?.value;
                return valor ? parseFloat(valor) : undefined;
            })(),
            CreditosMaximosSAE: (() => {
                const valor = document.getElementById('creditosMaximosSAE')?.value;
                return valor ? parseFloat(valor) : undefined;
            })(),
            TipusEstudiSAE: limpiarValor(document.getElementById('tipusEstudiSAE')?.value),
            CategoriaSAE: limpiarValor(document.getElementById('categoriaSAE')?.value),
            CompetenciesSAE: limpiarValor(limpiarCaracteresEspeciales(document.getElementById('competenciesSAE')?.value)),

            // Inscripción
            InscripcionInicio: document.getElementById('insc_inicio')?.value ? new Date(document.getElementById('insc_inicio').value).toISOString() : null,
            InscripcionFin: document.getElementById('insc_fin')?.value ? new Date(document.getElementById('insc_fin').value).toISOString() : null,
            InscripcionPlazas: parseInt(document.getElementById('insc_plazas')?.value) || null,
            InscripcionListaEspera: (function(){
                const checked = document.getElementById('insc_lista_espera')?.checked || false;
                return isUpdate ? (checked ? "S" : "N") : checked;
            })(),
            InscripcionModalidad: limpiarCaracteresEspeciales(document.getElementById('inscripcionModalidad')?.value) || '',
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

        // Limpiar valores vacíos del objeto antes de enviar
        const limpiarObjeto = (obj) => {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value !== null && value !== undefined && value !== '') {
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            cleaned[key] = value;
                        }
                    } else {
                        cleaned[key] = value;
                    }
                }
            }
            return cleaned;
        };
        
        const formDataLimpio = limpiarObjeto(formData);
        
        console.log('🚀 DEBUG: guardarActividad - Datos recopilados:', formData);
        console.log('🧹 DEBUG: guardarActividad - Datos limpios:', formDataLimpio);
        console.log('🔍 DEBUG: guardarActividad - UnidadGestionId específico:', formData.UnidadGestionId);
        
        // ===== JSON PARA COPIAR Y ANALIZAR =====
        console.log('📋 JSON ENVIADO A LA API (COPIA ESTO):');
        console.log('=' * 60);
        console.log(JSON.stringify(formDataLimpio, null, 2));
        console.log('=' * 60);

        // Determinar si es crear o actualizar
        const actividadId = document.getElementById('actividadId')?.value;
        
        let resultado;
        if (actividadId) {
            console.log('🚀 DEBUG: guardarActividad - Actualizando actividad con ID:', actividadId);
            resultado = await api.updateActividad(actividadId, formDataLimpio);
            mostrarMensajeExito('¡Actividad actualizada correctamente!');
        } else {
            console.log('🚀 DEBUG: guardarActividad - Creando nueva actividad');
            resultado = await api.createActividad(formDataLimpio);
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
    if (window.__initializePageRan) { console.log('⏭️ DEBUG: initializePage - ya ejecutado (skip)'); return; }
    window.__initializePageRan = true;
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

// Obtener valores de un dominio específico (DELEGADO a API con caché)
async function getValoresDominio(nombreDominio) {
    console.log('🚀 DEBUG: getValoresDominio (global) - Dominio:', nombreDominio);
    try {
        const valores = await api.getValoresDominio(nombreDominio);
        console.log('✅ DEBUG: getValoresDominio (global) - Devolviendo array con', Array.isArray(valores) ? valores.length : 0, 'valores');
        return valores; // Puede ser consumido como array o response.valores||response
    } catch (error) {
        console.error('❌ DEBUG: getValoresDominio (global) - Error:', error);
        throw error;
    }
}

// Cargar unidades de gestión directamente desde la tabla UnidadesGestion
async function cargarUnidadesGestion() {
    try {
        if (window.__unidadesGestionLoaded) { console.log('⏭️ DEBUG: cargarUnidadesGestion - ya cargado (skip)'); return; }
        if (window.__unidadesGestionStarted) { console.log('⏭️ DEBUG: cargarUnidadesGestion - ya iniciado (skip)'); return; }
        window.__unidadesGestionStarted = true;
        try { const now=performance.now(); if (window.__dominiosDoneTs && (now-window.__dominiosDoneTs)>1000){ console.warn('🧵 TRACE cargarUnidadesGestion tardío'); console.trace(); } } catch {}
        const element = document.getElementById('actividadUnidadGestion');
        if (!element) {
            console.log('⚠️ Elemento actividadUnidadGestion no encontrado');
            return;
        }
        
        console.log('🔍 DEBUG: cargarUnidadesGestion - Cargando unidades de gestión...');
        
        // Hacer petición directa a la API para obtener las unidades de gestión
        const response = await fetch('/api/unidades-gestion', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('ub_token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const unidades = await response.json();
        console.log('✅ DEBUG: cargarUnidadesGestion - Unidades obtenidas:', unidades);
        
        // Preservar la selección actual antes de limpiar
        const valorSeleccionado = element.value;
        console.log('🔍 DEBUG: cargarUnidadesGestion - Valor seleccionado antes de limpiar:', valorSeleccionado);
        
        // Limpiar select pero preservar la primera opción si existe
        element.innerHTML = '';
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccionar...';
        element.appendChild(defaultOption);
        
        // Agregar opciones
        unidades.forEach(unidad => {
            const option = document.createElement('option');
            option.value = unidad.id; // Usar el ID real de la tabla (1, 2, 3)
            option.textContent = unidad.nombre;
            element.appendChild(option);
        });
        
        // Restaurar la selección si había una
        if (valorSeleccionado && valorSeleccionado !== '') {
            element.value = valorSeleccionado;
            console.log('✅ DEBUG: cargarUnidadesGestion - Selección restaurada:', valorSeleccionado);
        }
        
        console.log('✅ DEBUG: cargarUnidadesGestion - Select llenado con', unidades.length, 'opciones');
        window.__unidadesGestionLoaded = true;
        window.__unidadesGestionStarted = false;
        
    } catch (error) {
        console.error('❌ DEBUG: cargarUnidadesGestion - Error:', error);
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
        // Si el select tiene un valor bloqueado (de edición), preservarlo siempre
        const lockedValue = element.dataset.lockedValue;

        const response = await getValoresDominio(nombreDominio);
        console.log('📊 DEBUG: loadValoresDominio - Respuesta obtenida para', nombreDominio + ':', response);
        
        // Extraer los valores del array dentro de la respuesta
        const valores = response.valores || response;
        console.log('📊 DEBUG: loadValoresDominio - Valores extraídos para', nombreDominio + ':', valores);
        
        if (!valores || !Array.isArray(valores) || valores.length === 0) {
            console.warn('⚠️ DEBUG: loadValoresDominio - No se encontraron valores válidos para', nombreDominio);
            return;
        }
        
        // Limpiar select
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
        
        // Restaurar lockedValue o valor anterior si existe en las nuevas opciones
        const valorPrevio = lockedValue || element.value;
        if (valorPrevio && valorPrevio !== '') {
            const exists = Array.from(element.options).some(o => o.value == valorPrevio);
            if (exists) {
                element.value = valorPrevio;
                console.log(`🔁 DEBUG: loadValoresDominio - Selección preservada (${nombreDominio}):`, valorPrevio);
            }
        }
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
        
        // Lista de dominios a cargar con sus elementos (modo edición)
        const dominiosACargar = [
            { elementId: 'tipoActividad', dominio: 'TIPOS_ACTIVIDAD' },
            { elementId: 'lineaEstrategica', dominio: 'LINEAS_ESTRATEGICAS' },
            { elementId: 'objetivoEstrategico', dominio: 'OBJETIVOS_ESTRATEGICOS' },
            { elementId: 'actividadReservada', dominio: 'ACTIVIDADES_RESERVADAS' },
            { elementId: 'modalidadGestion', dominio: 'MODALIDADES_GESTION' },
            { elementId: 'inscripcionModalidad', dominio: 'MODALIDAD_IMPARTICION' },
            { elementId: 'centroUnidadUBDestinataria', dominio: 'CENTROS_UB' },
            { elementId: 'tipusEstudiSAE', dominio: 'TIPUS_ESTUDI_SAE' },
            { elementId: 'categoriaSAE', dominio: 'CATEGORIAS_SAE' },
            { elementId: 'competenciesSAE', dominio: 'COMPETENCIAS_SAE' },
            // Dominios adicionales necesarios en edición
            { elementId: 'jefeUnidadGestora', dominio: 'JEFES_UNIDAD_GESTORA' },
            { elementId: 'unidadGestoraDetalle', dominio: 'SUBUNIDAD_GESTORA' },
            { elementId: 'gestorActividad', dominio: 'GESTORES_ACTIVIDAD' },
            { elementId: 'facultadDestinataria', dominio: 'FACULTADES_DESTINATARIAS' },
            { elementId: 'departamentoDestinatario', dominio: 'DEPARTAMENTOS_DESTINATARIOS' },
            { elementId: 'coordinadorCentreUnitat', dominio: 'COORDINADORES_CENTRE_UNITAT_IDP' }
        ];
        
        // Cargar dominios de forma robusta
        await cargarDominiosRobust(dominiosACargar);
        
        // Cargar unidades de gestión directamente desde la tabla
        await cargarUnidadesGestion();
        
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
    // Guardar para depuración y mostrar esperado por secciones
    try {
        window.__actividadDebugActual = actividad;
        if (typeof imprimirValoresEsperadosPorSeccion === 'function') {
            imprimirValoresEsperadosPorSeccion(actividad, true);
        }
    } catch (e) { /* noop */ }
    
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
    
    // Helper genérico para asignar valor al primer id existente
    const setValueByIds = (ids, value, opts = {}) => {
        for (const id of ids) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (opts.type === 'checkbox') {
                el.checked = !!value;
                return el;
            }
            if (value == null) {
                el.value = '';
            } else if (opts.date === true && typeof value === 'string') {
                el.value = value.includes('T') ? value.split('T')[0] : value;
            } else {
                el.value = value;
            }
            if (opts.lock === true && value != null && el.tagName === 'SELECT') {
                el.dataset.lockedValue = String(value);
            }
            return el;
        }
        return null;
    };

    // Campos de inscripción (admite ambas convenciones de IDs)
    setValueByIds(['insc_inicio','inscripcionInicio'], actividad.inscripcionInicio || actividad.InscripcionInicio, { date: true });
    setValueByIds(['insc_fin','inscripcionFin'], actividad.inscripcionFin || actividad.InscripcionFin, { date: true });
    setValueByIds(['insc_plazas','inscripcionPlazas'], actividad.inscripcionPlazas || actividad.InscripcionPlazas);
    setValueByIds(['insc_lista_espera','inscripcionListaEspera'], actividad.inscripcionListaEspera || actividad.InscripcionListaEspera, { type: 'checkbox' });
    setValueByIds(['inscripcionModalidad'], actividad.inscripcionModalidad || actividad.InscripcionModalidad, { lock: true });
    // Nuevos: Remesa y Tipos de Inscripción
    setValueByIds(['remesa'], actividad.remesa || actividad.Remesa, { lock: true });
    setValueByIds(['tiposInscripcionId'], (actividad.tiposInscripcionId ?? actividad.TiposInscripcionId), { lock: true });

    // Estado de actividad: intentar por id o por texto
    (function(){
        var select = document.getElementById('estadoActividad');
        if (!select) return;
        var raw = actividad.estadoActividad != null ? actividad.estadoActividad : actividad.EstadoActividad;
        if (raw == null || raw === '') return;
        var target = String(raw).trim();
        var matched = false;
        for (var i = 0; i < select.options.length; i++) {
            var opt = select.options[i];
            if (opt.value === target || opt.text === target) {
                select.value = opt.value;
                select.dataset.lockedValue = opt.value;
                matched = true;
                break;
            }
        }
        if (!matched) {
            var map = { 'Abierta':'63', 'Cerrada':'64', 'Actividad abierta':'63', 'Actividad cerrada':'64' };
            var mapped = map[target] || map[target.toLowerCase?.()] || null;
            if (!mapped) {
                // Intento case-insensitive por texto
                for (var j = 0; j < select.options.length; j++) {
                    var o = select.options[j];
                    if ((o.text || '').toLowerCase() === target.toLowerCase()) { mapped = o.value; break; }
                }
            }
            if (mapped) {
                select.value = String(mapped);
                select.dataset.lockedValue = String(mapped);
            }
        }
    })();

    // Requisitos multiidioma
    setValueByIds(['insc_requisitos_es','inscripcionRequisitosES'], actividad.inscripcionRequisitosES || actividad.InscripcionRequisitosES);
    setValueByIds(['insc_requisitos_ca','inscripcionRequisitosCA'], actividad.inscripcionRequisitosCA || actividad.InscripcionRequisitosCA);
    setValueByIds(['insc_requisitos_en','inscripcionRequisitosEN'], actividad.inscripcionRequisitosEN || actividad.InscripcionRequisitosEN);

    // Programa: descripciones
    setValueByIds(['programa_descripcion_es','programaDescripcionES'], actividad.programaDescripcionES || actividad.ProgramaDescripcionES);
    setValueByIds(['programa_descripcion_ca','programaDescripcionCA'], actividad.programaDescripcionCA || actividad.ProgramaDescripcionCA);
    setValueByIds(['programa_descripcion_en','programaDescripcionEN'], actividad.programaDescripcionEN || actividad.ProgramaDescripcionEN);
    // Programa: contenidos
    setValueByIds(['programa_contenidos_es','programaContenidosES'], actividad.programaContenidosES || actividad.ProgramaContenidosES);
    setValueByIds(['programa_contenidos_ca','programaContenidosCA'], actividad.programaContenidosCA || actividad.ProgramaContenidosCA);
    setValueByIds(['programa_contenidos_en','programaContenidosEN'], actividad.programaContenidosEN || actividad.ProgramaContenidosEN);
    // Programa: objetivos
    setValueByIds(['programa_objetivos_es','programaObjetivosES'], actividad.programaObjetivosES || actividad.ProgramaObjetivosES);
    setValueByIds(['programa_objetivos_ca','programaObjetivosCA'], actividad.programaObjetivosCA || actividad.ProgramaObjetivosCA);
    setValueByIds(['programa_objetivos_en','programaObjetivosEN'], actividad.programaObjetivosEN || actividad.ProgramaObjetivosEN);
    // Programa: duración y fechas
    setValueByIds(['programa_duracion','programaDuracion'], actividad.programaDuracion || actividad.ProgramaDuracion);
    setValueByIds(['programa_inicio','programaInicio'], actividad.programaInicio || actividad.ProgramaInicio, { date: true });
    setValueByIds(['programa_fin','programaFin'], actividad.programaFin || actividad.ProgramaFin, { date: true });
    
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
    
	// Campos simples adicionales (texto/textarea)
	if (document.getElementById('espacioImparticion')) {
		document.getElementById('espacioImparticion').value = actividad.espacioImparticion || actividad.EspacioImparticion || '';
	}
	if (document.getElementById('lugarImparticion')) {
		document.getElementById('lugarImparticion').value = actividad.lugarImparticion || actividad.LugarImparticion || '';
	}
	if (document.getElementById('otrasUbicaciones')) {
		document.getElementById('otrasUbicaciones').value = actividad.otrasUbicaciones || actividad.OtrasUbicaciones || '';
	}
	if (document.getElementById('sistemaEvaluacion')) {
		document.getElementById('sistemaEvaluacion').value = actividad.sistemaEvaluacion || actividad.SistemaEvaluacion || '';
	}
	if (document.getElementById('horarioYCalendario')) {
		document.getElementById('horarioYCalendario').value = actividad.horarioYCalendario || actividad.HorarioYCalendario || '';
	}
	if (document.getElementById('observaciones')) {
		document.getElementById('observaciones').value = actividad.observaciones || actividad.Observaciones || '';
	}
	if (document.getElementById('urlPlataformaVirtual')) {
		document.getElementById('urlPlataformaVirtual').value = actividad.urlPlataformaVirtual || actividad.UrlPlataformaVirtual || '';
	}
	if (document.getElementById('urlCuestionarioSatisfaccion')) {
		document.getElementById('urlCuestionarioSatisfaccion').value = actividad.urlCuestionarioSatisfaccion || actividad.UrlCuestionarioSatisfaccion || '';
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
    // Idioma de impartición (select)
    if (document.getElementById('idiomaImparticionId')) {
        const idiomaVal = actividad.idiomaImparticionId || actividad.IdiomaImparticionId;
        const sel = document.getElementById('idiomaImparticionId');
        if (idiomaVal != null && sel) {
            sel.dataset.lockedValue = String(idiomaVal);
            // si ya están las opciones, intenta seleccionar
            for (let opt of sel.options) {
                if (opt.value === String(idiomaVal)) { opt.selected = true; break; }
            }
        }
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
    // Helper para observar y preservar valores bloqueados
    const attachLockedObserver = (select) => {
        if (!select || select.__lockedObserverAttached) return;
        const observer = new MutationObserver(() => {
            const locked = select.dataset?.lockedValue;
            if (locked && Array.from(select.options).some(o => o.value == locked)) {
                if (select.value != locked) {
                    select.value = locked;
                    console.log(`🔁 DEBUG: Observer reaplicó lockedValue en #${select.id}:`, locked);
                }
            }
        });
        observer.observe(select, { childList: true });
        select.__lockedObserverAttached = true;
    };
    
    // Establecer valores en dropdowns
    if (document.getElementById('actividadUnidadGestion')) {
        const select = document.getElementById('actividadUnidadGestion');
        const valor = actividad.UnidadGestionId || actividad.unidadGestionId;
        console.log('🔧 DEBUG: establecerValoresDropdowns - actividadUnidadGestion, valor:', valor);
        
        // Para actividadUnidadGestion, usar directamente el valor (1, 2, 3) ya que viene de la tabla UnidadesGestion
        for (let option of select.options) {
            if (option.value === String(valor)) {
                option.selected = true;
                console.log('✅ DEBUG: establecerValoresDropdowns - actividadUnidadGestion establecido:', option.text || option.value);
                select.dataset.lockedValue = option.value;
                attachLockedObserver(select);
                break;
            }
        }
    }
    
    // Jefe/a unidad gestora
    if (document.getElementById('jefeUnidadGestora')) {
        const select = document.getElementById('jefeUnidadGestora');
        const valor = actividad.JefeUnidadGestora || actividad.jefeUnidadGestora;
        console.log('🔧 DEBUG: establecerValoresDropdowns - jefeUnidadGestora, valor:', valor);
        if (valor != null) {
            // Fijar lock por adelantado para que se aplique cuando lleguen las opciones
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - jefeUnidadGestora establecido:', option.text || option.value);
                    break;
                }
            }
        }
    }
    
    // Gestor/a de la actividad
    if (document.getElementById('gestorActividad')) {
        const select = document.getElementById('gestorActividad');
        const valor = actividad.GestorActividad || actividad.gestorActividad;
        console.log('🔧 DEBUG: establecerValoresDropdowns - gestorActividad, valor:', valor);
        if (valor != null) {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - gestorActividad establecido:', option.text || option.value);
                    break;
                }
            }
        }
    }
    
    // Facultad destinataria
    if (document.getElementById('facultadDestinataria')) {
        const select = document.getElementById('facultadDestinataria');
        const valor = actividad.FacultadDestinataria || actividad.facultadDestinataria;
        console.log('🔧 DEBUG: establecerValoresDropdowns - facultadDestinataria, valor:', valor);
        if (valor != null) {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - facultadDestinataria establecido:', option.text || option.value);
                    break;
                }
            }
        }
    }
    
    // Departamento destinatario
    if (document.getElementById('departamentoDestinatario')) {
        const select = document.getElementById('departamentoDestinatario');
        const valor = actividad.DepartamentoDestinatario || actividad.departamentoDestinatario;
        console.log('🔧 DEBUG: establecerValoresDropdowns - departamentoDestinatario, valor:', valor);
        if (valor != null) {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - departamentoDestinatario establecido:', option.text || option.value);
                    break;
                }
            }
        }
    }
    
    // Coordinador/a Centre Unitat (IDP)
    if (document.getElementById('coordinadorCentreUnitat')) {
        const select = document.getElementById('coordinadorCentreUnitat');
        const valor = actividad.CoordinadorCentreUnitat || actividad.coordinadorCentreUnitat;
        console.log('🔧 DEBUG: establecerValoresDropdowns - coordinadorCentreUnitat, valor:', valor);
        if (valor != null) {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - coordinadorCentreUnitat establecido:', option.text || option.value);
                    break;
                }
            }
        }
    }

    if (document.getElementById('lineaEstrategica')) {
        const select = document.getElementById('lineaEstrategica');
        const valor = actividad.LineaEstrategica || actividad.lineaEstrategica;
        console.log('🔧 DEBUG: establecerValoresDropdowns - lineaEstrategica, valor:', valor);
        if (valor != null && valor !== '') {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor) || option.text === String(valor)) {
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
        if (valor != null && valor !== '') {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor) || option.text === String(valor)) {
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
                    break;
                }
            }
        }
    }

    // Idioma de impartición
    if (document.getElementById('idiomaImparticionId')) {
        const select = document.getElementById('idiomaImparticionId');
        const valor = actividad.IdiomaImparticionId || actividad.idiomaImparticionId;
        console.log('🔧 DEBUG: establecerValoresDropdowns - idiomaImparticionId, valor:', valor);
        if (valor != null) {
            select.dataset.lockedValue = String(valor);
            attachLockedObserver(select);
            for (let option of select.options) {
                if (option.value === String(valor)) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - idiomaImparticionId establecido:', option.text || option.value);
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
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
                    select.dataset.lockedValue = option.value;
                    attachLockedObserver(select);
                    break;
                }
            }
        }
    }
    
    console.log('✅ DEBUG: establecerValoresDropdowns - Valores de dropdowns establecidos');
    // Tras aplicar selecciones, imprimir el estado seteado por secciones
    try {
        if (typeof imprimirValoresSeteadosPorSeccion === 'function') {
            imprimirValoresSeteadosPorSeccion(true);
        }
    } catch (e) { /* noop */ }
}

// Exponer helper global para otros módulos (editar-actividad.js)
window.attachLockedObserver = window.attachLockedObserver || function(select) {
    if (!select || select.__lockedObserverAttached) return;
    const observer = new MutationObserver(() => {
        const locked = select.dataset?.lockedValue;
        if (locked && Array.from(select.options).some(o => o.value == locked)) {
            if (select.value != locked) {
                select.value = locked;
                console.log(`🔁 DEBUG: (global) Observer reaplicó lockedValue en #${select.id}:`, locked);
            }
        }
    });
    observer.observe(select, { childList: true });
    select.__lockedObserverAttached = true;
};

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
        'creditosMinimosSAE', 'creditosMaximosSAE',
        // Inscripción (ambos conjuntos de ids)
        'insc_inicio', 'insc_fin', 'insc_plazas', 'insc_lista_espera', 'inscripcionModalidad',
        'insc_requisitos_es', 'insc_requisitos_ca', 'insc_requisitos_en',
        'inscripcionInicio', 'inscripcionFin', 'inscripcionPlazas', 'inscripcionListaEspera',
        'inscripcionRequisitosES', 'inscripcionRequisitosCA', 'inscripcionRequisitosEN',
        // Programa (ambos conjuntos de ids)
        'programa_descripcion_es', 'programa_descripcion_ca', 'programa_descripcion_en',
        'programa_contenidos_es', 'programa_contenidos_ca', 'programa_contenidos_en',
        'programa_objetivos_es', 'programa_objetivos_ca', 'programa_objetivos_en',
        'programa_duracion', 'programa_inicio', 'programa_fin',
        'programaDescripcionES', 'programaDescripcionCA', 'programaDescripcionEN',
        'programaContenidosES', 'programaContenidosCA', 'programaContenidosEN',
        'programaObjetivosES', 'programaObjetivosCA', 'programaObjetivosEN',
        'programaInicio', 'programaFin',
        // SAE
        'tipusEstudiSAE', 'categoriaSAE', 'competenciesSAE'
    ];
    
    // Detectar UG para marcar campos NO_APLICA (p.e. SAE cuando UG=IDP)
    const ugId = actividad.UnidadGestionId || actividad.unidadGestionId;
    const isIDP = String(ugId) === '1';

    camposEsperados.forEach(campo => {
        const resolvedId = resolveExistingId(campo) || campo;
        const elemento = document.getElementById(resolvedId);
        if (elemento) {
            let valor = elemento.value;
            
            // Para actividadUnidadGestion, verificar también el texto seleccionado
            if (resolvedId === 'actividadUnidadGestion' && elemento.tagName === 'SELECT') {
                const selectedOption = elemento.options[elemento.selectedIndex];
                if (selectedOption && selectedOption.text && selectedOption.text !== 'Seleccionar...' && selectedOption.text !== 'Seleccionar unidad...') {
                    valor = selectedOption.text;
                }
            }
            
            // Campos NO_APLICA por UG (SAE no aplica a IDP)
            const isCampoSAE = ['tipusEstudiSAE','categoriaSAE','competenciesSAE'].includes(campo);
            if (isIDP && isCampoSAE) {
                console.log(`ℹ️ Campo ${campo}: NO_APLICA (UG=IDP)`);
            } else if (valor && valor !== '') {
                console.log(`✅ Campo ${campo}: "${valor}"`);
            } else {
                console.log(`❌ Campo ${campo}: VACÍO`);
            }
        } else {
            console.log(`⚠️ Campo ${campo}: NO ENCONTRADO en el DOM`);
        }
    });
}

// ====== UTILIDADES DE DEBUG POR SECCIONES ======
const DOM_TO_ACT_KEYS = {
    'actividadTitulo': ['Titulo','titulo'],
    'actividadCodigo': ['Codigo','codigo'],
    'actividadAnioAcademico': ['AnioAcademico','anioAcademico'],
    'actividadUnidadGestion': ['UnidadGestionId','unidadGestionId'],
    'condicionesEconomicas': ['CondicionesEconomicas','condicionesEconomicas'],
    'lineaEstrategica': ['LineaEstrategica','lineaEstrategica'],
    'objetivoEstrategico': ['ObjetivoEstrategico','objetivoEstrategico'],
    'codigoRelacionado': ['CodigoRelacionado','codigoRelacionado'],
    'fechaActividad': ['FechaActividad','fechaActividad'],
    'motivoCierre': ['MotivoCierre','motivoCierre'],
    'personaSolicitante': ['PersonaSolicitante','personaSolicitante'],
    'coordinador': ['Coordinador','coordinador'],
    'jefeUnidadGestora': ['JefeUnidadGestora','jefeUnidadGestora'],
    'gestorActividad': ['GestorActividad','gestorActividad'],
    'facultadDestinataria': ['FacultadDestinataria','facultadDestinataria'],
    'departamentoDestinatario': ['DepartamentoDestinatario','departamentoDestinatario'],
    'centroUnidadUBDestinataria': ['CentroUnidadUBDestinataria','centroUnidadUBDestinataria'],
    'otrosCentrosInstituciones': ['OtrosCentrosInstituciones','otrosCentrosInstituciones'],
    'plazasTotales': ['PlazasTotales','plazasTotales'],
    'horasTotales': ['HorasTotales','horasTotales'],
    'centroTrabajoRequerido': ['CentroTrabajoRequerido','centroTrabajoRequerido'],
    'modalidadGestion': ['ModalidadGestion','modalidadGestion'],
    'fechaInicioImparticion': ['FechaInicioImparticion','fechaInicioImparticion'],
    'fechaFinImparticion': ['FechaFinImparticion','fechaFinImparticion'],
    'actividadPago': ['ActividadPago','actividadPago'],
    'coordinadorCentreUnitat': ['CoordinadorCentreUnitat','coordinadorCentreUnitat'],
    'centreTreballeAlumne': ['CentreTreballeAlumne','centreTreballeAlumne'],
    'creditosTotalesCRAI': ['CreditosTotalesCRAI','creditosTotalesCRAI'],
    'creditosTotalesSAE': ['CreditosTotalesSAE','creditosTotalesSAE'],
    'creditosMinimosSAE': ['CreditosMinimosSAE','creditosMinimosSAE'],
    'creditosMaximosSAE': ['CreditosMaximosSAE','creditosMaximosSAE'],
    'insc_inicio': ['InscInicio','insc_inicio'],
    'insc_fin': ['InscFin','insc_fin'],
    'insc_plazas': ['InscPlazas','insc_plazas'],
    'insc_lista_espera': ['InscListaEspera','insc_lista_espera'],
    'inscripcionModalidad': ['InscripcionModalidad','inscripcionModalidad'],
    'insc_requisitos_es': ['InscRequisitosES','insc_requisitos_es'],
    'insc_requisitos_ca': ['InscRequisitosCA','insc_requisitos_ca'],
    'insc_requisitos_en': ['InscRequisitosEN','insc_requisitos_en'],
    'programa_descripcion_es': ['ProgramaDescripcionES','programa_descripcion_es'],
    'programa_descripcion_ca': ['ProgramaDescripcionCA','programa_descripcion_ca'],
    'programa_descripcion_en': ['ProgramaDescripcionEN','programa_descripcion_en'],
    'programa_contenidos_es': ['ProgramaContenidosES','programa_contenidos_es'],
    'programa_contenidos_ca': ['ProgramaContenidosCA','programa_contenidos_ca'],
    'programa_contenidos_en': ['ProgramaContenidosEN','programa_contenidos_en'],
    'programa_objetivos_es': ['ProgramaObjetivosES','programa_objetivos_es'],
    'programa_objetivos_ca': ['ProgramaObjetivosCA','programa_objetivos_ca'],
    'programa_objetivos_en': ['ProgramaObjetivosEN','programa_objetivos_en'],
    'programa_duracion': ['ProgramaDuracion','programa_duracion'],
    'programa_inicio': ['ProgramaInicio','programa_inicio'],
    'programa_fin': ['ProgramaFin','programa_fin'],
    'tipusEstudiSAE': ['TipusEstudiSAE','tipusEstudiSAE'],
    'categoriaSAE': ['CategoriaSAE','categoriaSAE'],
    'competenciesSAE': ['CompetenciesSAE','competenciesSAE'],
    'tipoActividad': ['TipoActividad','tipoActividad']
};

const SECCIONES_DEBUG = {
    'Básicos': ['actividadTitulo','actividadCodigo','actividadAnioAcademico','codigoRelacionado','motivoCierre','personaSolicitante'],
    'UG y responsables': ['actividadUnidadGestion','jefeUnidadGestora','gestorActividad','coordinador','coordinadorCentreUnitat'],
    'Estrategia': ['lineaEstrategica','objetivoEstrategico'],
    'Centros': ['centroUnidadUBDestinataria','otrosCentrosInstituciones','centroTrabajoRequerido','facultadDestinataria','departamentoDestinatario'],
    'Impartición': ['fechaActividad','fechaInicioImparticion','fechaFinImparticion','horasTotales','plazasTotales','tipoActividad','modalidadGestion','actividadPago'],
    'Inscripción': ['insc_inicio','insc_fin','insc_plazas','insc_lista_espera','inscripcionModalidad','insc_requisitos_es','insc_requisitos_ca','insc_requisitos_en'],
    'Programa': ['programa_descripcion_es','programa_descripcion_ca','programa_descripcion_en','programa_contenidos_es','programa_contenidos_ca','programa_contenidos_en','programa_objetivos_es','programa_objetivos_ca','programa_objetivos_en','programa_duracion','programa_inicio','programa_fin'],
    'Créditos': ['creditosTotalesCRAI','creditosTotalesSAE','creditosMinimosSAE','creditosMaximosSAE'],
    'SAE': ['tipusEstudiSAE','categoriaSAE','competenciesSAE']
};

// Alias de IDs en DOM (snake_case -> camelCase u otras variantes)
const DOM_ALIASES = {
    // Inscripción
    'insc_inicio': ['inscripcionInicio'],
    'insc_fin': ['inscripcionFin'],
    'insc_plazas': ['inscripcionPlazas'],
    'insc_lista_espera': ['inscripcionListaEspera'],
    'insc_requisitos_es': ['inscripcionRequisitosES'],
    'insc_requisitos_ca': ['inscripcionRequisitosCA'],
    'insc_requisitos_en': ['inscripcionRequisitosEN'],
    // Programa
    'programa_descripcion_es': ['programaDescripcionES'],
    'programa_descripcion_ca': ['programaDescripcionCA'],
    'programa_descripcion_en': ['programaDescripcionEN'],
    'programa_contenidos_es': ['programaContenidosES'],
    'programa_contenidos_ca': ['programaContenidosCA'],
    'programa_contenidos_en': ['programaContenidosEN'],
    'programa_objetivos_es': ['programaObjetivosES'],
    'programa_objetivos_ca': ['programaObjetivosCA'],
    'programa_objetivos_en': ['programaObjetivosEN'],
    'programa_duracion': ['programaDuracion'],
    'programa_inicio': ['programaInicio'],
    'programa_fin': ['programaFin']
};

function resolveExistingId(primaryId) {
    const aliases = DOM_ALIASES[primaryId] || [];
    const candidates = [primaryId, ...aliases];
    for (const id of candidates) {
        const el = document.getElementById(id);
        if (el) return id;
    }
    return null;
}

function getValorActividad(actividad, claves) {
    if (!actividad || !claves) return undefined;
    for (const k of claves) {
        if (actividad[k] !== undefined && actividad[k] !== null) return actividad[k];
    }
    return undefined;
}

function imprimirValoresEsperadosPorSeccion(actividad, plano = false) {
    try {
        if (plano) {
            console.log('🧭 Esperados por sección (plano)');
            Object.keys(SECCIONES_DEBUG).forEach(seccion => {
                SECCIONES_DEBUG[seccion].forEach(id => {
                    const esperado = getValorActividad(actividad, DOM_TO_ACT_KEYS[id]);
                    console.log(`[Esperado] ${seccion} > ${id}:`, esperado);
                });
            });
        } else {
            console.groupCollapsed('🧭 Esperados por sección');
            Object.keys(SECCIONES_DEBUG).forEach(seccion => {
                const filas = SECCIONES_DEBUG[seccion].map(id => {
                    const esperado = getValorActividad(actividad, DOM_TO_ACT_KEYS[id]);
                    return { campo: id, esperado: esperado };
                });
                console.groupCollapsed(`Sección: ${seccion}`);
                console.table(filas);
                console.groupEnd();
            });
            console.groupEnd();
        }
    } catch (e) {
        console.warn('⚠️ imprimirValoresEsperadosPorSeccion error:', e);
    }
}

function leerValorDesdeDom(id) {
    let domId = resolveExistingId(id) || id;
    const el = document.getElementById(domId);
    if (!el) return { estado: 'NO_ENCONTRADO', valor: null, texto: null };
    if (el.tagName === 'SELECT') {
        const opt = el.options[el.selectedIndex];
        const valor = el.value || '';
        const texto = opt ? opt.text : '';
        return { estado: valor ? 'SETEADO' : 'VACÍO', valor, texto };
    }
    if (el.type === 'checkbox') {
        return { estado: el.checked ? 'SETEADO' : 'VACÍO', valor: el.checked };
    }
    return { estado: el.value ? 'SETEADO' : 'VACÍO', valor: el.value };
}

function imprimirValoresSeteadosPorSeccion(plano = false) {
    try {
        if (plano) {
            console.log('📌 Seteados en DOM por sección (plano)');
            Object.keys(SECCIONES_DEBUG).forEach(seccion => {
                SECCIONES_DEBUG[seccion].forEach(id => {
                    const lectura = leerValorDesdeDom(id);
                    console.log(`[Seteado] ${seccion} > ${id}:`, lectura);
                });
            });
        } else {
            console.groupCollapsed('📌 Seteados en DOM por sección');
            Object.keys(SECCIONES_DEBUG).forEach(seccion => {
                const filas = SECCIONES_DEBUG[seccion].map(id => {
                    const lectura = leerValorDesdeDom(id);
                    return { campo: id, estado: lectura.estado, valor: lectura.valor, texto: lectura.texto };
                });
                console.groupCollapsed(`Sección: ${seccion}`);
                console.table(filas);
                console.groupEnd();
            });
            console.groupEnd();
        }
    } catch (e) {
        console.warn('⚠️ imprimirValoresSeteadosPorSeccion error:', e);
    }
}

// Helpers globales para volcado plano sin expansión
window.dumpEsperadosPlano = function() {
    try { imprimirValoresEsperadosPorSeccion(window.__actividadDebugActual, true); } catch (e) {}
};
window.dumpSeteadosPlano = function() {
    try { imprimirValoresSeteadosPorSeccion(true); } catch (e) {}
};

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
        const entidadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/colaboradoras`);
        if (entidadesResponse.ok) {
            const entidades = await entidadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Entidades cargadas:', entidades);
            llenarEntidadesOrganizadoras(entidades);
        } else {
            console.log('⚠️ DEBUG: cargarDatosAdicionalesSinDominios - No se encontraron entidades organizadoras');
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/importes`);
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
        console.log('🚀 DEBUG: DOMContentLoaded - No es modo edición o no hay ID (initializePage gestionará la carga)');
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
        try { const now=performance.now(); if (window.__dominiosDoneTs && (now-window.__dominiosDoneTs)>1000){ console.warn('🧵 TRACE cargarIdiomasEnSelectCrear tardío'); console.trace(); } } catch {}
        if (window.__idiomasCache) {
            while (select.children.length > 1) { select.removeChild(select.lastChild); }
            window.__idiomasCache.forEach(idioma => {
                const option = document.createElement('option');
                option.value = idioma.id || idioma.Id;
                option.textContent = idioma.descripcion || idioma.Descripcion;
                select.appendChild(option);
            });
            console.log('✅ DEBUG: cargarIdiomasEnSelectCrear - poblado desde cache');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/dominios/IdiomaImparticion/valores`);
        if (response.ok) {
            const idiomas = await response.json();
            window.__idiomasCache = idiomas;
            
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

// Debug logging switch
(function(){
    const STORAGE_KEY = 'ub_debug_logging_enabled';
    let enabled = false;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) enabled = saved === 'true';
    } catch {}

    const original = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        debug: console.debug ? console.debug.bind(console) : console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    };

    function patchConsole() {
        console.log = (...args) => { if (enabled) original.log(...args); };
        console.info = (...args) => { if (enabled) original.info(...args); };
        console.debug = (...args) => { if (enabled) original.debug(...args); };
        console.warn = (...args) => { if (enabled) original.warn(...args); };
        console.error = original.error;
    }

    window.setDebugLogging = function(flag) {
        enabled = !!flag;
        try { localStorage.setItem(STORAGE_KEY, String(enabled)); } catch {}
        patchConsole();
        original.log(`🔁 Debug logging ${enabled ? 'activado' : 'desactivado'}`);
    };

    window.toggleDebugLogging = function() {
        window.setDebugLogging(!enabled);
    };

    // Aplicar al cargar
    patchConsole();
})();
