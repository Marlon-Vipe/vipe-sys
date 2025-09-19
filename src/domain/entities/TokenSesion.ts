import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('tokens_sesion')
@Index(['rnc', 'activo'])
@Index(['token', 'activo'])
export class TokenSesion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11 })
  rnc: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'timestamp' })
  fechaExpiracion: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Métodos de negocio
  isExpired(): boolean {
    return new Date() > this.fechaExpiracion;
  }

  isActive(): boolean {
    return this.activo && !this.isExpired();
  }

  deactivate(): void {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  extendExpiration(hours: number = 1): void {
    this.fechaExpiracion = new Date(Date.now() + hours * 60 * 60 * 1000);
    this.fechaActualizacion = new Date();
  }
}
