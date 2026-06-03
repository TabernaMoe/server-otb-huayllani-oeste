import { col, Op } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { accionModel } from '../../../models/accion/accion.model.js';
import { calleRamalModel } from '../../../models/calleRamal.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { tarifaModel } from '../../../models/tarifa/tarifa.model.js';
import { detallePagoAccion } from '../../../models/accion/detallePagoAccion.model.js';

export class accionServices {
  static async getAll(page = 1, limit = 10, search = '', estado = undefined) {}
  static async getId() {}
  static async create() {}
  static async update() {}
  static async toggleStatus() {}
}
