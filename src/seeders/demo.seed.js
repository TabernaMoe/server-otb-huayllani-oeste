import bcrypt from 'bcrypt';
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
import { personaAdminModel } from '../models/auth/personaAdmin.js';
import { socioModel } from '../models/socio.model.js';
import { calleRamalModel } from '../models/calleRamal.model.js';
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { rangoTarifaModel } from '../models/tarifa/rango.model.js';
import { tipoAccionModel } from '../models/accion/tipoAccion.model.js';
import { detallePagoAccion } from '../models/accion/detallePagoAccion.model.js';
import { accionModel } from '../models/accion/accion.model.js';
import { accionDetalleModel } from '../models/accion/accionDetalle.model.js';
import { gestionModel } from '../models/gestiones/gestion.model.js';
import { periodoModel } from '../models/gestiones/periodo.model.js';
import { multaModel } from '../models/multas.model.js';
import { lecturaAguaModel } from '../models/lecturasAgua/lecturasAgua.model.js';
import { cobroAguaModel } from '../models/cobroAgua/cobroAgua.model.js';
import { CobroLecturaModel } from '../models/cobroAgua/cobrosLectura.model.js';
import { cobroModel } from '../models/cobros/cobro.model.js';
import { pagoModel, pagoDetalleModel } from '../models/cobros/pago.model.js';
import { reciboModel } from '../models/cobros/recibo.model.js';
import { pagoAguaModel } from '../models/cobroAgua/pagoAgua.model.js';
import { reciboAguaModel } from '../models/cobroAgua/recibo.mode.js';
import { asambleaModel } from '../models/asamblea/asamblea.model.js';
import { asistenciaAsambleaModel } from '../models/asamblea/asistenciaAsamblea.model.js';
import { accionDetalleAlcantarilladoModel, detalleAlcantarilladoModel } from '../models/accionAlcantarillado/detalleAlcantarillado.model.js';
import { accionAlcantarilladoModel } from '../models/accionAlcantarillado/acccionAlcantarillado.model.js';

const PERMISSIONS = [
  ['Ver socio', 'socio.ver'], ['Crear Socio', 'socio.crear'], ['Editar Socio', 'socio.editar'], ['Estado Socio', 'socio.estado'],
  ['Ver tarifa', 'tarifa.ver'], ['Crear tarifa', 'tarifa.crear'], ['Editar tarifa', 'tarifa.editar'], ['Estado tarifa', 'tarifa.estado'], ['Eliminar tarifa', 'tarifa.eliminar'],
  ['Ver calles', 'calle.ver'], ['Crear calles', 'calle.crear'], ['Editar calles', 'calle.editar'], ['Estado calles', 'calle.estado'], ['Eliminar calles', 'calle.eliminar'],
  ['Ver detalle acciones', 'acciones.detalle.ver'], ['Crear detalle acciones', 'acciones.detalle.crear'], ['Editar detalle acciones', 'acciones.detalle.editar'], ['Estado detalle acciones', 'acciones.detalle.estado'], ['Eliminar detalle acciones', 'acciones.detalle.eliminar'],
  ['Ver accion', 'acciones.accion.ver'], ['Crear accion', 'acciones.accion.crear'], ['Editar accion', 'acciones.accion.editar'],
  ['Ver cobro', 'cobro.ver'], ['Pagar cobro', 'cobro.pagar'],
  ['Ver lectura', 'lectura.ver'], ['Crear lectura', 'lectura.crear'], ['Editar lectura', 'lectura.editar'], ['Cambio lectura', 'lectura.cambio'],
  ['Ver cobros agua', 'cobros.ver'], ['Pagar cobros agua', 'cobros.pagar'],
];

