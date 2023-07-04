const Router = require('koa-router');
const dotenv = require('dotenv');
const decoding = require('../utils/decoding.js');
var jwt = require('jsonwebtoken');

dotenv.config();

const router = new Router();

router.get("/you", async (ctx) => {
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    console.log(decodedToken);

    try {
      const { sub } = decodedToken;
      console.log('Sub:', sub);

      const user = await ctx.orm.Usuario.findByPk(sub)
      ctx.body = {
        id: user.id,
        nombre: user.nombre
      };
      console.log("Devolvemos " + ctx.body);
      ctx.status = 200;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      ctx.body = error;
      ctx.status = 400;
    }
})

module.exports = router;