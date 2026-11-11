import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { tipoAccionModel } from './tipoAccion.model.js';

export const detalleAccionModel = sequelize.define(
  'detalleAccion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tipo_accion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tipos_accion',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    tipo_servicio: {
      type: DataTypes.ENUM('AGUA', 'ALCANTARILLADO'),
      defaultValue: 'AGUA',
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
    tableName: 'detalle_accion',
    timestamps: true,
  },
);

tipoAccionModel.hasMany(detalleAccionModel, {
  as: 'DetallesPagoAccion',
  foreignKey: 'tipo_accion_id',
});
detalleAccionModel.belongsTo(tipoAccionModel, {
  as: 'tipoAccion',
  foreignKey: 'tipo_accion_id',
});
