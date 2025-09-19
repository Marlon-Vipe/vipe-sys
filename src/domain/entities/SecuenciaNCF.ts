import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { TipoECF } from '../../shared/enums/DGIIEnums';

@Entity('secuencias_ncf')
@Index(['rncEmisor', 'tipoECF'])
@Index(['rncEmisor', 'tipoECF', 'activa'])
export class SecuenciaNCF {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11 })
  rncEmisor: string;

  @Column({ type: 'integer' })
  tipoECF: TipoECF;

  @Column({ type: 'varchar', length: 13 })
  secuenciaDesde: string;

  @Column({ type: 'varchar', length: 13 })
  secuenciaHasta: string;

  @Column({ type: 'varchar', length: 13 })
  secuenciaActual: string;

  @Column({ type: 'integer' })
  cantidadAutorizada: number;

  @Column({ type: 'integer' })
  cantidadUtilizada: number;

  @Column({ type: 'integer' })
  cantidadDisponible: number;

  @Column({ type: 'date' })
  fechaAutorizacion: Date;

  @Column({ type: 'date' })
  fechaVencimiento: Date;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @Column({ type: 'boolean', default: false })
  anulada: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivoAnulacion: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaAnulacion: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  montoMaximo: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Métodos de negocio
  isExpired(): boolean {
    return new Date() > this.fechaVencimiento;
  }

  isActive(): boolean {
    return this.activa && !this.anulada && !this.isExpired();
  }

  hasAvailable(): boolean {
    return this.cantidadDisponible > 0;
  }

  canUse(secuencia: string): boolean {
    if (!this.isActive() || !this.hasAvailable()) {
      return false;
    }

    const secuenciaNum = parseInt(secuencia);
    const desdeNum = parseInt(this.secuenciaDesde);
    const hastaNum = parseInt(this.secuenciaHasta);

    return secuenciaNum >= desdeNum && secuenciaNum <= hastaNum;
  }

  useSecuencia(secuencia: string): boolean {
    if (!this.canUse(secuencia)) {
      return false;
    }

    this.cantidadUtilizada += 1;
    this.cantidadDisponible = this.cantidadAutorizada - this.cantidadUtilizada;
    this.secuenciaActual = secuencia;
    this.fechaActualizacion = new Date();

    return true;
  }

  anular(motivo: string): void {
    this.anulada = true;
    this.motivoAnulacion = motivo;
    this.fechaAnulacion = new Date();
    this.fechaActualizacion = new Date();
  }

  reactivar(): void {
    this.anulada = false;
    this.motivoAnulacion = null;
    this.fechaAnulacion = null;
    this.fechaActualizacion = new Date();
  }

  getUtilizationPercentage(): number {
    if (this.cantidadAutorizada === 0) return 0;
    return (this.cantidadUtilizada / this.cantidadAutorizada) * 100;
  }

  getDaysUntilExpiration(): number {
    const now = new Date();
    const diffTime = this.fechaVencimiento.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
