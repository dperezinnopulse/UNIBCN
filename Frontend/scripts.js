// UB Actividad 1 - Scripts de Integración Frontend-Backend
// Versión: scripts.js?v=1.0.21
// Configuración de la API
const API_BASE_URL = 'http://localhost:5001';

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
        console.log('🚀 DEBUG: makeRequest - Puerto:', new URL(url).port);
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
        
        return await this.makeRequest('/api/actividades-frontend', {
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
            return response;
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
        const valores = await api.getValoresDominio(nombreDominio);
        console.log(`📊 DEBUG: loadValoresDominio - Valores obtenidos para ${nombreDominio}:`, valores);
        
        if (!valores || valores.length === 0) {
            console.warn(`⚠️ DEBUG: loadValoresDominio - No se encontraron valores para ${nombreDominio}`);
            return;
        }
        
        // Limpiar select pero preservar la primera opción si existe
        const firstOption = selectElement.querySelector('option');
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
                    // Usar las propiedades correctas con mayúsculas
                    option.value = valor.Valor || valor.valor || valor.value || valor.Value;
                    option.textContent = valor.Valor || valor.valor || valor.value || valor.Value;
                    selectElement.appendChild(option);
                    opcionesAgregadas++;
                });
        console.log(`✅ DEBUG: loadValoresDominio - ${opcionesAgregadas} opciones agregadas para ${nombreDominio}`);
    } catch (error) {
        console.error(`❌ DEBUG: loadValoresDominio - Error cargando dominio ${nombreDominio}:`, error);
        // No mostrar error al usuario, solo log
    }
}

