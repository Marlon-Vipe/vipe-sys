import 'reflect-metadata';

// Configuración global para las pruebas
beforeAll(async () => {
  // Configurar variables de entorno para testing
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'vipe_dgii_test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.DGII_ENVIRONMENT = 'pre-cert';
});

afterAll(async () => {
  // Limpiar recursos después de todas las pruebas
});

// Mock de console para evitar logs en las pruebas
const originalConsole = console;
beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
});

afterEach(() => {
  global.console = originalConsole;
  jest.clearAllMocks();
});
