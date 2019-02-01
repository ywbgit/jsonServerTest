const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/interface.json'))
const interfaceDb = lowdb(adapter);

const createInterface = (ctx) => {
    const { appId, url, method, name, description } = ctx.request.body;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else if (!url || url === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到url'
        };
    } else if (!method || method === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到method'
        };
    } else {
        const interfaceList = interfaceDb.get(appId).value();
        const l = interfaceList ? interfaceList.length : 0;
        if (l === 0) {
            interfaceDb.set(appId, []).write();
        }
        interfaceDb.get(appId)
        .push({ interfaceId: l, appId, url, method, name, description, dataId: null })
        .write();
        ctx.status = 200;
        ctx.response.body = {
            result: true
        };
    }
};

const getInterfaceList = (ctx) => {
    const { appId } = ctx.request.query;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else {
        const interfaceList = interfaceDb.get(appId).value() || [];
        ctx.status = 200;
        ctx.response.body = {
            result: true,
            data: interfaceList
        };
    }
};

module.exports = {
    createInterface,
    getInterfaceList
};
