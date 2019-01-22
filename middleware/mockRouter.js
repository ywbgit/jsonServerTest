const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/interface.json'))
const interfaceDb = lowdb(adapter);

module.exports = async (ctx, next) => {
    const allInterface = interfaceDb.value();
    const reqPath = ctx.request.path;
    const reqMethod = ctx.request.method;
    if (reqPath.indexOf('/mock/') === 0) {
        const includeAppIdPath = reqPath.substr(5);
        if (includeAppIdPath !== '') {
            const interfaceList = Object.entries(allInterface).reduce((current, [ appId, list ]) => {
                current.push(...list);
                return current;
            }, []);
            const actualReqInteface = interfaceList.find(({ appId, url, method }) =>
            (`/${appId}${url}` === includeAppIdPath && reqMethod === method));
            if (actualReqInteface && actualReqInteface.dataId) {
                ctx.status = 200;
                ctx.response.body = {
                    result: true
                };
            } else {
                ctx.status = 200;
                ctx.response.body = {
                    result: false,
                    message: '这个请求未关联数据源'
                };
            }

        }
    }
    await next();
}