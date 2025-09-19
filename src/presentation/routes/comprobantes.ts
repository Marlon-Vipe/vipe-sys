import { Router } from 'express';
import { ComprobanteElectronicoController } from '../controllers/ComprobanteElectronicoController';
import { AuthMiddleware } from '../middleware/auth';
import { rncRateLimit, documentRateLimit } from '../middleware/rateLimiter';

const router = Router();
const controller = new ComprobanteElectronicoController();
const authMiddleware = new AuthMiddleware();

// Aplicar rate limiting
router.use(rncRateLimit);

/**
 * @route POST /api/facturaselectronicas
 * @desc Recibir comprobantes fiscales electrónicos (e-CF)
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 * @middleware documentRateLimit
 */
router.post('/facturaselectronicas', 
  authMiddleware.validateToken.bind(authMiddleware),
  documentRateLimit,
  ComprobanteElectronicoController.uploadSingle,
  (req, res) => {
    controller.recibirECF(req, res);
  }
);

/**
 * @route POST /api/recepcion/ecf
 * @desc Recibir resúmenes de facturas de consumo (FC)
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 * @middleware documentRateLimit
 */
router.post('/recepcion/ecf',
  authMiddleware.validateToken.bind(authMiddleware),
  documentRateLimit,
  ComprobanteElectronicoController.uploadSingle,
  (req, res) => {
    controller.recibirECF(req, res);
  }
);

/**
 * @route GET /api/consultas/estado
 * @desc Consultar estado de comprobantes
 * @access Private
 * @middleware AuthMiddleware.validateToken
 */
router.get('/consultas/estado',
  authMiddleware.validateToken.bind(authMiddleware),
  (req, res) => {
    controller.consultarEstado(req, res);
  }
);

/**
 * @route GET /api/trackids/consulta
 * @desc Consultar TrackIds por RNC y eNCF
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 */
router.get('/trackids/consulta',
  authMiddleware.validateToken.bind(authMiddleware),
  authMiddleware.validateRNC.bind(authMiddleware),
  (req, res) => {
    controller.consultarTrackIds(req, res);
  }
);

/**
 * @route GET /api/Consultas/Consulta
 * @desc Consultar resumen de factura específico
 * @access Private
 * @middleware AuthMiddleware.validateToken
 */
router.get('/Consultas/Consulta',
  authMiddleware.validateToken.bind(authMiddleware),
  (req, res) => {
    controller.consultarEstado(req, res);
  }
);

/**
 * @route GET /api/consultas/listado
 * @desc Listar todos los contribuyentes electrónicos
 * @access Private
 * @middleware AuthMiddleware.validateToken
 */
router.get('/consultas/listado',
  authMiddleware.validateToken.bind(authMiddleware),
  (req, res) => {
    controller.consultarDirectorio(req, res);
  }
);

/**
 * @route GET /api/consultas/obtenerdirectorioporrnc
 * @desc Obtener directorio por RNC específico
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 */
router.get('/consultas/obtenerdirectorioporrnc',
  authMiddleware.validateToken.bind(authMiddleware),
  authMiddleware.validateRNC.bind(authMiddleware),
  (req, res) => {
    controller.consultarDirectorio(req, res);
  }
);

/**
 * @route POST /api/aprobacioncomercial
 * @desc Recibir aprobaciones comerciales
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 * @middleware documentRateLimit
 */
router.post('/aprobacioncomercial',
  authMiddleware.validateToken.bind(authMiddleware),
  documentRateLimit,
  ComprobanteElectronicoController.uploadSingle,
  (req, res) => {
    controller.aprobacionComercial(req, res);
  }
);

/**
 * @route POST /api/operaciones/anularrango
 * @desc Anular rangos de secuencias
 * @access Private
 * @middleware AuthMiddleware.validateToken, AuthMiddleware.validateRNC
 */
router.post('/operaciones/anularrango',
  authMiddleware.validateToken.bind(authMiddleware),
  authMiddleware.validateRNC.bind(authMiddleware),
  (req, res) => {
    controller.anularRango(req, res);
  }
);

/**
 * @route GET /api/estatusservicios/obtenerestatus
 * @desc Obtener estatus de servicios
 * @access Private
 * @middleware AuthMiddleware.validateToken
 */
router.get('/estatusservicios/obtenerestatus',
  authMiddleware.validateToken.bind(authMiddleware),
  (req, res) => {
    controller.obtenerEstatusServicios(req, res);
  }
);

/**
 * @route GET /api/estatusservicios/verificarestado
 * @desc Verificar estado de servicios
 * @access Private
 * @middleware AuthMiddleware.validateToken
 */
router.get('/estatusservicios/verificarestado',
  authMiddleware.validateToken.bind(authMiddleware),
  (req, res) => {
    controller.obtenerEstatusServicios(req, res);
  }
);

export default router;
