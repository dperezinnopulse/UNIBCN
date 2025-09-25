#!/usr/bin/env python3
import requests
import json

print("🔍 Monitoreando página editar-actividad.html?id=6...")

try:
    # Verificar Chromium
    response = requests.get("http://localhost:9226/json")
    tabs = response.json()
    print(f"✅ Chromium activo - {len(tabs)} pestañas")
    
    if tabs:
        tab = tabs[0]
        print(f"📍 Página: {tab.get('title', 'Sin título')}")
        print(f"🌐 URL: {tab.get('url', 'N/A')}")
        
        # Verificar si estamos en la página correcta
        if 'editar-actividad.html' in tab.get('url', ''):
            print("✅ Página correcta detectada")
        else:
            print("⚠️ No estás en la página editar-actividad.html")
        
        # Script para capturar errores específicos de la página
        error_script = """
        (function() {
            var report = {
                errors: [],
                warnings: [],
                pageInfo: {},
                formElements: {},
                networkErrors: []
            };
            
            // Capturar errores de consola
            var originalError = console.error;
            var originalWarn = console.warn;
            
            console.error = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                report.errors.push(message);
                originalError.apply(console, arguments);
            };
            
            console.warn = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                report.warnings.push(message);
                originalWarn.apply(console, arguments);
            };
            
            // Información de la página
            report.pageInfo = {
                url: window.location.href,
                title: document.title,
                hasActividadData: typeof window.actividadData !== 'undefined',
                hasCargarActividad: typeof cargarActividad !== 'undefined',
                hasGuardarActividad: typeof guardarActividad !== 'undefined',
                hasValidarFormulario: typeof validarFormulario !== 'undefined'
            };
            
            // Verificar elementos del formulario
            report.formElements = {
                titulo: !!document.querySelector('input[name="titulo"], #titulo'),
                descripcion: !!document.querySelector('textarea[name="descripcion"], #descripcion'),
                unidadGestion: !!document.querySelector('select[name="unidadGestion"], #unidadGestion'),
                estado: !!document.querySelector('select[name="estado"], #estado'),
                fechaInicio: !!document.querySelector('input[name="fechaInicio"], #fechaInicio'),
                fechaFin: !!document.querySelector('input[name="fechaFin"], #fechaFin')
            };
            
            // Verificar token
            report.token = localStorage.getItem('ub_token') ? 'Presente' : 'Ausente';
            
            // Verificar si hay datos cargados
            try {
                if (window.actividadData) {
                    report.actividadData = {
                        id: window.actividadData.id,
                        titulo: window.actividadData.titulo,
                        hasData: true
                    };
                } else {
                    report.actividadData = { hasData: false };
                }
            } catch (e) {
                report.actividadData = { error: e.message };
            }
            
            return report;
        })()
        """
        
        # Ejecutar script
        eval_response = requests.get("http://localhost:9226/json/runtime/evaluate", 
                                   params={"expression": error_script})
        if eval_response.status_code == 200:
            data = eval_response.json()
            if 'result' in data and 'value' in data['result']:
                report = data['result']['value']
                
                print("\n📊 REPORTE DE LA PÁGINA:")
                print("=" * 50)
                
                # Información de la página
                print(f"📍 URL: {report['pageInfo']['url']}")
                print(f"📄 Título: {report['pageInfo']['title']}")
                print(f"🔑 Token: {report['token']}")
                
                # Funciones JavaScript
                print(f"\n🔧 FUNCIONES JAVASCRIPT:")
                print(f"  cargarActividad: {'✅' if report['pageInfo']['hasCargarActividad'] else '❌'}")
                print(f"  guardarActividad: {'✅' if report['pageInfo']['hasGuardarActividad'] else '❌'}")
                print(f"  validarFormulario: {'✅' if report['pageInfo']['hasValidarFormulario'] else '❌'}")
                print(f"  actividadData: {'✅' if report['pageInfo']['hasActividadData'] else '❌'}")
                
                # Elementos del formulario
                print(f"\n📝 ELEMENTOS DEL FORMULARIO:")
                for element, exists in report['formElements'].items():
                    print(f"  {element}: {'✅' if exists else '❌'}")
                
                # Datos de la actividad
                if report['actividadData']['hasData']:
                    print(f"\n📋 DATOS DE LA ACTIVIDAD:")
                    print(f"  ID: {report['actividadData'].get('id', 'N/A')}")
                    print(f"  Título: {report['actividadData'].get('titulo', 'N/A')}")
                else:
                    print(f"\n❌ NO HAY DATOS DE ACTIVIDAD CARGADOS")
                
                # Errores
                if report['errors']:
                    print(f"\n❌ ERRORES ({len(report['errors'])}):")
                    for i, error in enumerate(report['errors'], 1):
                        print(f"  {i}. {error}")
                else:
                    print(f"\n✅ NO HAY ERRORES DE CONSOLA")
                
                # Warnings
                if report['warnings']:
                    print(f"\n⚠️ WARNINGS ({len(report['warnings'])}):")
                    for i, warning in enumerate(report['warnings'], 1):
                        print(f"  {i}. {warning}")
                else:
                    print(f"\n✅ NO HAY WARNINGS")
        
        # Verificar backend
        print(f"\n🌐 ESTADO DEL BACKEND:")
        try:
            backend_response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=2)
            print(f"  ✅ Backend funcionando - Status: {backend_response.status_code}")
        except Exception as e:
            print(f"  ❌ Backend no disponible: {e}")
            
except Exception as e:
    print(f"❌ Error general: {e}")

print("\n📊 Monitoreo de editar-actividad completado")
