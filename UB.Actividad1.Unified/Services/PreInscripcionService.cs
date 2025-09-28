using System.Text;
using System.Xml;
using UB.Actividad1.API.DTOs;

namespace UB.Actividad1.API.Services
{
    public class PreInscripcionService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PreInscripcionService> _logger;

        public PreInscripcionService(HttpClient httpClient, ILogger<PreInscripcionService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<PreInscripcionResult> EnviarPreinscripcion(PreInscripcionDto dto)
        {
            try
            {
                _logger.LogInformation($"Enviando preinscripción para actividad {dto.ActividadId}, documento: {dto.NumeroDocumento}");

                // Construir el XML SOAP
                var soapEnvelope = ConstruirSoapEnvelope(dto);
                _logger.LogInformation($"XML SOAP enviado: {soapEnvelope}");

                // Configurar la petición HTTP
                var requestUrl = "https://demo.iformalia.es/ws/cargas/PreInscripciones.asmx";
                var request = new HttpRequestMessage(HttpMethod.Post, requestUrl);
                request.Headers.Add("SOAPAction", "http://tempuri.org/CargaPreInscripciones");
                request.Content = new StringContent(soapEnvelope, Encoding.UTF8, "text/xml");

                _logger.LogInformation($"URL de la petición: {requestUrl}");
                _logger.LogInformation($"Headers de la petición: {string.Join(", ", request.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}"))}");
                _logger.LogInformation($"Content-Type: {request.Content.Headers.ContentType}");

                // Enviar la petición
                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation($"Respuesta del servicio iFormalia: {response.StatusCode}");
                _logger.LogInformation($"Headers de respuesta: {string.Join(", ", response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}"))}");
                _logger.LogInformation($"Contenido de la respuesta: {responseContent}");

                if (response.IsSuccessStatusCode)
                {
                    var resultado = ProcesarRespuestaSoap(responseContent);
                    resultado.DetallesHttp = new DetallesHttp
                    {
                        Url = requestUrl,
                        Metodo = "POST",
                        HeadersPeticion = request.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value)),
                        ContentType = request.Content.Headers.ContentType?.ToString(),
                        BodyPeticion = soapEnvelope,
                        StatusCode = response.StatusCode.ToString(),
                        HeadersRespuesta = response.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value)),
                        BodyRespuesta = responseContent
                    };
                    return resultado;
                }
                else
                {
                    _logger.LogError($"Error HTTP del servicio iFormalia: {response.StatusCode} - {responseContent}");
                    return new PreInscripcionResult
                    {
                        Exito = false,
                        Mensaje = $"Error del servicio: {response.StatusCode} - {responseContent}",
                        DetallesHttp = new DetallesHttp
                        {
                            Url = requestUrl,
                            Metodo = "POST",
                            HeadersPeticion = request.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value)),
                            ContentType = request.Content.Headers.ContentType?.ToString(),
                            BodyPeticion = soapEnvelope,
                            StatusCode = response.StatusCode.ToString(),
                            HeadersRespuesta = response.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value)),
                            BodyRespuesta = responseContent
                        }
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enviando preinscripción a iFormalia");
                return new PreInscripcionResult
                {
                    Exito = false,
                    Mensaje = $"Error interno: {ex.Message}"
                };
            }
        }

        private string ConstruirSoapEnvelope(PreInscripcionDto dto)
        {
            // Mapear tipo de documento a número según el ejemplo
            var tipoDocumentoNumero = dto.TipoDocumento switch
            {
                "NIF" => "1",
                "NIE" => "2", 
                "PASAPORTE" => "3",
                _ => "1"
            };

            var soapEnvelope = $@"<?xml version=""1.0"" encoding=""utf-8""?>
<soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
  <soap:Body>
    <CargaPreInscripciones xmlns=""http://tempuri.org/"">
      <eUsuario>ws_user</eUsuario>
      <ePassword>ws_pass</ePassword>
      <eListPreInscripciones>
        <PreInscripciones>
          <expediente>Demo</expediente>
          <accion>2</accion>
          <grupo>1</grupo>
          <nif>{EscapeXml(dto.NumeroDocumento)}</nif>
          <tipoDocumento>{tipoDocumentoNumero}</tipoDocumento>
          <nombre>{EscapeXml(dto.Nombre)}</nombre>
          <apellido1>{EscapeXml(dto.Apellido1)}</apellido1>
          <apellido2>{EscapeXml(dto.Apellido2 ?? "")}</apellido2>
          <IdExt>{new Random().Next(100000000, 999999999)}</IdExt>
          <ComunicacionId>6</ComunicacionId>
          <email>{EscapeXml(dto.Email)}</email>
          <telefonoFijo>{EscapeXml(dto.Telefono)}</telefonoFijo>
          <datosextendidos>
            <DatosExtendidos>
              <nombre>OK_Doc</nombre>
              <valor>S</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>estado</nombre>
              <valor>S</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>estadoTrabajador</nombre>
              <valor>E</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>Sexo</nombre>
              <valor>H</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>FechaNacimiento</nombre>
              <valor>21/04/1988</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>discapacidad</nombre>
              <valor>N</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>Colectivo</nombre>
              <valor>RG</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>Categoria</nombre>
              <valor>TC</valor>
            </DatosExtendidos>
            <DatosExtendidos>
              <nombre>eSector</nombre>
              <valor>Sin especificar</valor>
            </DatosExtendidos>
          </datosextendidos>
        </PreInscripciones>
      </eListPreInscripciones>
    </CargaPreInscripciones>
  </soap:Body>
</soap:Envelope>";

            return soapEnvelope;
        }


        private PreInscripcionResult ProcesarRespuestaSoap(string responseContent)
        {
            try
            {
                _logger.LogInformation($"Procesando respuesta SOAP: {responseContent}");
                
                var xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(responseContent);

                // Buscar el resultado en la respuesta SOAP
                var resultadoNode = xmlDoc.SelectSingleNode("//CargaPreInscripcionesResult");
                if (resultadoNode != null)
                {
                    var hayErrorNode = resultadoNode.SelectSingleNode("HayError");
                    var mensajeNode = resultadoNode.SelectSingleNode("Mensaje");

                    var hayError = hayErrorNode?.InnerText?.ToLower() == "true";
                    var mensaje = mensajeNode?.InnerText ?? "Sin mensaje";

                    // Si hay errores, obtener más detalles
                    if (hayError)
                    {
                        var listaErroresNode = resultadoNode.SelectSingleNode("ListaDetallesErrores");
                        if (listaErroresNode != null)
                        {
                            var errores = new List<string>();
                            foreach (XmlNode errorNode in listaErroresNode.SelectNodes("string"))
                            {
                                errores.Add(errorNode.InnerText);
                            }
                            mensaje += " Detalles: " + string.Join("; ", errores);
                        }
                    }

                    _logger.LogInformation($"Resultado SOAP - HayError: {hayError}, Mensaje: {mensaje}");

                    return new PreInscripcionResult
                    {
                        Exito = !hayError,
                        Mensaje = mensaje
                    };
                }

                // Si no hay resultado específico, verificar si hay errores SOAP
                var faultNode = xmlDoc.SelectSingleNode("//soap:Fault", CreateNamespaceManager(xmlDoc));
                if (faultNode != null)
                {
                    var faultString = faultNode.SelectSingleNode(".//faultstring")?.InnerText ?? "Error SOAP";
                    _logger.LogError($"Error SOAP detectado: {faultString}");
                    return new PreInscripcionResult
                    {
                        Exito = false,
                        Mensaje = $"Error SOAP: {faultString}"
                    };
                }

                // Si no hay errores específicos, asumir éxito
                _logger.LogInformation("No se encontraron errores en la respuesta SOAP, asumiendo éxito");
                return new PreInscripcionResult
                {
                    Exito = true,
                    Mensaje = "Preinscripción enviada correctamente"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando respuesta SOAP");
                return new PreInscripcionResult
                {
                    Exito = false,
                    Mensaje = $"Error procesando respuesta: {ex.Message}"
                };
            }
        }

        private XmlNamespaceManager CreateNamespaceManager(XmlDocument doc)
        {
            var nsmgr = new XmlNamespaceManager(doc.NameTable);
            nsmgr.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
            return nsmgr;
        }

        private string EscapeXml(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return input
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\"", "&quot;")
                .Replace("'", "&apos;");
        }
    }

    public class PreInscripcionResult
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public DetallesHttp? DetallesHttp { get; set; }
    }

    public class DetallesHttp
    {
        public string Url { get; set; } = string.Empty;
        public string Metodo { get; set; } = string.Empty;
        public Dictionary<string, string> HeadersPeticion { get; set; } = new();
        public string? ContentType { get; set; }
        public string BodyPeticion { get; set; } = string.Empty;
        public string StatusCode { get; set; } = string.Empty;
        public Dictionary<string, string> HeadersRespuesta { get; set; } = new();
        public string BodyRespuesta { get; set; } = string.Empty;
    }
}
