'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pagos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      cobro_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'cobro_accion',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      monto_pago: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      metodo_pago: {
        type: Sequelize.ENUM('EFECTIVO', 'QR'),
        allowNull: false,
      },
      fecha_pago: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      observaciones_pago: {
        type: Sequelize.STRING,
      },
      etado_pago: {
        type: Sequelize.ENUM('VALIDAD', 'ANULADO'),
        defaultValue: 'VALIDO',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pagos');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_pagos_metodo_pago";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_pagos_etado_pago";',
    );
  },
};
