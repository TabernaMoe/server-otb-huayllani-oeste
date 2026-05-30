'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auth_roles', [
      {
        id: 1,
        nombre_rol: 'super_admin',
      },
      {
        id: 2,
        nombre_rol: 'usuario_normal',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auth_roles', null, {});
  },
};
