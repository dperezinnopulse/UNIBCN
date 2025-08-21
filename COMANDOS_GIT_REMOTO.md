# Comandos Git para Subir al Repositorio Remoto

## Estado Actual
✅ Repositorio Git inicializado localmente  
✅ Commit v0.1 realizado  
✅ Tag v0.1 creado  

## Próximos Pasos para Subir al Repo Remoto

### 1. Conectar con el repositorio remoto
```powershell
# Usar la ruta completa de Git
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/dperezinnopulse/UNIBCN.git
```

### 2. Subir al repositorio remoto
```powershell
# Subir la rama principal
& "C:\Program Files\Git\bin\git.exe" push -u origin master

# Subir el tag v0.1
& "C:\Program Files\Git\bin\git.exe" push origin v0.1
```

### 3. Verificar el estado
```powershell
# Ver el estado del repositorio
& "C:\Program Files\Git\bin\git.exe" status

# Ver los tags
& "C:\Program Files\Git\bin\git.exe" tag

# Ver el historial de commits
& "C:\Program Files\Git\bin\git.exe" log --oneline
```

## Información del Commit v0.1

**Hash del commit**: `9671b05`  
**Mensaje**: "v0.1: Backend funcional + Frontend prototipos - Sprint 1 completado"  
**Archivos**: 216 archivos añadidos, 11,799 líneas de código  

### Contenido del Commit
- ✅ Backend API completamente funcional (.NET 8 + EF Core)
- ✅ Base de datos configurada con datos de ejemplo
- ✅ Frontend con prototipos HTML/JS
- ✅ Documentación completa (OpenAPI, Postman, instrucciones)
- ✅ Scripts de automatización (PowerShell)
- ✅ Página de pruebas API

## URLs del Repositorio
- **Repositorio**: https://github.com/dperezinnopulse/UNIBCN
- **Release v0.1**: https://github.com/dperezinnopulse/UNIBCN/releases/tag/v0.1

## Notas Importantes
- El repositorio está configurado con usuario "UB Actividad 1"
- Todos los archivos están incluidos (incluyendo bin/ y obj/ por simplicidad)
- Para producción, considerar añadir .gitignore para excluir bin/ y obj/

## Comandos de Verificación
```powershell
# Verificar que todo está committeado
& "C:\Program Files\Git\bin\git.exe" status

# Ver el contenido del commit
& "C:\Program Files\Git\bin\git.exe" show --stat

# Ver los archivos incluidos
& "C:\Program Files\Git\bin\git.exe" ls-files
``` 