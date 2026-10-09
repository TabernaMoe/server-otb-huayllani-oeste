import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generarPlanillaReunion = async (data) => {
  const pdfDoc = await PDFDocument.create();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const azul = rgb(0.05, 0.16, 0.28);
  const gris = rgb(0.35, 0.38, 0.42);
  const grisClaro = rgb(0.95, 0.96, 0.97);
  const borde = rgb(0.8, 0.82, 0.84);
  const blanco = rgb(1, 1, 1);
  const negro = rgb(0.08, 0.09, 0.1);

  const PAGE_WIDTH = 841.89;
  const PAGE_HEIGHT = 595.28;

  const margen = 30;
  const rowHeight = 24;

  const columnas = [
    { label: 'N°', width: 30 },
    { label: 'Código', width: 60 },
    { label: 'C.I.', width: 70 },
    { label: 'Socio', width: 175 },
    { label: 'Tipo', width: 65 },
    { label: 'Multa Bs.', width: 65 },
    { label: 'Observación', width: 135 },
  ];

  let page;
  let y;
  let numeroPagina = 0;

  const texto = (value, x, y, size = 8, options = {}) => {
    page.drawText(String(value ?? '-'), {
      x,
      y,
      size,
      font: options.bold ? fontBold : font,
      color: options.color || negro,
    });
  };

  const rect = (x, y, width, height, color = blanco) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color,
      borderColor: borde,
      borderWidth: 0.5,
    });
  };

  // ========================================
  // ENCABEZADO GENERAL
  // ========================================

  const dibujarEncabezado = () => {
    texto(
      data.institucion || 'COOPERATIVA DE AGUA POTABLE',
      margen,
      PAGE_HEIGHT - 35,
      15,
      {
        bold: true,
        color: azul,
      },
    );

    texto(
      'PLANILLA DE FALTAS Y RETRASOS DE REUNIÓN',
      margen,
      PAGE_HEIGHT - 55,
      11,
      {
        bold: true,
        color: gris,
      },
    );

    texto(`Reunión: ${data.reunion || '-'}`, margen, PAGE_HEIGHT - 80, 8);

    texto(`Fecha: ${data.fecha || '-'}`, 300, PAGE_HEIGHT - 80, 8);

    texto(`Hora: ${data.hora || '-'}`, 440, PAGE_HEIGHT - 80, 8);

    texto(`Tolerancia: ${data.tolerancia || 0} min`, 550, PAGE_HEIGHT - 80, 8);

    texto(`Lugar: ${data.lugar || '-'}`, margen, PAGE_HEIGHT - 96, 8);
  };

  // ========================================
  // CABECERA DE TABLA
  // ========================================

  const dibujarCabeceraTabla = () => {
    let x = margen;

    columnas.forEach((col) => {
      rect(x, y, col.width, rowHeight, azul);

      texto(col.label, x + 4, y + 8, 7, {
        bold: true,
        color: blanco,
      });

      x += col.width;
    });

    y -= rowHeight;
  };

  // ========================================
  // CREAR NUEVA PÁGINA
  // ========================================

  const crearPagina = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    numeroPagina++;

    dibujarEncabezado();

    y = PAGE_HEIGHT - 130;

    dibujarCabeceraTabla();
  };

  // Primera página
  crearPagina();

  // ========================================
  // FILAS
  // ========================================

  data.detalle.forEach((item, index) => {
    /*
     * Si llegamos al final de la hoja,
     * creamos automáticamente otra.
     */
    if (y < 75) {
      crearPagina();
    }

    let x = margen;

    const valores = [
      index + 1,
      item.codigo_interno,
      item.ci_socio,
      item.socio,

      item.asistio,

      Number(item.multa || 0).toFixed(2),

      item.observacion || '-',
    ];

    columnas.forEach((col, colIndex) => {
      rect(x, y, col.width, rowHeight, index % 2 === 0 ? blanco : grisClaro);

      texto(valores[colIndex], x + 4, y + 8, 7);

      x += col.width;
    });

    y -= rowHeight;
  });

  // ========================================
  // RESUMEN FINAL
  // ========================================

  const totalFaltas = data.detalle.filter(
    (item) => item.tipo === 'FALTA',
  ).length;

  const totalRetrasos = data.detalle.filter(
    (item) => item.tipo === 'RETRASO',
  ).length;

  const totalMultas = data.detalle.reduce(
    (total, item) => total + Number(item.multa || 0),
    0,
  );

  // Verificamos que haya espacio para resumen
  if (y < 100) {
    crearPagina();
  }

  y -= 15;

  texto(`Total faltas: ${totalFaltas}`, margen, y, 9, {
    bold: true,
    color: azul,
  });

  texto(`Total retrasos: ${totalRetrasos}`, margen + 130, y, 9, {
    bold: true,
    color: azul,
  });

  texto(`Total multas: Bs. ${totalMultas.toFixed(2)}`, margen + 290, y, 9, {
    bold: true,
    color: azul,
  });

  // ========================================
  // NUMERACIÓN DE PÁGINAS
  // ========================================

  const paginas = pdfDoc.getPages();
  const totalPaginas = paginas.length;

  paginas.forEach((pagina, index) => {
    const numero = `Página ${index + 1} de ${totalPaginas}`;

    pagina.drawText(numero, {
      x: PAGE_WIDTH - 105,
      y: 25,
      size: 7,
      font,
      color: gris,
    });

    pagina.drawText('Documento generado por el sistema', {
      x: margen,
      y: 25,
      size: 7,
      font,
      color: gris,
    });
  });

  return await pdfDoc.save();
};