const STREETS = ['Av. Villazon','Ñancahuasu','Max Fernandez','Pando','Bolivia','1ro de Mayo','Sucre','Samuel Fino','Toroncho'];
const SOCIOS = [
  ['80000001','CB','Ana','Rojas','Mamani','70000001','FEMENINO','Av. Villazon #101'],
  ['80000002','CB','Carlos','Vargas','Lopez','70000002','MASCULINO','Ñancahuasu #22'],
  ['80000003','CB','Maria','Flores','Quispe','70000003','FEMENINO','Pando #45'],
  ['80000004','CB','Jorge','Mendoza','Rios','70000004','MASCULINO','Bolivia #80'],
  ['80000005','CB','Lucia','Fernandez','Cruz','70000005','FEMENINO','Sucre #15'],
  ['80000006','CB','Pedro','Condori','Soto','70000006','MASCULINO','1ro de Mayo #33'],
  ['80000007','CB','Rosa','Gutierrez','Vega','70000007','FEMENINO','Samuel Fino #9'],
  ['80000008','CB','Miguel','Paredes','Luna','70000008','MASCULINO','Toroncho #17'],
];
const MONTHS = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

async function findOrCreateBy(model, where, defaults = {}) {
  const [record] = await model.findOrCreate({ where, defaults: { ...where, ...defaults } });
  return record;
}

async function seedSecurity() {
  const permissionRecords = [];
  for (const [nombre_permiso, codigo_permiso] of PERMISSIONS) {
    permissionRecords.push(await findOrCreateBy(permisoModel, { codigo_permiso }, { nombre_permiso }));
  }
  const superAdminRole = await findOrCreateBy(rolModel, { nombre_rol: 'super_admin' });
  const socioRole = await findOrCreateBy(rolModel, { nombre_rol: 'usuario_normal' });
  const secretariaRole = await findOrCreateBy(rolModel, { nombre_rol: 'secretaria' });
  const lecturadorRole = await findOrCreateBy(rolModel, { nombre_rol: 'lecturador' });

  for (const permission of permissionRecords) {
    await permisoRolModel.findOrCreate({ where: { rol_id: superAdminRole.id, permiso_id: permission.id } });
  }
  for (const permission of permissionRecords.filter((p) => p.codigo_permiso !== 'lectura.cambio')) {
    await permisoRolModel.findOrCreate({ where: { rol_id: secretariaRole.id, permiso_id: permission.id } });
  }
  const lecturadorCodes = ['socio.ver','acciones.accion.ver','lectura.ver','lectura.crear','lectura.editar','lectura.cambio','cobros.ver'];
  for (const permission of permissionRecords.filter((p) => lecturadorCodes.includes(p.codigo_permiso))) {
    await permisoRolModel.findOrCreate({ where: { rol_id: lecturadorRole.id, permiso_id: permission.id } });
  }

  const adminPassword = await bcrypt.hash('admin_super_admin', 12);
  await usuarioModel.findOrCreate({ where: { nombre_usuario: 'super_admin' }, defaults: { contrasenia_usuario: adminPassword, rol_id: superAdminRole.id, estado: true, debe_camibiar_contrasenia: false } });

  const secretaryPassword = await bcrypt.hash('Secretaria123!', 12);
  const [secretary] = await usuarioModel.findOrCreate({ where: { nombre_usuario: 'secretaria_demo' }, defaults: { contrasenia_usuario: secretaryPassword, rol_id: secretariaRole.id, estado: true, debe_camibiar_contrasenia: false } });
  await personaAdminModel.findOrCreate({ where: { usuario_id: secretary.id }, defaults: { cargo: 'Secretaria', cedula_identidad: '90000001', ci_expedido: 'CB', nombre: 'Secretaria', apellido_paterno: 'Demo', apellido_materno: 'OTB' } });

  const lectorPassword = await bcrypt.hash('Lecturador123!', 12);
  const [lecturador] = await usuarioModel.findOrCreate({ where: { nombre_usuario: 'lecturador_demo' }, defaults: { contrasenia_usuario: lectorPassword, rol_id: lecturadorRole.id, estado: true, debe_camibiar_contrasenia: false } });
  await personaAdminModel.findOrCreate({ where: { usuario_id: lecturador.id }, defaults: { cargo: 'Lecturador', cedula_identidad: '90000002', ci_expedido: 'CB', nombre: 'Lecturador', apellido_paterno: 'Demo', apellido_materno: 'OTB' } });
  return { socioRole };
}

