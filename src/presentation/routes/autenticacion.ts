import { Router } from 'express';
import { AutenticacionController } from '../controllers/AutenticacionController';
import { AutenticacionService } from '../../application/services/AutenticacionService';
import { TokenSesionRepository } from '../../infrastructure/repositories/TokenSesionRepository';
import { LogTransaccionRepository } from '../../infrastructure/repositories/LogTransaccionRepository';
import { authRateLimit } from '../middleware/rateLimiter';

const router = Router();

// Inicializar servicios
const tokenRepository = new TokenSesionRepository();
const logRepository = new LogTransaccionRepository();
const autenticacionService = new AutenticacionService(tokenRepository, logRepository);
const autenticacionController = new AutenticacionController(autenticacionService);

// Aplicar rate limiting a todas las rutas de autenticación
router.use(authRateLimit);

/**
 * @route GET /api/autenticacion/semilla
 * @desc Obtener semilla para autenticación
 * @access Public
 * @query {string} rnc - RNC del contribuyente
 */
router.get('/semilla', (req, res) => {
  autenticacionController.obtenerSemilla(req, res);
});

/**
 * @route POST /api/autenticacion/validarsemilla
 * @desc Validar semilla firmada y obtener token
 * @access Public
 * @body {string} rnc - RNC del contribuyente
 * @body {string} semillaFirmada - Semilla firmada digitalmente
 */
router.post('/validarsemilla', (req, res) => {
  autenticacionController.validarSemilla(req, res);
});

/**
 * @route POST /api/autenticacion/renovar
 * @desc Renovar token de sesión
 * @access Private
 * @body {string} token - Token actual
 */
router.post('/renovar', (req, res) => {
  autenticacionController.renovarToken(req, res);
});

/**
 * @route POST /api/autenticacion/revocar
 * @desc Revocar token de sesión
 * @access Private
 * @body {string} token - Token a revocar
 */
router.post('/revocar', (req, res) => {
  autenticacionController.revocarToken(req, res);
});

export default router;
