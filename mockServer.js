const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const config = require('./config');
const mockRouter = require('./middleware/mockRouter');
const app = new Koa();

app.use(bodyParser());
app.use(json());
app.use(mockRouter);

app.listen(config.MOCK_PORT, () => {
    console.log(`server is running at ${config.MOCK_PORT}`);
});