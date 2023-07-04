const koa = require("koa");
const KoaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const bodyParser = require("koa-bodyparser");
const orm = require("./models");
const router = require("./routes")

const cors = require("@koa/cors");

const dotenv = require("dotenv");

dotenv.config();

const app = new koa();

app.context.orm = orm;

app.use(cors());

app.use(KoaLogger());
app.use(koaBody());
app.use(bodyParser());

app.use(router.routes());

app.use((ctx, next) => {
    ctx.body = "koa is working";
});

module.exports = app;