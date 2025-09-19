import { Repository, Like } from 'typeorm';
import { AppDataSource } from '../../shared/config/database';
import { Contribuyente } from '../../domain/entities/Contribuyente';
import { IContribuyenteRepository } from '../../domain/repositories/IContribuyenteRepository';

export class ContribuyenteRepository implements IContribuyenteRepository {
  private repository: Repository<Contribuyente>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contribuyente);
  }

  async create(contribuyente: Contribuyente): Promise<Contribuyente> {
    return await this.repository.save(contribuyente);
  }

  async findById(id: string): Promise<Contribuyente | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByRnc(rnc: string): Promise<Contribuyente | null> {
    return await this.repository.findOne({ where: { rnc } });
  }

  async findByRazonSocial(razonSocial: string): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { razonSocial: Like(`%${razonSocial}%`) },
      order: { razonSocial: 'ASC' }
    });
  }

  async findByEstado(estado: string): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { estado },
      order: { razonSocial: 'ASC' }
    });
  }

  async findActive(): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { activo: true },
      order: { razonSocial: 'ASC' }
    });
  }

  async findElectronicEmitters(): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { esEmisorElectronico: true, activo: true },
      order: { razonSocial: 'ASC' }
    });
  }

  async findElectronicReceivers(): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { esReceptorElectronico: true, activo: true },
      order: { razonSocial: 'ASC' }
    });
  }

  async update(contribuyente: Contribuyente): Promise<Contribuyente> {
    return await this.repository.save(contribuyente);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByEstado(estado: string): Promise<number> {
    return await this.repository.count({ where: { estado } });
  }

  async findUpdatedAfter(fecha: Date): Promise<Contribuyente[]> {
    return await this.repository.find({ 
      where: { fechaUltimaActualizacion: fecha },
      order: { fechaUltimaActualizacion: 'DESC' }
    });
  }

  async searchByText(texto: string): Promise<Contribuyente[]> {
    return await this.repository
      .createQueryBuilder('contribuyente')
      .where('contribuyente.razonSocial ILIKE :texto', { texto: `%${texto}%` })
      .orWhere('contribuyente.nombreComercial ILIKE :texto', { texto: `%${texto}%` })
      .orWhere('contribuyente.rnc ILIKE :texto', { texto: `%${texto}%` })
      .orderBy('contribuyente.razonSocial', 'ASC')
      .getMany();
  }

  async isRncValid(rnc: string): Promise<boolean> {
    const contribuyente = await this.findByRnc(rnc);
    return contribuyente ? contribuyente.isRNCValid() : false;
  }

  async isRncActive(rnc: string): Promise<boolean> {
    const contribuyente = await this.findByRnc(rnc);
    return contribuyente ? contribuyente.isActive() : false;
  }

  async canEmitElectronically(rnc: string): Promise<boolean> {
    const contribuyente = await this.findByRnc(rnc);
    return contribuyente ? contribuyente.canEmit() : false;
  }

  async canReceiveElectronically(rnc: string): Promise<boolean> {
    const contribuyente = await this.findByRnc(rnc);
    return contribuyente ? contribuyente.canReceive() : false;
  }
}