// Función para guardar actividad desde el formulario
async function guardarActividad() {
    console.log('🚀 DEBUG: guardarActividad - Versión del script: scripts.js?v=1.0.40');
    console.log('🚀 DEBUG: guardarActividad - Iniciando guardado de actividad...');
    
    // Verificar si estamos en modo edición
    const actividadId = document.getElementById('actividadId')?.value;
    const isUpdate = actividadId && actividadId.trim() !== '';
    
    console.log('🚀 DEBUG: guardarActividad - Modo:', isUpdate ? 'Actualización' : 'Creación');
    console.log('🚀 DEBUG: guardarActividad - ID de actividad:', actividadId);
    
    try {
        // Recopilar datos del formulario
        const formData = {
            // Campos básicos
            titulo: limpiarCaracteresEspeciales(document.getElementById('actividadTitulo')?.value) || 'Actividad de Prueba Frontend',
            descripcion: limpiarCaracteresEspeciales(document.getElementById('actividadDescripcion')?.value) || 'Esta actividad fue creada automaticamente para probar el frontend',
            fechaInicio: document.getElementById('actividadFechaInicio')?.value || null,
            fechaFin: document.getElementById('actividadFechaFin')?.value || null,
            lugar: document.getElementById('actividadLugar')?.value || 'Aula Virtual',
            codigo: document.getElementById('actividadCodigo')?.value || '',
            anioAcademico: document.getElementById('actividadAnioAcademico')?.value || '2024-25',
            estadoId: parseInt(document.getElementById('actividadEstado')?.value) || 1,
            unidadGestionId: parseInt(document.getElementById('actividadUnidadGestion')?.value) || 1,
            
            // Campos adicionales del formulario
            tipoActividad: limpiarCaracteresEspeciales(document.getElementById('tipoActividad')?.value) || '',
            condicionesEconomicas: limpiarCaracteresEspeciales(document.getElementById('condicionesEconomicas')?.value) || '',
            lineaEstrategica: limpiarCaracteresEspeciales(document.getElementById('lineaEstrategica')?.value) || '',
            objetivoEstrategico: limpiarCaracteresEspeciales(document.getElementById('objetivoEstrategico')?.value) || '',
            codigoRelacionado: limpiarCaracteresEspeciales(document.getElementById('codigoRelacionado')?.value) || '',
            actividadReservada: document.getElementById('actividadReservada')?.value === 'PDI' ? true : false,
            fechaActividad: document.getElementById('fechaActividad')?.value || null,
            motivoCierre: limpiarCaracteresEspeciales(document.getElementById('motivoCierre')?.value) || '',
            personaSolicitante: limpiarCaracteresEspeciales(document.getElementById('personaSolicitante')?.value) || '',
            coordinador: limpiarCaracteresEspeciales(document.getElementById('coordinador')?.value) || '',
            jefeUnidadGestora: limpiarCaracteresEspeciales(document.getElementById('jefeUnidadGestora')?.value) || '',
            gestorActividad: limpiarCaracteresEspeciales(document.getElementById('gestorActividad')?.value) || '',
            facultadDestinataria: limpiarCaracteresEspeciales(document.getElementById('facultadDestinataria')?.value) || '',
            departamentoDestinatario: limpiarCaracteresEspeciales(document.getElementById('departamentoDestinatario')?.value) || '',
            centroUnidadUBDestinataria: limpiarCaracteresEspeciales(document.getElementById('centroUnidadUBDestinataria')?.value) || '',
            otrosCentrosInstituciones: limpiarCaracteresEspeciales(document.getElementById('otrosCentrosInstituciones')?.value) || '',
            plazasTotales: parseInt(document.getElementById('plazasTotales')?.value) || null,
            horasTotales: parseFloat(document.getElementById('horasTotales')?.value) || null,
            centroTrabajoRequerido: document.getElementById('centroTrabajoRequerido')?.value || '',
            modalidadGestion: document.getElementById('modalidadGestion')?.value || '',
            fechaInicioImparticion: document.getElementById('fechaInicioImparticion')?.value || null,
            fechaFinImparticion: document.getElementById('fechaFinImparticion')?.value || null,
            actividadPago: document.getElementById('actividadPago')?.checked || false,
            
            // Campos específicos por unidad de gestión
            coordinadorCentreUnitat: limpiarCaracteresEspeciales(document.getElementById('coordinadorCentreUnitat')?.value) || '',
            centreTreballeAlumne: limpiarCaracteresEspeciales(document.getElementById('centreTreballeAlumne')?.value) || '',
            creditosTotalesCRAI: parseFloat(document.getElementById('creditosTotalesCRAI')?.value) || null,
            creditosTotalesSAE: parseFloat(document.getElementById('creditosTotalesSAE')?.value) || null,
            creditosMinimosSAE: parseFloat(document.getElementById('creditosMinimosSAE')?.value) || null,
            creditosMaximosSAE: parseFloat(document.getElementById('creditosMaximosSAE')?.value) || null,
            tipusEstudiSAE: limpiarCaracteresEspeciales(document.getElementById('tipusEstudiSAE')?.value) || '',
            categoriaSAE: limpiarCaracteresEspeciales(document.getElementById('categoriaSAE')?.value) || '',
            competenciesSAE: limpiarCaracteresEspeciales(document.getElementById('competenciesSAE')?.value) || '',
            
            // Campos de entidades organizadoras
            org_principal: limpiarCaracteresEspeciales(document.getElementById('org_principal')?.value) || '',
            org_nif: limpiarCaracteresEspeciales(document.getElementById('org_nif')?.value) || '',
            org_web: limpiarCaracteresEspeciales(document.getElementById('org_web')?.value) || '',
            org_contacto: limpiarCaracteresEspeciales(document.getElementById('org_contacto')?.value) || '',
            org_email: limpiarCaracteresEspeciales(document.getElementById('org_email')?.value) || '',
            org_tel: limpiarCaracteresEspeciales(document.getElementById('org_tel')?.value) || '',
            
            // Campos de inscripción
            inscripcionInicio: document.getElementById('insc_inicio')?.value || null,
            inscripcionFin: document.getElementById('insc_fin')?.value || null,
            inscripcionPlazas: parseInt(document.getElementById('insc_plazas')?.value) || null,
            inscripcionListaEspera: document.getElementById('insc_lista_espera')?.checked || false,
            inscripcionModalidad: limpiarCaracteresEspeciales(document.getElementById('insc_modalidad')?.value) || '',
            inscripcionRequisitosES: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_es')?.value) || '',
            inscripcionRequisitosCA: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_ca')?.value) || '',
            inscripcionRequisitosEN: limpiarCaracteresEspeciales(document.getElementById('insc_requisitos_en')?.value) || '',
            
            // Campos de programa
            programaDescripcionES: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_es')?.value) || '',
            programaDescripcionCA: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_ca')?.value) || '',
            programaDescripcionEN: limpiarCaracteresEspeciales(document.getElementById('programa_descripcion_en')?.value) || '',
            programaContenidosES: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_es')?.value) || '',
            programaContenidosCA: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_ca')?.value) || '',
            programaContenidosEN: limpiarCaracteresEspeciales(document.getElementById('programa_contenidos_en')?.value) || '',
            programaObjetivosES: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_es')?.value) || '',
            programaObjetivosCA: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_ca')?.value) || '',
            programaObjetivosEN: limpiarCaracteresEspeciales(document.getElementById('programa_objetivos_en')?.value) || '',
            programaDuracion: parseFloat(document.getElementById('programa_duracion')?.value) || null,
            programaInicio: document.getElementById('programa_inicio')?.value || null,
            programaFin: document.getElementById('programa_fin')?.value || null,
            
            // Campos de importes
            imp_base: parseFloat(document.getElementById('imp_base')?.value) || null,
            imp_tipo: limpiarCaracteresEspeciales(document.getElementById('imp_tipo')?.value) || '',
            imp_descuento_pct: parseFloat(document.getElementById('imp_descuento_pct')?.value) || null,
            imp_codigo: limpiarCaracteresEspeciales(document.getElementById('imp_codigo')?.value) || '',
            imp_condiciones_es: limpiarCaracteresEspeciales(document.getElementById('imp_condiciones_es')?.value) || '',
            imp_condiciones_ca: limpiarCaracteresEspeciales(document.getElementById('imp_condiciones_ca')?.value) || '',
            imp_condiciones_en: limpiarCaracteresEspeciales(document.getElementById('imp_condiciones_en')?.value) || ''
        };

        // Recopilar participantes dinámicos
        const participantes = [];
        const participanteElements = document.querySelectorAll('[id^="participante_"]');
        const participanteIds = [...new Set(Array.from(participanteElements).map(el => el.id.split('_')[1]))];
        
        participanteIds.forEach(id => {
            const nombre = document.getElementById(`participante_${id}_nombre`)?.value;
            const rol = document.getElementById(`participante_${id}_rol`)?.value;
            const email = document.getElementById(`participante_${id}_email`)?.value;
            
            if (nombre || rol || email) {
                participantes.push({
                    nombre: nombre || '',
                    rol: rol || '',
                    email: email || ''
                });
            }
        });

        // Recopilar subactividades dinámicas
        const subactividades = [];
        const subactividadElements = document.querySelectorAll('[id^="subactividad_"]');
        const subactividadIds = [...new Set(Array.from(subactividadElements).map(el => el.id.split('_')[1]))];
        
        subactividadIds.forEach(id => {
            const titulo = document.getElementById(`subactividad_${id}_titulo`)?.value;
            const modalidad = document.getElementById(`subactividad_${id}_modalidad`)?.value;
            const docente = document.getElementById(`subactividad_${id}_docente`)?.value;
            const fechaInicio = document.getElementById(`subactividad_${id}_fechaInicio`)?.value;
            const fechaFin = document.getElementById(`subactividad_${id}_fechaFin`)?.value;
            const horaInicio = document.getElementById(`subactividad_${id}_horaInicio`)?.value;
            const horaFin = document.getElementById(`subactividad_${id}_horaFin`)?.value;
            const duracion = parseFloat(document.getElementById(`subactividad_${id}_duracion`)?.value) || null;
            const ubicacion = document.getElementById(`subactividad_${id}_ubicacion`)?.value;
            const aforo = parseInt(document.getElementById(`subactividad_${id}_aforo`)?.value) || null;
            const idioma = document.getElementById(`subactividad_${id}_idioma`)?.value;
            const descripcion = document.getElementById(`subactividad_${id}_descripcion`)?.value;
            
            if (titulo || modalidad || docente || fechaInicio || fechaFin || horaInicio || horaFin || duracion || ubicacion || aforo || idioma || descripcion) {
                subactividades.push({
                    titulo: titulo || '',
                    modalidad: modalidad || '',
                    docente: docente || '',
                    fechaInicio: fechaInicio || null,
                    fechaFin: fechaFin || null,
                    horaInicio: horaInicio || null,
                    horaFin: horaFin || null,
                    duracion: duracion,
                    ubicacion: ubicacion || '',
                    aforo: aforo,
                    idioma: idioma || '',
                    descripcion: descripcion || ''
                });
            }
        });

        // Agregar participantes y subactividades al formData
        formData.participantes = participantes;
        formData.subactividades = subactividades;

        console.log('🚀 DEBUG: guardarActividad - Datos recopilados:', formData);

        // Validaciones básicas
        if (!formData.titulo.trim()) {
            showMessage('El título es obligatorio', 'warning');
            return;
        }

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
            
            // Redirigir a la página de edición con el ID de la actividad
            setTimeout(() => {
                window.location.href = `editar-actividad.html?id=${resultado.Id}`;
            }, 2000);
            
            // Actualizar el ID en el formulario
            if (document.getElementById('actividadId')) {
                document.getElementById('actividadId').value = resultado.Id;
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
        
        if (unidadesSelect) {
            console.log('🚀 DEBUG: initializePage - Cargando unidades de gestión...');
            await loadUnidadesGestion(unidadesSelect);
        }

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

// Función para cargar todos los dominios
async function cargarDominios() {
    try {
        console.log('🚀 DEBUG: cargarDominios - Iniciando carga de dominios...');
        
        // Lista de dominios a cargar con sus elementos correspondientes
        const dominiosACargar = [
            { elementId: 'tipoActividad', dominio: 'TIPOS_ACTIVIDAD' },
            { elementId: 'lineaEstrategica', dominio: 'LINEAS_ESTRATEGICAS' },
            { elementId: 'objetivoEstrategico', dominio: 'OBJETIVOS_ESTRATEGICOS' },
            { elementId: 'actividadReservada', dominio: 'ACTIVIDADES_RESERVADAS' },
            { elementId: 'modalidadGestion', dominio: 'MODALIDADES_GESTION' },
            { elementId: 'facultadDestinataria', dominio: 'FACULTADES' },
            { elementId: 'departamentoDestinatario', dominio: 'DEPARTAMENTOS' },
            { elementId: 'centroUnidadUBDestinataria', dominio: 'CENTROS_UB' },
            { elementId: 'imp_tipo', dominio: 'TIPOS_IMPUESTO' },
            { elementId: 'actividadUnidadGestion', dominio: 'UNIDADES_GESTION' },
            { elementId: 'centroTrabajoRequerido', dominio: 'OPCIONES_SI_NO' },
            { elementId: 'tipusEstudiSAE', dominio: 'TIPUS_ESTUDI_SAE' },
            { elementId: 'categoriaSAE', dominio: 'CATEGORIAS_SAE' }
        ];

        let dominiosCargados = 0;
        let dominiosNoEncontrados = 0;

        // Función para esperar a que un elemento esté disponible
        const waitForElement = (elementId, maxAttempts = 50) => {
            return new Promise((resolve) => {
                let attempts = 0;
                const checkElement = () => {
                    attempts++;
                    const element = document.getElementById(elementId);
                    if (element) {
                        console.log(`✅ DEBUG: cargarDominios - Elemento encontrado en intento ${attempts}: ${elementId}`);
                        resolve(element);
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkElement, 200); // Esperar 200ms antes de intentar de nuevo
                    } else {
                        console.warn(`⚠️ DEBUG: cargarDominios - Elemento no encontrado después de ${maxAttempts} intentos: ${elementId}`);
                        // Verificar si el elemento existe en el DOM pero no es accesible
                        const allElements = document.querySelectorAll('*');
                        const matchingElements = Array.from(allElements).filter(el => el.id === elementId);
                        if (matchingElements.length > 0) {
                            console.warn(`⚠️ DEBUG: cargarDominios - Elemento existe en DOM pero no accesible: ${elementId}`);
                        }
                        resolve(null);
                    }
                };
                checkElement();
            });
        };

        for (const dominio of dominiosACargar) {
            console.log(`🔍 DEBUG: cargarDominios - Procesando dominio: ${dominio.dominio} para elemento: ${dominio.elementId}`);
            
            const selectElement = await waitForElement(dominio.elementId);
            if (selectElement) {
                console.log(`✅ DEBUG: cargarDominios - Elemento encontrado: ${dominio.elementId}`, selectElement);
                console.log(`🔍 DEBUG: cargarDominios - Cargando ${dominio.dominio} en ${dominio.elementId}`);
                
                // Log del estado antes de cargar
                console.log(`📊 DEBUG: cargarDominios - Estado del select antes de cargar:`, {
                    id: selectElement.id,
                    options: selectElement.options.length,
                    innerHTML: selectElement.innerHTML.substring(0, 100) + '...'
                });
                
                // Log específico para actividadUnidadGestion
                if (dominio.elementId === 'actividadUnidadGestion') {
                    console.log(`🎯 DEBUG: cargarDominios - PROCESANDO actividadUnidadGestion específicamente`);
                    console.log(`🎯 DEBUG: cargarDominios - Elemento DOM:`, selectElement);
                    console.log(`🎯 DEBUG: cargarDominios - ID del elemento:`, selectElement.id);
                    console.log(`🎯 DEBUG: cargarDominios - Clases del elemento:`, selectElement.className);
                }
                
                await loadValoresDominio(dominio.elementId, dominio.dominio);
                
                // Log del estado después de cargar
                console.log(`📊 DEBUG: cargarDominios - Estado del select después de cargar:`, {
                    id: selectElement.id,
                    options: selectElement.options.length,
                    innerHTML: selectElement.innerHTML.substring(0, 100) + '...'
                });
                
                // Log específico para actividadUnidadGestion después de cargar
                if (dominio.elementId === 'actividadUnidadGestion') {
                    console.log(`🎯 DEBUG: cargarDominios - DESPUÉS de cargar actividadUnidadGestion`);
                    console.log(`🎯 DEBUG: cargarDominios - Opciones después de cargar:`, selectElement.options.length);
                    console.log(`🎯 DEBUG: cargarDominios - HTML después de cargar:`, selectElement.innerHTML);
                }
                
                dominiosCargados++;
            } else {
                console.warn(`⚠️ DEBUG: cargarDominios - Elemento no encontrado: ${dominio.elementId}`);
                dominiosNoEncontrados++;
            }
        }

        console.log(`✅ DEBUG: cargarDominios - Completado. ${dominiosCargados} dominios cargados, ${dominiosNoEncontrados} elementos no encontrados`);
    } catch (error) {
        console.error('❌ DEBUG: cargarDominios - Error cargando dominios:', error);
    }
}

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
        
        // Log específico para actividadUnidadGestion
        if (elementId === 'actividadUnidadGestion') {
            console.log(`🎯 DEBUG: loadValoresDominio - PROCESANDO actividadUnidadGestion`);
            console.log(`🎯 DEBUG: loadValoresDominio - Elemento encontrado:`, element);
            console.log(`🎯 DEBUG: loadValoresDominio - Estado del elemento antes de cargar:`, {
                id: element.id,
                options: element.options.length,
                innerHTML: element.innerHTML.substring(0, 200)
            });
        }
        
        const response = await getValoresDominio(nombreDominio);
        console.log('📊 DEBUG: loadValoresDominio - Respuesta obtenida para', nombreDominio + ':', response);
        
        // Extraer los valores del array dentro de la respuesta
        const valores = response.valores || response;
        console.log('📊 DEBUG: loadValoresDominio - Valores extraídos para', nombreDominio + ':', valores);
        
        // Log específico para actividadUnidadGestion
        if (elementId === 'actividadUnidadGestion') {
            console.log(`🎯 DEBUG: loadValoresDominio - Valores obtenidos para actividadUnidadGestion:`, valores);
        }
        
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
            // Usar las propiedades correctas con mayúsculas
            option.value = valor.Valor || valor.valor || valor.value || valor.Value;
            option.textContent = valor.Valor || valor.valor || valor.value || valor.Value;
            element.appendChild(option);
        });
        
        // Log específico para actividadUnidadGestion después de llenar
        if (elementId === 'actividadUnidadGestion') {
            console.log(`🎯 DEBUG: loadValoresDominio - DESPUÉS de llenar actividadUnidadGestion`);
            console.log(`🎯 DEBUG: loadValoresDominio - Opciones después de llenar:`, element.options.length);
            console.log(`🎯 DEBUG: loadValoresDominio - HTML después de llenar:`, element.innerHTML);
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
        console.log('🚀 DEBUG: cargarActividadParaEdicion - URL:', `http://localhost:5001/api/actividades/${id}`);
        
        // Llamar al endpoint para obtener la actividad
        const response = await fetch(`http://localhost:5001/api/actividades/${id}`);
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
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - URL:', `http://localhost:5001/api/actividades/${id}`);
        
        // Establecer bandera para evitar que llenarFormularioConActividad cargue dominios
        window.cargandoSinDominios = true;
        
        // Llamar al endpoint para obtener la actividad
        const response = await fetch(`http://localhost:5001/api/actividades/${id}`);
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Response status:', response.status);
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const actividad = await response.json();
        console.log('✅ DEBUG: cargarActividadParaEdicionSinDominios - Actividad cargada:', actividad);
        
        // PRIMERO: Esperar a que el DOM esté completamente cargado
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
        await cargarDominios();
        
        // TERCERO: Establecer valores en los dropdowns (ahora que tienen opciones)
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Estableciendo valores en dropdowns...');
        establecerValoresDropdowns(actividad);
        
        // CUARTO: Llenar el formulario con los datos (DESPUÉS de establecer valores en dropdowns)
        llenarFormularioConActividad(actividad);
        
        // Cargar datos adicionales (entidades, importes, participantes, subactividades) SIN dominios
        console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Cargando datos adicionales sin dominios...');
        await cargarDatosAdicionalesSinDominios(actividad.Id);
        
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
    console.log('🚀 DEBUG: llenarFormularioConActividad - cargandoSinDominios:', window.cargandoSinDominios);
    
    // Campos básicos - Usar camelCase como devuelve la API
    console.log('🔍 DEBUG: llenarFormularioConActividad - Título recibido:', actividad.titulo);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Código recibido:', actividad.codigo);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Año académico recibido:', actividad.anioAcademico);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Descripción recibida:', actividad.descripcion);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Lugar recibido:', actividad.lugar);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Condiciones económicas recibidas:', actividad.condicionesEconomicas);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Línea estratégica recibida:', actividad.lineaEstrategica);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Objetivo estratégico recibido:', actividad.objetivoEstrategico);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Código relacionado recibido:', actividad.codigoRelacionado);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Fecha actividad recibida:', actividad.fechaActividad);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Persona solicitante recibida:', actividad.personaSolicitante);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Coordinador recibido:', actividad.coordinador);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Jefe unidad gestora recibido:', actividad.jefeUnidadGestora);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Gestor actividad recibido:', actividad.gestorActividad);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Facultad destinataria recibida:', actividad.facultadDestinataria);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Departamento destinatario recibido:', actividad.departamentoDestinatario);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Centro unidad UB destinataria recibido:', actividad.centroUnidadUBDestinataria);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Otros centros recibidos:', actividad.otrosCentrosInstituciones);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Plazas totales recibidas:', actividad.plazasTotales);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Horas totales recibidas:', actividad.horasTotales);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Centro trabajo requerido recibido:', actividad.centroTrabajoRequerido);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Modalidad gestión recibida:', actividad.modalidadGestion);
    console.log('🔍 DEBUG: llenarFormularioConActividad - Actividad pago recibida:', actividad.actividadPago);
    
    if (document.getElementById('actividadTitulo')) {
        document.getElementById('actividadTitulo').value = actividad.titulo || '';
        console.log('✅ DEBUG: llenarFormularioConActividad - Título establecido en:', document.getElementById('actividadTitulo').value);
    } else {
        console.log('❌ DEBUG: llenarFormularioConActividad - Elemento actividadTitulo no encontrado');
    }
    if (document.getElementById('actividadCodigo')) {
        document.getElementById('actividadCodigo').value = actividad.codigo || '';
    }
    if (document.getElementById('actividadAnioAcademico')) {
        document.getElementById('actividadAnioAcademico').value = actividad.anioAcademico || '';
    }
    if (document.getElementById('actividadUnidadGestion')) {
        document.getElementById('actividadUnidadGestion').value = actividad.unidadGestionId || '';
    }
    
    // Campos adicionales básicos
    if (document.getElementById('condicionesEconomicas')) {
        document.getElementById('condicionesEconomicas').value = actividad.condicionesEconomicas || '';
    }
    if (document.getElementById('lineaEstrategica')) {
        document.getElementById('lineaEstrategica').value = actividad.lineaEstrategica || '';
    }
    if (document.getElementById('objetivoEstrategico')) {
        document.getElementById('objetivoEstrategico').value = actividad.objetivoEstrategico || '';
    }
    if (document.getElementById('codigoRelacionado')) {
        document.getElementById('codigoRelacionado').value = actividad.codigoRelacionado || '';
    }
    if (document.getElementById('fechaActividad')) {
        document.getElementById('fechaActividad').value = actividad.fechaActividad ? actividad.fechaActividad.split('T')[0] : '';
    }
    if (document.getElementById('motivoCierre')) {
        document.getElementById('motivoCierre').value = actividad.motivoCierre || '';
    }
    if (document.getElementById('personaSolicitante')) {
        document.getElementById('personaSolicitante').value = actividad.personaSolicitante || '';
    }
    if (document.getElementById('coordinador')) {
        document.getElementById('coordinador').value = actividad.coordinador || '';
    }
    if (document.getElementById('jefeUnidadGestora')) {
        document.getElementById('jefeUnidadGestora').value = actividad.jefeUnidadGestora || '';
    }
    if (document.getElementById('gestorActividad')) {
        document.getElementById('gestorActividad').value = actividad.gestorActividad || '';
    }
    if (document.getElementById('facultadDestinataria')) {
        document.getElementById('facultadDestinataria').value = actividad.facultadDestinataria || '';
    }
    if (document.getElementById('departamentoDestinatario')) {
        document.getElementById('departamentoDestinatario').value = actividad.departamentoDestinatario || '';
    }
    if (document.getElementById('centroUnidadUBDestinataria')) {
        document.getElementById('centroUnidadUBDestinataria').value = actividad.centroUnidadUBDestinataria || '';
    }
    if (document.getElementById('otrosCentrosInstituciones')) {
        document.getElementById('otrosCentrosInstituciones').value = actividad.otrosCentrosInstituciones || '';
    }
    if (document.getElementById('plazasTotales')) {
        document.getElementById('plazasTotales').value = actividad.plazasTotales || '';
    }
    if (document.getElementById('horasTotales')) {
        document.getElementById('horasTotales').value = actividad.horasTotales || '';
    }
    if (document.getElementById('centroTrabajoRequerido')) {
        document.getElementById('centroTrabajoRequerido').value = actividad.centroTrabajoRequerido || '';
    }
    // Solo proteger los dropdowns específicos, NO los campos de texto
    if (!window.cargandoSinDominios) {
        if (document.getElementById('modalidadGestion')) {
            document.getElementById('modalidadGestion').value = actividad.modalidadGestion || '';
        }
    }
    
    if (document.getElementById('fechaInicioImparticion')) {
        document.getElementById('fechaInicioImparticion').value = actividad.fechaInicioImparticion ? actividad.fechaInicioImparticion.split('T')[0] : '';
    }
    if (document.getElementById('fechaFinImparticion')) {
        document.getElementById('fechaFinImparticion').value = actividad.fechaFinImparticion ? actividad.fechaFinImparticion.split('T')[0] : '';
    }
    if (document.getElementById('actividadPago')) {
        document.getElementById('actividadPago').checked = actividad.actividadPago || false;
    }
    
    // Campos de fechas
    if (document.getElementById('fechaInicio')) {
        document.getElementById('fechaInicio').value = actividad.fechaInicio ? actividad.fechaInicio.split('T')[0] : '';
    }
    if (document.getElementById('fechaFin')) {
        document.getElementById('fechaFin').value = actividad.fechaFin ? actividad.fechaFin.split('T')[0] : '';
    }
    if (document.getElementById('lugar')) {
        document.getElementById('lugar').value = actividad.lugar || '';
    }
    
    // Campos adicionales que faltan
    if (document.getElementById('descripcion')) {
        document.getElementById('descripcion').value = actividad.descripcion || '';
    }
    if (document.getElementById('estado')) {
        document.getElementById('estado').value = actividad.estadoId || '';
    }
    
    // Campos adicionales - Solo proteger los campos problemáticos específicos
    // Solo proteger los dropdowns específicos, NO los campos de texto
    if (!window.cargandoSinDominios) {
        if (document.getElementById('tipoActividad')) {
            document.getElementById('tipoActividad').value = actividad.tipoActividad || '';
        }
    }
    if (document.getElementById('condicionesEconomicas')) {
        document.getElementById('condicionesEconomicas').value = actividad.condicionesEconomicas || '';
    }
    // NO establecer valores de dropdowns problemáticos si se llama desde cargarActividadParaEdicionSinDominios
    if (!window.cargandoSinDominios) {
        if (document.getElementById('lineaEstrategica')) {
            document.getElementById('lineaEstrategica').value = actividad.LineaEstrategica || '';
        }
        if (document.getElementById('objetivoEstrategico')) {
            document.getElementById('objetivoEstrategico').value = actividad.ObjetivoEstrategico || '';
        }
    }
    if (document.getElementById('codigoRelacionado')) {
        document.getElementById('codigoRelacionado').value = actividad.codigoRelacionado || '';
    }
    if (document.getElementById('actividadReservada')) {
        document.getElementById('actividadReservada').value = actividad.actividadReservada ? 'PDI' : '';
    }
    if (document.getElementById('fechaActividad')) {
        document.getElementById('fechaActividad').value = actividad.fechaActividad ? actividad.fechaActividad.split('T')[0] : '';
    }
    if (document.getElementById('motivoCierre')) {
        document.getElementById('motivoCierre').value = actividad.motivoCierre || '';
    }
    if (document.getElementById('personaSolicitante')) {
        document.getElementById('personaSolicitante').value = actividad.personaSolicitante || '';
    }
    if (document.getElementById('coordinador')) {
        document.getElementById('coordinador').value = actividad.coordinador || '';
    }
    if (document.getElementById('jefeUnidadGestora')) {
        document.getElementById('jefeUnidadGestora').value = actividad.jefeUnidadGestora || '';
    }
    if (document.getElementById('gestorActividad')) {
        document.getElementById('gestorActividad').value = actividad.gestorActividad || '';
    }
    if (document.getElementById('facultadDestinataria')) {
        document.getElementById('facultadDestinataria').value = actividad.facultadDestinataria || '';
    }
    if (document.getElementById('departamentoDestinatario')) {
        document.getElementById('departamentoDestinatario').value = actividad.departamentoDestinatario || '';
    }
    // NO establecer valores de dropdowns si se llama desde cargarActividadParaEdicionSinDominios
    if (!window.cargandoSinDominios) {
        if (document.getElementById('centroUnidadUBDestinataria')) {
            document.getElementById('centroUnidadUBDestinataria').value = actividad.CentroUnidadUBDestinataria || '';
        }
    }
    if (document.getElementById('otrosCentrosInstituciones')) {
        document.getElementById('otrosCentrosInstituciones').value = actividad.otrosCentrosInstituciones || '';
    }
    if (document.getElementById('plazasTotales')) {
        document.getElementById('plazasTotales').value = actividad.plazasTotales || '';
    }
    if (document.getElementById('horasTotales')) {
        document.getElementById('horasTotales').value = actividad.horasTotales || '';
    }
    // Solo proteger los dropdowns específicos, NO los campos de texto
    if (!window.cargandoSinDominios) {
        if (document.getElementById('centroTrabajoRequerido')) {
            document.getElementById('centroTrabajoRequerido').value = actividad.centroTrabajoRequerido || '';
        }
        if (document.getElementById('modalidadGestion')) {
            document.getElementById('modalidadGestion').value = actividad.modalidadGestion || '';
        }
    }
    
    // Campos de fechas - SIEMPRE llenar
    if (document.getElementById('fechaInicioImparticion')) {
        document.getElementById('fechaInicioImparticion').value = actividad.fechaInicioImparticion ? actividad.fechaInicioImparticion.split('T')[0] : '';
    }
    if (document.getElementById('fechaFinImparticion')) {
        document.getElementById('fechaFinImparticion').value = actividad.fechaFinImparticion ? actividad.fechaFinImparticion.split('T')[0] : '';
    }
    if (document.getElementById('actividadPago')) {
        document.getElementById('actividadPago').checked = actividad.actividadPago || false;
    }
    
    // Campos específicos por unidad de gestión - SIEMPRE llenar
    if (document.getElementById('coordinadorCentreUnitat')) {
        document.getElementById('coordinadorCentreUnitat').value = actividad.coordinadorCentreUnitat || '';
    }
    if (document.getElementById('centreTreballeAlumne')) {
        document.getElementById('centreTreballeAlumne').value = actividad.centreTreballeAlumne || '';
    }
    if (document.getElementById('creditosTotalesCRAI')) {
        document.getElementById('creditosTotalesCRAI').value = actividad.creditosTotalesCRAI || '';
    }
    if (document.getElementById('creditosTotalesSAE')) {
        document.getElementById('creditosTotalesSAE').value = actividad.creditosTotalesSAE || '';
    }
    if (document.getElementById('creditosMinimosSAE')) {
        document.getElementById('creditosMinimosSAE').value = actividad.creditosMinimosSAE || '';
    }
    if (document.getElementById('creditosMaximosSAE')) {
        document.getElementById('creditosMaximosSAE').value = actividad.creditosMaximosSAE || '';
    }
    
    // Campos de inscripción - SIEMPRE llenar
    if (document.getElementById('insc_inicio')) {
        document.getElementById('insc_inicio').value = actividad.inscripcionInicio ? actividad.inscripcionInicio.split('T')[0] : '';
    }
    if (document.getElementById('insc_fin')) {
        document.getElementById('insc_fin').value = actividad.inscripcionFin ? actividad.inscripcionFin.split('T')[0] : '';
    }
    if (document.getElementById('insc_plazas')) {
        document.getElementById('insc_plazas').value = actividad.inscripcionPlazas || '';
    }
    if (document.getElementById('insc_lista_espera')) {
        document.getElementById('insc_lista_espera').checked = actividad.inscripcionListaEspera || false;
    }
    if (document.getElementById('insc_modalidad')) {
        document.getElementById('insc_modalidad').value = actividad.inscripcionModalidad || '';
    }
    if (document.getElementById('insc_requisitos_es')) {
        document.getElementById('insc_requisitos_es').value = actividad.inscripcionRequisitosES || '';
    }
    if (document.getElementById('insc_requisitos_ca')) {
        document.getElementById('insc_requisitos_ca').value = actividad.inscripcionRequisitosCA || '';
    }
    if (document.getElementById('insc_requisitos_en')) {
        document.getElementById('insc_requisitos_en').value = actividad.inscripcionRequisitosEN || '';
    }
    
    // Campos de programa - SIEMPRE llenar
    if (document.getElementById('programa_descripcion_es')) {
        document.getElementById('programa_descripcion_es').value = actividad.programaDescripcionES || '';
    }
    if (document.getElementById('programa_descripcion_ca')) {
        document.getElementById('programa_descripcion_ca').value = actividad.programaDescripcionCA || '';
    }
    if (document.getElementById('programa_descripcion_en')) {
        document.getElementById('programa_descripcion_en').value = actividad.programaDescripcionEN || '';
    }
    
    // Campos de programa adicionales - SIEMPRE llenar
    if (document.getElementById('programa_contenidos_es')) {
        document.getElementById('programa_contenidos_es').value = actividad.programaContenidosES || '';
    }
    if (document.getElementById('programa_contenidos_ca')) {
        document.getElementById('programa_contenidos_ca').value = actividad.programaContenidosCA || '';
    }
    if (document.getElementById('programa_contenidos_en')) {
        document.getElementById('programa_contenidos_en').value = actividad.programaContenidosEN || '';
    }
    if (document.getElementById('programa_objetivos_es')) {
        document.getElementById('programa_objetivos_es').value = actividad.programaObjetivosES || '';
    }
    if (document.getElementById('programa_objetivos_ca')) {
        document.getElementById('programa_objetivos_ca').value = actividad.programaObjetivosCA || '';
    }
    if (document.getElementById('programa_objetivos_en')) {
        document.getElementById('programa_objetivos_en').value = actividad.programaObjetivosEN || '';
    }
    if (document.getElementById('programa_duracion')) {
        document.getElementById('programa_duracion').value = actividad.programaDuracion || '';
    }
    if (document.getElementById('programa_inicio')) {
        document.getElementById('programa_inicio').value = actividad.programaInicio ? actividad.programaInicio.split('T')[0] : '';
    }
    if (document.getElementById('programa_fin')) {
        document.getElementById('programa_fin').value = actividad.programaFin ? actividad.programaFin.split('T')[0] : '';
    }
    
    // Campos SAE - Solo proteger los dropdowns específicos, NO los campos de texto
    if (!window.cargandoSinDominios) {
        if (document.getElementById('tipusEstudiSAE')) {
            document.getElementById('tipusEstudiSAE').value = actividad.tipusEstudiSAE || '';
        }
        if (document.getElementById('categoriaSAE')) {
            document.getElementById('categoriaSAE').value = actividad.categoriaSAE || '';
        }
    }
    
    // Campo de texto - SIEMPRE llenar
    if (document.getElementById('competenciesSAE')) {
        document.getElementById('competenciesSAE').value = actividad.competenciesSAE || '';
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
    
    // Solo cargar datos adicionales y establecer valores si NO se llama desde cargarActividadParaEdicionSinDominios
    if (!window.cargandoSinDominios) {
        // Cargar datos adicionales (entidades, importes, participantes, subactividades)
        cargarDatosAdicionales(actividad.Id);
        
        // Esperar a que los dominios se carguen y luego establecer los valores de los dropdowns
        setTimeout(() => {
            establecerValoresDropdowns(actividad);
            // Verificar campos DESPUÉS de establecer dropdowns
            setTimeout(() => {
                verificarCamposLlenados(actividad);
            }, 500);
        }, 1000);
    } else {
        // Si se llama desde cargarActividadParaEdicionSinDominios, verificar después de establecer dropdowns
        setTimeout(() => {
            verificarCamposLlenados(actividad);
        }, 1000);
    }
}

