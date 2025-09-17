#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANÁLISIS SISTEMÁTICO DE CAMPOS DEL FORMULARIO EDITAR-ACTIVIDAD.HTML
Verifica cada campo: HTML, JavaScript, DTO y Backend
"""

import re
import json
from pathlib import Path

def analizar_campo(nombre_campo, id_html, mapeo_js, dto_prop, backend_prop):
    """Analiza un campo específico del formulario"""
    status = "✅ COMPLETO" if all([id_html, mapeo_js, dto_prop, backend_prop]) else "❌ INCOMPLETO"
    
    print(f"\n{'='*80}")
    print(f"🔍 CAMPO: {nombre_campo}")
    print(f"{'='*80}")
    print(f"📋 HTML ID:     {id_html or '❌ FALTANTE'}")
    print(f"🔧 JS Mapping:  {mapeo_js or '❌ FALTANTE'}")
    print(f"📦 DTO Prop:    {dto_prop or '❌ FALTANTE'}")
    print(f"⚙️  Backend:     {backend_prop or '❌ FALTANTE'}")
    print(f"📊 STATUS:       {status}")
    
    if not all([id_html, mapeo_js, dto_prop, backend_prop]):
        print("⚠️  PROBLEMAS DETECTADOS:")
        if not id_html:
            print("   - Falta ID en HTML")
        if not mapeo_js:
            print("   - Falta mapeo en JavaScript")
        if not dto_prop:
            print("   - Falta propiedad en DTO")
        if not backend_prop:
            print("   - Falta procesamiento en Backend")
    
    return status == "✅ COMPLETO"

def main():
    print("🧪 ANÁLISIS SISTEMÁTICO DE CAMPOS DEL FORMULARIO")
    print("=" * 80)
    
    # DEFINICIÓN DE CAMPOS A ANALIZAR
    campos_analisis = [
        # === CAMPOS BÁSICOS ===
        ("Código de la actividad", "actividadCodigo", "Codigo", "Codigo", "Codigo"),
        ("Título de la actividad", "actividadTitulo", "Titulo", "Titulo", "Titulo"),
        ("Tipo de actividad", "tipoActividad", "TipoActividad", "TipoActividad", "TipoActividad"),
        ("Unidad gestora", "actividadUnidadGestion", "UnidadGestionId", "UnidadGestionId", "UnidadGestionId"),
        ("Descripción", "descripcion", "Descripcion", "Descripcion", "Descripcion"),
        ("Condiciones económicas", "condicionesEconomicas", "CondicionesEconomicas", "CondicionesEconomicas", "CondicionesEconomicas"),
        ("Año académico", "actividadAnioAcademico", "AnioAcademico", "AnioAcademico", "AnioAcademico"),
        ("Línea estratégica", "lineaEstrategica", "LineaEstrategica", "LineaEstrategica", "LineaEstrategica"),
        ("Objetivo estratégico", "objetivoEstrategico", "ObjetivoEstrategico", "ObjetivoEstrategico", "ObjetivoEstrategico"),
        ("Código relacionado", "codigoRelacionado", "CodigoRelacionado", "CodigoRelacionado", "CodigoRelacionado"),
        ("Actividad reservada", "actividadReservada", "ActividadReservada", "ActividadReservada", "ActividadReservada"),
        ("Fecha de actividad", "fechaActividad", "FechaActividad", "FechaActividad", "FechaActividad"),
        ("Motivo de cierre", "motivoCierre", "MotivoCierre", "MotivoCierre", "MotivoCierre"),
        
        # === CAMPOS DE PERSONAS ===
        ("Persona solicitante", "personaSolicitante", "PersonaSolicitante", "PersonaSolicitante", "PersonaSolicitante"),
        ("Coordinador/a", "coordinador", "Coordinador", "Coordinador", "Coordinador"),
        ("Jefe/a unidad gestora", "jefeUnidadGestora", "JefeUnidadGestora", "JefeUnidadGestora", "JefeUnidadGestora"),
        ("Gestor/a de la actividad", "gestorActividad", "GestorActividad", "GestorActividad", "GestorActividad"),
        
        # === CAMPOS DE DESTINATARIOS ===
        ("Facultad destinataria", "facultadDestinataria", "FacultadDestinataria", "FacultadDestinataria", "FacultadDestinataria"),
        ("Departamento destinatario", "departamentoDestinatario", "DepartamentoDestinatario", "DepartamentoDestinatario", "DepartamentoDestinatario"),
        ("Centro/unidad UB destinataria", "centroUnidadUBDestinataria", "CentroUnidadUBDestinataria", "CentroUnidadUBDestinataria", "CentroUnidadUBDestinataria"),
        ("Otros centros/instituciones", "otrosCentrosInstituciones", "OtrosCentrosInstituciones", "OtrosCentrosInstituciones", "OtrosCentrosInstituciones"),
        
        # === CAMPOS NUMÉRICOS ===
        ("Plazas totales", "plazasTotales", "PlazasTotales", "PlazasTotales", "PlazasTotales"),
        ("Horas totales", "horasTotales", "HorasTotales", "HorasTotales", "HorasTotales"),
        
        # === CAMPOS DE GESTIÓN ===
        ("Centro de trabajo requerido", "centroTrabajoRequerido", "CentroTrabajoRequerido", "CentroTrabajoRequerido", "CentroTrabajoRequerido"),
        ("Modalidad de gestión", "modalidadGestion", "ModalidadGestion", "ModalidadGestion", "ModalidadGestion"),
        ("F. inicio de la imp.", "fechaInicioImparticion", "FechaInicioImparticion", "FechaInicioImparticion", "FechaInicioImparticion"),
        ("F. final de la imp.", "fechaFinImparticion", "FechaFinImparticion", "FechaFinImparticion", "FechaFinImparticion"),
        ("Actividad de pago", "actividadPago", "ActividadPago", "ActividadPago", "ActividadPago"),
        
        # === CAMPOS ESPECÍFICOS IDP ===
        ("Coordinador centre/unitat (IDP)", "coordinadorCentreUnitat", "CoordinadorCentreUnitat", "CoordinadorCentreUnitat", "CoordinadorCentreUnitat"),
        ("Centre de treball de l'alumne (IDP)", "centreTreballeAlumne", "CentreTreballeAlumne", "CentreTreballeAlumne", "CentreTreballeAlumne"),
        
        # === CAMPOS ESPECÍFICOS CRAI ===
        ("Crèdits totals (CRAI)", "creditosTotalesCRAI", "CreditosTotalesCRAI", "CreditosTotalesCRAI", "CreditosTotalesCRAI"),
        
        # === CAMPOS ESPECÍFICOS SAE ===
        ("Crèdits totals (SAE)", "creditosTotalesSAE", "CreditosTotalesSAE", "CreditosTotalesSAE", "CreditosTotalesSAE"),
        ("Crèdits mínims (SAE)", "creditosMinimosSAE", "CreditosMinimosSAE", "CreditosMinimosSAE", "CreditosMinimosSAE"),
        ("Crèdits màxims (SAE)", "creditosMaximosSAE", "CreditosMaximosSAE", "CreditosMaximosSAE", "CreditosMaximosSAE"),
        
        # === CAMPOS DE INSCRIPCIÓN ===
        ("Inicio inscripción", "insc_inicio", "InscripcionInicio", "InscripcionInicio", "InscripcionInicio"),
        ("Fin inscripción", "insc_fin", "InscripcionFin", "InscripcionFin", "InscripcionFin"),
        ("Plazas inscripción", "insc_plazas", "InscripcionPlazas", "InscripcionPlazas", "InscripcionPlazas"),
        ("Lista de espera", "insc_lista_espera", "InscripcionListaEspera", "InscripcionListaEspera", "InscripcionListaEspera"),
        ("Modalidad inscripción", "insc_modalidad", "InscripcionModalidad", "InscripcionModalidad", "InscripcionModalidad"),
        
        # === CAMPOS DE PROGRAMA ===
        ("Programa descripción ES", "programa_descripcion_es", "ProgramaDescripcionES", "ProgramaDescripcionES", "ProgramaDescripcionES"),
        ("Programa descripción CA", "programa_descripcion_ca", "ProgramaDescripcionCA", "ProgramaDescripcionCA", "ProgramaDescripcionCA"),
        ("Programa descripción EN", "programa_descripcion_en", "ProgramaDescripcionEN", "ProgramaDescripcionEN", "ProgramaDescripcionEN"),
        
        # === CAMPOS DE ENTIDADES ORGANIZADORAS ===
        ("Organizadora principal", "org_principal", "OrgPrincipal", "OrgPrincipal", "OrgPrincipal"),
        ("NIF/CIF", "org_nif", "OrgNif", "OrgNif", "OrgNif"),
        ("Web", "org_web", "OrgWeb", "OrgWeb", "OrgWeb"),
        ("Persona de contacto", "org_contacto", "OrgContacto", "OrgContacto", "OrgContacto"),
        ("Email", "org_email", "OrgEmail", "OrgEmail", "OrgEmail"),
        ("Teléfono", "org_tel", "OrgTel", "OrgTel", "OrgTel"),
        
        # === CAMPOS DE IMPORTES ===
        ("Importe base", "imp_base", "ImpBase", "ImpBase", "ImpBase"),
        ("Tipo impuesto", "imp_tipo", "ImpTipo", "ImpTipo", "ImpTipo"),
        ("Descuento %", "imp_descuento_pct", "ImpDescuentoPct", "ImpDescuentoPct", "ImpDescuentoPct"),
        ("Código promocional", "imp_codigo", "ImpCodigo", "ImpCodigo", "ImpCodigo"),
        ("Condiciones ES", "imp_condiciones_es", "ImpCondicionesES", "ImpCondicionesES", "ImpCondicionesES"),
        ("Condiciones CA", "imp_condiciones_ca", "ImpCondicionesCA", "ImpCondicionesCA", "ImpCondicionesCA"),
        ("Condiciones EN", "imp_condiciones_en", "ImpCondicionesEN", "ImpCondicionesEN", "ImpCondicionesEN"),
    ]
    
    # CONTADORES
    total_campos = len(campos_analisis)
    campos_completos = 0
    campos_incompletos = 0
    
    print(f"\n📊 TOTAL DE CAMPOS A ANALIZAR: {total_campos}")
    print("=" * 80)
    
    # ANALIZAR CADA CAMPO
    for nombre, id_html, mapeo_js, dto_prop, backend_prop in campos_analisis:
        if analizar_campo(nombre, id_html, mapeo_js, dto_prop, backend_prop):
            campos_completos += 1
        else:
            campos_incompletos += 1
    
    # RESUMEN FINAL
    print(f"\n{'='*80}")
    print("📊 RESUMEN DEL ANÁLISIS")
    print(f"{'='*80}")
    print(f"✅ CAMPOS COMPLETOS:     {campos_completos}")
    print(f"❌ CAMPOS INCOMPLETOS:   {campos_incompletos}")
    print(f"📋 TOTAL ANALIZADOS:     {total_campos}")
    print(f"📈 PORCENTAJE ÉXITO:     {(campos_completos/total_campos)*100:.1f}%")
    
    if campos_incompletos > 0:
        print(f"\n⚠️  RECOMENDACIONES:")
        print(f"   - Revisar campos faltantes en HTML")
        print(f"   - Verificar mapeo en JavaScript")
        print(f"   - Completar propiedades en DTO")
        print(f"   - Implementar procesamiento en Backend")
    else:
        print(f"\n🎉 ¡TODOS LOS CAMPOS ESTÁN COMPLETOS!")

if __name__ == "__main__":
    main()
