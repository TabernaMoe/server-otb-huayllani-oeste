import { Router } from 'express';
import { AccionController as controller } from '../controllers/accion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { accionSchema, accionUpdateSchema } from '../schema/acciones.schema.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/:id', controller.getId);
routes.post('/', validateSchema(accionSchema), controller.create);
routes.patch('/:id', validateSchema(accionUpdateSchema), controller.update);
routes.patch('/toggle-status/:id', controller.toggleStatus);

export default routes;
