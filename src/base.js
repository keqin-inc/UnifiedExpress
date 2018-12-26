const getAlias = require('./alias');
const defaultConfig = require('./defaultConfig');
class UnifiedExpressBase {

  constructor(userConfig = {}) {
    const cfg = Object.assign({}, defaultConfig);
    for(let key of Object.keys(userConfig)) {
      if(!cfg[key]) {
        continue;
      }
      if(userConfig[key]['source']) {
        cfg[key]['source'] = userConfig[key]['source'];
        cfg[key]['cfg'] = Object.assign({}, cfg[key]['cfg'], userConfig[key]['cfg']);
      } else {
        cfg[key]['cfg'] = Object.assign({}, cfg[key]['cfg'], userConfig[key]);
      }
    }
    this.config = cfg;
  }
  
  getCodeFromCompany(company) {
    if (company in this.config) {
      return company;
    }
    let code = getAlias(company);
    if (code in this.config) {
      return code;
    }
    throw new Error(`快递方式不支持：${company}`);
  }
}
module.exports = UnifiedExpressBase;