// Función para establecer valores en dropdowns después de que se carguen los dominios
function establecerValoresDropdowns(actividad) {
    console.log('🔧 DEBUG: establecerValoresDropdowns - Estableciendo valores en dropdowns...');
    console.log('🔧 DEBUG: establecerValoresDropdowns - Actividad recibida:', actividad);
    console.log('🔧 DEBUG: establecerValoresDropdowns - CentroUnidadUBDestinataria:', actividad.centroUnidadUBDestinataria);
    console.log('🔧 DEBUG: establecerValoresDropdowns - UnidadGestionId:', actividad.unidadGestionId);
    console.log('🔧 DEBUG: establecerValoresDropdowns - TipusEstudiSAE:', actividad.tipusEstudiSAE);
    console.log('🔧 DEBUG: establecerValoresDropdowns - CategoriaSAE:', actividad.categoriaSAE);
    console.log('🔧 DEBUG: establecerValoresDropdowns - CentroTrabajoRequerido:', actividad.centroTrabajoRequerido);
    
    // Establecer valores en dropdowns
    if (document.getElementById('actividadUnidadGestion')) {
        const select = document.getElementById('actividadUnidadGestion');
        const valor = actividad.unidadGestionId;
        console.log('🔧 DEBUG: establecerValoresDropdowns - actividadUnidadGestion, valor:', valor);
        
        // Para UNIDADES_GESTION, mapear el ID al valor correspondiente
        let valorABuscar = '';
        if (valor === 1) {
            valorABuscar = 'IDP';
        } else if (valor === 2) {
            valorABuscar = 'CRAI';
        } else if (valor === 3) {
            valorABuscar = 'SAE';
        }
        
        if (valorABuscar) {
            for (let option of select.options) {
                if (option.value === valorABuscar) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - actividadUnidadGestion establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('lineaEstrategica')) {
        const select = document.getElementById('lineaEstrategica');
        const valor = actividad.lineaEstrategica;
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
        const valor = actividad.objetivoEstrategico;
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
        const valor = actividad.centroUnidadUBDestinataria;
        console.log('🔧 DEBUG: establecerValoresDropdowns - centroUnidadUBDestinataria, valor:', valor);
        console.log('🔧 DEBUG: establecerValoresDropdowns - centroUnidadUBDestinataria, opciones disponibles:', select.options.length);
        
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
        const valor = actividad.centroTrabajoRequerido;
        console.log('🔧 DEBUG: establecerValoresDropdowns - centroTrabajoRequerido, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - centroTrabajoRequerido establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('tipusEstudiSAE')) {
        const select = document.getElementById('tipusEstudiSAE');
        const valor = actividad.tipusEstudiSAE;
        console.log('🔧 DEBUG: establecerValoresDropdowns - tipusEstudiSAE, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
                    option.selected = true;
                    console.log('✅ DEBUG: establecerValoresDropdowns - tipusEstudiSAE establecido:', option.text);
                    break;
                }
            }
        }
    }
    
    if (document.getElementById('categoriaSAE')) {
        const select = document.getElementById('categoriaSAE');
        const valor = actividad.categoriaSAE;
        console.log('🔧 DEBUG: establecerValoresDropdowns - categoriaSAE, valor:', valor);
        if (valor) {
            for (let option of select.options) {
                if (option.value === valor || option.text === valor) {
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
            const valor = elemento.value;
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
        const entidadesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/entidades`);
        if (entidadesResponse.ok) {
            const entidades = await entidadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Entidades cargadas:', entidades);
            llenarEntidadesOrganizadoras(entidades);
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/importes`);
        if (importesResponse.ok) {
            const importes = await importesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Importes cargados:', importes);
            llenarImportesDescuentos(importes);
        }
        
        // Cargar participantes
        const participantesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionales - Participantes cargados:', participantes);
            llenarParticipantes(participantes);
        }
        
        // Cargar subactividades
        const subactividadesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/subactividades`);
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
        const entidadesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/entidades`);
        if (entidadesResponse.ok) {
            const entidades = await entidadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Entidades cargadas:', entidades);
            llenarEntidadesOrganizadoras(entidades);
        }
        
        // Cargar importes y descuentos
        const importesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/importes`);
        if (importesResponse.ok) {
            const importes = await importesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Importes cargados:', importes);
            llenarImportesDescuentos(importes);
        }
        
        // Cargar participantes
        const participantesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Participantes cargados:', participantes);
            llenarParticipantes(participantes);
        }
        
        // Cargar subactividades
        const subactividadesResponse = await fetch(`http://localhost:5001/api/actividades/${actividadId}/subactividades`);
        if (subactividadesResponse.ok) {
            const subactividades = await subactividadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Subactividades cargadas:', subactividades);
            llenarSubactividades(subactividades);
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
            document.getElementById('org_principal').value = entidad.Nombre || '';
        }
        if (document.getElementById('org_nif')) {
            document.getElementById('org_nif').value = entidad.NifCif || '';
        }
        if (document.getElementById('org_web')) {
            document.getElementById('org_web').value = entidad.Web || '';
        }
        if (document.getElementById('org_contacto')) {
            document.getElementById('org_contacto').value = entidad.PersonaContacto || '';
        }
        if (document.getElementById('org_email')) {
            document.getElementById('org_email').value = entidad.Email || '';
        }
        if (document.getElementById('org_tel')) {
            document.getElementById('org_tel').value = entidad.Telefono || '';
        }
    }
}

// Función para llenar importes y descuentos
function llenarImportesDescuentos(importes) {
    if (importes && importes.length > 0) {
        const importe = importes[0]; // Tomar el primer importe
        if (document.getElementById('imp_base')) {
            document.getElementById('imp_base').value = importe.ImporteBase || '';
        }
        if (document.getElementById('imp_tipo')) {
            document.getElementById('imp_tipo').value = importe.TipoImpuesto || '';
        }
        if (document.getElementById('imp_descuento_pct')) {
            document.getElementById('imp_descuento_pct').value = importe.PorcentajeDescuento || '';
        }
        if (document.getElementById('imp_codigo')) {
            document.getElementById('imp_codigo').value = importe.CodigoPromocional || '';
        }
        if (document.getElementById('imp_condiciones_es')) {
            document.getElementById('imp_condiciones_es').value = importe.CondicionesES || '';
        }
        if (document.getElementById('imp_condiciones_ca')) {
            document.getElementById('imp_condiciones_ca').value = importe.CondicionesCA || '';
        }
        if (document.getElementById('imp_condiciones_en')) {
            document.getElementById('imp_condiciones_en').value = importe.CondicionesEN || '';
        }
    }
}

// Función para llenar participantes
function llenarParticipantes(participantes) {
    // TODO: Implementar llenado de participantes
    console.log('📝 DEBUG: llenarParticipantes - Función pendiente de implementar');
}

// Función para llenar subactividades
function llenarSubactividades(subactividades) {
    // TODO: Implementar llenado de subactividades
    console.log('📝 DEBUG: llenarSubactividades - Función pendiente de implementar');
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
