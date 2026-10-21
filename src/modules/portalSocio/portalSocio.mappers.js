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
    ...new Set(
      detalles
        .map((detalle) => detalle.tipo_accion)
        .filter(Boolean),
    ),
  ];

  return {
    id: row.id,
    codigo_interno: row.codigo_interno,
    tipo: tipos.join(', ') || 'Sin tipo',
    nro_medidor: row.nro_medidor,
    calle: row.calleAccion?.nombre_calle ?? '-',
    tarifa: row.tarifaAccion?.nombre_tarifa ?? '-',
    direccion: row.direccion,
    estado: row.estado,
    detalles,
  };
}

export function mapLectura(row) {
  return {
    id: row.id,
    accion_id: row.lecturaAccion?.id,
    codigo_interno: row.lecturaAccion?.codigo_interno,
    nro_medidor: row.lecturaAccion?.nro_medidor,
    gestion: row.lecturaPeriodo?.gestion?.anio ?? null,
    mes: row.lecturaPeriodo?.mes ?? row.periodo,
    lectura_anterior: row.lectura_anterior,
    lectura_actual: row.lectura_actual,
    consumo_m3: row.consumo_m3,
    monto: toNumber(row.precio) + toNumber(row.mora),
    fecha: row.createdAt,
  };
}

export function mapCobroGeneral(item) {
  return {
    ...item,
    origen: 'GENERAL',
    monto: toNumber(item.saldo),
  };
}

export function mapCobroAgua(item) {
  return {
    ...item,
    tipo_cobro: 'AGUA',
    origen: 'AGUA',
    monto: toNumber(item.saldo),
  };
}

export { toNumber };
