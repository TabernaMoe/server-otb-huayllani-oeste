'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cobros', {
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

      tipo_cobro: {
        type: Sequelize.ENUM('ACCION', 'CAMBIO_NOMBRE_ACCION', 'OTRO'),
      },

      referencia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      concepto_cobro: {
        type: Sequelize.STRING,
      },

      descripcion: {
        type: Sequelize.STRING,
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
        type: Sequelize.ENUM('PENDIENTE', 'PAGADO', 'PARCIAL', 'ANULADO'),
        defaultValue: 'PENDIENTE',
      },
      fecha_emision: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cobros');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_cobros_estado_cobro" CASCADE;',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_cobros_tipo_cobro" CASCADE;',
    );
  },
};
