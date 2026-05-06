'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pago_accion', {
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
        type: Sequelize.ENUM('efectivo', 'qr'),
        defaultValue: 'efectivo',
        allowNull: false,
      },
      fecha_pago: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      observaciones_pago: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pago_accion');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_pago_accion_metodo_pago";',
    );
  },
};
