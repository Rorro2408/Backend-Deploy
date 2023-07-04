const Router = require('koa-router');
const decoding = require('../utils/decoding.js');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function sonAdyacentes(casillasJugador, x, y){
    for(let i=0; i< casillasJugador.length; i++){
        let diffX = casillasJugador[i].posicion_eje_x - x;
        if (diffX < 0 ){
            diffX = diffX * -1;
        } 
        let diffY = casillasJugador[i].posicion_eje_y - y;
        if (diffY < 0 ){
            diffY = diffY * -1;
        }
        let dist = diffX + diffY;
        if(dist <= 1){
            return true;
        } 
    }
    return false;
}

const router = new Router();

router.post("casilla.buy", "/buy", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const {p_id, g_id } = decodedToken;

    try{
        const tipo = ctx.request.body.tipo;
        const posicion_eje_x = ctx.request.body.posicion_eje_x;
        const posicion_eje_y = ctx.request.body.posicion_eje_y;
        const casillaParams = {
            "p_id":p_id,
            "g_id":g_id,
            "tipo":tipo,
            "posicion_eje_x":posicion_eje_x,
            "posicion_eje_y":posicion_eje_y
        };

        if(tipo == "agua"){
            ctx.body = "no puedes comprar agua";
            ctx.status = 403;
            return;
        }
        const jugador = await ctx.orm.Jugador.findByPk(p_id);
        const casillasJugador = await ctx.orm.Casilla.findAll({where:{p_id:p_id}});
        let casillaPrevia = await ctx.orm.Casilla.findOne({where: 
            {g_id: g_id, posicion_eje_x: posicion_eje_x, posicion_eje_y: posicion_eje_y}
        });
        if (casillaPrevia){
            ctx.body = "No puedes comprar esta casilla por que ya tiene dueño";
            ctx.status = 403;
            return;
        }
        if(jugador.dinero >= 100 && sonAdyacentes(casillasJugador, posicion_eje_x, posicion_eje_y)){
            jugador.dinero -= 100;
            await jugador.save();
            const casilla = await ctx.orm.Casilla.create(casillaParams);

            const allCasillas = await ctx.orm.Casilla.findAll({where:{g_id:g_id}});
            const juego = await ctx.orm.Juego.findByPk(g_id);
            //Terminar el juego si hay 77 casillas
            if(allCasillas.length == 77){
                juego.fase = "fin";
                await juego.save();
            }

            console.log(allCasillas.length);
            console.log("Verificando la cantidad de casillas");

            ctx.body = {
                jugador: jugador,
                casilla: casilla
            };
            ctx.status = 201;
        }else{
            ctx.body = "O no tienes dinero o no es adyacente"
            ctx.status = 403;
        }
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("casillas.status", "/status", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { g_id } = decodedToken;

    try{
        const casillas = await ctx.orm.Casilla.findAll({where:{g_id:g_id}})
        ctx.body = casillas;
        ctx.status = 200;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

router.put("casilla.conquistar", "/conquistar", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id, g_id } = decodedToken;

    try{
        console.log("dentro del try")
        const x = ctx.request.body.x;
        const y = ctx.request.body.y;
        console.log("so far sos good")
        const casilla = await ctx.orm.Casilla.findOne({where : {g_id:g_id, posicion_eje_x:x, posicion_eje_y:y}});
        if(casilla.tipo == "castillo"){
            ctx.body = "no puedes conquistar un castillo"
            ctx.status = 403;
            return
        }
        if(casilla.p_id == p_id){
            ctx.body = "no puedes conquistar a ti mismo"
            ctx.status = 403;
            return
        }
        const defensor = await ctx.orm.Jugador.findByPk(casilla.p_id);
        const idAtacante = p_id;
        const atacante = await ctx.orm.Jugador.findByPk(idAtacante);
        const casillasAtacante = await ctx.orm.Casilla.findAll({where:{p_id:idAtacante}});
        if(atacante.dinero < 150 && sonAdyacentes(casillasAtacante, casilla.posicion_eje_x, casilla.posicion_eje_y)){
            ctx.body = "o no tienes dinero o no es adyacente"
            ctx.status = 403;
        } else{
            if(atacante.soldados > defensor.soldados){
                casilla.p_id = idAtacante;
                atacante.soldados -= defensor.soldados;
                atacante.dinero -= 150;
                defensor.soldados = 0;
            } else{
                defensor.soldados -= atacante.soldados;
                atacante.dinero -= 150;
                atacante.soldados = 0;
            }

            await casilla.save();
            await atacante.save();
            await defensor.save();
            ctx.body = ctx.body = {
                jugador: atacante,
                casilla: casilla
            };
            ctx.status = 202;
        }

    } catch(error){
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }
})

router.post("casilla.castillo", "/castillo", async (ctx)=>{
    const authorizationHeader = ctx.request.headers.authorization;
    const decodedToken = await decoding(authorizationHeader);
    const { p_id, g_id } = decodedToken;

    try{
        const posicion_eje_x = ctx.request.body.posicion_eje_x;
        const posicion_eje_y = ctx.request.body.posicion_eje_y;
        const tipo = ctx.request.body.tipo;
        if (tipo != "pradera"){
            ctx.body = "solo puedes poner castillo en pradera";
            ctx.status = 403;
        }
        const casillaParams = {
            "p_id":p_id,
            "g_id":g_id,
            "tipo":"castillo",
            "posicion_eje_x":posicion_eje_x,
            "posicion_eje_y":posicion_eje_y
        };
        const casilla = await ctx.orm.Casilla.create(casillaParams);
        const juego = await ctx.orm.Juego.findByPk(g_id);
        juego.turno += 1;
        if(juego.turno === juego.numero_de_jugadores){
            juego.fase = "conquista";
        }
        await juego.save();
        ctx.body = casilla;
        ctx.status = 201;
    } catch(error){
        ctx.body = error;
        ctx.status = 400;
    }
})

module.exports = router;