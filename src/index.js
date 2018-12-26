const Base = require('./base');

class UnifiedExpress extends Base {
  async query({ no, company }) {
    const code = this.getCodeFromCompany(company);
    const source = this.config[code].source; 
    const api = require(`./source/${source}/${code}`);
    return await api.query(no, this.config[code]['cfg']);
  }
}
module.exports = UnifiedExpress;