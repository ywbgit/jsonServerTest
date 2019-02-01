const path = require('path');
const fs = require('fs');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const adapter = new FileSync(resolveApp('service/request.json'))
const requestDb = lowdb(adapter)

const setRequestModelNodeId = (requestModel, count) => {
    let { type, children, key } = requestModel;
    let isTopNode = count === 0;
    let rest = null;
    if (type === 'array') {
        rest = {
            type,
            nodeId: ++count,
            options: {
                length: {
                    nodeId: ++count,
                    key: 'length',
                    type: 'number'
                }
            },
            children: children.map((item) => setRequestModelNodeId(item, ++count))
        };
    } else if (type === 'object') {
        rest = {
            type,
            nodeId: ++count,
            children: children.map((item) => setRequestModelNodeId(item, ++count))
        };
    } else {
        rest = {
            type,
            nodeId: ++count
        };
    }
    return isTopNode ? {
        ...rest
    } : {
        ...rest,
        key
    }
};

const validateRequestModel = () => {
    try {
        return setRequestModelNodeId(dataModel, count);
    } catch {
        return false;
    }
}

const createRequestModel = (ctx) => {
    const { appId, interfaceId, requestModel } = ctx.request.body;
    if (!appId || appId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到appId'
        };
    } else if (!requestModel || requestModel === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到requestModel'
        };
    } else if (!interfaceId || interfaceId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到interfaceId'
        };
    } else if (!validateRequestModel(requestModel, 0)) {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: 'requestModel不符合要求'
        };
    } else {
        requestDb.set(interfaceId, {
            appId, interfaceId,
            requestModel: setRequestModelNodeId(requestModel, 0)
        }).write();
        ctx.status = 200;
        ctx.response.body = {
            result: true
        };
    }
}

const getRequestModel = (ctx) => {
    const { interfaceId } = ctx.request.query;
    if (!interfaceId || interfaceId === '') {
        ctx.status = 200;
        ctx.response.body = {
            result: false,
            message: '未获取到interfaceId'
        };
    } else {
        const requestModel = requestDb.get(interfaceId).value();
        ctx.status = 200;
        ctx.response.body = {
            result: true,
            data: requestModel
        };
    }
}

module.exports = {
    createRequestModel,
    getRequestModel
}