async function seedCatalogs() {
  const streets = [];
  for (const nombre_calle of STREETS) streets.push(await findOrCreateBy(calleRamalModel, { nombre_calle }, { estado: true }));

  const tariffDefinitions = [
    { name: 'Domiciliaria', ranges: [[0,10,10],[11,20,20],[21,30,30],[31,null,40]] },
    { name: 'Comercial', ranges: [[0,10,15],[11,20,25],[21,30,40],[31,null,55]] },
    { name: 'Social', ranges: [[0,10,5],[11,20,10],[21,30,20],[31,null,30]] },
  ];
  const tariffs = [];
  for (const definition of tariffDefinitions) {
    const tariff = await findOrCreateBy(tarifaModel, { nombre_tarifa: definition.name }, { estado: true });
    tariffs.push(tariff);
    for (const [consumo_minimo, consumo_maximo, precio] of definition.ranges) {
      await rangoTarifaModel.findOrCreate({ where: { tarifa_id: tariff.id, consumo_minimo }, defaults: { consumo_maximo, precio } });
    }
  }

  const agua = await findOrCreateBy(tipoAccionModel, { nombre_tipo_accion: 'AGUA POTABLE' });
  const social = await findOrCreateBy(tipoAccionModel, { nombre_tipo_accion: 'SOCIAL' });
  const comercial = await findOrCreateBy(tipoAccionModel, { nombre_tipo_accion: 'COMERCIAL' });
  const details = [];
  for (const [tipo_accion_id, nombre_accion, precio_accion, tipo_cobro] of [
    [agua.id,'Compra de acción de agua',1200,'UNICO'], [agua.id,'Carnet de socio',50,'UNICO'], [agua.id,'Mantenimiento mensual',20,'MENSUAL'],
    [social.id,'Acción social',700,'UNICO'], [social.id,'Mantenimiento social',10,'MENSUAL'], [comercial.id,'Acción comercial',1800,'UNICO'],
  ]) {
    details.push(await findOrCreateBy(detallePagoAccion, { tipo_accion_id, nombre_accion }, { precio_accion, tipo_cobro, estado: true }));
  }

  const sewerDetails = [];
  for (const [nombre_accion, precio_accion, tipo_cobro] of [['Derecho de alcantarillado',350,'UNICO'],['Mantenimiento alcantarillado',15,'MENSUAL'],['Conexión domiciliaria',200,'UNICO']]) {
    sewerDetails.push(await findOrCreateBy(detalleAlcantarilladoModel, { nombre_accion }, { precio_accion, tipo_cobro, estado: true }));
  }
  for (const [nombre_multa, precio] of [['Falta a asamblea',100],['Retraso a asamblea',20],['Basura en la calle',200],['Daño a infraestructura',300]]) {
    await findOrCreateBy(multaModel, { nombre_multa }, { precio, estado: true });
  }
  return { streets, tariffs, details, sewerDetails };
}

