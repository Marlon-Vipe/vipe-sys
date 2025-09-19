import { Repository } from 'typeorm';
import { AppDataSource } from '../../shared/config/database';
import { TokenSesion } from '../../domain/entities/TokenSesion';
import { ITokenSesionRepository } from '../../domain/repositories/ITokenSesionRepository';

export class TokenSesionRepository implements ITokenSesionRepository {
  private repository: Repository<TokenSesion>;

  constructor() {
    this.repository = AppDataSource.getRepository(TokenSesion);
  }

  async create(token: TokenSesion): Promise<TokenSesion> {
    return await this.repository.save(token);
  }

  async findById(id: string): Promise<TokenSesion | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByToken(token: string): Promise<TokenSesion | null> {
    return await this.repository.findOne({ 
      where: { token, activo: true } 
    });
  }

  async findByRnc(rnc: string): Promise<TokenSesion[]> {
    return await this.repository.find({ 
      where: { rnc },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findActiveByRnc(rnc: string): Promise<TokenSesion | null> {
    return await this.repository.findOne({ 
      where: { rnc, activo: true },
      order: { fechaCreacion: 'DESC' }
    });
  }

  async update(token: TokenSesion): Promise<TokenSesion> {
    return await this.repository.save(token);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deactivateByRnc(rnc: string): Promise<void> {
    await this.repository.update(
      { rnc, activo: true },
      { activo: false }
    );
  }

  async deleteExpired(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .where('fechaExpiracion < :now', { now: new Date() })
      .execute();
    
    return result.affected || 0;
  }

  async countActiveByRnc(rnc: string): Promise<number> {
    return await this.repository.count({ 
      where: { rnc, activo: true } 
    });
  }
}
