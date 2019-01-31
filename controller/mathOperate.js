const { MATH_OPERATE_MAP } =  require('../constants/mathOperate')

const getMathOperateList = (ctx) => {
    ctx.status = 200;
    ctx.response.body = {
        result: true,
        data: {
            mathOperateList: MATH_OPERATE_MAP.map(([ key, value ]) => ({
                id: key,
                operateName: value
            }))
        }
    };
}

module.exports = {
    getMathOperateList
};
