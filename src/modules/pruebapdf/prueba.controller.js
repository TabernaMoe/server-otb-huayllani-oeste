import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generarReciboPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([396, 612]); // media carta

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const negro = rgb(0.08, 0.08, 0.08);
  const gris = rgb(0.45, 0.45, 0.45);
  const grisClaro = rgb(0.86, 0.86, 0.86);
  const fondoSuave = rgb(0.98, 0.98, 0.98);

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: 22,
    y: 25,
    width: width - 44,
    height: height - 50,
    borderColor: grisClaro,
    borderWidth: 1,
  });

  // Encabezado simple
  page.drawText('COMITE DE AUGA POTABLE', {
    x: 38,
    y: height - 55,
    size: 15,
    font: bold,
    color: negro,
  });
  page.drawText('HUAYLLANI OESTE', {
    x: 38,
    y: height - 70,
    size: 15,
    font: bold,
    color: negro,
  });

  page.drawText('RECIBO OFICIAL', {
    x: 38,
    y: height - 78,
    size: 8.5,
    font,
    color: gris,
  });

  page.drawText('RECIBO', {
    x: width - 100,
    y: height - 55,
    size: 10,
    font: bold,
    color: negro,
  });
  page.drawText('# 1', {
    x: width - 90,
    y: height - 70,
    size: 10,
    font: bold,
    color: negro,
  });

  page.drawText('25/06/2026', {
    x: width - 105,
    y: height - 79,
    size: 8,
    font,
    color: gris,
  });

  page.drawLine({
    start: { x: 38, y: height - 95 },
    end: { x: width - 38, y: height - 95 },
    thickness: 1,
    color: grisClaro,
  });

  // Helper
  const drawRow = (label, value, y) => {
    page.drawText(label, {
      x: 42,
      y,
      size: 8.5,
      font,
      color: gris,
    });

    page.drawText(value, {
      x: 145,
      y,
      size: 8.5,
      font: bold,
      color: negro,
    });
  };

  // Datos socio
  page.drawText('DATOS DEL SOCIO', {
    x: 38,
    y: 485,
    size: 9,
    font: bold,
    color: negro,
  });

  let y = 462;

  [
    ['Socio', 'Juan Pérez Mamani'],
    ['CI', '7894561 CB'],
    ['Acción', '00125'],
    ['Dirección', 'Av. Villazón #123'],
  ].forEach(([label, value]) => {
    drawRow(label, value, y);
    y -= 18;
  });

  page.drawLine({
    start: { x: 38, y: 378 },
    end: { x: width - 38, y: 378 },
    thickness: 0.8,
    color: grisClaro,
  });

  // Lecturas
  page.drawText('LECTURAS Y CONSUMO', {
    x: 38,
    y: 352,
    size: 9,
    font: bold,
    color: negro,
  });

  y = 329;

  [
    ['Periodo', 'Junio 2026'],
    ['Medidor', '7878'],
    ['Lectura anterior', '1200 m³'],
    ['Lectura actual', '1250 m³'],
    ['Consumo', '50 m³'],
  ].forEach(([label, value]) => {
    drawRow(label, value, y);
    y -= 18;
  });

  page.drawLine({
    start: { x: 38, y: 222 },
    end: { x: width - 38, y: 222 },
    thickness: 0.8,
    color: grisClaro,
  });

  // Detalle
  page.drawText('DETALLE DE COBRO', {
    x: 38,
    y: 196,
    size: 9,
    font: bold,
    color: negro,
  });

  page.drawRectangle({
    x: 38,
    y: 165,
    width: width - 76,
    height: 22,
    color: fondoSuave,
  });

  page.drawText('Concepto', {
    x: 48,
    y: 172,
    size: 8,
    font: bold,
    color: gris,
  });

  page.drawText('Importe', {
    x: width - 105,
    y: 172,
    size: 8,
    font: bold,
    color: gris,
  });

  y = 145;

  [
    ['Consumo de agua', '50.00 Bs'],
    ['Mantenimiento', '10.00 Bs'],
    ['Multa', '0.00 Bs'],
  ].forEach(([concepto, monto]) => {
    page.drawText(concepto, {
      x: 48,
      y,
      size: 8.5,
      font,
      color: negro,
    });

    page.drawText(monto, {
      x: width - 105,
      y,
      size: 8.5,
      font: bold,
      color: negro,
    });

    y -= 17;
  });

  // Total
  page.drawLine({
    start: { x: 38, y: 88 },
    end: { x: width - 38, y: 88 },
    thickness: 1,
    color: negro,
  });

  page.drawText('TOTAL PAGADO', {
    x: 48,
    y: 66,
    size: 10,
    font: bold,
    color: negro,
  });

  page.drawText('60.00 Bs', {
    x: width - 115,
    y: 62,
    size: 16,
    font: bold,
    color: negro,
  });

  // Footer
  page.drawText('Forma de pago: Efectivo', {
    x: 38,
    y: 38,
    size: 7.5,
    font,
    color: gris,
  });

  page.drawText('Cajero: Administrador', {
    x: 38,
    y: 27,
    size: 7.5,
    font,
    color: gris,
  });

  page.drawLine({
    start: { x: width - 145, y: 38 },
    end: { x: width - 45, y: 38 },
    thickness: 0.7,
    color: gris,
  });

  page.drawText('Firma y sello', {
    x: width - 118,
    y: 25,
    size: 7.5,
    font,
    color: gris,
  });

  return await pdfDoc.save();
}
