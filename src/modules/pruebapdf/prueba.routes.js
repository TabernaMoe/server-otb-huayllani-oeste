import { Router } from 'express';
import { generarReciboPDF } from '../../helpers/GenerarReciboPDF.js';

const routes = new Router();

routes.get('/recibo', async (req, res) => {
  const pdfBytes = await generarReciboPDF();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=recibo.pdf');

  res.send(Buffer.from(pdfBytes));
});

export default routes;
