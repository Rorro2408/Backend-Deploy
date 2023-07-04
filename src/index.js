const app = require('./app');
const db = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Coneccion con la base de datos fue exitosa');
    app.listen(PORT, (err) => {
        if (err) {
            return console.error('oops', err);
        }
        console.log(`Escuchando en puerto ${PORT}`);
        return app;
    });
  })
  .catch((err) => console.error('No se pudo conectar a la base de datos:', err));