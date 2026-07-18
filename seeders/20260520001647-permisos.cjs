'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auth_permisos', [
      //SOCIOS PERMISOS
      {
        nombre_permiso: 'Ver socio',
        codigo_permiso: 'socio.ver',
      },
      {
        nombre_permiso: 'Crear Socio',
        codigo_permiso: 'socio.crear',
      },
      {
        nombre_permiso: 'Editar Socio',
        codigo_permiso: 'socio.editar',
      },

      {
        nombre_permiso: 'Estado Socio',
        codigo_permiso: 'socio.estado',
      },

      //TARIFA
      {
        nombre_permiso: 'Ver tarifa',
        codigo_permiso: 'tarifa.ver',
      },
      {
        nombre_permiso: 'Crear tarifa',
        codigo_permiso: 'tarifa.crear',
      },
      {
        nombre_permiso: 'Editar tarifa',
        codigo_permiso: 'tarifa.editar',
      },
      {
        nombre_permiso: 'Estado tarifa',
        codigo_permiso: 'tarifa.estado',
      },
      {
        nombre_permiso: 'Eliminar tarifa',
        codigo_permiso: 'tarifa.eliminar',
      },
      //ACCIONES PERMISOS GESTION DE CALLES
      {
        nombre_permiso: 'Ver calles',
        codigo_permiso: 'calle.ver',
      },
      {
        nombre_permiso: 'Crear calles',
        codigo_permiso: 'calle.crear',
      },
      {
        nombre_permiso: 'Editar calles',
        codigo_permiso: 'calle.editar',
      },
      {
        nombre_permiso: 'Estado calles',
        codigo_permiso: 'calle.estado',
      },
      {
        nombre_permiso: 'Eliminar calles',
        codigo_permiso: 'calle.eliminar',
      },
      //aciones detallle
      {
        nombre_permiso: 'Ver detalle acciones',
        codigo_permiso: 'acciones.detalle.ver',
      },
      {
        nombre_permiso: 'Crear detalle acciones',
        codigo_permiso: 'acciones.detalle.crear',
      },
      {
        nombre_permiso: 'Editar detalle acciones',
        codigo_permiso: 'acciones.detalle.editar',
      },
      {
        nombre_permiso: 'Estado detalle acciones',
        codigo_permiso: 'acciones.detalle.estado',
      },
      {
        nombre_permiso: 'Eliminar detalle acciones',
        codigo_permiso: 'acciones.detalle.eliminar',
      },
      //Accion 16-06-2026
      {
        nombre_permiso: 'Ver accion',
        codigo_permiso: 'acciones.accion.ver',
      },
      {
        nombre_permiso: 'Crear accion',
        codigo_permiso: 'acciones.accion.crear',
      },
      {
        nombre_permiso: 'Editar accion',
        codigo_permiso: 'acciones.accion.editar',
      },
      //cobros 17-06-2026
      {
        nombre_permiso: 'Ver cobro',
        codigo_permiso: 'cobro.ver',
      },
      {
        nombre_permiso: 'pagar cobro',
        codigo_permiso: 'cobro.pagar',
      },
      //lecutrar

      {
        nombre_permiso: 'Ver lectura',
        codigo_permiso: 'lectura.ver',
      },
      {
        nombre_permiso: 'Crear lectura',
        codigo_permiso: 'lectura.crear',
      },
      {
        nombre_permiso: 'Editar lectura',
        codigo_permiso: 'lectura.editar',
      },
      {
        nombre_permiso: 'Cambio lectura',
        codigo_permiso: 'lectura.cambio',
      },
      //cobros agua
      {
        nombre_permiso: 'Ver cobros agua',
        codigo_permiso: 'cobros.ver',
      },
      {
        nombre_permiso: 'Pagar cobros agua',
        codigo_permiso: 'cobros.pagar',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auth_permisos', null, {});
  },
};
