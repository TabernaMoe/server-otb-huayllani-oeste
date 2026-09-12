import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generarPlanillaReunion = async (data) => {
  const pdfDoc = await PDFDocument.create();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // =====================================================
  // CONFIGURACIÓN
  // =====================================================

  const PAGE_WIDTH = 841.89;
  const PAGE_HEIGHT = 595.28;

  const MARGEN = 30;
  const ROW_HEIGHT = 25;

  // =====================================================
  // COLORES
  // =====================================================

  const azul = rgb(0.055, 0.16, 0.28);
  const azulSecundario = rgb(0.1, 0.28, 0.43);

  const gris = rgb(0.35, 0.38, 0.42);
  const grisTexto = rgb(0.22, 0.24, 0.27);
  const grisClaro = rgb(0.965, 0.97, 0.975);
  const grisCabecera = rgb(0.93, 0.94, 0.95);

  const borde = rgb(0.79, 0.81, 0.83);

  const blanco = rgb(1, 1, 1);
  const negro = rgb(0.08, 0.09, 0.1);

  const rojo = rgb(0.65, 0.12, 0.12);
  const naranja = rgb(0.72, 0.38, 0.05);

  // =====================================================
  // COLUMNAS
  // =====================================================

  // Ancho disponible:
  // 841.89 - 60 = 781.89
  const columnas = [
    {
      key: 'numero',
      label: 'N°',
      width: 32,
      align: 'center',
    },
    {
      key: 'codigo_interno',
      label: 'CÓDIGO',
      width: 72,
      align: 'center',
    },
    {
      key: 'ci_socio',
      label: 'C.I.',
      width: 82,
      align: 'center',
    },
    {
      key: 'socio',
      label: 'SOCIO',
      width: 220,
      align: 'left',
    },
    {
      key: 'asistio',
      label: 'ESTADO',
      width: 85,
      align: 'center',
    },
    {
      key: 'multa',
      label: 'MULTA Bs.',
      width: 75,
      align: 'right',
    },
    {
      key: 'observacion',
      label: 'OBSERVACIÓN',
      width: 215,
      align: 'left',
    },
  ];

  let page;
  let y;

  // =====================================================
  // HELPERS
  // =====================================================

  const obtenerTexto = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  };

  const texto = (value, x, yPos, size = 8, options = {}) => {
    page.drawText(obtenerTexto(value), {
      x,
      y: yPos,
      size,
      font: options.bold ? fontBold : font,
      color: options.color || negro,
    });
  };

  const rect = (x, yPos, width, height, options = {}) => {
    page.drawRectangle({
      x,
      y: yPos,
      width,
      height,
      color: options.color || blanco,
      borderColor: options.borderColor || borde,
      borderWidth: options.borderWidth ?? 0.5,
    });
  };

  const linea = (x1, y1, x2, y2, color = borde, thickness = 0.5) => {
    page.drawLine({
      start: {
        x: x1,
        y: y1,
      },
      end: {
        x: x2,
        y: y2,
      },
      thickness,
      color,
    });
  };

  /**
   * Evita que un texto se salga de una celda.
   */
  const cortarTexto = (value, maxWidth, size = 7, selectedFont = font) => {
    const textoOriginal = obtenerTexto(value);

    if (selectedFont.widthOfTextAtSize(textoOriginal, size) <= maxWidth) {
      return textoOriginal;
    }

    let resultado = textoOriginal;

    while (
      resultado.length > 0 &&
      selectedFont.widthOfTextAtSize(`${resultado}...`, size) > maxWidth
    ) {
      resultado = resultado.slice(0, -1);
    }

    return `${resultado}...`;
  };

  const normalizarEstado = (estado) => {
    return String(estado || '')
      .trim()
      .toUpperCase();
  };

  const obtenerColorEstado = (estado) => {
    const value = normalizarEstado(estado);

    if (value === 'FALTA') {
      return rojo;
    }

    if (value === 'RETRASO') {
      return naranja;
    }

    return grisTexto;
  };

  /**
   * Escribe dentro de una celda respetando
   * alineación y ancho.
   */
  const textoCelda = (value, x, yPos, width, options = {}) => {
    const size = options.size || 7.2;

    const selectedFont = options.bold ? fontBold : font;

    const contenido = cortarTexto(value, width - 10, size, selectedFont);

    const textWidth = selectedFont.widthOfTextAtSize(contenido, size);

    let textX = x + 5;

    if (options.align === 'center') {
      textX = x + (width - textWidth) / 2;
    }

    if (options.align === 'right') {
      textX = x + width - textWidth - 5;
    }

    page.drawText(contenido, {
      x: textX,
      y: yPos,
      size,
      font: selectedFont,
      color: options.color || grisTexto,
    });
  };

  // =====================================================
  // ENCABEZADO
  // =====================================================

  const dibujarEncabezado = () => {
    texto(
      data.institucion || 'COOPERATIVA DE AGUA POTABLE',
      MARGEN,
      PAGE_HEIGHT - 38,
      15,
      {
        bold: true,
        color: azul,
      },
    );

    texto(
      'CONTROL DE ASISTENCIA',
      PAGE_WIDTH - MARGEN - 145,
      PAGE_HEIGHT - 35,
      7,
      {
        bold: true,
        color: gris,
      },
    );

    linea(
      MARGEN,
      PAGE_HEIGHT - 51,
      PAGE_WIDTH - MARGEN,
      PAGE_HEIGHT - 51,
      azul,
      1.2,
    );

    texto('PLANILLA DE FALTAS Y RETRASOS', MARGEN, PAGE_HEIGHT - 72, 11, {
      bold: true,
      color: azul,
    });

    // Información de reunión
    rect(MARGEN, PAGE_HEIGHT - 116, PAGE_WIDTH - MARGEN * 2, 30, {
      color: grisClaro,
      borderColor: borde,
    });

    texto('REUNIÓN:', MARGEN + 10, PAGE_HEIGHT - 104, 6.5, {
      bold: true,
      color: gris,
    });

    texto(data.reunion || '-', MARGEN + 58, PAGE_HEIGHT - 104, 8, {
      color: negro,
    });

    texto('FECHA:', 340, PAGE_HEIGHT - 104, 6.5, {
      bold: true,
      color: gris,
    });

    texto(data.fecha || '-', 378, PAGE_HEIGHT - 104, 8);

    texto('HORA:', 480, PAGE_HEIGHT - 104, 6.5, {
      bold: true,
      color: gris,
    });

    texto(data.hora || '-', 515, PAGE_HEIGHT - 104, 8);

    texto('LUGAR:', 590, PAGE_HEIGHT - 104, 6.5, {
      bold: true,
      color: gris,
    });

    texto(cortarTexto(data.lugar || '-', 165, 8), 630, PAGE_HEIGHT - 104, 8);
  };

  // =====================================================
  // CABECERA TABLA
  // =====================================================

  const dibujarCabeceraTabla = () => {
    let x = MARGEN;

    columnas.forEach((col) => {
      rect(x, y, col.width, ROW_HEIGHT, {
        color: azul,
        borderColor: azul,
        borderWidth: 0.4,
      });

      textoCelda(col.label, x, y + 9, col.width, {
        size: 6.8,
        bold: true,
        color: blanco,
        align: 'center',
      });

      x += col.width;
    });

    y -= ROW_HEIGHT;
  };

  // =====================================================
  // NUEVA PÁGINA
  // =====================================================

  const crearPagina = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    dibujarEncabezado();

    y = PAGE_HEIGHT - 150;

    dibujarCabeceraTabla();
  };

  // =====================================================
  // PRIMERA PÁGINA
  // =====================================================

  crearPagina();

  // =====================================================
  // DETALLE
  // =====================================================

  const detalle = Array.isArray(data.detalle) ? data.detalle : [];

  detalle.forEach((item, index) => {
    // Espacio reservado para footer
    if (y < 65) {
      crearPagina();
    }

    const fondo = index % 2 === 0 ? blanco : grisClaro;

    const estado = normalizarEstado(item.asistio);

    const valores = {
      numero: index + 1,

      codigo_interno: item.codigo_interno,

      ci_socio: item.ci_socio,

      socio: item.socio,

      asistio: estado || '-',

      multa: Number(item.multa || 0).toFixed(2),

      observacion: item.observacion || '-',
    };

    let x = MARGEN;

    columnas.forEach((col) => {
      rect(x, y, col.width, ROW_HEIGHT, {
        color: fondo,
        borderColor: borde,
        borderWidth: 0.4,
      });

      let colorTexto = grisTexto;
      let bold = false;

      if (col.key === 'asistio') {
        colorTexto = obtenerColorEstado(estado);

        bold = true;
      }

      if (col.key === 'multa') {
        bold = Number(item.multa || 0) > 0;
      }

      textoCelda(valores[col.key], x, y + 9, col.width, {
        size: 7.2,
        align: col.align,
        color: colorTexto,
        bold,
      });

      x += col.width;
    });

    y -= ROW_HEIGHT;
  });

  // =====================================================
  // TOTALES
  // =====================================================

  const totalFaltas = detalle.filter(
    (item) => normalizarEstado(item.asistio) === 'FALTA',
  ).length;

  const totalRetrasos = detalle.filter(
    (item) => normalizarEstado(item.asistio) === 'RETRASO',
  ).length;

  const totalMultas = detalle.reduce(
    (total, item) => total + Number(item.multa || 0),
    0,
  );

  // Si no queda espacio suficiente,
  // creamos otra página.
  if (y < 115) {
    crearPagina();
  }

  y -= 18;

  // Título resumen
  texto('RESUMEN', MARGEN, y, 8, {
    bold: true,
    color: azul,
  });

  y -= 35;

  // =====================================================
  // TARJETAS RESUMEN
  // =====================================================

  const cardWidth = 170;
  const cardHeight = 42;
  const gap = 15;

  // FALTAS
  rect(MARGEN, y, cardWidth, cardHeight, {
    color: grisClaro,
    borderColor: borde,
  });

  texto('TOTAL FALTAS', MARGEN + 12, y + 25, 6.5, {
    bold: true,
    color: gris,
  });

  texto(totalFaltas, MARGEN + 12, y + 9, 12, {
    bold: true,
    color: rojo,
  });

  // RETRASOS
  const retrasoX = MARGEN + cardWidth + gap;

  rect(retrasoX, y, cardWidth, cardHeight, {
    color: grisClaro,
    borderColor: borde,
  });

  texto('TOTAL RETRASOS', retrasoX + 12, y + 25, 6.5, {
    bold: true,
    color: gris,
  });

  texto(totalRetrasos, retrasoX + 12, y + 9, 12, {
    bold: true,
    color: naranja,
  });

  // MULTAS
  const multaX = retrasoX + cardWidth + gap;

  rect(multaX, y, 230, cardHeight, {
    color: grisClaro,
    borderColor: borde,
  });

  texto('TOTAL MULTAS', multaX + 12, y + 25, 6.5, {
    bold: true,
    color: gris,
  });

  texto(`Bs. ${totalMultas.toFixed(2)}`, multaX + 12, y + 9, 12, {
    bold: true,
    color: azulSecundario,
  });

  // =====================================================
  // PIE DE PÁGINA
  // =====================================================

  const paginas = pdfDoc.getPages();

  const totalPaginas = paginas.length;

  paginas.forEach((pagina, index) => {
    pagina.drawLine({
      start: {
        x: MARGEN,
        y: 43,
      },
      end: {
        x: PAGE_WIDTH - MARGEN,
        y: 43,
      },
      thickness: 0.6,
      color: borde,
    });

    pagina.drawText('Documento generado por el sistema', {
      x: MARGEN,
      y: 25,
      size: 6.5,
      font,
      color: gris,
    });

    const pageText = `Página ${index + 1} de ${totalPaginas}`;

    const pageTextWidth = font.widthOfTextAtSize(pageText, 6.5);

    pagina.drawText(pageText, {
      x: PAGE_WIDTH - MARGEN - pageTextWidth,
      y: 25,
      size: 6.5,
      font,
      color: gris,
    });
  });

  return await pdfDoc.save();
};
