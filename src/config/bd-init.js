import { sequelize } from './database.js';

// auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { personaAdminModel } from '../models/auth/personaAdmin.js';
import { auditoriaModel } from '../models/auth/auditoria.model.js';

// Catálogos base
import { calleRamalModel } from '../models/calleRamal.model.js';
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { rangoTarifaModel } from '../models/tarifa/rango.model.js';
import { socioModel } from '../models/socio.model.js';

// Acciones
import { tipoAccionModel } from '../models/accion/tipoAccion.model.js';
import { detalleAccionModel } from '../models/accion/detalleAccion.model.js';
import { accionModel } from '../models/accion/accion.model.js';
import { accionDetalleModel } from '../models/accion/accionDetalle.model.js';

// Gestiones y periodos
import { gestionModel } from '../models/gestiones/gestion.model.js';
import { periodoModel } from '../models/gestiones/periodo.model.js';

// Cobros generales, pagos y recibos
import { cobroModel } from '../models/cobros/cobro.model.js';
import { cobroAccionModel } from '../models/cobros/tipoCobros/cobroAccion.model.js';
import { pagoDetalleModel, pagoModel } from '../models/cobros/pago.model.js';
import { reciboModel } from '../models/cobros/recibo.model.js';

// Lecturas y cobro de agua
import { lecturaAguaModel } from '../models/lecturasAgua/lecturasAgua.model.js';
import { cambioMedidor } from '../models/lecturasAgua/cambioMedidor.model.js';
import { cobroAguaModel } from '../models/cobroAgua/cobroAgua.model.js';
import { CobroLecturaModel } from '../models/cobroAgua/cobrosLectura.model.js';
import { pagoAguaModel } from '../models/cobroAgua/pagoAgua.model.js';
import { reciboAguaModel } from '../models/cobroAgua/recibo.mode.js';

// Inventario y asambleas
import { inventarioModel } from '../models/inventario.model.js';
import { asambleaModel } from '../models/asamblea/asamblea.model.js';
import { asistenciaAsambleaModel } from '../models/asamblea/asistenciaAsamblea.model.js';
import { cobroAsamblea } from '../models/cobros/tipoCobros/cobroAsamblea.model.js';

// Multas
import { multaModel } from '../models/multas.model.js';
import { cobroMultaModel } from '../models/cobros/tipoCobros/cobroMulta.model.js';

// Alcantarillado
import {
  accionDetalleAlcantarilladoModel,
  detalleAlcantarilladoModel,
} from '../models/accionAlcantarillado/detalleAlcantarillado.model.js';
import { accionAlcantarilladoModel } from '../models/accionAlcantarillado/acccionAlcantarillado.model.js';
import { cobroAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/cobroAlcantarillado.model.js';
import {
  pagoAlcantarilladoModel,
  pagoDetalleAlcantarilladoModel,
} from '../models/accionAlcantarillado/cobroAlcantarillado/pagoAlcantarillado.model.js';
import { reciboAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/reciboAlcantarillado.model.js';
import { cobroAccionAlcantarilladoModel } from '../models/accionAlcantarillado/cobroAlcantarillado/tipoCobros/cobroAccionAlcantarillado.model.js';

// Pago QR
import {
  pagoQrModel,
  PagoQrDetalleModel,
} from '../modules/pagoQr/pagoQr.model.js';

// Cambio de nombre
import { cambiarNombreModel } from '../models/cambioNombre.model.js';
import { cobroCambioNombreModel } from '../models/cobros/tipoCobros/cobroCambioNombre.model.js';

// Egresos
import { CategoriaGastosModel } from '../models/egresos/categoriaGasto.model.js';
import { EgresosModel } from '../models/egresos/egresos.model.js';
import { BeneficiarioEgresosModel } from '../models/egresos/beneficiario.model.js';

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

    // 1. Auth
    await permisoModel.sync({ alter: false });
    await rolModel.sync({ alter: false });
    await permisoRolModel.sync({ alter: false });
    await usuarioModel.sync({ alter: false });
    await personaAdminModel.sync({ alter: false });
    await auditoriaModel.sync({ alter: false });

    // 2. Calles, Tarifas y Socios
    await calleRamalModel.sync({ alter: false });
    await tarifaModel.sync({ alter: false });
    await rangoTarifaModel.sync({ alter: false });
    await socioModel.sync({ alter: false });

    // 3. Acciones
    await tipoAccionModel.sync({ alter: false });
    await detalleAccionModel.sync({ alter: false });
    await accionModel.sync({ alter: false });
    await accionDetalleModel.sync({ alter: false });

    // 4. Gestiones y Periodos
    await gestionModel.sync({ alter: false });
    await periodoModel.sync({ alter: false });

    // 5. Cobros generales, Pagos y Recibos
    await cobroModel.sync({ alter: false });
    await cobroAccionModel.sync({ alter: false });
    await pagoModel.sync({ alter: false });
    await pagoDetalleModel.sync({ alter: false });
    await reciboModel.sync({ alter: false });

    // 6. Lecturas y Cobros de agua
    await lecturaAguaModel.sync({ alter: false });
    await cambioMedidor.sync({ alter: false });
    await cobroAguaModel.sync({ alter: false });
    await CobroLecturaModel.sync({ alter: false });
    await pagoAguaModel.sync({ alter: false });
    await reciboAguaModel.sync({ alter: false });

    // 7. Inventario
    await inventarioModel.sync({ alter: false });

    // 8. Asambleas
    await asambleaModel.sync({ alter: false });
    await asistenciaAsambleaModel.sync({ alter: false });
    await cobroAsamblea.sync({ alter: false });

    // 9. Pago QR
    await pagoQrModel.sync({ alter: false });
    await PagoQrDetalleModel.sync({ alter: false });

    // 10. Multas
    await multaModel.sync({ alter: false });
    await cobroMultaModel.sync({ alter: false });

    // 11. Cambio de nombre
    await cambiarNombreModel.sync({ alter: false });
    await cobroCambioNombreModel.sync({ alter: false });

    // 12. Alcantarillado
    await detalleAlcantarilladoModel.sync({ alter: false });
    await accionAlcantarilladoModel.sync({ alter: false });
    await accionDetalleAlcantarilladoModel.sync({ alter: false });
    await cobroAlcantarilladoModel.sync({ alter: false });
    await pagoAlcantarilladoModel.sync({ alter: false });
    await pagoDetalleAlcantarilladoModel.sync({ alter: false });
    await reciboAlcantarilladoModel.sync({ alter: false });
    await cobroAccionAlcantarilladoModel.sync({ alter: false });

    // 13. Egresos
    await CategoriaGastosModel.sync({ alter: false });
    await BeneficiarioEgresosModel.sync({ alter: false });
    await EgresosModel.sync({ alter: false });

    console.log(
      `✅ Tablas cargadas correctamente${shouldResetDatabase ? ' (reiniciadas)' : ''}`,
    );
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}