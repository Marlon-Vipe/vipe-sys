import { AutenticacionService } from '../../../src/application/services/AutenticacionService';
import { ITokenSesionRepository } from '../../../src/domain/repositories/ITokenSesionRepository';
import { ILogTransaccionRepository } from '../../../src/domain/repositories/ILogTransaccionRepository';
import { TokenSesion } from '../../../src/domain/entities/TokenSesion';

// Mock de repositorios
const mockTokenRepository: jest.Mocked<ITokenSesionRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByToken: jest.fn(),
  findByRnc: jest.fn(),
  findActiveByRnc: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deactivateByRnc: jest.fn(),
  deleteExpired: jest.fn(),
  countActiveByRnc: jest.fn(),
};

const mockLogRepository: jest.Mocked<ILogTransaccionRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByRnc: jest.fn(),
  findByTrackId: jest.fn(),
  findByTipoOperacion: jest.fn(),
  findByNivel: jest.fn(),
  findByFechaRange: jest.fn(),
  findByExito: jest.fn(),
  countByRnc: jest.fn(),
  countByTipoOperacion: jest.fn(),
  countByNivel: jest.fn(),
  countByExito: jest.fn(),
  findErrors: jest.fn(),
  findSlowQueries: jest.fn(),
  deleteOldLogs: jest.fn(),
  getMetricsByDateRange: jest.fn(),
};

describe('AutenticacionService', () => {
  let autenticacionService: AutenticacionService;

  beforeEach(() => {
    jest.clearAllMocks();
    autenticacionService = new AutenticacionService(mockTokenRepository, mockLogRepository);
  });

  describe('obtenerSemilla', () => {
    it('debería generar una semilla válida', async () => {
      const request = { rnc: '123456789' };
      
      const result = await autenticacionService.obtenerSemilla(request);
      
      expect(result).toHaveProperty('valor');
      expect(result).toHaveProperty('fecha');
      expect(typeof result.valor).toBe('string');
      expect(result.valor.length).toBeGreaterThan(0);
      expect(mockLogRepository.create).toHaveBeenCalled();
    });

    it('debería manejar errores correctamente', async () => {
      const request = { rnc: '123456789' };
      mockLogRepository.create.mockRejectedValue(new Error('Database error'));
      
      await expect(autenticacionService.obtenerSemilla(request)).rejects.toThrow('Database error');
    });
  });

  describe('validarSemilla', () => {
    it('debería validar semilla correctamente y generar token', async () => {
      const request = {
        rnc: '123456789',
        semillaFirmada: 'valid-signed-seed'
      };

      const mockToken = new TokenSesion();
      mockToken.rnc = request.rnc;
      mockToken.token = 'generated-token';
      mockToken.fechaExpiracion = new Date(Date.now() + 3600000);
      mockToken.activo = true;

      mockTokenRepository.findActiveByRnc.mockResolvedValue(null);
      mockTokenRepository.create.mockResolvedValue(mockToken);
      mockLogRepository.create.mockResolvedValue({} as any);

      const result = await autenticacionService.validarSemilla(request);

      expect(result.codigo).toBe(1); // ACEPTADO
      expect(result.estado).toBe('Aceptado');
      expect(result).toHaveProperty('token');
      expect(mockTokenRepository.create).toHaveBeenCalled();
    });

    it('debería rechazar semilla inválida', async () => {
      const request = {
        rnc: '123456789',
        semillaFirmada: ''
      };

      mockLogRepository.create.mockResolvedValue({} as any);

      const result = await autenticacionService.validarSemilla(request);

      expect(result.codigo).toBe(2); // RECHAZADO
      expect(result.estado).toBe('Rechazado');
      expect(result.mensajes[0].valor).toContain('Certificado digital inválido');
    });
  });

  describe('validarToken', () => {
    it('debería validar token válido', async () => {
      const token = 'valid-token';
      const mockToken = new TokenSesion();
      mockToken.activo = true;
      mockToken.fechaExpiracion = new Date(Date.now() + 3600000);

      mockTokenRepository.findByToken.mockResolvedValue(mockToken);

      const result = await autenticacionService.validarToken(token);

      expect(result).toBe(true);
    });

    it('debería rechazar token inválido', async () => {
      const token = 'invalid-token';
      mockTokenRepository.findByToken.mockResolvedValue(null);

      const result = await autenticacionService.validarToken(token);

      expect(result).toBe(false);
    });
  });

  describe('renovarToken', () => {
    it('debería renovar token válido', async () => {
      const token = 'valid-token';
      const mockToken = new TokenSesion();
      mockToken.rnc = '123456789';
      mockToken.activo = true;
      mockToken.fechaExpiracion = new Date(Date.now() + 3600000);

      mockTokenRepository.findByToken.mockResolvedValue(mockToken);
      mockTokenRepository.update.mockResolvedValue(mockToken);

      const result = await autenticacionService.renovarToken(token);

      expect(typeof result).toBe('string');
      expect(mockTokenRepository.update).toHaveBeenCalled();
    });

    it('debería lanzar error para token inválido', async () => {
      const token = 'invalid-token';
      mockTokenRepository.findByToken.mockResolvedValue(null);

      await expect(autenticacionService.renovarToken(token)).rejects.toThrow('Token inválido o expirado');
    });
  });

  describe('revocarToken', () => {
    it('debería revocar token existente', async () => {
      const token = 'valid-token';
      const mockToken = new TokenSesion();
      mockToken.activo = true;

      mockTokenRepository.findByToken.mockResolvedValue(mockToken);
      mockTokenRepository.update.mockResolvedValue(mockToken);

      await autenticacionService.revocarToken(token);

      expect(mockToken.activo).toBe(false);
      expect(mockTokenRepository.update).toHaveBeenCalled();
    });

    it('debería manejar token inexistente', async () => {
      const token = 'non-existent-token';
      mockTokenRepository.findByToken.mockResolvedValue(null);

      await expect(autenticacionService.revocarToken(token)).resolves.not.toThrow();
    });
  });

  describe('limpiarTokensExpirados', () => {
    it('debería limpiar tokens expirados', async () => {
      const deletedCount = 5;
      mockTokenRepository.deleteExpired.mockResolvedValue(deletedCount);

      const result = await autenticacionService.limpiarTokensExpirados();

      expect(result).toBe(deletedCount);
      expect(mockTokenRepository.deleteExpired).toHaveBeenCalled();
    });
  });
});
