import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './shared/config/environment';
import { AppDataSource } from './shared/config/database';
import { generalRateLimit, rateLimitLogger } from './presentation/middleware/rateLimiter';
import autenticacionRoutes from './presentation/routes/autenticacion';
import comprobantesRoutes from './presentation/routes/comprobantes';

class Application {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('✅ Base de datos conectada exitosamente');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    // Seguridad
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: config.app.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compresión
    this.app.use(compression());

    // Logging
    this.app.use(morgan('combined'));

    // Rate limiting
    this.app.use(generalRateLimit);
    this.app.use(rateLimitLogger);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Headers de seguridad
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: config.app.nodeEnv
      });
    });

    // API Routes
    this.app.use('/api/autenticacion', autenticacionRoutes);
    this.app.use('/api', comprobantesRoutes);

    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.json({
        message: 'API de Facturación Electrónica DGII',
        version: '1.0.0',
        documentation: '/docs',
        health: '/health'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        codigo: 404,
        estado: 'Endpoint no encontrado',
        mensajes: [{
          valor: `La ruta ${req.originalUrl} no existe`,
          codigo: 404
        }]
      });
    });
  }

  private initializeErrorHandling(): void {
    // Error handler global
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error no manejado:', error);

      const statusCode = error.statusCode || 500;
      const message = error.message || 'Error interno del servidor';

      res.status(statusCode).json({
        codigo: statusCode,
        estado: 'Error interno del servidor',
        mensajes: [{
          valor: message,
          codigo: statusCode
        }],
        ...(config.app.nodeEnv === 'development' && { stack: error.stack })
      });
    });
  }

  public start(): void {
    const port = config.app.port;
    
    this.app.listen(port, () => {
      console.log(`🚀 Servidor iniciado en puerto ${port}`);
      console.log(`📊 Ambiente: ${config.app.nodeEnv}`);
      console.log(`🔗 URL: http://localhost:${port}`);
      console.log(`📚 Documentación: http://localhost:${port}/docs`);
      console.log(`❤️  Health Check: http://localhost:${port}/health`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Inicializar aplicación
const app = new Application();

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar servidor
app.start();

export default app;
