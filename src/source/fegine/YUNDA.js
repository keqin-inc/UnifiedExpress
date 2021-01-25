const Base = require('./base');

class YUNDA extends Base {
  async query({ no }, cfg) {
    const body = await this.request(no, 'YUNDA', cfg);
    if(body.status === '0') {
      return this.format(body.result);
    } else if(body.status === '205') {
      return {
        status: '查询不到',
        no,
        traces: []
      };
    } else {
      throw new Error('快递查询异常：', body);
    }
  }

  format(record) {
    
    const express = {
      no: record.number,
    }
    const sortedTraces = this.sortTraces(record.list);
  
    let hasReject = false; // 是否拒收
    let delivering = false; // 是否正在派送中
    let received = false; // 是否签收
    let deliverRemark = '';
    let deliverDate = '';
    for(let { status: trace, time } of sortedTraces) {
      if(trace.indexOf('拒收') > -1) {
        hasReject = true;
        deliverDate = time;
        // 提前签收是错误的行为，重置掉
        received = false;
      } else if(trace.indexOf('派件') > -1) {
        delivering = true;
        deliverDate = time;
      } else if(trace.indexOf('签收') > -1) {
        received = true;
        deliverDate = time;
        // 拒签又反悔了
        hasReject = false;
      }
    }
    express.deliverRemark = deliverRemark;
    express.deliverDate = deliverDate;
    express.hasReject = hasReject;
    express.received = received;
    express.delivering = delivering;
    express.traces = sortedTraces.map(trace => {
      trace.msg = trace.desc;
      delete trace.desc;
      return trace;
    });

    let status = express.traces.length > 0 ? '运输中' : '查询不到';
    if(express.hasReject) {
      status = '拒收';
    } else if(express.delivering && !express.received) {
      status = '派送中';
    } else if(express.received) {
      status = '已签收';
    }
    express.status = status;
    return express;
  }
}

module.exports = new YUNDA();