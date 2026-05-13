import { accionModel } from '../models/acciones/accion.model.js';

export const validarReferenciaCobro = async ({
  tipo_cobro,
  referencia_id,
  transaction,
}) => {
  if (!referencia_id) return null;

  if (tipo_cobro === 'ACCION') {
    const accion = await accionModel.findByPk(referencia_id, { transaction });

    if (!accion) {
      const err = new Error('La acción de referencia no existe');
      err.statusCode = 404;
      throw err;
    }

    return accion;
  }

  if (tipo_cobro === 'AGUA') {
    const consumo = await consumoAguaModel.findByPk(referencia_id, {
      transaction,
    });

    if (!consumo) {
      const err = new Error('El consumo de agua de referencia no existe');
      err.statusCode = 404;
      throw err;
    }

    return consumo;
  }

  return null;
};
