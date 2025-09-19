import { 
  RecepcionECFRequest, 
  RecepcionECFResponse, 
  ConsultaEstadoRequest, 
  ConsultaEstadoResponse,
  ValidacionXMLResult 
} from '../../shared/types/DGIITypes';

export interface IComprobanteElectronicoService {
  recibirECF(request: RecepcionECFRequest): Promise<RecepcionECFResponse>;
  consultarEstado(request: ConsultaEstadoRequest): Promise<ConsultaEstadoResponse>;
  validarXML(xmlContent: string): Promise<ValidacionXMLResult>;
  procesarComprobante(trackId: string): Promise<void>;
  generarAcuseRecibo(trackId: string): Promise<Buffer>;
  generarAprobacionComercial(trackId: string): Promise<Buffer>;
}
