import { TokenSesion } from '../entities/TokenSesion';

export interface ITokenSesionRepository {
  create(token: TokenSesion): Promise<TokenSesion>;
  findById(id: string): Promise<TokenSesion | null>;
  findByToken(token: string): Promise<TokenSesion | null>;
  findByRnc(rnc: string): Promise<TokenSesion[]>;
  findActiveByRnc(rnc: string): Promise<TokenSesion | null>;
  update(token: TokenSesion): Promise<TokenSesion>;
  delete(id: string): Promise<void>;
  deactivateByRnc(rnc: string): Promise<void>;
  deleteExpired(): Promise<number>;
  countActiveByRnc(rnc: string): Promise<number>;
}
