import { sequelize } from '../../config/database.js';
import { DataTypes } from 'sequelize';
import { lecturaAguaModel } from '../lecturasAgua/lecturasAgua.model.js';
import { cobroAguaModel } from '../cobroAgua/cobroAgua.model.js';

export const CobroLecturaModel = sequelize.define(
  'CobroLectura',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    lectura_agua_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lecturas_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    cobro_agua_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cobro_agua',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    mora: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    monto_lectura: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'cobros_lecturas',
    timestamps: true,
  },
);

lecturaAguaModel.hasMany(CobroLecturaModel, {
  foreignKey: 'lectura_agua_id',
});
CobroLecturaModel.belongsTo(lecturaAguaModel, {
  foreignKey: 'lectura_agua_id',
});

cobroAguaModel.hasMany(CobroLecturaModel, {
  foreignKey: 'cobro_agua_id',
});
CobroLecturaModel.belongsTo(cobroAguaModel, {
  foreignKey: 'lectura_agua_id',
});
