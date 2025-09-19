import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { TipoOperacion } from '../../shared/enums/DGIIEnums';

@Entity('logs_transacciones')
@Index(['rnc', 'fechaTransaccion'])
@Index(['trackId'])
@Index(['tipoOperacion', 'fechaTransaccion'])
@Index(['nivel', 'fechaTransaccion'])
export class LogTransaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  rnc: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  trackId: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  encf: string;

  @Column({ type: 'enum', enum: TipoOperacion })
  tipoOperacion: TipoOperacion;

  @Column({ type: 'varchar', length: 20 })
  nivel: 'error' | 'warn' | 'info' | 'debug';

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'text', nullable: true })
  contexto: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  endpoint: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  metodoHttp: string;

  @Column({ type: 'integer', nullable: true })
  codigoRespuesta: number;

  @Column({ type: 'integer', nullable: true })
  tiempoRespuesta: number;

  @Column({ type: 'text', nullable: true })
  requestBody: string;

  @Column({ type: 'text', nullable: true })
  responseBody: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  archivoNombre: string;

  @Column({ type: 'integer', nullable: true })
  archivoTamaño: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  certificadoSerial: string;

  @Column({ type: 'boolean', default: false })
  exito: boolean;

  @Column({ type: 'text', nullable: true })
  stackTrace: string;

  @CreateDateColumn()
  fechaTransaccion: Date;

  // Métodos de negocio
  static createError(
    mensaje: string,
    contexto: Record<string, any>,
    rnc?: string,
    trackId?: string
  ): LogTransaccion {
    const log = new LogTransaccion();
    log.nivel = 'error';
    log.mensaje = mensaje;
    log.contexto = JSON.stringify(contexto);
    log.rnc = rnc;
    log.trackId = trackId;
    log.exito = false;
    log.fechaTransaccion = new Date();
    return log;
  }

  static createInfo(
    mensaje: string,
    contexto: Record<string, any>,
    rnc?: string,
    trackId?: string
  ): LogTransaccion {
    const log = new LogTransaccion();
    log.nivel = 'info';
    log.mensaje = mensaje;
    log.contexto = JSON.stringify(contexto);
    log.rnc = rnc;
    log.trackId = trackId;
    log.exito = true;
    log.fechaTransaccion = new Date();
    return log;
  }

  static createWarning(
    mensaje: string,
    contexto: Record<string, any>,
    rnc?: string,
    trackId?: string
  ): LogTransaccion {
    const log = new LogTransaccion();
    log.nivel = 'warn';
    log.mensaje = mensaje;
    log.contexto = JSON.stringify(contexto);
    log.rnc = rnc;
    log.trackId = trackId;
    log.exito = true;
    log.fechaTransaccion = new Date();
    return log;
  }

  static createDebug(
    mensaje: string,
    contexto: Record<string, any>,
    rnc?: string,
    trackId?: string
  ): LogTransaccion {
    const log = new LogTransaccion();
    log.nivel = 'debug';
    log.mensaje = mensaje;
    log.contexto = JSON.stringify(contexto);
    log.rnc = rnc;
    log.trackId = trackId;
    log.exito = true;
    log.fechaTransaccion = new Date();
    return log;
  }

  setRequestInfo(
    endpoint: string,
    metodoHttp: string,
    requestBody?: string,
    ipAddress?: string,
    userAgent?: string
  ): void {
    this.endpoint = endpoint;
    this.metodoHttp = metodoHttp;
    this.requestBody = requestBody;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }

  setResponseInfo(
    codigoRespuesta: number,
    tiempoRespuesta: number,
    responseBody?: string
  ): void {
    this.codigoRespuesta = codigoRespuesta;
    this.tiempoRespuesta = tiempoRespuesta;
    this.responseBody = responseBody;
    this.exito = codigoRespuesta >= 200 && codigoRespuesta < 300;
  }

  setFileInfo(
    archivoNombre: string,
    archivoTamaño: number,
    certificadoSerial?: string
  ): void {
    this.archivoNombre = archivoNombre;
    this.archivoTamaño = archivoTamaño;
    this.certificadoSerial = certificadoSerial;
  }

  setError(error: Error, stackTrace?: string): void {
    this.mensaje = error.message;
    this.stackTrace = stackTrace || error.stack;
    this.exito = false;
    this.nivel = 'error';
  }

  getContextoAsObject(): Record<string, any> {
    try {
      return JSON.parse(this.contexto || '{}');
    } catch {
      return {};
    }
  }
}
