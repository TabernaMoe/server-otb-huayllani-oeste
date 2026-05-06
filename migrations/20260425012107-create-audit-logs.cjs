'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_auditoria_logs', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'auth_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      accion: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      modulo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      entidad: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      entidad_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      valores_antiguos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      valores_nuevos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      ip_address: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auth_auditoria_logs');
  },
};
