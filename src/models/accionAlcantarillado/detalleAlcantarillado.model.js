import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { accionAlcantarilladoModel } from './acccionAlcantarillado.model.js';

export const detalleAlcantarilladoModel = sequelize.define(
  'detalleAncantarillado',
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
    tableName: 'detalle_ancantarillado',
    timestamps: true,
  },
);

export const accionDetalleAlcantarilladoModel = sequelize.define(
  'accionDetalleAlcantarrillado',
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
        model: 'accion_detalle_alcantarillado',
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

accionAlcantarilladoModel.belongsToMany(detalleAlcantarilladoModel, {
  as: 'detallesAlcantarrillado',
  through: accionDetalleAlcantarilladoModel,
  foreignKey: 'accion_alcantarillado_id',
  otherKey: 'detalle_alcantarillado_id',
});
detalleAlcantarilladoModel.belongsToMany(accionAlcantarilladoModel, {
  as: 'accionesAlcantarillado',
  through: accionDetalleAlcantarilladoModel,
  foreignKey: 'detalle_alcantarillado_id',
  otherKey: 'accion_alcantarillado_id',
});
//
detalleAlcantarilladoModel.hasMany(accionDetalleAlcantarilladoModel, {
  foreignKey: 'detalle_alcantarillado_id',
});
accionDetalleAlcantarilladoModel.belongsTo(detalleAlcantarilladoModel, {
  as: 'detallesADA',
  foreignKey: 'detalle_alcantarillado_id',
});
