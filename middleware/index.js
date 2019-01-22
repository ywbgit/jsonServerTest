const path = require('path');
const ip = require('ip');
const bodyParser = require('koa-bodyparser');
const staticFiles = require('koa-static');
const json = require('koa-json');

const log = require('./log');
const config = require('../config');

module.exports = (app) => {
    app.use(log({
        env: app.env,
        projectName: config.PROJECT_NAME || 'koatemplate',
        appLogLevel: config.LOG_LEVEL || 'debug',
        dir: 'logs',
        serverIp: ip.address()
    }));

    app.use(staticFiles(path.resolve(__dirname, './public')));
    app.use(bodyParser());
    app.use(json());

    // 增加错误的监听处理
    app.on('error', (err, ctx) => {
        if (ctx && !ctx.headerSent && ctx.status < 500) {
            ctx.status = 500;
        }
        if (ctx && ctx.log && ctx.log.error) {
            if (!ctx.state.logged) {
                ctx.log.error(err.stack);
            }
        }
    })
}
