import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import { lecturaAguaModel } from './lecturasAgua.model.js';

export const cambioMedidor = sequelize.define(
  'cambio_medidor',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lectura_agua_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'lecturas_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    consumo_m3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'cambio_medidor',
    timestamps: true,
  },
);

lecturaAguaModel.hasOne(cambioMedidor, {
  as: 'cambioMedidor',
  foreignKey: 'lectura_agua_id',
});
cambioMedidor.belongsTo(lecturaAguaModel, {
  as: 'lecturaCambio',
  foreignKey: 'id',
});
