'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipos_acciones', [
      {
        nombre_tipos_acciones: 'Ac Agua',
        costo_tipos_acciones: 5400,
      },
      {
        nombre_tipos_acciones: 'Ac Alcantarillado',
        costo_tipos_acciones: 700,
      },
      {
        nombre_tipos_acciones: 'Derecho de socio',
        costo_tipos_acciones: 700,
      },
      {
        nombre_tipos_acciones: 'Derecho de calle',
        costo_tipos_acciones: 500,
      },
      {
        nombre_tipos_acciones: 'Conexion de agua',
        costo_tipos_acciones: 100,
      },
      {
        nombre_tipos_acciones: 'Conexion de alcantarillado',
        costo_tipos_acciones: 100,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_acciones', null, {});
  },
};
