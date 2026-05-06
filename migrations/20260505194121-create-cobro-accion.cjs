'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cobro_accion', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      socio_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'socios',
          key: 'id',
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      accion_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'acciones',
          key: 'id',
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      concepto_cobro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      monto_total_cobro: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      monto_pagado_cobro: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      saldo_cobro: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      estado_cobro: {
        type: Sequelize.ENUM('pendiente', 'pagado', 'parcial', 'anulado'),
        defaultValue: 'pendiente',
        allowNull: false,
      },
      fecha_emision: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cobro_accion');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_cobro_accion_estado_cobro";',
    );
  },
};
