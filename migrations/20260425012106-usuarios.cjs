'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_usuarios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contrasenia_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado_usuario: {
        type: Sequelize.ENUM('HABILITADO', 'INHABILITADO'),
        defaultValue: 'HABILITADO',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auth_usuarios');
  },
};
