import path from 'path';
import fs from 'fs';
import Koa from 'koa';
import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import moment from 'moment';
import views from 'koa-nunjucks-next';
import onerror from 'koa-onerror';
import routes from './routes/index';
import routesAPI from './routes/api';
import filters from './filters/index';
import {wrap} from './utils/index';
import home from './controllers/home';

const app = new Koa();
const hostname = '127.0.0.1';
const port = 3000;

onerror(app);

const router = koaRouter();
const apiRouter = koaRouter({
    prefix: '/api'
});

app.use(async (ctx, next) => {

    const start = new Date();
    await next();
    const ms = new Date() - start;
    const message = `${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`;
    const data = `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${message}\n`;

    const folder = path.resolve(__dirname, '../logs');
    const file = `${moment().format('YYYY-MM-DD')}.log`;

    if (!fs.existsSync(folder)) {
        fs.mkdirSync('logs');
    }

    await wrap(fs, fs.appendFile, path.join(folder, file), data);

});

app.use(async (ctx, next) => {

    await next();

    if (ctx.status === 404) {
        ctx.body = fs.createReadStream('not exist');
    }

});

app.use(views(path.join(__dirname, 'views'), {filters}));

app.use(logger());
app.use(bodyParser());

routes(router);
routesAPI(apiRouter);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
