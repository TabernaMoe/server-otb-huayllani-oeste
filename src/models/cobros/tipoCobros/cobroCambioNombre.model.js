import { sequelize } from '../../../config/database.js';
import { DataTypes } from 'sequelize';
import { cambiarNombreModel } from '../../../models/cambioNombre.model.js';
import { cobroModel } from '../../cobros/cobro.model.js';

export const cobroCambioNombreModel = sequelize.define(
  'CobroCambioNombre',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cobro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobros',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cambio_nombre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cambiar_nombre',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'cobro_cambio_nombres',
    timestamps: true,
  },
);

cobroModel.hasMany(cobroCambioNombreModel, {
  as: 'cobroCambioNombre',
  foreignKey: 'cobro_id',
});
cobroCambioNombreModel.belongsTo(cobroModel, {
  as: 'cambioNombreCobro',
  foreignKey: 'cobro_id',
});

cambiarNombreModel.hasMany(cobroCambioNombreModel, {
  as: 'cnCobro',
  foreignKey: 'cambio_nombre_id',
});
cobroCambioNombreModel.belongsTo(cambiarNombreModel, {
  as: 'cobroCn',
  foreignKey: 'cambio_nombre_id',
});
