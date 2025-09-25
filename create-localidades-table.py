#!/usr/bin/env python3
"""
Script para crear tabla de localidades desde CSV
"""

import csv
import os

def create_localidades_table():
    csv_file = '/mnt/c/Traspaso/localidades.csv'
    sql_file = 'create-localidades-table.sql'
    
    if not os.path.exists(csv_file):
        print(f"❌ Error: No se encuentra el archivo {csv_file}")
        return
    
    print(f"📁 Procesando archivo: {csv_file}")
    
    # Crear SQL para la tabla
    sql_content = """-- Tabla de localidades españolas
CREATE TABLE Localidades (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CodigoPostal NVARCHAR(5) NOT NULL,
    Localidad NVARCHAR(100) NOT NULL,
    Provincia NVARCHAR(50),
    INDEX IX_Localidades_CodigoPostal (CodigoPostal)
);

-- Insertar datos de localidades
"""
    
    localidades_unicas = set()
    codigos_postales = set()
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            # Leer línea por línea ya que parece ser un formato personalizado
            for line_num, line in enumerate(file, 1):
                # Procesar todo el archivo
                    
                line = line.strip()
                if not line:
                    continue
                
                # Dividir por punto y coma
                parts = line.split(';')
                if len(parts) >= 4:
                    # Asumiendo estructura: ID;Localidad;Localidad;CodigoPostal;...
                    localidad = parts[1].strip()
                    codigo_postal = parts[3].strip()
                    
                    # Limpiar código postal (quitar ceros a la izquierda si es necesario)
                    if codigo_postal and codigo_postal.isdigit():
                        codigo_postal = codigo_postal.zfill(5)  # Asegurar 5 dígitos
                        
                        # Crear clave única
                        clave = f"{codigo_postal}|{localidad}"
                        if clave not in localidades_unicas:
                            localidades_unicas.add(clave)
                            codigos_postales.add(codigo_postal)
                            
                            # Determinar provincia basándose en el código postal
                            provincia = get_provincia_from_cp(codigo_postal)
                            
                            sql_content += f"INSERT INTO Localidades (CodigoPostal, Localidad, Provincia) VALUES ('{codigo_postal}', '{localidad.replace("'", "''")}', '{provincia}');\n"
        
        # Escribir archivo SQL
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"✅ Tabla creada exitosamente: {sql_file}")
        print(f"📊 Total localidades únicas: {len(localidades_unicas)}")
        print(f"📊 Total códigos postales: {len(codigos_postales)}")
        
    except Exception as e:
        print(f"❌ Error procesando archivo: {e}")

def get_provincia_from_cp(codigo_postal):
    """Determinar provincia basándose en el código postal"""
    cp = int(codigo_postal[:2])
    
    provincias = {
        1: 'Álava', 2: 'Albacete', 3: 'Alicante', 4: 'Almería', 5: 'Ávila',
        6: 'Badajoz', 7: 'Baleares', 8: 'Barcelona', 9: 'Burgos', 10: 'Cáceres',
        11: 'Cádiz', 12: 'Castellón', 13: 'Ciudad Real', 14: 'Córdoba', 15: 'A Coruña',
        16: 'Cuenca', 17: 'Girona', 18: 'Granada', 19: 'Guadalajara', 20: 'Guipúzcoa',
        21: 'Huelva', 22: 'Huesca', 23: 'Jaén', 24: 'León', 25: 'Lleida',
        26: 'La Rioja', 27: 'Lugo', 28: 'Madrid', 29: 'Málaga', 30: 'Murcia',
        31: 'Navarra', 32: 'Ourense', 33: 'Asturias', 34: 'Palencia', 35: 'Las Palmas',
        36: 'Pontevedra', 37: 'Salamanca', 38: 'Santa Cruz de Tenerife', 39: 'Cantabria',
        40: 'Segovia', 41: 'Sevilla', 42: 'Soria', 43: 'Tarragona', 44: 'Teruel',
        45: 'Toledo', 46: 'Valencia', 47: 'Valladolid', 48: 'Vizcaya', 49: 'Zamora',
        50: 'Zaragoza', 51: 'Ceuta', 52: 'Melilla'
    }
    
    return provincias.get(cp, 'Desconocida')

if __name__ == "__main__":
    create_localidades_table()
