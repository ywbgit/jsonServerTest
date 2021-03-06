const router = require('koa-router')();
const { createApplication } = require('../controller/application.js');
const { createInterface, getInterfaceList } = require('../controller/interface.js');
const { createJSONDataModel } = require('../controller/dataModel.js');
const { getMathOperateList } = require('../controller/mathOperate.js');

router.post('/api/application', createApplication);

router.post('/api/interface', createInterface);
router.get('/api/interface', getInterfaceList);

router.post('/api/jsonDataModel', createJSONDataModel);

router.get('/api/mathOperate', getMathOperateList);

module.exports = router;