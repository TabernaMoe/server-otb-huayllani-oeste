import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionAlcantarillado } from './acccionAlcantarillado.model.js';

export const detallePagoAccionAlcantarillado = sequelize.define(
  'detallePagoAccionAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    nombre_accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio_accion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tipo_cobro: {
      type: DataTypes.ENUM('UNICO', 'MENSUAL'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'detalles_pago_accion_alcantarillado',
    timestamps: true,
  },
);

export const accionAlcantarilladoDetalle = sequelize.define(
  'accionAlcantarrilladoDetalle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accion_alcantarillado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones_alcantarillado',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    detalle_alcantarillado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'detalles_pago_accion_alcantarillado',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    tableName: 'accion_alcantarillado_detalle',
    timestamps: false,
  },
);

accionAlcantarillado.belongsToMany(detallePagoAccionAlcantarillado, {
  as: 'detallesAlcantarrillado',
  through: accionAlcantarilladoDetalle,
  foreignKey: 'accion_alcantarillado_id',
  otherKey: 'detalle_alcantarillado_id',
});
detallePagoAccionAlcantarillado.belongsToMany(accionAlcantarillado, {
  as: 'accionesAlcantarilladoDetalle',
  through: accionAlcantarilladoDetalle,
  foreignKey: 'detalle_alcantarillado_id',
  otherKey: 'accion_alcantarillado_id',
});
