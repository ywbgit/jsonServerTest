const Koa = require('koa');
const router = require('./router');
const middleware = require('./middleware');
const config = require('./config');

const app = new Koa();

middleware(app);

app.use(router.routes(), router.allowedMethods());

app.listen(config.PORT, () => {
    console.log(`server is running at ${config.PORT}`);
  });