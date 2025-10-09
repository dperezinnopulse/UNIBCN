/**
 * Funcionalidad para mostrar campos específicos por unidad gestora
 * y preseleccionar la unidad gestora del usuario
 */

(function() {
    'use strict';

    // Configuración de colores por unidad gestora
    const UG_COLORS = {
        'IDP': {
            background: '#fffbeb',
            border: '#f59e0b',
            borderLeft: '#f59e0b'
        },
        'CRAI': {
            background: '#eff6ff',
            border: '#3b82f6',
            borderLeft: '#3b82f6'
        },
        'SAE': {
            background: '#ecfdf5',
            border: '#10b981',
            borderLeft: '#10b981'
        }
    };

    // Mapeo de IDs de unidad gestora a códigos (valores del select)
    const UG_ID_TO_CODE = {
        35: 'IDP',
        36: 'CRAI', 
        37: 'SAE',
        // Mantener compatibilidad con IDs antiguos
        1: 'IDP',
        2: 'CRAI', 
        3: 'SAE'
    };

    // Mapeo de códigos a IDs de unidad gestora (valores del select)
    const UG_CODE_TO_ID = {
        'IDP': 35,
        'CRAI': 36,
        'SAE': 37
    };

    let currentUserUG = null;

    /**
     * Obtiene la unidad gestora del usuario actual
     */
    function getUserUnidadGestora() {
        try {
            // Intentar obtener del token JWT
            const token = localStorage.getItem('ub_token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const ugId = payload.ugId;
                if (ugId) {
                    return UG_ID_TO_CODE[ugId] || null;
                }
            }

            // Fallback: obtener del usuario almacenado
            const userData = localStorage.getItem('ub_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.ugId) {
                    return UG_ID_TO_CODE[user.ugId] || null;
                }
            }

            return null;
        } catch (error) {
            console.error('Error obteniendo unidad gestora del usuario:', error);
            return null;
        }
    }

    /**
     * Aplica estilos específicos a los campos según la unidad gestora
     */
    function applyUGStyles(ugCode) {
        if (!ugCode || !UG_COLORS[ugCode]) return;

        const colors = UG_COLORS[ugCode];
        
        // Aplicar estilos a todos los campos específicos de la UG
        const ugFields = document.querySelectorAll(`[data-ug="${ugCode}"]`);
        ugFields.forEach(field => {
            field.style.backgroundColor = colors.background;
            field.style.border = `1px solid ${colors.border}`;
            field.style.borderLeft = `6px solid ${colors.borderLeft}`;
            field.style.borderRadius = '10px';
            field.style.padding = '12px';
        });

        console.log(`✅ Estilos aplicados para ${ugCode}: ${ugFields.length} campos`);
    }

    /**
     * Muestra solo los campos específicos de la unidad gestora del usuario
     */
    function showUGSpecificFields(ugCode) {
        if (!ugCode) return;

        // Ocultar todos los campos específicos primero
        const allUGFields = document.querySelectorAll('[data-ug]');
        allUGFields.forEach(field => {
            // NO ocultar el campo estado informativo
            if (field.querySelector('#estadoActualBD')) {
                console.log('🔧 DEBUG: showUGSpecificFields - Preservando campo estado informativo');
                return; // Skip este campo
            }
            field.style.display = 'none';
        });

        // Mostrar solo los campos de la UG del usuario
        const userUGFields = document.querySelectorAll(`[data-ug="${ugCode}"]`);
        userUGFields.forEach(field => {
            field.style.display = 'block';
        });

        console.log(`✅ Campos mostrados para ${ugCode}: ${userUGFields.length} campos`);
    }

    /**
     * Preselecciona la unidad gestora del usuario y la hace no editable
     */
    function preselectUserUG(ugCode) {
        const ugSelect = document.getElementById('actividadUnidadGestion');
        if (!ugSelect) {
            console.warn('⚠️ Select de unidad gestora no encontrado');
            return;
        }

        // Función para intentar preseleccionar
        function tryPreselect() {
            const options = ugSelect.querySelectorAll('option');
            let selectedOption = null;

            console.log(`🔍 DEBUG: Buscando opción para unidad gestora: ${ugCode}`);
            console.log(`🔍 DEBUG: Opciones disponibles:`, Array.from(options).map(opt => ({ value: opt.value, text: opt.textContent })));

            options.forEach(option => {
                // Buscar por value, textContent exacto, o que contenga el código
                if (option.value === ugCode || 
                    option.textContent === ugCode || 
                    option.textContent.trim() === ugCode ||
                    option.textContent.includes(ugCode + ' -') ||
                    option.textContent.includes(ugCode + ' ')) {
                    selectedOption = option;
                }
            });

            if (selectedOption) {
                // Preseleccionar la opción
                selectedOption.selected = true;
                
                // Hacer el select no editable
                ugSelect.disabled = true;
                ugSelect.style.backgroundColor = '#f8f9fa';
                ugSelect.style.cursor = 'not-allowed';
                
                // Agregar un tooltip explicativo
                ugSelect.title = `Unidad gestora fija para tu perfil: ${ugCode}`;
                
                console.log(`✅ Unidad gestora preseleccionada: ${ugCode}`);
                return true;
            } else {
                console.warn(`⚠️ No se encontró opción para unidad gestora: ${ugCode}`);
                console.warn(`⚠️ Opciones disponibles:`, Array.from(options).map(opt => opt.textContent));
                return false;
            }
        }

        // Intentar inmediatamente
        if (!tryPreselect()) {
            // Si no funciona, esperar a que se carguen las opciones
            console.log(`⏳ Esperando a que se carguen las opciones del desplegable...`);
            setTimeout(() => {
                if (!tryPreselect()) {
                    // Segundo intento después de más tiempo
                    setTimeout(tryPreselect, 2000);
                }
            }, 1000);
        }
    }

    /**
     * Inicializa la funcionalidad de campos específicos por UG
     */
    function initializeUGSpecificFields() {
        try { perfStart('ug:init'); } catch {}
        console.log('🚀 Inicializando campos específicos por unidad gestora...');

        // Obtener la unidad gestora del usuario
        currentUserUG = getUserUnidadGestora();
        const user = (typeof Auth !== 'undefined') ? Auth.getUser() : {};
        const userRole = user?.rol;
        const isAdmin = (userRole ?? '').toString().toUpperCase() === 'ADMIN';
        
        if (!currentUserUG) {
            console.warn('⚠️ No se pudo determinar la unidad gestora del usuario');
            if (isAdmin) {
                // Admin: mostrar todo siempre
                showAllUGFields();
                console.log('👑 Admin sin UG detectada: mostrando todos los campos de UG');
                return;
            } else {
                // Fallback: usar selección actual del desplegable si existe
                const ugCodeFromSelect = getUGCodeFromSelect();
                if (ugCodeFromSelect) {
                    showUGSpecificFields(ugCodeFromSelect);
                    applyUGStyles(ugCodeFromSelect);
                    bindUGSelect();
                    console.log(`✅ Campos inicializados por selección de UG: ${ugCodeFromSelect}`);
                    return;
                }
                // En cualquier caso, enlazar el change para cuando el usuario seleccione una UG
                bindUGSelect();
                return;
            }
        }

        console.log(`👤 Usuario pertenece a: ${currentUserUG} (Rol: ${userRole})`);

        if (isAdmin) {
            // Admin: ver todos los campos de todas las UG simultáneamente
            showAllUGFields();
            forceShowUGFields('SAE');
            console.log('👑 Usuario Admin: mostrando todos los campos de UG (sin ocultar por selección)');
        } else {
            // No-Admin: mostrar solo su UG, aplicar estilos y bloquear selección
            showUGSpecificFields(currentUserUG);
            applyUGStyles(currentUserUG);
            console.log(`🔒 Usuario no-Admin: bloqueando unidad gestora a ${currentUserUG}`);
            try { perfStart('ug:preselect'); } catch {}
            preselectUserUG(currentUserUG);
            try { perfEnd('ug:preselect'); } catch {}
            // Enlazar cambios por si varía (ej. cambio de sesión)
            bindUGSelect();
        }
        console.log('✅ Campos específicos por unidad gestora inicializados');
        try { window.__ugInitialized = true; } catch {}
        try { perfEnd('ug:init'); } catch {}
    }

    /**
     * Función pública para reinicializar (útil para cambios de usuario)
     */
    window.reinitializeUGFields = function() {
        initializeUGSpecificFields();
    };

    /**
     * Función pública para inicializar campos específicos por UG
     */
    window.initializeUGSpecificFields = initializeUGSpecificFields;

    /**
     * Función pública para obtener la UG actual
     */
    window.getCurrentUserUG = function() {
        return currentUserUG;
    };

    function getUGCodeFromSelect() {
        const ugSelect = document.getElementById('actividadUnidadGestion');
        if (!ugSelect) { return null; }
        const val = ugSelect.value;
        if (!val) { return null; }
        // Si es un id numérico mapeable
        if (UG_ID_TO_CODE[val] || UG_ID_TO_CODE[parseInt(val)]) {
            return UG_ID_TO_CODE[val] || UG_ID_TO_CODE[parseInt(val)];
        }
        // Si ya es código
        const txt = (ugSelect.options[ugSelect.selectedIndex]?.text || '').toUpperCase();
        if (['IDP','CRAI','SAE'].some(c => txt.includes(c))) {
            return ['IDP','CRAI','SAE'].find(c => txt.includes(c));
        }
        return null;
    }

    function showAllUGFields() {
        const allUGFields = document.querySelectorAll('[data-ug]');
        allUGFields.forEach(field => {
            field.style.display = 'block';
            // Reset estilos específicos si se hubieran aplicado
            field.style.backgroundColor = '';
            field.style.border = '';
            field.style.borderLeft = '';
            field.classList.remove('d-none');
        });
    }

    function forceShowUGFields(code) {
        const targets = document.querySelectorAll(`[data-ug="${code}"]`);
        targets.forEach(t => { t.style.display = 'block'; t.classList.remove('d-none'); });
        // Asegurar campos concretos de SAE
        ['tipusEstudiSAE','categoriaSAE','competenciesSAE'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                let p = el.closest('[data-ug]');
                if (p) { p.style.display = 'block'; p.classList.remove('d-none'); }
            }
        });
    }

    function bindUGSelect() {
        const ugSelect = document.getElementById('actividadUnidadGestion');
        if (!ugSelect) { return; }
        if (ugSelect.__ugBound) { return; }
        ugSelect.addEventListener('change', () => {
            const code = getUGCodeFromSelect();
            if (code) {
                showUGSpecificFields(code);
                applyUGStyles(code);
            }
        });
        ugSelect.__ugBound = true;
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUGSpecificFields);
    } else {
        initializeUGSpecificFields();
    }

    // También inicializar después de un pequeño delay para asegurar que otros scripts se hayan cargado
    setTimeout(initializeUGSpecificFields, 1000);

})();
