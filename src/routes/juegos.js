const Router = require('koa-router');
const decoding = require('../utils/decoding.js');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = new Router();

router.post("juego.create", "/create", async (ctx)=>{
    try{
        const codigo = ctx.request.body.codigo;
        const privado = ctx.request.body.privado;
        const numero_de_jugadores = ctx.request.body.numero_de_jugadores;
        const nombre = ctx.request.body.nombre;
        const juegoParams = {
            "codigo": codigo,
            "turno": 0,
            "privado": privado,
            "numero_de_jugadores": numero_de_jugadores,
            "nombre": nombre,
            "fase": "espera"
        };
        const juego = await ctx.orm.Juego.create(juegoParams);
        ctx.body = juego;
        ctx.status = 201;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("juegos.list", "/allstatus", async (ctx)=>{
    try{
        const juegos = await ctx.orm.Juego.findAll();
        ctx.body = juegos;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("juego.status", "/status", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { g_id } = decodedToken;

    try{
        const juego = await ctx.orm.Juego.findByPk(g_id);
        ctx.body = juego;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("juego.fullstatus", "/fullstatus", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id, g_id } = decodedToken;

    try{
        const juego = await ctx.orm.Juego.findByPk(g_id);
        const jugadores = await ctx.orm.Jugador.findAll({where: {g_id:g_id}});
        const casillas = await ctx.orm.Casilla.findAll({where: {g_id:g_id}});
        ctx.body = {
            p_id: p_id,
            juego: juego,
            jugadores: jugadores,
            casillas: casillas,
        };
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("juego.isYourTurn", "/isYourTurn", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id, g_id } = decodedToken;

    try{
        const juego = await ctx.orm.Juego.findByPk(g_id);
        console.log("Encontramos el juego")
        const jugadors = await ctx.orm.Jugador.findAll({where:{g_id:g_id}});
        jugadors.sort((a, b) => a.id - b.id);
        console.log("Todos Los Jugadores de la Partida Son");
        console.log(jugadors);
        console.log("En total son:" + juego.numero_de_jugadores);
        const posJugador = await jugadors.findIndex(jugador => jugador.id == p_id);
        console.log("I HATE VERY THING");
        console.log(posJugador);
        console.log(juego.turno % juego.numero_de_jugadores);
        if (juego.turno % juego.numero_de_jugadores !== posJugador){
            ctx.body = {
                isYourTurn: false
            }
            ctx.status = 200;
        }
        else{
            ctx.body = {
                isYourTurn: true
            };
            ctx.status = 200;
        }
    } catch(error){
        ctx.body = error;
        console.log(error);
        ctx.status = 400;
    }
})

module.exports = router;