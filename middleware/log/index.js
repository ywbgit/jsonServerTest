const logger = require('./logger.js');
module.exports = (options) => {
    const loggerMiddleware = logger(options);
    return (ctx, next) => {
        return loggerMiddleware(ctx, next)
            .catch((err) => {
                if (ctx.status < 500) {
                    ctx.status = 500;
                }
                ctx.log.error(err.stack);
                ctx.state.logged = true;
                ctx.throw(err);
            });
    };
};
