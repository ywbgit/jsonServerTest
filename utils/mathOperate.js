const floatTool = require('./floatTool');

const add = (a, b) => {
    return floatTool.add(a, b);
}
const subtract = (a, b) => {
    return floatTool.subtract(a, b);
};
const multiply = (a, b) => {
    return floatTool.multiply(a, b);
};
const divide = (a, b) => {
    return floatTool.divide(a, b);
};

module.exports = {
    add,
    subtract,
    multiply,
    divide
};