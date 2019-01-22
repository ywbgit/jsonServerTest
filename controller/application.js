const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/application.json'))
const appDb = lowdb(adapter)

const createApplication = async (ctx) => {
    const { id, name, description } = ctx.request.body;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else if (!name || name === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到name'
        };
    } else {
        /** 
         * 此处需要判断id是否存在
         * */
        const app = appDb.get('appList').find({ id }).value()
        if (app) {
            appDb.get('appList')
                 .push({ id, name, description, baseUrl: `/${id}` })
                 .write()
            ctx.status = 200;
            ctx.response.body = {
                result: true,
                data: {
                    appId: id
                }
            };
        }
    }
};

module.exports = {
    createApplication
};
