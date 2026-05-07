'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('socios', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'auth_usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ci_socio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      ci_expedido_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nombres_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      primer_apellido_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      segundo_apellido_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numero_celular_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numero_telefono_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genero_socio: {
        type: Sequelize.ENUM('masculino', 'femenino'),
        allowNull: false,
      },
      estado_accion: {
        type: Sequelize.ENUM('pasivo', 'activo'),
      },
      direccion_socio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('socios');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_socios_genero_socio";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_socios_estado_accion";',
    );
  },
};
