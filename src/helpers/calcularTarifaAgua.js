export function calcularTarifaAgua(consumo, rangos) {
  if (!Number.isFinite(consumo) || consumo < 0) {
    const err = new Error('El consumo no es válido');
    err.statusCode = 400;
    throw err;
  }

  if (!Array.isArray(rangos) || rangos.length === 0) {
    throw new Error('La tarifa no tiene rangos configurados');
  }

  const rangosOrdenados = [...rangos].sort(
    (a, b) => Number(a.consumo_minimo) - Number(b.consumo_minimo),
  );

  let consumoRestante = consumo;
  let totalPagar = 0;
  let limiteAnterior = 0;

  for (const rango of rangosOrdenados) {
    if (consumoRestante <= 0) break;

    const minimo = Number(rango.consumo_minimo);

    const maximo =
      rango.consumo_maximo === null ? Infinity : Number(rango.consumo_maximo);

    const precio = Number(rango.precio);

    if (
      !Number.isFinite(minimo) ||
      !(maximo > minimo) ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      minimo !== limiteAnterior
    ) {
      throw new Error('La configuración de rangos no es válida');
    }

    const cantidadRango = maximo - minimo;

    const consumoCobrado = Math.min(consumoRestante, cantidadRango);

    totalPagar += consumoCobrado * precio;
    consumoRestante -= consumoCobrado;

    limiteAnterior = maximo;
  }

  if (consumoRestante > 0) {
    throw new Error('Los rangos de la tarifa no cubren todo el consumo');
  }

  return Number(totalPagar.toFixed(2));
}
