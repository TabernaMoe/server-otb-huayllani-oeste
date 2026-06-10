'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin_super_admin', 12);
    await queryInterface.bulkInsert('auth_usuarios', [
      {
        nombre_usuario: 'super_admin',
        contrasenia_usuario: hashedPassword,
        rol_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auth_usuarios', null, {});
  },
};
