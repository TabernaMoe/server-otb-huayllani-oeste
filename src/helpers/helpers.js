export function fechaFormateada(fecha) {
  if (!fecha) {
    return 'Sin fecha';
  }
  const date = new Date(fecha);
  const fechaFormateada = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return fechaFormateada;
}
