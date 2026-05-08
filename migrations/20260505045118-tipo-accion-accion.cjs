'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipo_accion_accion', {
      accion_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'acciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      tipo_accion_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'tipos_acciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tipo_accion_accion');
  },
};
