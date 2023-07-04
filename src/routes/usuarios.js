const Router = require('koa-router');
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

router.post('/login', async (ctx) => {
    let usuarioEncontrado;
    const authInfo = ctx.request.body;
    try {
        usuarioEncontrado = await ctx.orm.Usuario.findOne({where: {mail: authInfo.mail}});
    } 
    catch (error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
        return; 
    }
    if (!usuarioEncontrado){
        ctx.body = `El usuario con el email '${authInfo.email}' no fue encontrado`;
        ctx.status = 400;
        return;
    }

    const contrasenaValida = await bcrypt.compare(authInfo.contrasena, usuarioEncontrado.contrasena)

    if (contrasenaValida){
        ctx.body = {
            nombre: usuarioEncontrado.nombre,
            mail: usuarioEncontrado.mail,
        };
        ctx.status = 200;
    } else {
        ctx.body = "contrasena incorrecta";
        ctx.status = 400;
        return;
    }
    const expirationSeconds = 1 * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    var token = jwt.sign(
        { scope : ['usuario'],
        p_id: "",
        g_id: "" },
        JWT_PRIVATE_KEY,
        { subject: usuarioEncontrado.id.toString() },
        {expiresIn: expirationSeconds }
    );
    ctx.body = {
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": expirationSeconds,
    }
    ctx.status = 200;
});

router.post('/signin', async (ctx) => {
    const authInfo = ctx.request.body;
    let user = await ctx.orm.Usuario.findOne({where: {mail: authInfo.mail}})
    if (user) {
        ctx.body = `Ya existe un usuario con el email '${authInfo.mail}'`
        ctx.status = 400;
        return;
    }
    try {
        const saltRounds = 10;
        const hashContrasena = await bcrypt.hash(authInfo.contrasena, saltRounds);

        user = await ctx.orm.Usuario.create({
            nombre: authInfo.nombre,
            mail: authInfo.mail,
            contrasena: hashContrasena,
        });
    } catch (error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400; 
    }
    ctx.body = {
        nombre: user.nombre,
        email: user.mail
    };

    ctx.status = 201;
});

module.exports = router;