#!/usr/bin/env python3
"""
Sistema de monitoreo automático para debugging
Captura errores de consola, red y estado de servicios
"""

import requests
import json
import time
import sys
from datetime import datetime

class AutoMonitor:
    def __init__(self, debug_port=9226):
        self.debug_port = debug_port
        self.debug_url = f"http://localhost:{debug_port}"
        self.errors_captured = []
        self.network_errors = []
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def check_services(self):
        """Verificar estado de backend y frontend"""
        self.log("🔍 Verificando servicios...")
        
        # Backend
        try:
            response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=2)
            if response.status_code == 200:
                self.log("✅ Backend funcionando correctamente")
            else:
                self.log(f"⚠️ Backend respondiendo con código: {response.status_code}", "WARN")
        except Exception as e:
            self.log(f"❌ Backend no disponible: {e}", "ERROR")
            
        # Frontend
        try:
            response = requests.get("http://localhost:8080", timeout=2)
            if response.status_code == 200:
                self.log("✅ Frontend funcionando correctamente")
            else:
                self.log(f"⚠️ Frontend respondiendo con código: {response.status_code}", "WARN")
        except Exception as e:
            self.log(f"❌ Frontend no disponible: {e}", "ERROR")
    
    def setup_error_capture(self):
        """Configurar captura automática de errores"""
        self.log("🔧 Configurando captura de errores...")
        
        # Script para capturar errores de consola
        console_script = """
        (function() {
            window.autoMonitorErrors = [];
            window.autoMonitorNetworkErrors = [];
            
            // Capturar errores de consola
            var originalError = console.error;
            var originalWarn = console.warn;
            
            console.error = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                window.autoMonitorErrors.push({
                    type: 'ERROR',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                originalError.apply(console, arguments);
            };
            
            console.warn = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                window.autoMonitorErrors.push({
                    type: 'WARN',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                originalWarn.apply(console, arguments);
            };
            
            // Capturar errores de DOM
            window.addEventListener('error', function(e) {
                window.autoMonitorErrors.push({
                    type: 'DOM_ERROR',
                    message: e.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    timestamp: new Date().toISOString()
                });
            });
            
            // Capturar errores de promesas
            window.addEventListener('unhandledrejection', function(e) {
                window.autoMonitorErrors.push({
                    type: 'PROMISE_REJECTION',
                    message: e.reason,
                    timestamp: new Date().toISOString()
                });
            });
            
            // Interceptar fetch para capturar errores de red
            var originalFetch = window.fetch;
            window.fetch = function() {
                var url = arguments[0];
                return originalFetch.apply(this, arguments)
                    .catch(function(error) {
                        window.autoMonitorNetworkErrors.push({
                            type: 'FETCH_ERROR',
                            url: url,
                            message: error.message,
                            timestamp: new Date().toISOString()
                        });
                        throw error;
                    });
            };
            
            // Interceptar XMLHttpRequest
            var originalXHROpen = XMLHttpRequest.prototype.open;
            var originalXHRSend = XMLHttpRequest.prototype.send;
            
            XMLHttpRequest.prototype.open = function(method, url) {
                this._url = url;
                return originalXHROpen.apply(this, arguments);
            };
            
            XMLHttpRequest.prototype.send = function() {
                var xhr = this;
                xhr.addEventListener('error', function() {
                    window.autoMonitorNetworkErrors.push({
                        type: 'XHR_ERROR',
                        url: xhr._url,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        timestamp: new Date().toISOString()
                    });
                });
                return originalXHRSend.apply(this, arguments);
            };
            
            return 'Error capture configured';
        })()
        """
        
        try:
            response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                  params={"expression": console_script})
            if response.status_code == 200:
                self.log("✅ Captura de errores configurada")
                return True
            else:
                self.log(f"❌ Error configurando captura: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error conectando a DevTools: {e}", "ERROR")
            return False
    
    def get_console_errors(self):
        """Obtener errores capturados de la consola"""
        try:
            response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                  params={"expression": "window.autoMonitorErrors || []"})
            if response.status_code == 200:
                data = response.json()
                if 'result' in data and 'value' in data['result']:
                    errors = data['result']['value']
                    return errors
            return []
        except Exception as e:
            self.log(f"Error obteniendo errores de consola: {e}", "ERROR")
            return []
    
    def get_network_errors(self):
        """Obtener errores de red capturados"""
        try:
            response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                  params={"expression": "window.autoMonitorNetworkErrors || []"})
            if response.status_code == 200:
                data = response.json()
                if 'result' in data and 'value' in data['result']:
                    errors = data['result']['value']
                    return errors
            return []
        except Exception as e:
            self.log(f"Error obteniendo errores de red: {e}", "ERROR")
            return []
    
    def check_authentication(self):
        """Verificar estado de autenticación"""
        try:
            # Verificar token
            response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                  params={"expression": "localStorage.getItem('ub_token')"})
            if response.status_code == 200:
                data = response.json()
                if 'result' in data and 'value' in data['result']:
                    token = data['result']['value']
                    if token:
                        self.log(f"✅ Token encontrado: {token[:20]}...")
                        return True
                    else:
                        self.log("❌ No hay token en localStorage", "WARN")
                        return False
        except Exception as e:
            self.log(f"Error verificando autenticación: {e}", "ERROR")
        return False
    
    def get_page_info(self):
        """Obtener información de la página actual"""
        try:
            # URL actual
            url_response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                      params={"expression": "window.location.href"})
            if url_response.status_code == 200:
                url_data = url_response.json()
                if 'result' in url_data and 'value' in url_data['result']:
                    current_url = url_data['result']['value']
                    self.log(f"📍 Página actual: {current_url}")
            
            # Título de la página
            title_response = requests.get(f"{self.debug_url}/json/runtime/evaluate", 
                                        params={"expression": "document.title"})
            if title_response.status_code == 200:
                title_data = title_response.json()
                if 'result' in title_data and 'value' in title_data['result']:
                    title = title_data['result']['value']
                    self.log(f"📄 Título: {title}")
                    
        except Exception as e:
            self.log(f"Error obteniendo información de página: {e}", "ERROR")
    
    def run_monitoring_cycle(self):
        """Ejecutar un ciclo de monitoreo"""
        self.log("🔄 Iniciando ciclo de monitoreo...")
        
        # Verificar servicios
        self.check_services()
        
        # Obtener información de la página
        self.get_page_info()
        
        # Verificar autenticación
        self.check_authentication()
        
        # Obtener errores de consola
        console_errors = self.get_console_errors()
        if console_errors:
            self.log(f"⚠️ {len(console_errors)} errores de consola encontrados:", "WARN")
            for i, error in enumerate(console_errors[-5:], 1):  # Mostrar últimos 5
                self.log(f"  {i}. [{error.get('type', 'UNKNOWN')}] {error.get('message', 'Sin mensaje')}", "WARN")
        
        # Obtener errores de red
        network_errors = self.get_network_errors()
        if network_errors:
            self.log(f"🌐 {len(network_errors)} errores de red encontrados:", "WARN")
            for i, error in enumerate(network_errors[-5:], 1):  # Mostrar últimos 5
                self.log(f"  {i}. [{error.get('type', 'UNKNOWN')}] {error.get('url', 'N/A')} - {error.get('message', 'Sin mensaje')}", "WARN")
        
        if not console_errors and not network_errors:
            self.log("✅ No se detectaron errores nuevos")
        
        return {
            'console_errors': console_errors,
            'network_errors': network_errors
        }
    
    def start_continuous_monitoring(self, interval=10):
        """Iniciar monitoreo continuo"""
        self.log(f"🚀 Iniciando monitoreo continuo (cada {interval} segundos)")
        self.log("Presiona Ctrl+C para detener")
        
        if not self.setup_error_capture():
            self.log("❌ No se pudo configurar la captura de errores", "ERROR")
            return
        
        try:
            while True:
                self.run_monitoring_cycle()
                self.log(f"⏳ Esperando {interval} segundos...")
                time.sleep(interval)
        except KeyboardInterrupt:
            self.log("🛑 Monitoreo detenido por el usuario")
        except Exception as e:
            self.log(f"❌ Error en monitoreo: {e}", "ERROR")

def main():
    print("🔧 Sistema de Monitoreo Automático")
    print("=" * 50)
    
    monitor = AutoMonitor()
    
    if len(sys.argv) > 1 and sys.argv[1] == "continuous":
        # Monitoreo continuo
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        monitor.start_continuous_monitoring(interval)
    else:
        # Monitoreo único
        monitor.run_monitoring_cycle()

if __name__ == "__main__":
    main()
