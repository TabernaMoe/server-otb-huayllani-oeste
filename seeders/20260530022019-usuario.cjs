'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auth_usuarios', [
      {
        nombre_usuario: 'super_admin',
        contrasenia_usuario: 'admin_super_admin',
        rol_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auth_usuarios', null, {});
  },
};
