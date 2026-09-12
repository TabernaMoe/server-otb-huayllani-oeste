import { Router } from 'express';
import { generarReciboPDF } from '../../helpers/GenerarReciboPDF.js';
import { generarCaratulaAccion } from './generarCaratulaAccion.js';
import { generarPlanillaReunion } from './generarPlanillaReunion.js';

const routes = new Router();

routes
  .get('/recibo', async (req, res) => {
    const pdfBytes = await generarReciboPDF();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=recibo.pdf');

    res.send(Buffer.from(pdfBytes));
  })
  .get('/caratula', async (req, res, next) => {
    try {
      const data = {
        accion: {
          codigoInterno: '1256',
          calle: 'Bolivar',
          tarifa: 'familiar',
          nroMedidor: '',
          direccion: 'Uyuni casi peru',
          tipoAccion: 'FAMILIAR',
          estado: 'ACTIVA',
          fechaRegistro: '11/09/2026',
        },

        socio: {
          ci: '1234567 LP',
          nombres: 'Juan Carlos',
          primerApellido: 'Pérez',
          segundoApellido: 'López',
          numeroCelular: '41414141',
        },
      };

      const pdfBytes = await generarCaratulaAccion(data);

      res.setHeader('Content-Type', 'application/pdf');

      res.setHeader(
        'Content-Disposition',
        'inline; filename="caratula-accion.pdf"',
      );

      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  })
  .get('/reunion', async (req, res, next) => {
    try {
      const data = {
        institucion: 'COOPERATIVA DE AGUA POTABLE',

        reunion: 'Asamblea General Ordinaria',
        fecha: '11/09/2026',
        hora: '19:00',
        tolerancia: 10,
        lugar: 'Sede de la Cooperativa',

        detalle: [
          {
            codigo: 'AC-001',
            ci: '1234567',
            nombre: 'Juan Pérez Mamani',
            horaProgramada: '19:00',
            horaLlegada: '19:18',
            minutosRetraso: 8,
            tipo: 'RETRASO',
            multa: 10,
            observacion: '',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
          {
            codigo: 'AC-015',
            ci: '4567890',
            nombre: 'Carlos López Quispe',
            horaProgramada: '19:00',
            horaLlegada: null,
            minutosRetraso: null,
            tipo: 'FALTA',
            multa: 30,
            observacion: 'Sin justificar',
          },
        ],
      };

      const pdfBytes = await generarPlanillaReunion(data);

      res.setHeader('Content-Type', 'application/pdf');

      res.setHeader(
        'Content-Disposition',
        'inline; filename="caratula-accion.pdf"',
      );

      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      next(error);
    }
  });

export default routes;
