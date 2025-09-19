import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { TipoECF, EstadoComprobante } from '../../shared/enums/DGIIEnums';

@Entity('comprobantes_electronicos')
@Index(['rncEmisor', 'encf'])
@Index(['trackId'])
@Index(['estado', 'fechaRecepcion'])
export class ComprobanteElectronico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  trackId: string;

  @Column({ type: 'varchar', length: 11 })
  rncEmisor: string;

  @Column({ type: 'varchar', length: 13 })
  encf: string;

  @Column({ type: 'integer' })
  tipoECF: TipoECF;

  @Column({ type: 'varchar', length: 150 })
  razonSocialEmisor: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  rncComprador: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  razonSocialComprador: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  montoTotal: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalITBIS: number;

  @Column({ type: 'integer', default: EstadoComprobante.EN_PROCESO })
  estado: EstadoComprobante;

  @Column({ type: 'text', nullable: true })
  mensajeEstado: string;

  @Column({ type: 'timestamp' })
  fechaEmision: Date;

  @Column({ type: 'timestamp' })
  fechaRecepcion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaProcesamiento: Date;

  @Column({ type: 'text', nullable: true })
  xmlOriginal: string;

  @Column({ type: 'text', nullable: true })
  xmlRespuesta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombreArchivoOriginal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombreArchivoRespuesta: string;

  @Column({ type: 'boolean', default: false })
  secuenciaUtilizada: boolean;

  @Column({ type: 'boolean', default: false })
  requiereAprobacion: boolean;

  @Column({ type: 'boolean', default: false })
  requiereAcuseRecibo: boolean;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Métodos de negocio
  isAccepted(): boolean {
    return this.estado === EstadoComprobante.ACEPTADO || 
           this.estado === EstadoComprobante.ACEPTADO_CONDICIONAL;
  }

  isRejected(): boolean {
    return this.estado === EstadoComprobante.RECHAZADO;
  }

  isInProcess(): boolean {
    return this.estado === EstadoComprobante.EN_PROCESO;
  }

  isNotFound(): boolean {
    return this.estado === EstadoComprobante.NO_ENCONTRADO;
  }

  canBeReused(): boolean {
    return this.isRejected() && !this.secuenciaUtilizada;
  }

  markAsProcessed(): void {
    this.estado = EstadoComprobante.ACEPTADO;
    this.fechaProcesamiento = new Date();
    this.secuenciaUtilizada = true;
    this.fechaActualizacion = new Date();
  }

  markAsRejected(mensaje: string): void {
    this.estado = EstadoComprobante.RECHAZADO;
    this.mensajeEstado = mensaje;
    this.fechaProcesamiento = new Date();
    this.fechaActualizacion = new Date();
  }

  updateEstado(nuevoEstado: EstadoComprobante, mensaje?: string): void {
    this.estado = nuevoEstado;
    if (mensaje) {
      this.mensajeEstado = mensaje;
    }
    this.fechaActualizacion = new Date();
  }
}
