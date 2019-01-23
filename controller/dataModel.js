const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/dataModel.json'))
const dataModelDb = lowdb(adapter)

const setDataModelNodeId = (dataModel, count = 0, dataModelType) => {
    if (dataModelType === 2 && !dataModel.value) {
        throw new Error();
    }
    let { type, children, key } = dataModel;
    if (type === 'array') {
        return {
            type,
            children: children.map((item) => setDataModelNodeId(item, count++)),
            nodeId: count
        }
    } else if (type === 'object') {
        return {
            type,
            key,
            children: children.map((item) => setDataModelNodeId(item, count++)),
            nodeId: count
        }
    } else {
        return {
            type,
            nodeId: count
        }
    }
};

const validateDataModel = (dataModel, count = 0, dataModelType) => {
    try {
        return setDataModelNodeId(dataModel, count, dataModelType);
    } catch {
        return false;
    }
}

const createJSONDataModel = async (ctx) => {
    const { appId, dataModel, type } = ctx.request.body;
    if (!validateDataModel(dataModel, 0, type)) {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: 'dataModel不符合要求'
        };
    } else if (!appId || appId === '') {
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
        const dataSourceList = dataModelDb.get(appId).value();
        const l = dataSourceList ? dataSourceList.length : 0;
        if (l === 0) {
            dataModelDb.set(appId, []).write();
        }
        dataModelDb.get(appId)
        .push({ id: l, appId, dataModel: type === 1 ? setDataModelNodeId(dataModel) : dataModel, type })
        .write();
        ctx.status = 200;
        ctx.response.body = {
            result: true
        };
    }
};

module.exports = {
    createJSONDataModel
};
