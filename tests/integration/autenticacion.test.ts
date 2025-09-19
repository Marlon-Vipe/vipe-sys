import request from 'supertest';
import { AppDataSource } from '../../src/shared/config/database';

describe('Autenticación Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    // Inicializar base de datos de prueba
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Importar app después de inicializar la base de datos
    const { default: application } = await import('../../src/index');
    app = application.getApp();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    // Limpiar base de datos antes de cada prueba
    await AppDataSource.synchronize(true);
  });

  describe('GET /api/autenticacion/semilla', () => {
    it('debería obtener semilla con RNC válido', async () => {
      const response = await request(app)
        .get('/api/autenticacion/semilla')
        .query({ rnc: '123456789' })
        .expect(200);

      expect(response.body).toHaveProperty('valor');
      expect(response.body).toHaveProperty('fecha');
      expect(typeof response.body.valor).toBe('string');
      expect(response.body.valor.length).toBeGreaterThan(0);
    });

    it('debería rechazar RNC inválido', async () => {
      const response = await request(app)
        .get('/api/autenticacion/semilla')
        .query({ rnc: '123' })
        .expect(400);

      expect(response.body.codigo).toBe(400);
      expect(response.body.estado).toBe('Error de validación');
    });

    it('debería rechazar sin RNC', async () => {
      const response = await request(app)
        .get('/api/autenticacion/semilla')
        .expect(400);

      expect(response.body.codigo).toBe(400);
    });
  });

  describe('POST /api/autenticacion/validarsemilla', () => {
    it('debería validar semilla correctamente', async () => {
      const response = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789',
          semillaFirmada: 'valid-signed-seed'
        })
        .expect(200);

      expect(response.body.codigo).toBe(1);
      expect(response.body.estado).toBe('Aceptado');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expiracion');
    });

    it('debería rechazar semilla inválida', async () => {
      const response = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789',
          semillaFirmada: ''
        })
        .expect(400);

      expect(response.body.codigo).toBe(2);
      expect(response.body.estado).toBe('Rechazado');
    });

    it('debería rechazar datos faltantes', async () => {
      const response = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789'
        })
        .expect(400);

      expect(response.body.codigo).toBe(400);
      expect(response.body.estado).toBe('Error de validación');
    });
  });

  describe('POST /api/autenticacion/renovar', () => {
    it('debería renovar token válido', async () => {
      // Primero obtener un token
      const authResponse = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789',
          semillaFirmada: 'valid-signed-seed'
        });

      const token = authResponse.body.token;

      const response = await request(app)
        .post('/api/autenticacion/renovar')
        .send({ token })
        .expect(200);

      expect(response.body.codigo).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('debería rechazar token inválido', async () => {
      const response = await request(app)
        .post('/api/autenticacion/renovar')
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(response.body.codigo).toBe(400);
    });
  });

  describe('POST /api/autenticacion/revocar', () => {
    it('debería revocar token válido', async () => {
      // Primero obtener un token
      const authResponse = await request(app)
        .post('/api/autenticacion/validarsemilla')
        .send({
          rnc: '123456789',
          semillaFirmada: 'valid-signed-seed'
        });

      const token = authResponse.body.token;

      const response = await request(app)
        .post('/api/autenticacion/revocar')
        .send({ token })
        .expect(200);

      expect(response.body.codigo).toBe(200);
      expect(response.body.estado).toBe('Token revocado exitosamente');
    });
  });
});
