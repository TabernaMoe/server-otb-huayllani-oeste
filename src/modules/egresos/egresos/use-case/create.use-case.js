import { EgresosRespository } from '../repository.js';
import { CategoriaGastosRespository } from '../../categoriaGastos/repository.js';
import { BeneficiarioRepository } from '../../beneficiario/repository.js';

export class CreateUseCase {
  static async execute({ payload }) {
    const buscarCategoria = await CategoriaGastosRespository.getById({
      id: payload.categoria_egreso_id,
    });
    if (!buscarCategoria) {
      const err = new Error('No se encontor el gasto');
      err.statusCode = 404;
      throw err;
    }

    const buscarBeneficiario = await BeneficiarioRepository.getByName({
      nombre_beneficiario: payload.beneficiario,
    });

    if (!buscarBeneficiario) {
      await BeneficiarioRepository.create({
        payload: {
          nombre_beneficiario: payload.beneficiario,
        },
      });
    }
    const data = await EgresosRespository.create({ payload });
    return data;
  }
}
