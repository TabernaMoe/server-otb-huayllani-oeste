import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generarCaratulaAccion = async (data) => {
  const pdfDoc = await PDFDocument.create();

  // A4
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // =========================================================
  // COLORES
  // =========================================================

  const azulInstitucional = rgb(0.055, 0.16, 0.28);
  const azulSecundario = rgb(0.1, 0.28, 0.43);

  const grisTexto = rgb(0.3, 0.34, 0.38);
  const grisMedio = rgb(0.55, 0.58, 0.61);
  const grisBorde = rgb(0.82, 0.84, 0.86);
  const grisFondo = rgb(0.955, 0.96, 0.965);

  const negro = rgb(0.08, 0.09, 0.1);
  const blanco = rgb(1, 1, 1);

  const margen = 42;
  const contentWidth = width - margen * 2;

  // =========================================================
  // HELPERS
  // =========================================================

  const texto = (value, x, y, size = 10, options = {}) => {
    const valueString =
      value === null || value === undefined || value === ''
        ? '-'
        : String(value);

    page.drawText(valueString, {
      x,
      y,
      size,
      font: options.bold ? fontBold : font,
      color: options.color || negro,
    });
  };

  const linea = (x1, y1, x2, y2, color = grisBorde, thickness = 0.7) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness,
      color,
    });
  };

  const rectangulo = (x, y, w, h, options = {}) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: options.color || blanco,
      borderColor: options.borderColor || grisBorde,
      borderWidth:
        options.borderWidth !== undefined ? options.borderWidth : 0.7,
    });
  };

  /**
   * Corta texto largo para que no se salga del PDF
   */
  const cortarTexto = (value, maxWidth, size = 9.5, selectedFont = font) => {
    const original =
      value === null || value === undefined || value === ''
        ? '-'
        : String(value);

    if (selectedFont.widthOfTextAtSize(original, size) <= maxWidth) {
      return original;
    }

    let result = original;

    while (
      result.length > 0 &&
      selectedFont.widthOfTextAtSize(`${result}...`, size) > maxWidth
    ) {
      result = result.slice(0, -1);
    }

    return `${result}...`;
  };

  const campo = ({
    label,
    value,
    x,
    y,
    width: fieldWidth = 230,
    labelWidth = 100,
  }) => {
    texto(label.toUpperCase(), x, y + 11, 7, {
      bold: true,
      color: grisMedio,
    });

    const valueText = cortarTexto(value, fieldWidth, 10, font);

    texto(valueText, x, y - 3, 10, {
      color: negro,
    });

    linea(x, y - 10, x + fieldWidth, y - 10, grisBorde, 0.6);
  };

  const tituloSeccion = (numero, titulo, y) => {
    rectangulo(margen, y, contentWidth, 31, {
      color: grisFondo,
      borderColor: grisBorde,
      borderWidth: 0.6,
    });

    // Barra lateral
    page.drawRectangle({
      x: margen,
      y,
      width: 4,
      height: 31,
      color: azulInstitucional,
    });

    texto(`${numero}. ${titulo}`, margen + 16, y + 10, 11, {
      bold: true,
      color: azulInstitucional,
    });
  };

  // =========================================================
  // ENCABEZADO INSTITUCIONAL
  // =========================================================

  texto(
    data.institucion || 'COMITE DE AGUA POTABLE OTB HUAYLLANI OESTE',
    margen,
    height - 49,
    16,
    {
      bold: true,
      color: azulInstitucional,
    },
  );

  linea(
    margen,
    height - 80,
    width - margen,
    height - 80,
    azulInstitucional,
    1.4,
  );

  // =========================================================
  // TÍTULO PRINCIPAL
  // =========================================================

  const headerY = height - 148;

  rectangulo(margen, headerY, contentWidth, 48, {
    color: azulInstitucional,
    borderColor: azulInstitucional,
    borderWidth: 0,
  });

  texto('CARÁTULA DE ACCIÓN', margen + 18, headerY + 17, 17, {
    bold: true,
    color: blanco,
  });

  const codigo = data.accion?.codigoInterno || 'SIN CÓDIGO';

  texto('CÓDIGO DE ACCIÓN', width - margen - 100, headerY + 29, 6.5, {
    bold: true,
    color: rgb(0.78, 0.84, 0.89),
  });

  const codigoText = String(codigo);

  const codigoWidth = fontBold.widthOfTextAtSize(codigoText, 13);

  texto(codigoText, width - margen - codigoWidth - 55, headerY + 11, 13, {
    bold: true,
    color: blanco,
  });

  // =========================================================
  // INFORMACIÓN RÁPIDA
  // =========================================================

  const infoY = headerY - 38;

  texto('FECHA DE REGISTRO', margen, infoY + 13, 6.5, {
    bold: true,
    color: grisMedio,
  });

  texto(data.accion?.fechaRegistro || '-', margen, infoY - 1, 9, {
    color: negro,
  });

  texto('ESTADO', margen + 180, infoY + 13, 6.5, {
    bold: true,
    color: grisMedio,
  });

  texto(data.accion?.estado || '-', margen + 180, infoY - 1, 9, {
    bold: true,
    color: azulSecundario,
  });

  linea(margen, infoY - 15, width - margen, infoY - 15);

  // =========================================================
  // DATOS DE LA ACCIÓN
  // =========================================================

  let y = infoY - 65;

  tituloSeccion('01', 'DATOS DE LA ACCIÓN', y);

  const boxAccionTop = y;
  const boxAccionHeight = 238;
  const boxAccionY = boxAccionTop - boxAccionHeight;

  rectangulo(margen, boxAccionY, contentWidth, boxAccionHeight, {
    color: blanco,
    borderColor: grisBorde,
    borderWidth: 0.7,
  });

  // Separación entre título y contenido
  let campoY = y - 33;

  const izquierdaX = margen + 18;
  const derechaX = margen + 275;

  const anchoColumna = 225;

  // FILA 1
  campo({
    label: 'Código interno',
    value: data.accion?.codigoInterno,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  campo({
    label: 'Tipo de acción',
    value: data.accion?.tipoAccion,
    x: derechaX,
    y: campoY,
    width: anchoColumna,
  });

  campoY -= 48;

  // FILA 2
  campo({
    label: 'Calle',
    value: data.accion?.calle,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  campo({
    label: 'Tarifa',
    value: data.accion?.tarifa,
    x: derechaX,
    y: campoY,
    width: anchoColumna,
  });

  campoY -= 48;

  // FILA 3
  campo({
    label: 'N.º de medidor',
    value: data.accion?.nroMedidor,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  campo({
    label: 'Estado',
    value: data.accion?.estado,
    x: derechaX,
    y: campoY,
    width: anchoColumna,
  });

  campoY -= 48;

  // DIRECCIÓN
  campo({
    label: 'Dirección',
    value: data.accion?.direccion,
    x: izquierdaX,
    y: campoY,
    width: contentWidth - 36,
  });

  campoY -= 48;

  // OBSERVACIONES
  texto('OBSERVACIONES', izquierdaX, campoY + 11, 7, {
    bold: true,
    color: grisMedio,
  });

  texto(
    cortarTexto(
      data.accion?.observaciones || 'Sin observaciones',
      contentWidth - 50,
      9.5,
    ),
    izquierdaX,
    campoY - 3,
    9.5,
    {
      color: negro,
    },
  );

  linea(izquierdaX, campoY - 10, width - margen - 18, campoY - 10);

  // =========================================================
  // DATOS DEL SOCIO
  // =========================================================

  y = boxAccionY - 48;

  tituloSeccion('02', 'DATOS DEL SOCIO', y);

  const boxSocioHeight = 160;
  const boxSocioY = y - boxSocioHeight;

  rectangulo(margen, boxSocioY, contentWidth, boxSocioHeight, {
    color: blanco,
    borderColor: grisBorde,
    borderWidth: 0.7,
  });

  campoY = y - 35;

  // FILA 1
  campo({
    label: 'Cédula de identidad',
    value: data.socio?.ci,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  campo({
    label: 'Número de celular',
    value: data.socio?.numeroCelular,
    x: derechaX,
    y: campoY,
    width: anchoColumna,
  });

  campoY -= 48;

  // FILA 2
  campo({
    label: 'Nombres',
    value: data.socio?.nombres,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  campo({
    label: 'Primer apellido',
    value: data.socio?.primerApellido,
    x: derechaX,
    y: campoY,
    width: anchoColumna,
  });

  campoY -= 48;

  // FILA 3
  campo({
    label: 'Segundo apellido',
    value: data.socio?.segundoApellido,
    x: izquierdaX,
    y: campoY,
    width: anchoColumna,
  });

  // =========================================================
  // PIE DE PÁGINA
  // =========================================================

  const footerY = 57;

  linea(margen, footerY, width - margen, footerY, azulInstitucional, 1);

  return await pdfDoc.save();
};
