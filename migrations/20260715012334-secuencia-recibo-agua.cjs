'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Crear la secuencia
      await queryInterface.sequelize.query(
        `
        CREATE SEQUENCE IF NOT EXISTS recibo_agua_numero_recibo_seq
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        NO CYCLE;
        `,
        { transaction },
      );

      // 2. Si ya existen recibos, continuar desde el número más alto + 1
      await queryInterface.sequelize.query(
        `
        SELECT setval(
          'recibo_agua_numero_recibo_seq',
          COALESCE(
            (SELECT MAX(numero_recibo) FROM recibo_agua),
            0
          ) + 1,
          false
        );
        `,
        { transaction },
      );

      // 3. Asignar la secuencia como valor por defecto
      await queryInterface.sequelize.query(
        `
        ALTER TABLE recibo_agua
        ALTER COLUMN numero_recibo
        SET DEFAULT nextval('recibo_agua_numero_recibo_seq');
        `,
        { transaction },
      );

      // 4. Vincular la secuencia con la columna
      await queryInterface.sequelize.query(
        `
        ALTER SEQUENCE recibo_agua_numero_recibo_seq
        OWNED BY recibo_agua.numero_recibo;
        `,
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Quitar el valor automático de la columna
      await queryInterface.sequelize.query(
        `
        ALTER TABLE recibo_agua
        ALTER COLUMN numero_recibo
        DROP DEFAULT;
        `,
        { transaction },
      );

      // Desvincular y eliminar la secuencia
      await queryInterface.sequelize.query(
        `
        ALTER SEQUENCE recibo_agua_numero_recibo_seq
        OWNED BY NONE;
        `,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `
        DROP SEQUENCE IF EXISTS recibo_agua_numero_recibo_seq;
        `,
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
