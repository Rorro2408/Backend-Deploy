const Router = require("koa-router");
const usuarios = require("./routes/usuarios");
const juegos = require("./routes/juegos");
const jugadors = require("./routes/jugadors");
const casillas = require("./routes/casillas")
const usuarioInfo = require("./routes/usuarioInfo");
const dotenv = require('dotenv');
const jwtMiddleware = require('koa-jwt');

dotenv.config();

const router = new Router();

router.use("/usuarios", usuarios.routes());

router.use(jwtMiddleware( { secret: process.env.JWT_SECRET } ))

router.use("/juegos", juegos.routes());
router.use("/jugadors", jugadors.routes());
router.use("/casillas", casillas.routes());
router.use("/usuarioInfo", usuarioInfo.routes());

module.exports = router;