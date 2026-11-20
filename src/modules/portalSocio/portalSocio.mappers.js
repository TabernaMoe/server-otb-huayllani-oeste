function toNumber(value) {
  return Number(value ?? 0);
}

export function mapAccion(row) {
  const detalles = (row.detallesAccion ?? []).map((detalle) => ({
    id: detalle.id,
    nombre: detalle.nombre_accion,
    precio: toNumber(detalle.precio_accion),
    tipo_cobro: detalle.tipo_cobro,
    tipo_accion: detalle.tipoAccion?.nombre_tipo_accion ?? null,
  }));

  const tipos = [
    ...new Set(detalles.map((d) => d.tipo_accion).filter(Boolean)),
  ];

  return {
    id: row.id,
    codigo_interno: row.codigo_interno,
    tipo_servicio: row.tipo_servicio ?? 'AGUA',
    tipo: tipos.join(', ') || 'Sin tipo',
    nro_medidor: row.nro_medidor,
    calle: row.calleAccion?.nombre_calle ?? '-',
    tarifa: row.tarifaAccion?.nombre_tarifa ?? '-',
    direccion: row.direccion,
    observacion: row.observacion ?? '',
    estado: row.estado,
    detalles,
  };
}

export function mapLectura(row) {
  const precio = toNumber(row.precio);
  const mora = toNumber(row.mora);

  return {
    id: row.id,
    accion_id: row.lecturaAccion?.id,
    codigo_interno: row.lecturaAccion?.codigo_interno,
    nro_medidor: row.lecturaAccion?.nro_medidor,
    gestion: row.lecturaPeriodo?.gestion?.anio ?? null,
    mes: row.lecturaPeriodo?.mes ?? row.periodo,
    lectura_anterior: toNumber(row.lectura_anterior),
    lectura_actual: toNumber(row.lectura_actual),
    consumo_m3: toNumber(row.consumo_m3),
    precio,
    mora,
    monto: precio + mora,
    fecha: row.createdAt,
  };
}

export function mapCobroGeneral(item) {
  return {
    ...item,
    monto_total: toNumber(item.monto_total),
    monto_pagado: toNumber(item.monto_pagado),
    saldo: toNumber(item.saldo),
    origen: 'GENERAL',
    monto: toNumber(item.saldo),
  };
}

export function mapCobroAgua(item) {
  return {
    ...item,
    monto_total: toNumber(item.monto_total),
    monto_pagado: toNumber(item.monto_pagado),
    saldo: toNumber(item.saldo),
    tipo_cobro: 'AGUA',
    origen: 'AGUA',
    monto: toNumber(item.saldo),
  };
}

export function mapReciboGeneral(recibo, accionId = null) {
  const cobros = recibo.pago?.cobrosRecibo ?? [];

  const cobros_detalle = cobros.map((cobro) => ({
    id: cobro.id,
    concepto: cobro.concepto,
    descripcion: cobro.descripcion,
    tipo_cobro: cobro.tipo_cobro,
    monto: toNumber(cobro.pago_detalle?.monto),
    codigo_interno: cobro.accionCobro?.codigo_interno ?? null,
  }));

  const monto = cobros_detalle.reduce((total, item) => total + item.monto, 0);
  const conceptos = [...new Set(cobros.map((c) => c.concepto).filter(Boolean))];
  const firstAccion = cobros[0]?.accionCobro;

  return {
    id: recibo.id,
    numero_recibo: recibo.numero_recibo,
    fecha_emision: recibo.fecha_emision,
    monto: monto || toNumber(recibo.pago?.monto_pagado),
    metodo_pago: recibo.pago?.metodo_pago ?? 'EFECTIVO',
    origen: 'GENERAL',
    concepto: conceptos.join(', '),
    accion_id: accionId ?? cobros[0]?.accion_id ?? null,
    codigo_interno: firstAccion?.codigo_interno ?? null,
    cobros_detalle,
  };
}

export function mapReciboAgua(recibo) {
  const pago = recibo.reciboAguaRecibo;
  const cobro = pago?.pagoAgua;
  const monto = toNumber(pago?.monto);

  return {
    id: recibo.id,
    numero_recibo: recibo.numero_recibo,
    fecha_emision: recibo.fecha_emision,
    monto,
    metodo_pago: pago?.metodo_pago ?? 'EFECTIVO',
    origen: 'AGUA',
    concepto: cobro?.concepto ?? 'Pago de agua',
    accion_id: cobro?.accion_id ?? null,
    codigo_interno: cobro?.accionCobroAgua?.codigo_interno ?? null,
    cobros_detalle: [
      {
        id: cobro?.id ?? recibo.id,
        concepto: cobro?.concepto ?? 'Pago de agua',
        descripcion: cobro?.descripcion ?? '',
        tipo_cobro: 'AGUA',
        monto,
        codigo_interno: cobro?.accionCobroAgua?.codigo_interno ?? null,
      },
    ],
  };
}

export { toNumber };
