// 别名映射表
const alias = {
  '中通': 'ZTO',
  '申通': 'STO',
  '圆通': 'YTO',
  '圆通速递': 'YTO',
  '圆通速递货到付款': 'YTO',
  '顺丰': 'SF',
  '顺丰速运': 'SF',
  '顺丰速运货到付款': 'SF'
};
module.exports = function getAlias(company) {
  if(company in alias) {
    return alias[company];
  } else {
    return company;
  }
};