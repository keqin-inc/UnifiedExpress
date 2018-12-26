const request = require('request-promise-native');
const crypto = require('crypto');

class ZTO {
  async request(no, cfg) {
    const form = {
      company_id: cfg.company_id,
      msg_type: 'NEW_TRACES',
      data: JSON.stringify(no)
    }
    const signString = `company_id=${form.company_id}&msg_type=${form.msg_type}&data=${form.data}${cfg.key}`;
    let sign = crypto.createHash('md5')
        .update(signString)
        .digest('base64');
    const body = await request.post({
      url: 'http://japi.zto.cn/traceInterfaceNewTraces',
      method: 'POST',
      json: true,
      form,
      headers: {
        'x-companyId': form.company_id,
        'x-dataDigest': sign
      }
    });
    if(body.status) {
      return body.data[0];
    } else {
      throw new Error('接口未成功返回数据', body);
    }
  }

  async query(no, cfg) {
    if(!Array.isArray(no)) {
      no = [ no ];
    }
    const data = await this.request(no, cfg);
    return this.format(data);
  }

  sortTraces(traces) {
    return traces.sort((a, b) => {
      return new Date(a.scanDate) - new Date(b.scanDate)
    });
  }

  format(record) {

    const express = {
      no: record.billCode,
    }
    const sortedTraces = this.sortTraces(record.traces);
  
    let hasReject = false;
    let delivering = false;
    let received = false;
    let deliverRemark = '';
    let deliverDate = '';
    for(let { desc: trace, scanType, scanDate } of sortedTraces) {
      if(trace.indexOf('客户拒收') > -1) {
        hasReject = true;
        deliverDate = scanDate;
      } else if(trace.indexOf('被退回') > -1) {
        hasReject = true;
        deliverDate = scanDate;
      } else if(trace.indexOf('派件') > -1) {
        delivering = true;
        deliverDate = scanDate;
      } else if(trace.indexOf('签收') > -1) {
        received = true;
        deliverDate = scanDate;
      }
      if(scanType === '问题件') {
        const match = trace.match(/原因：(.+)$/);
        if(match) {
          deliverRemark = match[1];
          deliverDate = scanDate;
        }
      }
      // 未派件就退回，是地址不够详细导致的中转，可重置
      if(!delivering && hasReject){
        hasReject = false;
      }
    }
    
    express.deliverRemark = deliverRemark;
    express.deliverDate = deliverDate;
    express.hasReject = hasReject;
    express.received = !hasReject && received;
    express.delivering = delivering;
    express.traces = sortedTraces.map(trace => {
      trace.msg = trace.desc;
      delete trace.desc;
      return trace;
    });

    let status = '';
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

module.exports = new ZTO;