import { sequelize } from './database.js';

//auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { personaAdminModel } from '../models/auth/personaAdmin.js';
import { auditoriaModel } from '../models/auth/auditoria.model.js';

//Primera
import { calleRamalModel } from '../models/calleRamal.model.js';
//
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { rangoTarifaModel } from '../models/tarifa/rango.model.js';
//
import { socioModel } from '../models/socio.model.js';
//
import { detallePagoAccion } from '../models/accion/detallePagoAccion.model.js';
//
import { accionModel } from '../models/accion/accion.model.js';
import { accionDetalleModel } from '../models/accion/accionDetalle.model.js';
//
import { gestionModel } from '../models/gestiones/gestion.model.js';
import { periodoModel } from '../models/gestiones/periodo.model.js';
//
import { cobroModel } from '../models/cobros/cobro.model.js';
import { cobroAccionModel } from '../models/cobros/tipoCobros/cobroAccion.model.js';
import { pagoDetalleModel, pagoModel } from '../models/cobros/pago.model.js';
import { reciboModel } from '../models/cobros/recibo.model.js';
//cobro agua
import { cobroAguaModel } from '../models/cobroAgua/cobroAgua.model.js';
import { CobroLecturaModel } from '../models/cobroAgua/cobrosLectura.model.js';
import { pagoAguaModel } from '../models/cobroAgua/pagoAgua.model.js';
import { reciboAguaModel } from '../models/cobroAgua/recibo.mode.js';
//lectura
import { lecturaAguaModel } from '../models/lecturasAgua/lecturasAgua.model.js';
import { cambioMedidor } from '../models/lecturasAgua/cambioMedidor.model.js';
import { tipoAccionModel } from '../models/accion/tipoAccion.model.js';
//inventario
import { inventarioModel } from '../models/inventario.model.js';
import { asambleaModel } from '../models/asamblea/asamblea.model.js';
import { asistenciaAsambleaModel } from '../models/asamblea/asistenciaAsamblea.model.js';
import { cobroAsamblea } from '../models/cobros/tipoCobros/cobroAsamblea.model.js';
//multas
import { multaModel } from '../models/multas.model.js';
import { cobroMultaModel } from '../models/cobros/tipoCobros/cobroMulta.model.js';

//

import {
  accionDetalleAlcantarilladoModel,
  detalleAlcantarilladoModel,
} from '../models/accionAlcantarillado/detalleAlcantarillado.model.js';
import { accionAlcantarilladoModel } from '../models/accionAlcantarillado/acccionAlcantarillado.model.js';
//
import { cobroAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/cobroAlcantarillado.model.js';
import {
  pagoAlcantarilladoModel,
  pagoDetalleAlcantarilladoModel,
} from '../models/accionAlcantarillado/cobroAlcantarillado/pagoAlcantarillado.model.js';
import { reciboAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/reciboAlcantarillado.model.js';
import { cobroAccionAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/tipoCobros/cobroAccionAlcantarillado.model.js';
//qr
import {
  pagoQrModel,
  PagoQrDetalleModel,
} from '../modules/pagoQr/pagoQr.model.js';

//
import { cambiarNombreModel } from '../models/cambioNombre.model.js';
import { cobroCambioNombreModel } from '../models/cobros/tipoCobros/cobroCambioNombre.model.js';

export async function ConnectDB() {
  const shouldResetDatabase = process.env.RESET_DB_ON_START === 'true';
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');

    if (shouldResetDatabase) {
      console.log('🧹 Reiniciando tablas de desarrollo...');
      await sequelize.drop({ cascade: true });
    }

    // //Primera migracion
     await permisoModel.sync({ force: false });
     await rolModel.sync({ force: false });
     await permisoRolModel.sync({ force: false });
     await usuarioModel.sync({ force: false });
     await personaAdminModel.sync({ force: false });
     await auditoriaModel.sync({ force: false });
    // //Segunda Migracion
     await calleRamalModel.sync({ force: false });
    // //Tercera migracion
     await tarifaModel.sync({ force: false });
     await rangoTarifaModel.sync({ force: false });
    // //Cuartea migracion
     await socioModel.sync({ force: false });
    // //Quinta Migracion
     await tipoAccionModel.sync({ force: false });
     await detallePagoAccion.sync({ force: false });
    // //
     await accionModel.sync({ force: false });
     await accionDetalleModel.sync({ force: false });
    // Gestiones
     await gestionModel.sync({ force: false });
     await periodoModel.sync({ force: false });
    // //
     await cobroModel.sync({ force: false });
     await cobroAccionModel.sync({ force: false });
     await pagoModel.sync({ force: false });
     await pagoDetalleModel.sync({ force: false });
     await reciboModel.sync({ force: false });

    // //
    await lecturaAguaModel.sync({ force: false });
    await cambioMedidor.sync({ force: false });
    // //
     await cobroAguaModel.sync({ force: false });
     await CobroLecturaModel.sync({ force: false });
     await pagoAguaModel.sync({ force: false });
     await reciboAguaModel.sync({ force: false });

     await inventarioModel.sync({ force: false });

     await asambleaModel.sync({ force: false });
     await asistenciaAsambleaModel.sync({ force: false });
     await cobroAsamblea.sync({ force: false });

     await pagoQrModel.sync({ force: false });
     await PagoQrDetalleModel.sync({ force: false });

     await multaModel.sync({ force: false });
     await cobroMultaModel.sync({ force: false });

    // // cambio nombre
     await cambiarNombreModel.sync({ force: false });
     await cobroCambioNombreModel.sync({ force: false });

     await detalleAlcantarilladoModel.sync({ force: false });
     await accionAlcantarilladoModel.sync({ force: false });
     await accionDetalleAlcantarilladoModel.sync({ force: false });

    // // //
     await cobroAlcantarilladoModel.sync({ force: false });
   await pagoAlcantarilladoModel.sync({ force: false });
     await pagoDetalleAlcantarilladoModel.sync({ force: false });
     await reciboAlcantarilladoModel.sync({ force: false });
     await cobroAccionAlcantarilladoModel.sync({ force: false });

    console.log(`✅ Tablas cargadas correctamente${shouldResetDatabase ? ' (reiniciadas)' : ''}`);
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
