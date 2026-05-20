'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('auth_permisos', [
      //SOCIOS PERMISOS
      {
        nombre_permiso: 'Ver socio',
        codigo_permiso: 'socios.socio.ver',
      },
      {
        nombre_permiso: 'Crear Socio',
        codigo_permiso: 'socios.socio.crear',
      },
      {
        nombre_permiso: 'Editar Socio',
        codigo_permiso: 'socios.socio.editar',
      },
      {
        nombre_permiso: 'Eliminar Socio',
        codigo_permiso: 'socios.socio.eliminar',
      },
      {
        nombre_permiso: 'Estado Socio',
        codigo_permiso: 'socios.socio.gestionar_estado',
      },
      {
        nombre_permiso: 'Ver socios eliminados',
        codigo_permiso: 'socios.eliminados.ver',
      },
      {
        nombre_permiso: 'Restaurar Socios eliminados ',
        codigo_permiso: 'socios.eliminados.restaurar',
      },
      //ACCIONES PERMISOS DETALLES DE PAGO
      {
        nombre_permiso: 'Ver detalles de pago acciones',
        codigo_permiso: 'acciones.detalles.ver',
      },
      {
        nombre_permiso: 'Crear detalles de pago acciones',
        codigo_permiso: 'acciones.detalles.crear',
      },
      {
        nombre_permiso: 'Editar detalles de pago acciones',
        codigo_permiso: 'acciones.detalles.editar',
      },
      {
        nombre_permiso: 'Eliminar detalles de pago acciones',
        codigo_permiso: 'acciones.detalles.eliminar',
      },
      //ACCIONES PERMISOS GESTION DE CALLES
      {
        nombre_permiso: 'Ver calles',
        codigo_permiso: 'acciones.calles.ver',
      },
      {
        nombre_permiso: 'Crear calles',
        codigo_permiso: 'acciones.calles.crear',
      },
      {
        nombre_permiso: 'Editar calles',
        codigo_permiso: 'acciones.calles.editar',
      },
      {
        nombre_permiso: 'Eliminar calles',
        codigo_permiso: 'acciones.calles.eliminar',
      },
      //ACCIONES ACCIONES
      {
        nombre_permiso: 'Ver acciones',
        codigo_permiso: 'acciones.accion.ver',
      },
      {
        nombre_permiso: 'Crear acciones',
        codigo_permiso: 'acciones.accion.crear',
      },
      {
        nombre_permiso: 'Editar acciones',
        codigo_permiso: 'acciones.accion.editar',
      },
      {
        nombre_permiso: 'Eliminar acciones',
        codigo_permiso: 'acciones.accion.eliminar',
      },
      {
        nombre_permiso: 'Cambiar nombre accion',
        codigo_permiso: 'acciones.accion.cambiar_nombre',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('auth_permisos', null, {});
  },
};
