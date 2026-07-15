import fs from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Genera un recibo únicamente por consumo de agua.
 *
 * @param {Object} datos
 * @param {number|string} datos.numeroRecibo
 * @param {string|Date} datos.fechaPago
 * @param {string} datos.nombreSocio
 * @param {string} datos.ci
 * @param {string|number} datos.numeroAccion
 * @param {string} datos.direccion
 * @param {string} datos.periodo
 * @param {string|number} datos.numeroMedidor
 * @param {number} datos.lecturaAnterior
 * @param {number} datos.lecturaActual
 * @param {number} datos.consumo
 * @param {number} datos.montoAgua
 * @param {string} datos.formaPago
 * @param {string} datos.cajero
 */
export async function generarReciboAguaPDF(datos) {
  const {
    numeroRecibo,
    fechaPago,
    nombreSocio,
    ci,
    numeroAccion,
    direccion,
    periodo,
    numeroMedidor,
    lecturaAnterior,
    lecturaActual,
    consumo,
    montoAgua,
    formaPago = 'Efectivo',
    cajero = 'Administrador',
  } = datos;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([396, 612]); // Media carta

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const negro = rgb(0.08, 0.08, 0.08);
  const gris = rgb(0.45, 0.45, 0.45);
  const grisClaro = rgb(0.86, 0.86, 0.86);
  const fondoSuave = rgb(0.97, 0.97, 0.97);

  const formatoNumero = (valor, decimales = 2) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return Number(0).toFixed(decimales);
    }

    return numero.toFixed(decimales);
  };

  const formatoRecibo = String(numeroRecibo ?? 0).padStart(6, '0');

  const formatoFecha = new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaPago ? new Date(fechaPago) : new Date());

  // Logo opcional
  let logo = null;

  try {
    const logoBytes = fs.readFileSync('./assets/logo.png');
    logo = await pdfDoc.embedPng(logoBytes);
  } catch {
    logo = null;
  }

  // Fondo
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1),
  });

  // Borde principal
  page.drawRectangle({
    x: 22,
    y: 25,
    width: width - 44,
    height: height - 50,
    borderColor: grisClaro,
    borderWidth: 1,
  });

  // Logo
  if (logo) {
    page.drawImage(logo, {
      x: 38,
      y: height - 82,
      width: 42,
      height: 42,
    });
  }

  const titleX = logo ? 90 : 38;

  // Encabezado
  page.drawText('COMITÉ DE AGUA POTABLE', {
    x: titleX,
    y: height - 50,
    size: 13,
    font: bold,
    color: negro,
  });

  page.drawText('HUAYLLANI OESTE', {
    x: titleX,
    y: height - 66,
    size: 13,
    font: bold,
    color: negro,
  });

  page.drawText('RECIBO DE PAGO DE AGUA', {
    x: titleX,
    y: height - 82,
    size: 8,
    font,
    color: gris,
  });

  // Número de recibo
  page.drawText('RECIBO', {
    x: width - 105,
    y: height - 50,
    size: 9,
    font: bold,
    color: gris,
  });

  page.drawText(`Nº ${formatoRecibo}`, {
    x: width - 105,
    y: height - 66,
    size: 11,
    font: bold,
    color: negro,
  });

  page.drawText(formatoFecha, {
    x: width - 105,
    y: height - 82,
    size: 8,
    font,
    color: gris,
  });

  page.drawLine({
    start: { x: 38, y: height - 100 },
    end: { x: width - 38, y: height - 100 },
    thickness: 1,
    color: grisClaro,
  });

  const drawRow = (label, value, y) => {
    page.drawText(String(label), {
      x: 42,
      y,
      size: 8.5,
      font,
      color: gris,
    });

    page.drawText(String(value ?? '-'), {
      x: 145,
      y,
      size: 8.5,
      font: bold,
      color: negro,
    });
  };

  // Datos del socio
  page.drawText('DATOS DEL SOCIO', {
    x: 38,
    y: 485,
    size: 9,
    font: bold,
    color: negro,
  });

  let y = 462;

  [
    ['Socio', nombreSocio],
    ['CI', ci],
    ['Acción', numeroAccion],
    ['Dirección', direccion],
  ].forEach(([label, value]) => {
    drawRow(label, value, y);
    y -= 18;
  });

  page.drawLine({
    start: { x: 38, y: 382 },
    end: { x: width - 38, y: 382 },
    thickness: 0.8,
    color: grisClaro,
  });

  // Lecturas y consumo
  page.drawText('LECTURAS Y CONSUMO', {
    x: 38,
    y: 360,
    size: 9,
    font: bold,
    color: negro,
  });

  y = 337;

  [
    ['Periodo', periodo],
    ['Medidor', numeroMedidor],
    ['Lectura anterior', `${formatoNumero(lecturaAnterior)} m³`],
    ['Lectura actual', `${formatoNumero(lecturaActual)} m³`],
    ['Consumo', `${formatoNumero(consumo)} m³`],
  ].forEach(([label, value]) => {
    drawRow(label, value, y);
    y -= 18;
  });

  page.drawLine({
    start: { x: 38, y: 238 },
    end: { x: width - 38, y: 238 },
    thickness: 0.8,
    color: grisClaro,
  });

  // Detalle del pago
  page.drawText('DETALLE DE COBRO', {
    x: 38,
    y: 216,
    size: 9,
    font: bold,
    color: negro,
  });

  page.drawRectangle({
    x: 38,
    y: 178,
    width: width - 76,
    height: 25,
    color: fondoSuave,
  });

  page.drawText('Concepto', {
    x: 48,
    y: 187,
    size: 8,
    font: bold,
    color: gris,
  });

  page.drawText('Importe', {
    x: width - 105,
    y: 187,
    size: 8,
    font: bold,
    color: gris,
  });

  page.drawText('Consumo de agua', {
    x: 48,
    y: 158,
    size: 9,
    font,
    color: negro,
  });

  page.drawText(`${formatoNumero(montoAgua)} Bs`, {
    x: width - 105,
    y: 158,
    size: 9,
    font: bold,
    color: negro,
  });

  // Total
  page.drawLine({
    start: { x: 38, y: 120 },
    end: { x: width - 38, y: 120 },
    thickness: 1,
    color: negro,
  });

  page.drawText('TOTAL PAGADO', {
    x: 48,
    y: 94,
    size: 10,
    font: bold,
    color: negro,
  });

  page.drawText(`${formatoNumero(montoAgua)} Bs`, {
    x: width - 125,
    y: 90,
    size: 16,
    font: bold,
    color: negro,
  });

  // Pie
  page.drawText(`Forma de pago: ${formaPago}`, {
    x: 38,
    y: 58,
    size: 7.5,
    font,
    color: gris,
  });

  page.drawText(`Cajero: ${cajero}`, {
    x: 38,
    y: 45,
    size: 7.5,
    font,
    color: gris,
  });

  page.drawLine({
    start: { x: width - 145, y: 58 },
    end: { x: width - 45, y: 58 },
    thickness: 0.7,
    color: gris,
  });

  page.drawText('Firma y sello', {
    x: width - 118,
    y: 45,
    size: 7.5,
    font,
    color: gris,
  });

  return pdfDoc.save();
}
