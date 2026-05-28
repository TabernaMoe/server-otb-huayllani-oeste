'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('calles_ramal', [
      { nombre_calle: 'Av Villazon' },
      { nombre_calle: 'Ñancahuasu' },
      { nombre_calle: 'Max Fernandez' },
      { nombre_calle: 'Pando' },
      { nombre_calle: 'Bolivia' },
      { nombre_calle: '1ro Mayo' },
      { nombre_calle: 'Sucre' },
      { nombre_calle: 'Samuel Fino' },
      { nombre_calle: 'Toroncho' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('calles_ramal', null, {});
  },
};
