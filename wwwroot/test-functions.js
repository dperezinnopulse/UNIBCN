// Test simple de funciones
console.log('🔍 TEST FUNCTIONS - Iniciando...');

// Definir funciones simples
function llenarParticipantes(participantes) {
    console.log('✅ llenarParticipantes llamada con:', participantes);
}

function llenarSubactividades(subactividades) {
    console.log('✅ llenarSubactividades llamada con:', subactividades);
}

function agregarParticipante() {
    console.log('✅ agregarParticipante llamada');
}

function agregarSubactividad() {
    console.log('✅ agregarSubactividad llamada');
}

function cargarActividadParaEdicionSinDominios(id) {
    console.log('✅ cargarActividadParaEdicionSinDominios llamada con ID:', id);
}

function cargarDatosAdicionalesSinDominios(actividadId) {
    console.log('✅ cargarDatosAdicionalesSinDominios llamada con ID:', actividadId);
}

// Exportar funciones al contexto global
window.llenarParticipantes = llenarParticipantes;
window.llenarSubactividades = llenarSubactividades;
window.agregarParticipante = agregarParticipante;
window.agregarSubactividad = agregarSubactividad;
window.cargarActividadParaEdicionSinDominios = cargarActividadParaEdicionSinDominios;
window.cargarDatosAdicionalesSinDominios = cargarDatosAdicionalesSinDominios;

console.log('🔍 TEST FUNCTIONS - Funciones exportadas al contexto global');
