import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { periodoModel } from '../../models/gestiones/periodo.model.js';

export const asambleaModel = sequelize.define(
  'Asamblea',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    periodo_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'periodos',
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
    monto_multa: {
      type: DataTypes.DECIMAL(10, 2),
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

//periodo
periodoModel.hasMany(asambleaModel, {
  as: 'asambleasPeriodo',
  foreignKey: 'periodo_id',
});
asambleaModel.belongsTo(periodoModel, {
  as: 'periodoAsamblea',
  foreignKey: 'periodo_id',
});
