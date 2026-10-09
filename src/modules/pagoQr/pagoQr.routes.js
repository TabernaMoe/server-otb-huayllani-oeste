import { Router } from 'express';

import { PagoQrController } from './pagoQr.controller.js';

const router = Router();

router.post('/', PagoQrController.generar);
router.get('/', PagoQrController.listar);
router.post('/conciliar/:fecha', PagoQrController.conciliar);
router.get('/:id/status', PagoQrController.verificarEstado);
router.get('/:id', PagoQrController.obtenerPorId);

export default router;
