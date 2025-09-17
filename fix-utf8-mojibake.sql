USE UB_Formacion;
GO

BEGIN TRY
  BEGIN TRAN;

  -- Corrección de mojibake común (UTF-8 interpretado como ANSI)
  UPDATE ea
    SET 
      ea.Nombre = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ea.Nombre,
                    N'Ã¡', N'á'), N'Ã©', N'é'), N'Ã­', N'í'), N'Ã³', N'ó'), N'Ãº', N'ú'), N'Ã±', N'ñ'), N'Ã', N'Á'), N'Ã‰', N'É'), N'Ã“', N'Ó'), N'Ãš', N'Ú'),
      ea.Descripcion = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ea.Descripcion,
                         N'Ã¡', N'á'), N'Ã©', N'é'), N'Ã­', N'í'), N'Ã³', N'ó'), N'Ãº', N'ú'), N'Ã±', N'ñ'), N'Ã', N'Á'), N'Ã‰', N'É'), N'Ã“', N'Ó'), N'Ãš', N'Ú')
  FROM EstadosActividad ea;

  COMMIT;
  PRINT '>>> Mojibake corregido en EstadosActividad.';
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  DECLARE @Err NVARCHAR(4000)=ERROR_MESSAGE();
  RAISERROR('Error en fix-utf8-mojibake.sql: %s', 16, 1, @Err);
END CATCH;


