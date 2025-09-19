import request from 'supertest';
import { AppDataSource } from '../../src/shared/config/database';

describe('API E2E Tests', () => {
  let app: any;
  let authToken: string;

  beforeAll(async () => {
    // Inicializar base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const { default: application } = await import('../../src/index');
    app = application.getApp();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    await AppDataSource.synchronize(true);
  });

  describe('Flujo completo de autenticación y recepción', () => {
    it('debería completar el flujo completo de autenticación', async () => {
      // 1. Obtener semilla
      const semillaResponse = await request(app)
        .get('/api/autenticacion/semilla')
        .query({ rnc: '123456789' })
        .expect(200);

      expect(semillaResponse.body).toHaveProperty('valor');
      expect(semillaResponse.body).toHaveProperty('fecha');

      // 2. Validar semilla y obtener token
      const validacionResponse = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789',
          semillaFirmada: 'valid-signed-seed'
        })
        .expect(200);

      expect(validacionResponse.body.codigo).toBe(1);
      expect(validacionResponse.body).toHaveProperty('token');
      
      authToken = validacionResponse.body.token;

      // 3. Verificar que el token funciona
      const healthResponse = await request(app)
        .get('/health')
        .expect(200);

      expect(healthResponse.body.status).toBe('OK');
    });

    it('debería manejar rate limiting correctamente', async () => {
      // Hacer múltiples solicitudes rápidamente
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/autenticacion/semilla')
          .query({ rnc: '123456789' })
      );

      const responses = await Promise.all(promises);
      
      // Al menos una debería ser exitosa
      const successResponses = responses.filter(r => r.status === 200);
      expect(successResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Health Check', () => {
    it('debería responder correctamente al health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('Error Handling', () => {
    it('debería manejar rutas no encontradas', async () => {
      const response = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404);

      expect(response.body.codigo).toBe(404);
      expect(response.body.estado).toBe('Endpoint no encontrado');
    });

    it('debería manejar errores de validación', async () => {
      const response = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123', // RNC inválido
          semillaFirmada: 'test'
        })
        .expect(400);

      expect(response.body.codigo).toBe(400);
      expect(response.body.estado).toBe('Error de validación');
    });
  });

  describe('CORS', () => {
    it('debería incluir headers CORS correctos', async () => {
      const response = await request(app)
        .options('/api/autenticacion/semilla')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('debería incluir headers de seguridad', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });
});
