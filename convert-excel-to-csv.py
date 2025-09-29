#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para convertir archivo Excel a CSV manteniendo caracteres especiales
Soporta acentos, ñ, y otros caracteres del español y catalán
"""

import pandas as pd
import sys
import os

def convert_excel_to_csv(excel_path, csv_path=None):
    """
    Convierte un archivo Excel a CSV manteniendo la codificación UTF-8
    
    Args:
        excel_path (str): Ruta del archivo Excel
        csv_path (str): Ruta del archivo CSV de salida (opcional)
    """
    try:
        # Verificar que el archivo Excel existe
        if not os.path.exists(excel_path):
            print(f"❌ Error: El archivo {excel_path} no existe")
            return False
        
        # Si no se especifica ruta de salida, usar la misma carpeta con extensión .csv
        if csv_path is None:
            csv_path = excel_path.replace('.xlsx', '.csv').replace('.xls', '.csv')
        
        print(f"📖 Leyendo archivo Excel: {excel_path}")
        
        # Leer el archivo Excel
        # Usar engine='openpyxl' para archivos .xlsx y 'xlrd' para .xls
        if excel_path.endswith('.xlsx'):
            df = pd.read_excel(excel_path, engine='openpyxl')
        else:
            df = pd.read_excel(excel_path, engine='xlrd')
        
        print(f"✅ Archivo leído correctamente")
        print(f"📊 Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
        print(f"📋 Columnas: {list(df.columns)}")
        
        # Mostrar las primeras filas para verificar
        print(f"\n🔍 Primeras 5 filas:")
        print(df.head().to_string())
        
        # Guardar como CSV con codificación UTF-8
        print(f"\n💾 Guardando como CSV: {csv_path}")
        df.to_csv(csv_path, index=False, encoding='utf-8')
        
        print(f"✅ Conversión completada exitosamente")
        print(f"📁 Archivo CSV creado: {csv_path}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error durante la conversión: {str(e)}")
        return False

def main():
    """Función principal"""
    excel_path = r"C:\Traspaso\DominiosUNIUB.xlsx"
    
    print("🚀 Convertidor de Excel a CSV")
    print("=" * 50)
    print(f"📂 Archivo origen: {excel_path}")
    
    # Convertir el archivo
    success = convert_excel_to_csv(excel_path)
    
    if success:
        csv_path = excel_path.replace('.xlsx', '.csv')
        print(f"\n🎉 ¡Conversión exitosa!")
        print(f"📄 Archivo CSV disponible en: {csv_path}")
        print(f"🔤 Codificación: UTF-8 (soporta acentos, ñ, etc.)")
    else:
        print(f"\n💥 Error en la conversión")
        sys.exit(1)

if __name__ == "__main__":
    main()
