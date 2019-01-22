const router = require('koa-router')();
const { createApplication } = require('../controller/application.js');
const { createInterface, getInterfaceList } = require('../controller/interface.js');
const { createJSONDataSource } = require('../controller/dataSource.js');

router.post('/api/application', createApplication);

router.post('/api/interface', createInterface);
router.get('/api/interface', getInterfaceList);

router.post('/api/jsonDataSource', createJSONDataSource);

module.exports = router;