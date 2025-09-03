// Versión: scripts-clean.js?v=1.0.1
// Archivo JavaScript limpio para editar-actividad.html

const API_BASE_URL = 'https://localhost:7001';

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
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3">
                                    <strong>Título:</strong> ${subactividad.titulo || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Modalidad:</strong> ${subactividad.modalidad || 'N/A'}
                                </div>
                                <div class="col-md-3">
                                    <strong>Idioma:</strong> ${subactividad.idioma || 'N/A'}
                                </div>
                                <div class="col-md-3 text-end">
                                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editarSubactividad(${subactividad.id})">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarSubactividad(${subactividad.id})">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                subactividadesContainer.insertAdjacentHTML('beforeend', subactividadHTML);
            });
            
            console.log('✅ DEBUG: llenarSubactividades - Subactividades mostradas correctamente');
        } else {
            console.log('⚠️ DEBUG: llenarSubactividades - No se pudo encontrar el contenedor');
        }
    } else {
        console.log('⚠️ DEBUG: llenarSubactividades - No hay subactividades para mostrar');
    }
}

// Función para agregar participante
function agregarParticipante() {
    console.log('📝 DEBUG: agregarParticipante - Abriendo modal para agregar participante');
    
    // Crear modal dinámicamente
    const modalHTML = `
        <div class="modal fade" id="modalAgregarParticipante" tabindex="-1" aria-labelledby="modalAgregarParticipanteLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalAgregarParticipanteLabel">Agregar Participante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                    <option value="">Seleccionar...</option>
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
    
    // Agregar modal al body si no existe
    if (!document.getElementById('modalAgregarParticipante')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgregarParticipante'));
    modal.show();
}

// Función para agregar subactividad
function agregarSubactividad() {
    console.log('📝 DEBUG: agregarSubactividad - Abriendo modal para agregar subactividad');
    
    // Crear modal dinámicamente
    const modalHTML = `
        <div class="modal fade" id="modalAgregarSubactividad" tabindex="-1" aria-labelledby="modalAgregarSubactividadLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalAgregarSubactividadLabel">Agregar Subactividad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                            <option value="">Seleccionar...</option>
                                            <option value="Presencial">Presencial</option>
                                            <option value="Virtual">Virtual</option>
                                            <option value="Híbrida">Híbrida</option>
                                            <option value="Semi-presencial">Semi-presencial</option>
                                        </select>
                                    </div>
                                </div>
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
                                            <option value="">Seleccionar...</option>
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
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoFechaInicio" class="form-label">Fecha Inicio</label>
                                        <input type="date" class="form-control" id="nuevoFechaInicio" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoFechaFin" class="form-label">Fecha Fin</label>
                                        <input type="date" class="form-control" id="nuevoFechaFin" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoHoraInicio" class="form-label">Hora Inicio</label>
                                        <input type="time" class="form-control" id="nuevoHoraInicio" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="nuevoHoraFin" class="form-label">Hora Fin</label>
                                        <input type="time" class="form-control" id="nuevoHoraFin" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoDuracion" class="form-label">Duración (horas)</label>
                                        <input type="number" class="form-control" id="nuevoDuracion" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoAforo" class="form-label">Aforo</label>
                                        <input type="number" class="form-control" id="nuevoAforo" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="nuevoUbicacion" class="form-label">Ubicación</label>
                                        <input type="text" class="form-control" id="nuevoUbicacion" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoDescripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="nuevoDescripcion" rows="3" required></textarea>
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
    
    // Agregar modal al body si no existe
    if (!document.getElementById('modalAgregarSubactividad')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalAgregarSubactividad'));
    modal.show();
}

// Función para editar participante
function editarParticipante(participanteId) {
    console.log('📝 DEBUG: editarParticipante - Editando participante ID:', participanteId);
    
    const participante = window.participantesCargados.find(p => p.id === participanteId);
    if (!participante) {
        alert('Participante no encontrado');
        return;
    }
    
    // Crear modal dinámicamente
    const modalHTML = `
        <div class="modal fade" id="modalEditarParticipante" tabindex="-1" aria-labelledby="modalEditarParticipanteLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalEditarParticipanteLabel">Editar Participante</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarParticipante">
                            <input type="hidden" id="editParticipanteId" value="${participante.id}">
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
                                    <option value="">Seleccionar...</option>
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
                        <button type="button" class="btn btn-primary" onclick="guardarParticipante(${participante.id})">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body si no existe
    if (!document.getElementById('modalEditarParticipante')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } else {
        // Actualizar contenido del modal existente
        document.getElementById('modalEditarParticipante').outerHTML = modalHTML;
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarParticipante'));
    modal.show();
}

// Función para editar subactividad
function editarSubactividad(subactividadId) {
    console.log('📝 DEBUG: editarSubactividad - Editando subactividad ID:', subactividadId);
    
    const subactividad = window.subactividadesCargadas.find(s => s.id === subactividadId);
    if (!subactividad) {
        alert('Subactividad no encontrada');
        return;
    }
    
    // Crear modal dinámicamente
    const modalHTML = `
        <div class="modal fade" id="modalEditarSubactividad" tabindex="-1" aria-labelledby="modalEditarSubactividadLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalEditarSubactividadLabel">Editar Subactividad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarSubactividad">
                            <input type="hidden" id="editSubactividadId" value="${subactividad.id}">
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
                                            <option value="">Seleccionar...</option>
                                            <option value="Presencial" ${subactividad.modalidad === 'Presencial' ? 'selected' : ''}>Presencial</option>
                                            <option value="Virtual" ${subactividad.modalidad === 'Virtual' ? 'selected' : ''}>Virtual</option>
                                            <option value="Híbrida" ${subactividad.modalidad === 'Híbrida' ? 'selected' : ''}>Híbrida</option>
                                            <option value="Semi-presencial" ${subactividad.modalidad === 'Semi-presencial' ? 'selected' : ''}>Semi-presencial</option>
                                        </select>
                                    </div>
                                </div>
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
                                            <option value="">Seleccionar...</option>
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
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editFechaInicio" class="form-label">Fecha Inicio</label>
                                        <input type="date" class="form-control" id="editFechaInicio" value="${subactividad.fechaInicio || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editFechaFin" class="form-label">Fecha Fin</label>
                                        <input type="date" class="form-control" id="editFechaFin" value="${subactividad.fechaFin || ''}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editHoraInicio" class="form-label">Hora Inicio</label>
                                        <input type="time" class="form-control" id="editHoraInicio" value="${subactividad.horaInicio || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="editHoraFin" class="form-label">Hora Fin</label>
                                        <input type="time" class="form-control" id="editHoraFin" value="${subactividad.horaFin || ''}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editDuracion" class="form-label">Duración (horas)</label>
                                        <input type="number" class="form-control" id="editDuracion" value="${subactividad.duracion || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editAforo" class="form-label">Aforo</label>
                                        <input type="number" class="form-control" id="editAforo" value="${subactividad.aforo || ''}" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="editUbicacion" class="form-label">Ubicación</label>
                                        <input type="text" class="form-control" id="editUbicacion" value="${subactividad.ubicacion || ''}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="editDescripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="editDescripcion" rows="3" required>${subactividad.descripcion || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarSubactividad(${subactividad.id})">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body si no existe
    if (!document.getElementById('modalEditarSubactividad')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } else {
        // Actualizar contenido del modal existente
        document.getElementById('modalEditarSubactividad').outerHTML = modalHTML;
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarSubactividad'));
    modal.show();
}

// Función para eliminar participante
function eliminarParticipante(participanteId) {
    console.log('📝 DEBUG: eliminarParticipante - Eliminando participante ID:', participanteId);
    
    if (confirm('¿Estás seguro de que quieres eliminar este participante?')) {
        // Aquí iría la lógica para eliminar el participante
        console.log('Eliminando participante:', participanteId);
        alert('Participante eliminado correctamente');
    }
}

// Función para eliminar subactividad
function eliminarSubactividad(subactividadId) {
    console.log('📝 DEBUG: eliminarSubactividad - Eliminando subactividad ID:', subactividadId);
    
    if (confirm('¿Estás seguro de que quieres eliminar esta subactividad?')) {
        // Aquí iría la lógica para eliminar la subactividad
        console.log('Eliminando subactividad:', subactividadId);
        alert('Subactividad eliminada correctamente');
    }
}

// Función para guardar participante
function guardarParticipante(participanteId) {
    console.log('📝 DEBUG: guardarParticipante - Guardando participante ID:', participanteId);
    
    const nombre = document.getElementById('editNombre').value;
    const email = document.getElementById('editEmail').value;
    const rol = document.getElementById('editRol').value;
    
    if (!nombre || !email || !rol) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    // Aquí iría la lógica para guardar el participante
    console.log('Guardando participante:', { participanteId, nombre, email, rol });
    alert('Participante guardado correctamente');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarParticipante'));
    modal.hide();
}

// Función para guardar subactividad
function guardarSubactividad(subactividadId) {
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
    
    // Aquí iría la lógica para guardar la subactividad
    console.log('Guardando subactividad:', { subactividadId, titulo, descripcion, modalidad, docente, idioma, fechaInicio, fechaFin, duracion, horaInicio, horaFin, aforo, ubicacion });
    alert('Subactividad guardada correctamente');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarSubactividad'));
    modal.hide();
}

// Función para guardar nuevo participante
function guardarNuevoParticipante() {
    console.log('📝 DEBUG: guardarNuevoParticipante - Guardando nuevo participante');
    
    const nombre = document.getElementById('nuevoNombre').value;
    const email = document.getElementById('nuevoEmail').value;
    const rol = document.getElementById('nuevoRol').value;
    
    if (!nombre || !email || !rol) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    // Aquí iría la lógica para guardar el nuevo participante
    console.log('Guardando nuevo participante:', { nombre, email, rol });
    alert('Participante agregado correctamente');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarParticipante'));
    modal.hide();
}

// Función para guardar nueva subactividad
function guardarNuevaSubactividad() {
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
    
    // Aquí iría la lógica para guardar la nueva subactividad
    console.log('Guardando nueva subactividad:', { titulo, descripcion, modalidad, docente, idioma, fechaInicio, fechaFin, duracion, horaInicio, horaFin, aforo, ubicacion });
    alert('Subactividad agregada correctamente');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarSubactividad'));
    modal.hide();
}

// Función para cargar actividad para edición sin dominios
async function cargarActividadParaEdicionSinDominios(id) {
    console.log('🚀 DEBUG: cargarActividadParaEdicionSinDominios - Cargando actividad ID:', id);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/actividades/${id}`);
        if (response.ok) {
            const actividad = await response.json();
            console.log('✅ DEBUG: cargarActividadParaEdicionSinDominios - Actividad cargada:', actividad);
            
            // Aquí iría la lógica para llenar los campos del formulario
            // Por ahora solo cargamos los datos adicionales
            await cargarDatosAdicionalesSinDominios(id);
        } else {
            console.error('❌ DEBUG: cargarActividadParaEdicionSinDominios - Error al cargar actividad:', response.status);
        }
    } catch (error) {
        console.error('❌ DEBUG: cargarActividadParaEdicionSinDominios - Error:', error);
    }
}

// Función para cargar datos adicionales sin dominios
async function cargarDatosAdicionalesSinDominios(actividadId) {
    console.log('🚀 DEBUG: cargarDatosAdicionalesSinDominios - Cargando datos adicionales para actividad ID:', actividadId);
    
    try {
        // Cargar participantes
        const participantesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/participantes`);
        if (participantesResponse.ok) {
            const participantes = await participantesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Participantes cargados:', participantes);
            llenarParticipantes(participantes);
        } else {
            console.error('❌ DEBUG: cargarDatosAdicionalesSinDominios - Error al cargar participantes:', participantesResponse.status);
        }
        
        // Cargar subactividades
        const subactividadesResponse = await fetch(`${API_BASE_URL}/api/actividades/${actividadId}/subactividades`);
        if (subactividadesResponse.ok) {
            const subactividades = await subactividadesResponse.json();
            console.log('✅ DEBUG: cargarDatosAdicionalesSinDominios - Subactividades cargadas:', subactividades);
            llenarSubactividades(subactividades);
        } else {
            console.error('❌ DEBUG: cargarDatosAdicionalesSinDominios - Error al cargar subactividades:', subactividadesResponse.status);
        }
    } catch (error) {
        console.error('❌ DEBUG: cargarDatosAdicionalesSinDominios - Error:', error);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DEBUG: DOMContentLoaded - Inicializando...');
    
    // Verificar si estamos en la página de edición
    const urlParams = new URLSearchParams(window.location.search);
    const actividadId = urlParams.get('id');
    
    if (actividadId && window.location.pathname.includes('editar-actividad.html')) {
        console.log('🚀 DEBUG: DOMContentLoaded - Modo edición detectado, ID:', actividadId);
        // Establecer el ID en el campo oculto
        if (document.getElementById('actividadId')) {
            document.getElementById('actividadId').value = actividadId;
        }
        // Cargar los datos de la actividad
        cargarActividadParaEdicionSinDominios(actividadId);
    } else {
        console.log('🚀 DEBUG: DOMContentLoaded - No es modo edición o no hay ID');
    }
});

// Exportar funciones al contexto global
window.llenarParticipantes = llenarParticipantes;
window.llenarSubactividades = llenarSubactividades;
window.agregarParticipante = agregarParticipante;
window.agregarSubactividad = agregarSubactividad;
window.editarParticipante = editarParticipante;
window.editarSubactividad = editarSubactividad;
window.eliminarParticipante = eliminarParticipante;
window.eliminarSubactividad = eliminarSubactividad;
window.guardarParticipante = guardarParticipante;
window.guardarSubactividad = guardarSubactividad;
window.guardarNuevoParticipante = guardarNuevoParticipante;
window.guardarNuevaSubactividad = guardarNuevaSubactividad;
window.cargarActividadParaEdicionSinDominios = cargarActividadParaEdicionSinDominios;
window.cargarDatosAdicionalesSinDominios = cargarDatosAdicionalesSinDominios;

console.log('🔍 SCRIPTS CLEAN - Archivo cargado correctamente');
