import { Router } from 'express';
import { PersonaAdminController } from './PersonaAdmin.controller.js';
import { RolController } from '../auth/controller/rol.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import {
  personaAdminSchema,
  personaAdminUpdateSchema,
} from './personaAdmin.schema.js';
const routes = new Router();

routes
  .get('/', PersonaAdminController.getAll)
  .get('/rol', RolController.getSelect)
  .get('/:id', PersonaAdminController.getId)
  .post('/', validateSchema(personaAdminSchema), PersonaAdminController.create)
  .patch(
    '/:id',
    validateSchema(personaAdminUpdateSchema),
    PersonaAdminController.update,
  )
  .patch('/cambiar-estado/:id', PersonaAdminController.update);

export default routes;
