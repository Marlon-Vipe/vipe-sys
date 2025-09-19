import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { DGII_CONSTANTS } from '../../shared/constants/DGIIConstants';

// Rate limiter general
export const generalRateLimit = rateLimit({
  windowMs: DGII_CONSTANTS.RATE_LIMIT.WINDOW_MS,
  max: DGII_CONSTANTS.RATE_LIMIT.MAX_REQUESTS,
  message: {
    codigo: 429,
    estado: 'Demasiadas solicitudes',
    mensajes: [{
      valor: 'Ha excedido el límite de solicitudes permitidas. Intente nuevamente más tarde.',
      codigo: 429
    }]
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Saltar rate limiting para health checks
    return req.path === '/health' || req.path === '/api/health';
  }
});

// Rate limiter específico por RNC
export const rncRateLimit = rateLimit({
  windowMs: DGII_CONSTANTS.RATE_LIMIT.WINDOW_MS,
  max: 50, // Límite más estricto por RNC
  keyGenerator: (req: Request) => {
    // Usar RNC del usuario autenticado o de la petición
    const user = (req as any).user;
    const rnc = user?.rnc || req.params.rnc || req.body.rnc || req.query.rnc || req.ip;
    return `rnc:${rnc}`;
  },
  message: {
    codigo: 429,
    estado: 'Demasiadas solicitudes para este RNC',
    mensajes: [{
      valor: 'Ha excedido el límite de solicitudes para este RNC. Intente nuevamente más tarde.',
      codigo: 429
    }]
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para autenticación
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de autenticación por IP
  message: {
    codigo: 429,
    estado: 'Demasiados intentos de autenticación',
    mensajes: [{
      valor: 'Demasiados intentos de autenticación. Intente nuevamente en 15 minutos.',
      codigo: 429
    }]
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // No contar solicitudes exitosas
});

// Rate limiter para recepción de documentos
export const documentRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 documentos por minuto
  keyGenerator: (req: Request) => {
    const user = (req as any).user;
    return `doc:${user?.rnc || req.ip}`;
  },
  message: {
    codigo: 429,
    estado: 'Demasiados documentos enviados',
    mensajes: [{
      valor: 'Ha excedido el límite de documentos por minuto. Intente nuevamente más tarde.',
      codigo: 429
    }]
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware personalizado para logging de rate limiting
export const rateLimitLogger = (req: Request, res: Response, next: NextFunction): void => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    if (res.statusCode === 429) {
      console.warn(`Rate limit exceeded for ${req.ip} - ${req.method} ${req.path}`, {
        ip: req.ip,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};
