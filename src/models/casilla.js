'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Casilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Jugador, {
        foreignKey: 'p_id'
      });
      this.belongsTo(models.Juego, {
        foreignKey: 'g_id'
      });
    }
  }
  Casilla.init({
    p_id: DataTypes.INTEGER,
    g_id: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    posicion_eje_x: DataTypes.INTEGER,
    posicion_eje_y: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Casilla',
  });
  return Casilla;
};