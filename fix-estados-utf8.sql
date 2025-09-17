USE UB_Formacion;
GO

BEGIN TRY
  BEGIN TRAN;

  -- Corregir nombres y descripciones con acentos (usar literales Unicode N'...')
  UPDATE EstadosActividad SET Nombre = N'Borrador', Descripcion = N'Edición por proponente; no enviado.' WHERE Codigo = 'BORRADOR';
  UPDATE EstadosActividad SET Nombre = N'Enviada', Descripcion = N'Registrada para revisión inicial.' WHERE Codigo = 'ENVIADA';
  UPDATE EstadosActividad SET Nombre = N'En revisión', Descripcion = N'Revisión por Coordinador de Formación.' WHERE Codigo = 'EN_REVISION';
  UPDATE EstadosActividad SET Nombre = N'Validación de unidad', Descripcion = N'Revisión por Responsable de Unidad.' WHERE Codigo = 'VALIDACION_UNIDAD';
  UPDATE EstadosActividad SET Nombre = N'Definición', Descripcion = N'Definición académico-docente y subactividades.' WHERE Codigo = 'DEFINICION';
  UPDATE EstadosActividad SET Nombre = N'Revisión administrativa', Descripcion = N'Control final por Soporte Administrativo.' WHERE Codigo = 'REVISION_ADMIN';
  UPDATE EstadosActividad SET Nombre = N'Publicada', Descripcion = N'Visible en catálogo.' WHERE Codigo = 'PUBLICADA';
  UPDATE EstadosActividad SET Nombre = N'Cancelada', Descripcion = N'Cierre anticipado con motivo.' WHERE Codigo = 'CANCELADA';
  UPDATE EstadosActividad SET Nombre = N'Rechazada', Descripcion = N'Denegada, con comentario.' WHERE Codigo = 'RECHAZADA';

  COMMIT;
  PRINT '>>> EstadosActividad actualizado con acentos correctos.';
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  DECLARE @Err NVARCHAR(4000)=ERROR_MESSAGE();
  RAISERROR('Error en fix-estados-utf8.sql: %s', 16, 1, @Err);
END CATCH;


