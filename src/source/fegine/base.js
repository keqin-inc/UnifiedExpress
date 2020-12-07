const request = require('request-promise-native');

class Base {
  async request(no, company, cfg) {
    const url = `https://wuliu.market.alicloudapi.com/kdi?no=${no}&type=${company}`;
    const headers = {
      'Authorization': 'APPCODE ' + cfg.appcode 
    };
    const body = await request({
      url,
      headers,
      json: true
    });
    return body;
  }

  sortTraces(traces) {
    return traces.sort((a, b) => {
      return new Date(a.time) - new Date(b.time)
    });
  }
}
module.exports = Base;
