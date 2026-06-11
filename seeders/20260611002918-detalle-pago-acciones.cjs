'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('detalle_pago_accion', [
      {
        nombre_accion: 'Ac. agua',
        precio_accion: 5400,
        tipo_cobro: 'UNICO',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Ac. alcantarillado',
        precio_accion: 700,
        tipo_cobro: 'UNICO',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Derecho socio',
        precio_accion: 700,
        tipo_cobro: 'UNICO',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Conexion agua',
        precio_accion: 100,
        tipo_cobro: 'UNICO',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Conexion alcantarillado',
        precio_accion: 100,
        tipo_cobro: 'UNICO',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Mantenimiento accion de agua',
        precio_accion: 19,
        tipo_cobro: 'MENSUAL',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre_accion: 'Mantenimiento accion de alcantarillado',
        precio_accion: 3,
        tipo_cobro: 'MENSUAL',
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('detalle_pago_accion');
  },
};
