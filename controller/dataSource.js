const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/dataSource.json'))
const dataSourceDb = lowdb(adapter)

const createJSONDataSource = async (ctx) => {
    const { appId, dataModel } = ctx.request.body;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else if (!dataModel || dataModel === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到dataModel'
        };
    } else {
        const dataSourceList = dataSourceDb.get(appId).value();
        const l = dataSourceList ? dataSourceList.length : 0;
        if (l === 0) {
            dataSourceDb.set(appId, []).write();
        }
        dataSourceDb.get(appId)
        .push({ id: l, appId, dataModel })
        .write();
        ctx.status = 200;
        ctx.response.body = {
            result: true
        };
    }
};

module.exports = {
    createJSONDataSource
};
