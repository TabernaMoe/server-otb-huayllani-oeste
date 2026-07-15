import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { multaModel } from './multa.model.js';

export const asambleaModel = sequelize.define(
  'Asambleas',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    multa_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'multas',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_string: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_final: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    lugar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'asambleas',
    timestamps: true,
  },
);

multaModel.hasMany(asambleaModel, {
  as: 'asambleas',
  foreignKey: 'multa_id',
});
asambleaModel.belongsTo(multaModel, {
  as: 'multa',
  foreignKey: 'multa_id',
});
