import { reciboModel } from '../../../models/cobros/recibo.model.js';
import { pagoModel } from '../../../models/cobros/pago.model.js';
import { pagoDetalleModel } from '../../../models/cobros/pago.model.js';
import { cobroModel } from '../../../models/cobros/cobro.model.js';
import { socioModel } from '../../../models/socio.model.js';
import { periodoModel } from '../../../models/gestiones/periodo.model.js';
import { accionModel } from '../../../models/accion/accion.model.js';

export class ReciboAguaRepository {
  static async create({ payload, transaction = null }) {
    const data = await reciboModel.create(payload, { transaction });
    return data;
  }
  static async getReciboWithDatos({ id, transaction = null }) {
    const data = await reciboModel.findByPk(id, {
      include: [
        {
          model: pagoModel,
          as: 'pago',
          include: [
            {
              model: cobroModel,
              as: 'cobrosRecibo',
              attributes: ['concepto', 'descripcion'],
              through: { attributes: [] },
            },
          ],
        },
      ],
      transaction,
    });

    return data;
  }
}
