import z from 'zod';
import {
  reqCelular,
  reqCi,
  reqExpedidoCi,
  reqFecha,
  reqString,
  reqGenero,
  reqEstadoSocio,
} from '../../validators/funcionesZod.js';
export const socioSchema = z.object({
  ci_socio: reqCi(),
  ci_expedido: reqExpedidoCi(),
  nombres: reqString({
    label: 'Nombre del socio',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El nombre solo debe contener letras',
  }),
  primer_apellido: reqString({
    label: 'Primer apellido',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),
  segundo_apellido: reqString({
    label: 'Segundo apellido',
    min: 2,
    max: 100,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    regexMessage: 'El apellido solo debe contener letras',
  }),
  numero_celular: reqCelular(),
  numero_telefono: reqCelular('Telefono', false),
  genero: reqGenero(),
  direccion: reqString({
    label: 'Dirección',
    min: 5,
    max: 255,
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#\-.,/]+$/,
    regexMessage: 'La dirección contiene caracteres inválidos',
  }),
});
export const updateSocioSchema = socioSchema.partial();
