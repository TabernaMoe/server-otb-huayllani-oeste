import { AccionAlcantarilladoRepository } from '../repository.js';
import { SocioRepository } from '../../../../socios/socio.repository.js';
import { CobroRepository } from '../../../../cobrosGenerales/cobro/repository.js';
import { CobroCambioNombreRespository } from '../../../../cobrosGenerales/tipoCobro/CobroCambioNombre.respository.js';
import { CambioNombreRepository } from '../../../cambioNombre/cambioNombre.respository.js';
import { sequelize } from '../../../../../config/database.js';

export class ChangeNameUseCase {
  static async execute({ payload }) {
    return sequelize.transaction(async (t) => {
      const { accion_id, socio_nuevo_id, tipo, observacion, monto } = payload;
      const buscarAccion = await AccionAlcantarilladoRepository.getById({
        id: accion_id,
        transaction: t,
      });
      if (!buscarAccion) {
        const err = new Error('No encontro la accion');
        err.statusCode = 404;
        throw err;
      }
      const socioAntiguo = await SocioRepository.getById({
        id: buscarAccion.socio_id,
        transaction: t,
      });
      const socioNuevo = await SocioRepository.getById({
        id: socio_nuevo_id,
        transaction: t,
      });

      if (!socioAntiguo || !socioNuevo) {
        const err = new Error('No se encontro el socio');
        err.statusCode = 404;
        throw err;
      }

      const crearCambioNombre = await CambioNombreRepository.create({
        payload: {
          accion_id: buscarAccion.id,
          socio_antiguo_id: socioAntiguo.id,
          socio_nuevo_id: socioNuevo.id,
          socio_antiguo_snapshot: `${socioAntiguo.ci_socio} ${socioAntiguo.nombres} ${socioAntiguo.primer_apellido} ${socioAntiguo.segundo_apellido}`,
          socio_nuevo_snapshot: `${socioNuevo.ci_socio} ${socioNuevo.nombres} ${socioNuevo.primer_apellido} ${socioNuevo.segundo_apellido}`,
          tipo,
          observacion,
          monto: tipo == 'FAMILIAR' ? 0 : monto,
        },
        transaction: t,
      });

      await AccionAlcantarilladoRepository.update({
        id: accion_id,
        payload: { socio_id: socio_nuevo_id },
        transaction: t,
      });

      if (tipo == 'AJENO') {
        const crearCobro = await CobroRepository.create({
          payload: {
            socio_id: socioNuevo.id,
            accion_id: accion.id,
            periodo_id: periodo.id,
            tipo_cobro: 'CAMBIO_NOMBRE_ACCION_ALCANTARILLADO',
            concepto: 'CAMBIO DE NOMBRE DE ACCION AJENO',
            descripcion: `CAMBIO DE NOMBRE DE  ${socioAntiguo.ci_socio} ${socioAntiguo.nombres} ${socioAntiguo.primer_apellido} ${socioAntiguo.segundo_apellido} a ${socioNuevo.ci_socio} ${socioNuevo.nombres} ${socioNuevo.primer_apellido} ${socioNuevo.segundo_apellido}`,
            monto_total: monto,
            saldo: monto,
          },
          transaction: t,
        });

        await CobroCambioNombreRespository.create({
          payload: {
            cobro_id: crearCobro.id,
            cambio_nombre_id: crearCambioNombre.id,
            monto,
            tipo_servicio: 'ALCANTARILLADO',
          },
          transaction: t,
        });
      }
      return crearCambioNombre;
    });
  }
}
