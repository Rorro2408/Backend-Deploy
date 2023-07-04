'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jugador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'u_id'
      });
      this.belongsTo(models.Juego, {
        foreignKey: 'g_id'
      });
      this.hasMany(models.Casilla, {
        foreignKey: 'id'
      });
    }
  }
  Jugador.init({
    u_id: DataTypes.INTEGER,
    g_id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    dinero: DataTypes.INTEGER,
    soldados: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Jugador',
  });
  return Jugador;
};