const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/dataModel.json'))
const dataModelDb = lowdb(adapter)

const setDataModelNodeId = (dataModel, count, dataModelType) => {
    if (dataModelType === 2 && !dataModel.value) {
        throw new Error();
    }
    let { type, children, key } = dataModel;
    let isTopNode = count === 0;
    let rest = null;
    if (type === 'array') {
        rest = {
            type,
            options: {
                pageNum: {
                    nodeId: ++count,
                    key: 'pageNum',
                    type: 'number'
                },
                pageSize: {
                    nodeId: ++count,
                    key: 'pageSize',
                    type: 'number'
                }
            },
            children: children.map((item) => setDataModelNodeId(item, ++count))
        };
    } else if (type === 'object') {
        rest = {
            type,
            children: children.map((item) => setDataModelNodeId(item, ++count))
        };
    } else {
        rest = {
            type,
            nodeId: count
        };
    }
    return isTopNode ? {
        ...rest
    } : {
        ...rest,
        key
    }
};

const validateDataModel = (dataModel, count, dataModelType) => {
    try {
        return setDataModelNodeId(dataModel, count, dataModelType);
    } catch {
        return false;
    }
}

const createJSONDataModel = (ctx) => {
    const { appId, dataModel, type } = ctx.request.body;
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
    } else if (!validateDataModel(dataModel, 0, type)) {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: 'dataModel不符合要求'
        };
    } else {
        const dataSourceList = dataModelDb.get(appId).value();
        const l = dataSourceList ? dataSourceList.length : 0;
        if (l === 0) {
            dataModelDb.set(appId, []).write();
        }
        dataModelDb.get(appId)
        .push({ id: l, appId, dataModel: type === 1 ? setDataModelNodeId(dataModel, 0) : dataModel, type })
        .write();
        ctx.status = 200;
        ctx.response.body = {
            result: true
        };
    }
};

const getJSONDataModelList = (ctx) => {
    const { appId } = ctx.request.query;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else {
        const dataSourceList = dataModelDb.get(appId).value() || [];
        ctx.status = 200;
        ctx.response.body = {
            result: true,
            data: dataSourceList
        };
    }
}

const relatedToDataModelNode = (ctx) => {
    const {
        appId, dataModelId, dataModelNodeId, expression
    } = ctx.request.body;
}

module.exports = {
    createJSONDataModel,
    getJSONDataModelList
};
