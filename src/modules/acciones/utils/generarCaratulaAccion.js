// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// const formatFechaHora = (fecha) => {
//   if (!fecha) return '-';

//   const date = new Date(fecha);

//   return date.toLocaleString('es-BO', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//     timeZone: 'UTC',
//   });
// };

// export const generarCaratulaAccion = async (data) => {
//   const pdfDoc = await PDFDocument.create();

//   // A4
//   let page = pdfDoc.addPage([612, 792]);

//   const { width, height } = page.getSize();

//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   // =========================================================
//   // COLORES
//   // =========================================================

//   const azulInstitucional = rgb(0.055, 0.16, 0.28);
//   const azulSecundario = rgb(0.1, 0.28, 0.43);

//   const grisTexto = rgb(0.3, 0.34, 0.38);
//   const grisMedio = rgb(0.55, 0.58, 0.61);
//   const grisBorde = rgb(0.82, 0.84, 0.86);
//   const grisFondo = rgb(0.955, 0.96, 0.965);

//   const negro = rgb(0.08, 0.09, 0.1);
//   const blanco = rgb(1, 1, 1);

//   const margen = 42;
//   const contentWidth = width - margen * 2;

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   const texto = (value, x, y, size = 10, options = {}) => {
//     const valueString =
//       value === null || value === undefined || value === ''
//         ? '-'
//         : String(value);

//     page.drawText(valueString, {
//       x,
//       y,
//       size,
//       font: options.bold ? fontBold : font,
//       color: options.color || negro,
//     });
//   };

//   const linea = (x1, y1, x2, y2, color = grisBorde, thickness = 0.7) => {
//     page.drawLine({
//       start: { x: x1, y: y1 },
//       end: { x: x2, y: y2 },
//       thickness,
//       color,
//     });
//   };

//   const rectangulo = (x, y, w, h, options = {}) => {
//     page.drawRectangle({
//       x,
//       y,
//       width: w,
//       height: h,
//       color: options.color || blanco,
//       borderColor: options.borderColor || grisBorde,
//       borderWidth:
//         options.borderWidth !== undefined ? options.borderWidth : 0.7,
//     });
//   };

//   /**
//    * Corta texto largo para que no se salga del PDF
//    */
//   const cortarTexto = (value, maxWidth, size = 9.5, selectedFont = font) => {
//     const original =
//       value === null || value === undefined || value === ''
//         ? '-'
//         : String(value);

//     if (selectedFont.widthOfTextAtSize(original, size) <= maxWidth) {
//       return original;
//     }

//     let result = original;

//     while (
//       result.length > 0 &&
//       selectedFont.widthOfTextAtSize(`${result}...`, size) > maxWidth
//     ) {
//       result = result.slice(0, -1);
//     }

//     return `${result}...`;
//   };

//   const campo = ({
//     label,
//     value,
//     x,
//     y,
//     width: fieldWidth = 230,
//     labelWidth = 100,
//   }) => {
//     texto(label.toUpperCase(), x, y + 11, 7, {
//       bold: true,
//       color: grisMedio,
//     });

//     const valueText = cortarTexto(value, fieldWidth, 10, font);

//     texto(valueText, x, y - 3, 10, {
//       color: negro,
//     });

//     linea(x, y - 10, x + fieldWidth, y - 10, grisBorde, 0.6);
//   };

//   const tituloSeccion = (numero, titulo, y) => {
//     rectangulo(margen, y, contentWidth, 31, {
//       color: grisFondo,
//       borderColor: grisBorde,
//       borderWidth: 0.6,
//     });

//     // Barra lateral
//     page.drawRectangle({
//       x: margen,
//       y,
//       width: 4,
//       height: 31,
//       color: azulInstitucional,
//     });

//     texto(`${numero}. ${titulo}`, margen + 16, y + 10, 11, {
//       bold: true,
//       color: azulInstitucional,
//     });
//   };

//   // =========================================================
//   // ENCABEZADO INSTITUCIONAL
//   // =========================================================

//   texto(
//     data.institucion || 'COMITE DE AGUA POTABLE OTB HUAYLLANI OESTE',
//     margen,
//     height - 49,
//     16,
//     {
//       bold: true,
//       color: azulInstitucional,
//     },
//   );

//   linea(
//     margen,
//     height - 80,
//     width - margen,
//     height - 80,
//     azulInstitucional,
//     1.4,
//   );

//   // =========================================================
//   // TÍTULO PRINCIPAL
//   // =========================================================

//   const headerY = height - 148;

//   rectangulo(margen, headerY, contentWidth, 48, {
//     color: azulInstitucional,
//     borderColor: azulInstitucional,
//     borderWidth: 0,
//   });

//   texto('CARÁTULA DE ACCIÓN', margen + 18, headerY + 17, 17, {
//     bold: true,
//     color: blanco,
//   });

//   const codigo = data.accion?.codigo_interno || 'SIN CÓDIGO';

//   texto('CÓDIGO DE ACCIÓN', width - margen - 100, headerY + 29, 6.5, {
//     bold: true,
//     color: rgb(0.78, 0.84, 0.89),
//   });

//   const codigoText = String(codigo);

//   const codigoWidth = fontBold.widthOfTextAtSize(codigoText, 13);

//   texto(codigoText, width - margen - codigoWidth - 55, headerY + 11, 13, {
//     bold: true,
//     color: blanco,
//   });

//   // =========================================================
//   // INFORMACIÓN RÁPIDA
//   // =========================================================

//   const infoY = headerY - 38;

//   texto('FECHA DE CREARCION DE LA ACCION', margen, infoY + 13, 6.5, {
//     bold: true,
//     color: grisMedio,
//   });

//   texto(formatFechaHora(data.accion?.fechaRegistro), margen, infoY - 1, 9, {
//     color: negro,
//   });

//   texto('ESTADO', margen + 180, infoY + 13, 6.5, {
//     bold: true,
//     color: grisMedio,
//   });

//   texto(data.accion?.estado || '-', margen + 180, infoY - 1, 9, {
//     bold: true,
//     color: azulSecundario,
//   });

//   linea(margen, infoY - 15, width - margen, infoY - 15);

//   // =========================================================
//   // DATOS DE LA ACCIÓN
//   // =========================================================

//   let y = infoY - 65;

//   tituloSeccion('01', 'DATOS DE LA ACCIÓN', y);

//   const boxAccionTop = y;
//   const boxAccionHeight = 238;
//   const boxAccionY = boxAccionTop - boxAccionHeight;

//   rectangulo(margen, boxAccionY, contentWidth, boxAccionHeight, {
//     color: blanco,
//     borderColor: grisBorde,
//     borderWidth: 0.7,
//   });

//   // Separación entre título y contenido
//   let campoY = y - 33;

//   const izquierdaX = margen + 18;
//   const derechaX = margen + 275;

//   const anchoColumna = 225;

//   // FILA 1
//   campo({
//     label: 'Código interno',
//     value: data.accion?.codigo_interno,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campoY -= 48;

//   // FILA 2
//   campo({
//     label: 'Calle',
//     value: data.accion?.calle,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campo({
//     label: 'Tarifa',
//     value: data.accion?.tarifa,
//     x: derechaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campoY -= 48;

//   // FILA 3
//   campo({
//     label: 'N.º de medidor',
//     value: data.accion?.nro_medidor,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campo({
//     label: 'Estado',
//     value: data.accion?.estado,
//     x: derechaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campoY -= 48;

//   // DIRECCIÓN
//   campo({
//     label: 'Dirección',
//     value: data.accion?.direccion,
//     x: izquierdaX,
//     y: campoY,
//     width: contentWidth - 36,
//   });

//   campoY -= 48;

//   // OBSERVACIONES
//   texto('OBSERVACIONES', izquierdaX, campoY + 11, 7, {
//     bold: true,
//     color: grisMedio,
//   });

//   texto(
//     cortarTexto(
//       data.accion?.observacion || 'Sin observaciones',
//       contentWidth - 50,
//       9.5,
//     ),
//     izquierdaX,
//     campoY - 3,
//     9.5,
//     {
//       color: negro,
//     },
//   );

//   linea(izquierdaX, campoY - 10, width - margen - 18, campoY - 10);

//   // =========================================================
//   // DATOS DEL SOCIO
//   // =========================================================

//   y = boxAccionY - 48;

//   tituloSeccion('02', 'DATOS DEL SOCIO', y);

//   const boxSocioHeight = 160;
//   const boxSocioY = y - boxSocioHeight;

//   rectangulo(margen, boxSocioY, contentWidth, boxSocioHeight, {
//     color: blanco,
//     borderColor: grisBorde,
//     borderWidth: 0.7,
//   });

//   campoY = y - 35;

//   // FILA 1
//   campo({
//     label: 'Cédula de identidad',
//     value: data.socio?.ci_socio,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campo({
//     label: 'Número de celular',
//     value: data.socio?.numero_celular,
//     x: derechaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campoY -= 48;

//   // FILA 2
//   campo({
//     label: 'Nombres',
//     value: data.socio?.nombres,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campo({
//     label: 'Primer apellido',
//     value: data.socio?.primer_apellido,
//     x: derechaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   campoY -= 48;

//   // FILA 3
//   campo({
//     label: 'Segundo apellido',
//     value: data.socio?.segundo_apellido,
//     x: izquierdaX,
//     y: campoY,
//     width: anchoColumna,
//   });

//   // =========================================================
//   // PIE DE PÁGINA
//   // =========================================================

//   const footerY = 57;

//   linea(margen, footerY, width - margen, footerY, azulInstitucional, 1);

//   const cobros = Array.isArray(data.cobros) ? data.cobros : [];

//   if (cobros.length > 0) {
//     const PAGE_WIDTH = 612;
//     const PAGE_HEIGHT = 792;

//     const margenCobros = 42;
//     const contentCobrosWidth = PAGE_WIDTH - margenCobros * 2;

//     const rowHeight = 30;

//     // Anchos de columnas
//     const columnas = [
//       {
//         label: 'N°',
//         width: 40,
//       },
//       {
//         label: 'CONCEPTO',
//         width: 345,
//       },
//       {
//         label: 'PRECIO (Bs.)',
//         width: 126,
//       },
//     ];

//     let cobroY;

//     // =====================================================
//     // HELPER CENTRAR TEXTO
//     // =====================================================

//     const textoCentrado = (value, x, y, cellWidth, size = 8, options = {}) => {
//       const valueString =
//         value === null || value === undefined || value === ''
//           ? '-'
//           : String(value);

//       const selectedFont = options.bold ? fontBold : font;

//       const textWidth = selectedFont.widthOfTextAtSize(valueString, size);

//       page.drawText(valueString, {
//         x: x + (cellWidth - textWidth) / 2,
//         y,
//         size,
//         font: selectedFont,
//         color: options.color || negro,
//       });
//     };

//     // =====================================================
//     // ENCABEZADO DE HOJA DE COBROS
//     // =====================================================

//     const dibujarEncabezadoCobros = () => {
//       texto(
//         data.institucion || 'COMITE DE AGUA POTABLE OTB HUAYLLANI OESTE',
//         margenCobros,
//         PAGE_HEIGHT - 49,
//         16,
//         {
//           bold: true,
//           color: azulInstitucional,
//         },
//       );

//       linea(
//         margenCobros,
//         PAGE_HEIGHT - 80,
//         PAGE_WIDTH - margenCobros,
//         PAGE_HEIGHT - 80,
//         azulInstitucional,
//         1.4,
//       );

//       texto(
//         'DETALLE DE COBROS DE LA ACCIÓN',
//         margenCobros,
//         PAGE_HEIGHT - 115,
//         15,
//         {
//           bold: true,
//           color: azulInstitucional,
//         },
//       );

//       // Información de la acción
//       rectangulo(margenCobros, PAGE_HEIGHT - 168, contentCobrosWidth, 35, {
//         color: grisFondo,
//         borderColor: grisBorde,
//         borderWidth: 0.6,
//       });

//       texto('CÓDIGO DE ACCIÓN', margenCobros + 15, PAGE_HEIGHT - 148, 7, {
//         bold: true,
//         color: grisMedio,
//       });

//       texto(
//         data.accion?.codigo_interno || '-',
//         margenCobros + 110,
//         PAGE_HEIGHT - 148,
//         9,
//         {
//           bold: true,
//           color: negro,
//         },
//       );

//       texto('SOCIO', margenCobros + 230, PAGE_HEIGHT - 148, 7, {
//         bold: true,
//         color: grisMedio,
//       });

//       const nombreSocio = [
//         data.socio?.nombres,
//         data.socio?.primer_apellido,
//         data.socio?.segundo_apellido,
//       ]
//         .filter(Boolean)
//         .join(' ');

//       texto(
//         cortarTexto(nombreSocio || '-', 220, 9),
//         margenCobros + 275,
//         PAGE_HEIGHT - 148,
//         9,
//         {
//           color: negro,
//         },
//       );

//       cobroY = PAGE_HEIGHT - 215;
//     };

//     // =====================================================
//     // CABECERA DE LA TABLA
//     // =====================================================

//     const dibujarCabeceraCobros = () => {
//       let x = margenCobros;

//       columnas.forEach((col) => {
//         page.drawRectangle({
//           x,
//           y: cobroY,
//           width: col.width,
//           height: rowHeight,
//           color: azulInstitucional,
//           borderColor: blanco,
//           borderWidth: 0.4,
//         });

//         textoCentrado(col.label, x, cobroY + 10, col.width, 7.5, {
//           bold: true,
//           color: blanco,
//         });

//         x += col.width;
//       });

//       cobroY -= rowHeight;
//     };

//     // =====================================================
//     // PIE DE PÁGINA COBROS
//     // =====================================================

//     const dibujarFooterCobros = () => {
//       linea(
//         margenCobros,
//         57,
//         PAGE_WIDTH - margenCobros,
//         57,
//         azulInstitucional,
//         1,
//       );

//       texto(
//         data.institucion || 'COMITE DE AGUA POTABLE OTB HUAYLLANI OESTE',
//         margenCobros,
//         40,
//         7,
//         {
//           color: grisMedio,
//         },
//       );
//     };

//     // =====================================================
//     // NUEVA PÁGINA
//     // =====================================================

//     const crearPaginaCobros = () => {
//       page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

//       dibujarEncabezadoCobros();

//       dibujarCabeceraCobros();
//     };

//     // Crear segunda página
//     crearPaginaCobros();

//     // =====================================================
//     // FILAS DE COBROS
//     // =====================================================

//     cobros.forEach((cobro, index) => {
//       // Si ya no entra otra fila
//       if (cobroY < 90) {
//         dibujarFooterCobros();

//         crearPaginaCobros();
//       }

//       let x = margenCobros;

//       // Fondo alternado
//       const fondo = index % 2 === 0 ? blanco : grisFondo;

//       // =========================
//       // N°
//       // =========================

//       rectangulo(x, cobroY, columnas[0].width, rowHeight, {
//         color: fondo,
//         borderColor: grisBorde,
//         borderWidth: 0.5,
//       });

//       textoCentrado(index + 1, x, cobroY + 10, columnas[0].width, 8, {
//         color: negro,
//       });

//       x += columnas[0].width;

//       // =========================
//       // CONCEPTO
//       // =========================

//       rectangulo(x, cobroY, columnas[1].width, rowHeight, {
//         color: fondo,
//         borderColor: grisBorde,
//         borderWidth: 0.5,
//       });

//       texto(
//         cortarTexto(cobro.nombre_accion || '-', columnas[1].width - 15, 8.5),
//         x + 8,
//         cobroY + 10,
//         8.5,
//         {
//           color: negro,
//         },
//       );

//       x += columnas[1].width;

//       // =========================
//       // PRECIO
//       // =========================

//       rectangulo(x, cobroY, columnas[2].width, rowHeight, {
//         color: fondo,
//         borderColor: grisBorde,
//         borderWidth: 0.5,
//       });

//       const precio = Number(cobro.precio_accion || 0).toFixed(2);

//       const precioWidth = fontBold.widthOfTextAtSize(precio, 8.5);

//       texto(
//         precio,
//         x + columnas[2].width - precioWidth - 10,
//         cobroY + 10,
//         8.5,
//         {
//           bold: true,
//           color: azulInstitucional,
//         },
//       );

//       cobroY -= rowHeight;
//     });

//     // =====================================================
//     // TOTAL
//     // =====================================================

//     const totalCobros = cobros.reduce(
//       (total, cobro) => total + Number(cobro.precio_accion || 0),
//       0,
//     );

//     // Si no entra el total, crear otra página
//     if (cobroY < 115) {
//       dibujarFooterCobros();

//       crearPaginaCobros();
//     }

//     cobroY -= 15;

//     rectangulo(margenCobros + 385, cobroY - 25, 126, 40, {
//       color: grisFondo,
//       borderColor: grisBorde,
//       borderWidth: 0.7,
//     });

//     texto('TOTAL', margenCobros + 397, cobroY, 7, {
//       bold: true,
//       color: grisMedio,
//     });

//     texto(
//       `Bs. ${totalCobros.toFixed(2)}`,
//       margenCobros + 397,
//       cobroY - 15,
//       11,
//       {
//         bold: true,
//         color: azulInstitucional,
//       },
//     );

//     // =========================================================
//     // FIRMA DEL SOCIO
//     // =========================================================

//     const firmaX = derechaX;
//     const firmaY = campoY - 5;

//     linea(firmaX, firmaY, firmaX + anchoColumna, firmaY, grisTexto, 0.8);

//     texto('FIRMA DEL SOCIO', firmaX + 72, firmaY - 14, 7, {
//       bold: true,
//       color: grisMedio,
//     });

//     dibujarFooterCobros();
//   }

//   return await pdfDoc.save();
// };

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const formatFechaHora = (fecha) => {
  if (!fecha) return '-';

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
};

export const generarCaratulaAccion = async (data) => {
  const pdfDoc = await PDFDocument.create();

  // Se conserva el tamaño original de tu PDF: 612 x 792 pt.
  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const margen = 42;
  const contentWidth = PAGE_WIDTH - margen * 2;

  // Hasta 10 cobros + total + firma caben en la primera hoja.
  const MAX_COBROS_PRIMERA_HOJA = 10;
  const ROW_HEIGHT = 18;
  const HEADER_HEIGHT = 22;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colores originales.
  const azulInstitucional = rgb(0.055, 0.16, 0.28);
  const azulSecundario = rgb(0.1, 0.28, 0.43);
  const grisTexto = rgb(0.3, 0.34, 0.38);
  const grisMedio = rgb(0.55, 0.58, 0.61);
  const grisBorde = rgb(0.82, 0.84, 0.86);
  const grisFondo = rgb(0.955, 0.96, 0.965);
  const negro = rgb(0.08, 0.09, 0.1);
  const blanco = rgb(1, 1, 1);

  const institucion =
    data.institucion || 'COMITE DE AGUA POTABLE OTB HUAYLLANI OESTE';
  const codigoAccion = data.accion?.codigo_interno ?? 'SIN CÓDIGO';
  const nombreSocio = [
    data.socio?.nombres,
    data.socio?.primer_apellido,
    data.socio?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ');
  const cobros = Array.isArray(data.cobros) ? data.cobros : [];

  // =========================================================
  // HELPERS (siempre trabajan sobre la página actual)
  // =========================================================

  const texto = (value, x, y, size = 9, options = {}) => {
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

  const linea = (x1, y1, x2, y2, color = grisBorde, thickness = 0.6) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color,
      thickness,
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
      borderWidth: options.borderWidth ?? 0.6,
    });
  };

  const cortarTexto = (value, maxWidth, size = 9, selectedFont = font) => {
    const original =
      value === null || value === undefined || value === ''
        ? '-'
        : String(value);

    if (selectedFont.widthOfTextAtSize(original, size) <= maxWidth) {
      return original;
    }

    let resultado = original;
    while (
      resultado.length > 0 &&
      selectedFont.widthOfTextAtSize(`${resultado}...`, size) > maxWidth
    ) {
      resultado = resultado.slice(0, -1);
    }
    return `${resultado}...`;
  };

  const textoCentrado = (value, x, y, width, size = 8, options = {}) => {
    const selectedFont = options.bold ? fontBold : font;
    const contenido = cortarTexto(value, width - 8, size, selectedFont);
    const textWidth = selectedFont.widthOfTextAtSize(contenido, size);
    texto(contenido, x + (width - textWidth) / 2, y, size, options);
  };

  const campo = ({ label, value, x, y, width: fieldWidth }) => {
    texto(label.toUpperCase(), x, y + 11, 6.5, {
      bold: true,
      color: grisMedio,
    });
    texto(cortarTexto(value, fieldWidth - 3, 9), x, y - 2, 9);
    linea(x, y - 9, x + fieldWidth, y - 9, grisBorde, 0.5);
  };

  const tituloSeccion = (numero, titulo, y) => {
    rectangulo(margen, y, contentWidth, 24, {
      color: grisFondo,
      borderColor: grisBorde,
      borderWidth: 0.5,
    });
    page.drawRectangle({
      x: margen,
      y,
      width: 4,
      height: 24,
      color: azulInstitucional,
    });
    texto(`${numero}. ${titulo}`, margen + 14, y + 7, 9.5, {
      bold: true,
      color: azulInstitucional,
    });
  };

  const dibujarInstitucion = () => {
    texto(
      cortarTexto(institucion, contentWidth, 14, fontBold),
      margen,
      765,
      14,
      {
        bold: true,
        color: azulInstitucional,
      },
    );
    linea(margen, 747, PAGE_WIDTH - margen, 747, azulInstitucional, 1.2);
  };

  const dibujarFooter = () => {
    linea(margen, 43, PAGE_WIDTH - margen, 43, azulInstitucional, 0.9);
    texto(cortarTexto(institucion, contentWidth, 7), margen, 29, 7, {
      color: grisMedio,
    });
  };

  // =========================================================
  // HOJA PRINCIPAL: CARÁTULA + ACCIÓN + SOCIO + FIRMA
  // =========================================================

  dibujarInstitucion();

  rectangulo(margen, 702, contentWidth, 34, {
    color: azulInstitucional,
    borderColor: azulInstitucional,
    borderWidth: 0,
  });
  texto('CARÁTULA DE ACCIÓN', margen + 14, 713, 15, {
    bold: true,
    color: blanco,
  });

  const codigoText = cortarTexto(codigoAccion, 100, 11, fontBold);
  const codigoWidth = fontBold.widthOfTextAtSize(codigoText, 11);
  texto('CÓDIGO DE ACCIÓN', PAGE_WIDTH - margen - 118, 723, 6.3, {
    bold: true,
    color: rgb(0.78, 0.84, 0.89),
  });
  texto(codigoText, PAGE_WIDTH - margen - 15 - codigoWidth, 708, 11, {
    bold: true,
    color: blanco,
  });

  texto('FECHA DE CREACIÓN DE LA ACCIÓN', margen, 690, 6.5, {
    bold: true,
    color: grisMedio,
  });
  texto(formatFechaHora(data.accion?.fechaRegistro), margen, 675, 9);
  texto('ESTADO', margen + 245, 690, 6.5, {
    bold: true,
    color: grisMedio,
  });
  texto(data.accion?.estado, margen + 245, 675, 9, {
    bold: true,
    color: azulSecundario,
  });
  linea(margen, 663, PAGE_WIDTH - margen, 663);

  const izquierdaX = margen + 15;
  const derechaX = margen + 272;
  const anchoColumna = 226;

  // DATOS DE LA ACCIÓN
  tituloSeccion('01', 'DATOS DE LA ACCIÓN', 627);
  rectangulo(margen, 476, contentWidth, 145);

  campo({
    label: 'Código interno',
    value: data.accion?.codigo_interno,
    x: izquierdaX,
    y: 603,
    width: anchoColumna,
  });
  campo({
    label: 'Calle',
    value: data.accion?.calle,
    x: izquierdaX,
    y: 577,
    width: anchoColumna,
  });
  campo({
    label: 'Tarifa',
    value: data.accion?.tarifa,
    x: derechaX,
    y: 577,
    width: anchoColumna,
  });
  campo({
    label: 'N.º de medidor',
    value: data.accion?.nro_medidor,
    x: izquierdaX,
    y: 551,
    width: anchoColumna,
  });
  campo({
    label: 'Estado',
    value: data.accion?.estado,
    x: derechaX,
    y: 551,
    width: anchoColumna,
  });
  campo({
    label: 'Dirección',
    value: data.accion?.direccion,
    x: izquierdaX,
    y: 525,
    width: contentWidth - 30,
  });

  texto('OBSERVACIONES', izquierdaX, 500, 6.5, {
    bold: true,
    color: grisMedio,
  });
  texto(
    cortarTexto(
      data.accion?.observacion || 'Sin observaciones',
      contentWidth - 32,
      8.5,
    ),
    izquierdaX,
    487,
    8.5,
  );

  // DATOS DEL SOCIO
  tituloSeccion('02', 'DATOS DEL SOCIO', 444);
  rectangulo(margen, 331, contentWidth, 107);

  campo({
    label: 'Cédula de identidad',
    value: data.socio?.ci_socio,
    x: izquierdaX,
    y: 414,
    width: anchoColumna,
  });
  campo({
    label: 'Número de celular',
    value: data.socio?.numero_celular,
    x: derechaX,
    y: 414,
    width: anchoColumna,
  });
  campo({
    label: 'Nombres',
    value: data.socio?.nombres,
    x: izquierdaX,
    y: 384,
    width: anchoColumna,
  });
  campo({
    label: 'Primer apellido',
    value: data.socio?.primer_apellido,
    x: derechaX,
    y: 384,
    width: anchoColumna,
  });
  campo({
    label: 'Segundo apellido',
    value: data.socio?.segundo_apellido,
    x: izquierdaX,
    y: 354,
    width: anchoColumna,
  });

  // FIRMA: espacio libre de la tercera fila de datos del socio.
  linea(derechaX, 349, derechaX + anchoColumna, 349, grisTexto, 0.85);
  textoCentrado('FIRMA DEL SOCIO', derechaX, 335, anchoColumna, 7, {
    bold: true,
    color: grisMedio,
  });

  // =========================================================
  // DETALLE DE COBROS EN LA MISMA HOJA
  // =========================================================

  tituloSeccion('03', 'DETALLE DE COBROS DE LA ACCIÓN', 298);

  const columnas = [
    { label: 'N.º', width: 36 },
    { label: 'CONCEPTO', width: 376 },
    { label: 'PRECIO (Bs.)', width: 116 },
  ];

  // Cursor vertical: el PDF crece hacia arriba, por eso se resta.
  let cobroY = 0;

  const dibujarCabeceraTabla = (yTop) => {
    const yBottom = yTop - HEADER_HEIGHT;
    let x = margen;

    columnas.forEach((col) => {
      rectangulo(x, yBottom, col.width, HEADER_HEIGHT, {
        color: azulInstitucional,
        borderColor: blanco,
        borderWidth: 0.4,
      });
      textoCentrado(col.label, x, yBottom + 7, col.width, 7.2, {
        bold: true,
        color: blanco,
      });
      x += col.width;
    });

    cobroY = yBottom;
  };

  const dibujarFilaCobro = (cobro, index) => {
    const filaY = cobroY - ROW_HEIGHT;
    const fondo = index % 2 === 0 ? blanco : grisFondo;
    const textY = filaY + 5;

    let x = margen;

    rectangulo(x, filaY, columnas[0].width, ROW_HEIGHT, {
      color: fondo,
      borderWidth: 0.4,
    });
    textoCentrado(index + 1, x, textY, columnas[0].width, 8);
    x += columnas[0].width;

    rectangulo(x, filaY, columnas[1].width, ROW_HEIGHT, {
      color: fondo,
      borderWidth: 0.4,
    });
    texto(
      cortarTexto(cobro.nombre_accion || '-', columnas[1].width - 16, 8.2),
      x + 8,
      textY,
      8.2,
    );
    x += columnas[1].width;

    rectangulo(x, filaY, columnas[2].width, ROW_HEIGHT, {
      color: fondo,
      borderWidth: 0.4,
    });
    const importe = Number(cobro.precio_accion || 0).toFixed(2);
    const importeText = cortarTexto(
      importe,
      columnas[2].width - 12,
      8.2,
      fontBold,
    );
    const importeWidth = fontBold.widthOfTextAtSize(importeText, 8.2);
    texto(importeText, x + columnas[2].width - importeWidth - 8, textY, 8.2, {
      bold: true,
      color: azulInstitucional,
    });

    cobroY = filaY;
  };

  const crearPaginaContinuacion = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    dibujarInstitucion();

    texto('DETALLE DE COBROS DE LA ACCIÓN (CONTINUACIÓN)', margen, 710, 13, {
      bold: true,
      color: azulInstitucional,
    });

    rectangulo(margen, 665, contentWidth, 31, {
      color: grisFondo,
      borderColor: grisBorde,
    });
    texto('CÓDIGO DE ACCIÓN', margen + 10, 682, 6.5, {
      bold: true,
      color: grisMedio,
    });
    texto(cortarTexto(codigoAccion, 80, 9, fontBold), margen + 103, 680, 9, {
      bold: true,
    });
    texto('SOCIO', margen + 205, 682, 6.5, {
      bold: true,
      color: grisMedio,
    });
    texto(cortarTexto(nombreSocio, 230, 9), margen + 248, 680, 9);

    dibujarCabeceraTabla(648);
    dibujarFooter();
  };

  dibujarCabeceraTabla(293);
  dibujarFooter();

  let filasEnPagina = 0;
  let esPrimeraPagina = true;

  if (cobros.length === 0) {
    rectangulo(margen, cobroY - 25, contentWidth, 25, {
      color: grisFondo,
    });
    textoCentrado(
      'Sin cobros registrados',
      margen,
      cobroY - 17,
      contentWidth,
      8,
      {
        color: grisMedio,
      },
    );
    cobroY -= 25;
  }

  cobros.forEach((cobro, index) => {
    if (esPrimeraPagina && filasEnPagina >= MAX_COBROS_PRIMERA_HOJA) {
      crearPaginaContinuacion();
      esPrimeraPagina = false;
      filasEnPagina = 0;
    }

    // En páginas adicionales, se deja espacio para el total y el pie.
    if (!esPrimeraPagina && cobroY - ROW_HEIGHT < 90) {
      crearPaginaContinuacion();
      filasEnPagina = 0;
    }

    dibujarFilaCobro(cobro, index);
    filasEnPagina += 1;
  });

  // =========================================================
  // TOTAL DE COBROS
  // =========================================================

  const totalCobros = cobros.reduce(
    (acumulado, cobro) => acumulado + Number(cobro.precio_accion || 0),
    0,
  );

  const TOTAL_HEIGHT = 29;
  const TOTAL_GAP = 6;
  const TOTAL_MIN_Y = 55;

  if (cobroY - TOTAL_GAP - TOTAL_HEIGHT < TOTAL_MIN_Y) {
    crearPaginaContinuacion();
  }

  const totalY = cobroY - TOTAL_GAP - TOTAL_HEIGHT;
  const totalX = PAGE_WIDTH - margen - 186;
  const totalWidth = 186;

  rectangulo(totalX, totalY, totalWidth, TOTAL_HEIGHT, {
    color: grisFondo,
    borderColor: grisBorde,
    borderWidth: 0.7,
  });
  texto('TOTAL', totalX + 12, totalY + 10, 8, {
    bold: true,
    color: grisMedio,
  });

  const totalTexto = `Bs. ${totalCobros.toFixed(2)}`;
  const totalTextoSeguro = cortarTexto(totalTexto, 112, 10, fontBold);
  const totalTextoWidth = fontBold.widthOfTextAtSize(totalTextoSeguro, 10);
  texto(
    totalTextoSeguro,
    totalX + totalWidth - totalTextoWidth - 10,
    totalY + 9,
    10,
    {
      bold: true,
      color: azulInstitucional,
    },
  );

  // Se mantiene el mismo tipo de respuesta que tu función original.
  return await pdfDoc.save();
};
