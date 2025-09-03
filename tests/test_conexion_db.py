import pyodbc
import sys

def test_conexion_db():
    print('🧪 TEST CONEXIÓN BASE DE DATOS')
    print('=' * 50)
    
    try:
        # Cadena de conexión
        connection_string = (
            "Driver={ODBC Driver 17 for SQL Server};"
            "Server=localhost;"
            "Database=UB_Formacion;"
            "Trusted_Connection=yes;"
            "TrustServerCertificate=yes;"
        )
        
        print(f'🔌 Conectando a: {connection_string}')
        
        # Intentar conexión
        conn = pyodbc.connect(connection_string)
        print('✅ CONEXIÓN EXITOSA a la base de datos')
        
        # Verificar que existe la tabla Actividades
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Actividades")
        count = cursor.fetchone()[0]
        print(f'📊 Tabla Actividades: {count} registros encontrados')
        
        # Verificar estructura de la tabla
        cursor.execute("SELECT TOP 1 * FROM Actividades")
        columns = [column[0] for column in cursor.description]
        print(f'🏗️  Columnas de Actividades: {len(columns)} campos')
        print(f'📝 Primeras 10 columnas: {columns[:10]}')
        
        conn.close()
        print('✅ Conexión cerrada correctamente')
        
    except pyodbc.Error as e:
        print(f'❌ Error de conexión ODBC: {e}')
        print('💡 Verificar que SQL Server esté ejecutándose')
    except Exception as e:
        print(f'❌ Error inesperado: {e}')
        print(f'💡 Tipo de error: {type(e).__name__}')

if __name__ == "__main__":
    test_conexion_db()
