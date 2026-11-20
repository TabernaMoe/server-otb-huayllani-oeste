export function fechaBonita(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const getRangoFechas = ({ fechaInicio = null, fechaFin = null }) => {
  if (!fechaInicio || !fechaFin) {
    return null;
  }
  const inicio = new Date(`${fechaInicio}T00:00:00.000Z`);

  const fin = new Date(`${fechaFin}T00:00:00.000Z`);
  fin.setUTCDate(fin.getUTCDate() + 1);

  return { inicio, fin };
};
