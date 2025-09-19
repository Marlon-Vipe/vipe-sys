import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { TipoDocumentoIdentidad } from '../../shared/enums/DGIIEnums';

@Entity('contribuyentes')
@Index(['rnc'], { unique: true })
@Index(['estado', 'fechaActualizacion'])
export class Contribuyente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  rnc: string;

  @Column({ type: 'varchar', length: 150 })
  razonSocial: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nombreComercial: string;

  @Column({ type: 'enum', enum: TipoDocumentoIdentidad })
  tipoDocumento: TipoDocumentoIdentidad;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  estado: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'boolean', default: false })
  esEmisorElectronico: boolean;

  @Column({ type: 'boolean', default: false })
  esReceptorElectronico: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaInicioActividad: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFinActividad: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaUltimaActualizacion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Métodos de negocio
  isActive(): boolean {
    return this.activo && this.estado === 'ACTIVO';
  }

  canEmit(): boolean {
    return this.isActive() && this.esEmisorElectronico;
  }

  canReceive(): boolean {
    return this.isActive() && this.esReceptorElectronico;
  }

  activate(): void {
    this.activo = true;
    this.estado = 'ACTIVO';
    this.fechaActualizacion = new Date();
  }

  deactivate(): void {
    this.activo = false;
    this.estado = 'INACTIVO';
    this.fechaActualizacion = new Date();
  }

  enableElectronicEmission(): void {
    this.esEmisorElectronico = true;
    this.fechaActualizacion = new Date();
  }

  disableElectronicEmission(): void {
    this.esEmisorElectronico = false;
    this.fechaActualizacion = new Date();
  }

  enableElectronicReception(): void {
    this.esReceptorElectronico = true;
    this.fechaActualizacion = new Date();
  }

  disableElectronicReception(): void {
    this.esReceptorElectronico = false;
    this.fechaActualizacion = new Date();
  }

  updateFromDGII(data: Partial<Contribuyente>): void {
    Object.assign(this, data);
    this.fechaUltimaActualizacion = new Date();
    this.fechaActualizacion = new Date();
  }

  getDisplayName(): string {
    return this.nombreComercial || this.razonSocial;
  }

  isRNCValid(): boolean {
    // Validación básica de RNC (9 o 11 dígitos)
    return /^\d{9}$|^\d{11}$/.test(this.rnc);
  }
}
