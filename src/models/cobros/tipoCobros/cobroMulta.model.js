import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js';
import { multaModel } from '../../multas.model.js';
import { cobroModel } from '../cobro.model.js';

export const cobroMultaModel = sequelize.define(
  'CobroMulta',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cobro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobros',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    multa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'multas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    multa_snapshot: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: 'cobro_multas',
    timestamps: true,
  },
);

multaModel.hasMany(cobroMultaModel, {
  as: 'cobrosMulta',
  foreignKey: 'multa_id',
});
cobroMultaModel.belongsTo(multaModel, {
  as: 'multaCobro',
  foreignKey: 'multa_id',
});

cobroModel.hasMany(cobroMultaModel, {
  as: 'multas',
  foreignKey: 'cobro_id',
});
cobroMultaModel.belongsTo(cobroModel, {
  as: 'cobroMulta',
  foreignKey: 'cobro_id',
});
