'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('acciones', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tipo_accion_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'tipos_acciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      calle_ramal_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'calles_ramal',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      socio_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'socios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      codigo_interno_accion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nro_medidor_accion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      direccion_acciones: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      observaciones_acciones: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_vizualizacion_acciones: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      nro_accion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      cobrar_accion: {
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('acciones');
  },
};
