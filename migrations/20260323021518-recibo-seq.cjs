'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE recibo_seq
      START WITH 1
      INCREMENT BY 1;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS recibo_seq;
    `);
  },
};
