import { DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/database.js';
import { cobroAlcantarilladoModel } from '../cobroAlcantarillado.model.js';
import { accionAlcantarilladoModel } from '../../acccionAlcantarillado.model.js';

export const cobroAccionAlcantarilladoModel = sequelize.define(
  'cobroAccionAlcantarillado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cobro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobros_alcantarillado',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    accion_detalle_alcantarillado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accion_alcantarillado_detalle',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_accion_alcantarillado',
    timestamps: true,
  },
);

cobroAlcantarilladoModel.hasMany(cobroAccionAlcantarilladoModel, {
  as: 'cobroAccionAlcantarillado',
  foreignKey: 'cobro_id',
});

cobroAccionAlcantarilladoModel.belongsTo(cobroAlcantarilladoModel, {
  as: 'cobroAlcantarillado',
  foreignKey: 'cobro_id',
});