async function seedGestion() {
  const gestion = await findOrCreateBy(gestionModel, { anio: 2026 }, { fecha_inicio: '2026-01-01', fecha_fin: '2026-12-31', estado: 'ACTIVO' });
  const periods = [];
  for (let i = 0; i < MONTHS.length; i += 1) {
    const month = i + 1;
    const start = `2026-${String(month).padStart(2,'0')}-01`;
    const end = new Date(month === 12 ? '2027-01-01T00:00:00Z' : `2026-${String(month + 1).padStart(2,'0')}-01T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() - 1);
    const estado = month < 10 ? 'CERRADO' : month === 10 ? 'ACTIVO' : 'PENDIENTE';
    periods.push(await findOrCreateBy(periodoModel, { gestion_id: gestion.id, numero_mes: month }, { mes: MONTHS[i], fecha_inicio: start, fecha_fin: end.toISOString().slice(0,10), estado }));
  }
  return { periods };
}

async function seedSocios(socioRole) {
  const socios = [];
  for (const [ci,ci_expedido,nombres,primer_apellido,segundo_apellido,numero_celular,genero,direccion] of SOCIOS) {
    const hash = await bcrypt.hash(ci, 12);
    const [user] = await usuarioModel.findOrCreate({ where: { nombre_usuario: ci }, defaults: { contrasenia_usuario: hash, rol_id: socioRole.id, estado: true, debe_camibiar_contrasenia: true } });
    const [socio] = await socioModel.findOrCreate({ where: { ci_socio: Number(ci) }, defaults: { user_id: user.id, ci_expedido, nombres, primer_apellido, segundo_apellido, numero_celular, genero, direccion, estado: true } });
    socios.push(socio);
  }
  return socios;
}

async function seedActions({ socios, streets, tariffs, details, sewerDetails }) {
  const actions = [];
  for (let i = 0; i < socios.length; i += 1) {
    const [action] = await accionModel.findOrCreate({ where: { codigo_interno: 1001 + i }, defaults: { socio_id: socios[i].id, calle_id: streets[i % streets.length].id, tarifa_id: tariffs[i % tariffs.length].id, nro_medidor: `MED-${String(i + 1).padStart(4,'0')}`, direccion: SOCIOS[i][7], observacion: i === 6 ? 'Acción pasiva para pruebas de adelantos' : 'Dato demo generado por seeder', estado: i === 6 ? 'PASIVO' : 'ACTIVO' } });
    actions.push(action);
    const selected = i % 3 === 0 ? [details[0], details[1], details[2]] : [details[1], details[2]];
    for (const detail of selected) await accionDetalleModel.findOrCreate({ where: { accion_id: action.id, detalle_pago_accion_id: detail.id } });
  }

  for (let i = 0; i < 5; i += 1) {
    const [action] = await accionAlcantarilladoModel.findOrCreate({ where: { codigo_interno: 5001 + i }, defaults: { socio_id: socios[i].id, calle_id: streets[(i + 2) % streets.length].id, direccion: SOCIOS[i][7], observacion: 'Acción de alcantarillado de prueba', estado: true, paso_a_accion_agua: i === 0 } });
    for (const detail of sewerDetails.slice(0, i % 2 === 0 ? 3 : 2)) {
      await accionDetalleAlcantarilladoModel.findOrCreate({ where: { accion_alcantarillado_id: action.id, detalle_alcantarillado_id: detail.id } });
    }
  }
  return { actions };
}

async function seedReadingsAndCharges({ socios, actions, periods }) {
  const periodMap = new Map(periods.map((p) => [p.numero_mes, p]));
  for (let a = 0; a < Math.min(actions.length, 6); a += 1) {
    let previous = 100 + a * 7;
    for (const month of [8,9,10]) {
      const consumption = 5 + ((a + month) % 8);
      const current = previous + consumption;
      const price = consumption <= 10 ? 10 : 20;
      const period = periodMap.get(month);
      const [reading] = await lecturaAguaModel.findOrCreate({ where: { accion_id: actions[a].id, periodo_id: period.id }, defaults: { lectura_anterior: previous, lectura_actual: current, consumo_m3: consumption, precio: price, mora: month === 8 ? 5 : 0, periodo: period.mes, observacion: 'Lectura demo', estado: true, puede_editar: month === 10, pude_editar_m3: month === 10, puede_editar_mora: true } });
      const total = price + (month === 8 ? 5 : 0);
      const paid = month === 8 && a < 2;
      const [charge] = await cobroAguaModel.findOrCreate({ where: { lectura_id: reading.id }, defaults: { accion_id: actions[a].id, socio_id: socios[a].id, periodo_id: period.id, concepto: `Consumo de agua ${period.mes}`, descripcion: `Lectura ${previous} → ${current} m³`, monto_total: total, monto_pagado: paid ? total : 0, saldo: paid ? 0 : total, estado: paid ? 'PAGADO' : 'PENDIENTE' } });
      await CobroLecturaModel.findOrCreate({ where: { lectura_agua_id: reading.id, cobro_agua_id: charge.id }, defaults: { mora: month === 8 ? 5 : 0, monto_lectura: price, observacion: 'Cobro demo' } });
      if (paid) {
        const [payment] = await pagoAguaModel.findOrCreate({ where: { cobro_agua_id: charge.id }, defaults: { monto: total, metodo_pago: 'EFECTIVO', observacion: 'Pago demo' } });
        await reciboAguaModel.findOrCreate({ where: { pago_agua_id: payment.id }, defaults: { numero_recibo: 7000 + payment.id } });
      }
      previous = current;
    }
  }

  for (let i = 0; i < Math.min(actions.length, 5); i += 1) {
    const period = periodMap.get(10);
    const paid = i === 0;
    const [charge] = await cobroModel.findOrCreate({ where: { accion_id: actions[i].id, periodo_id: period.id, concepto: 'Mantenimiento octubre' }, defaults: { socio_id: socios[i].id, tipo_cobro: 'MANTENIMIENTO', descripcion: 'Mantenimiento mensual de acción', monto_total: 20, monto_pagado: paid ? 20 : 0, saldo: paid ? 0 : 20, estado: paid ? 'PAGADO' : 'PENDIENTE' } });
    if (paid) {
      const [payment] = await pagoModel.findOrCreate({ where: { monto_pagado: 20, metodo_pago: 'EFECTIVO' }, defaults: { fecha_pago: new Date('2026-10-05T10:00:00Z') } });
      await pagoDetalleModel.findOrCreate({ where: { cobro_id: charge.id, pago_id: payment.id }, defaults: { monto: 20 } });
      await reciboModel.findOrCreate({ where: { pago_id: payment.id }, defaults: { numero_recibo: 6000 + payment.id, fecha_emision: new Date('2026-10-05T10:05:00Z'), estado: true } });
    }
  }
}

async function seedAssemblies(actions, periods) {
  const period = periods.find((p) => p.numero_mes === 10) ?? periods[0];
  const [assembly] = await asambleaModel.findOrCreate({ where: { titulo: 'Asamblea general octubre 2026', fecha: '2026-10-04' }, defaults: { periodo_id: period.id, hora_inicio: '18:00', lugar: 'Casa OTB', monto_multa: 100, monto_retraso: 20, estado: true } });
  const states = ['ASISTIO','FALTA','RETRASO','PERMISO','ASISTIO','SIN EFECTO'];
  for (let i = 0; i < Math.min(actions.length, states.length); i += 1) {
    await asistenciaAsambleaModel.findOrCreate({ where: { asamblea_id: assembly.id, accion_id: actions[i].id }, defaults: { asistio: states[i], observacion: states[i] === 'ASISTIO' ? 'Asistencia normal' : `Estado demo: ${states[i]}` } });
  }
}

export async function seedDemoData() {
  console.log('🌱 Cargando datos demo...');
  const { socioRole } = await seedSecurity();
  const catalogs = await seedCatalogs();
  const { periods } = await seedGestion();
  const socios = await seedSocios(socioRole);
  const { actions } = await seedActions({ socios, ...catalogs });
  await seedReadingsAndCharges({ socios, actions, periods });
  await seedAssemblies(actions, periods);
  console.log('✅ Datos demo cargados correctamente');
  console.log('Credenciales:');
  console.log('  super_admin / admin_super_admin');
  console.log('  secretaria_demo / Secretaria123!');
  console.log('  lecturador_demo / Lecturador123!');
  console.log('  socios 80000001..80000008 / misma CI');
}
