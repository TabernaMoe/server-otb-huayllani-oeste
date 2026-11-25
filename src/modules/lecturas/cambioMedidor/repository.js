import { cambioMedidor } from '../../../models/lecturasAgua/cambioMedidor.model';

export class CambioMedidorRepository {
  static async getByUltimaCambioByLectura({
    lectura_agua_id,
    transaction = null,
  }) {
    const data = await cambioMedidor.findOne({
      where: { lectura_agua_id },
      transaction,
      order: [['id', 'DESC']],
      raw: true,
    });
    return !data ? null : data;
  }
}
