const Router = require('koa-router');
const decoding = require('../utils/decoding.js');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

router.post("jugador.joinGame", "/joinGame", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { sub } = decodedToken;

    console.log("El jugador "+sub+"Esta uninendose a una partida")

    const usuario = await ctx.orm.Usuario.findByPk(sub);

    console.log(usuario);

    try{
        const codigo = ctx.request.body.codigo;
        const u_id = sub;
        const nombre = usuario.nombre;
        const juego = await ctx.orm.Juego.findOne({where:{codigo:codigo}});
        const g_id = juego.id;
        const jugadorParams = {
            "u_id": u_id,
            "g_id": g_id,
            "nombre": nombre,
            "dinero": 500,
            "soldados": 0
        }
        
        const jugador = await ctx.orm.Jugador.create(jugadorParams);

        const expirationSeconds = 1 * 60 * 60 * 24;
        const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
        
        var token = jwt.sign(
            { scope : ['usuario'],
            p_id: jugador.id.toString(),
            g_id: g_id.toString() },
            JWT_PRIVATE_KEY,
            { subject: u_id.toString() },
            {expiresIn: expirationSeconds }
        );

        console.log(token + " se ha generado")

        const todosLosJugadoresDelJuego = await ctx.orm.Jugador.findAll({where:{g_id:g_id}});
        if (todosLosJugadoresDelJuego.length === juego.numero_de_jugadores){
            juego.fase = "inicio";
            await juego.save();
        }

        ctx.body = {
            "access_token": token,
            "id": jugador.id,
            "g_id": jugador.g_id,
            "nombre": jugador.nombre,
            "dinero": jugador.dinero,
            "soldados": jugador.soldados
        };
        ctx.status = 201;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("jugador.status", "/status", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id } = decodedToken;

    try{
        const jugador = await ctx.orm.Jugador.findByPk(p_id);
        ctx.body = jugador;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("jugador.status", "/allstatus", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { g_id } = decodedToken;

    try{
        const jugadors = await ctx.orm.Jugador.findAll({where : {g_id: g_id}});
        ctx.body = jugadors;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("jugador.getMoney", "/getMoney", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id } = decodedToken;

    try{
        const id = p_id;
        const jugador = await ctx.orm.Jugador.findByPk(id);
        const casillas = await ctx.orm.Casilla.findAll({where:{p_id:id}});
        for (let i=0; i<casillas.length; i++){
            if(casillas[i].tipo === "castillo"){
                jugador.dinero += 150;
            }
            if(casillas[i].tipo === "granja"){
                jugador.dinero += 100;
            }
            if(casillas[i].tipo === "mina"){
                jugador.dinero += 325;
            }
        }

        await jugador.save();

        ctx.body = jugador;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
        console.log(error);
    }
})

router.get("jugador.buySoldiers", "/buySoldiers", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id } = decodedToken;

    try{
        const id = p_id;
        const cantidad = 1;
        const precio = 150;
        const jugador = await ctx.orm.Jugador.findByPk(id);
        if (cantidad*precio > jugador.dinero){
            ctx.body = "No tienes suficiente dinero..."
            ctx.status = 403;
        } else{
            jugador.soldados += cantidad;
            jugador.dinero -= cantidad*precio;
            await jugador.save();
            ctx.body = jugador;
            ctx.status = 200;
        }
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("jugador.endTurn", "/endTurn", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id } = decodedToken;

    try{
        const id = p_id;
        const jugador = await ctx.orm.Jugador.findByPk(id);
        console.log(jugador);
        const juego = await ctx.orm.Juego.findByPk(jugador.g_id);
        console.log(juego);
        juego.turno += 1;
        //console.log("about to print casillas")
        //const casillas = await ctx.orm.Casillas.findAll({where:{g_id:juego.id}});
        //console.log("printing casillas")
        //console.log(casillas);
        //if (casillas.length === 100){
        //    juego.fase = "fin";
        //}
        await juego.save();
        ctx.body = juego;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

module.exports = router;