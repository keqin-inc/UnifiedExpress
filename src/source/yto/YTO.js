const request = require('request-promise-native');
const crypto = require('crypto');
const dayjs = require('dayjs');

class YTO {
  async request(no, cfg) {
    const param = [{ Number: no }];
    const form = {
      app_key: cfg.app_key,
      method: 'yto.Marketing.WaybillTrace',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user_id: cfg.user_id,
      v: '1.01',
      json: true,
      format: 'JSON'
    };
    const keys = Object.keys(form).sort();
    const signString = cfg.secret_key + keys.map(key => `${key}${form[key]}`).join('');
    form.param = JSON.stringify(param);
    form.sign = crypto.createHash('md5')
      .update(signString)
      .digest('hex')
      .toUpperCase();
    const body = await request.post({
      url: 'http://marketinginterface.yto.net.cn/',
      method: 'POST',
      json: true,
      form
    });
    if (Array.isArray(body)) {
      return this.format(body);
    }
    const express = {
      no,
      traces: []
    };
    const { status, message = '' } = body;
    if(status == '0' && message === '该单号暂无物流进展') {
      express.status = '查询不到';
    } else {
      throw new Error('接口未成功返回数据 ' + message);
    }
    return express;
  }

  async query(no, cfg) {
    const data = await this.request(no, cfg);
    return data;
  }

  sortTraces(records) {
    return records.sort((a, b) => {
      return new Date(a.Upload_Time) - new Date(b.Upload_Time)
    });
  }

  format(records) {
    if(records.length === 0) {
      throw new Error('接口未成功返回数据, 数组空');
    }
    const [ firstTrace ] = records;
    const express = {
      no: firstTrace.Waybill_No,
    }

    const sortedTraces = this.sortTraces(records);
    let hasReject = false;
    let delivering = false;
    let received = false;
    let deliverRemark = '';
    let deliverDate = '';
    for(let { 
        ProcessInfo: trace,
        Upload_Time: scanDate } of sortedTraces) {
      if(trace.indexOf('失败签收录入') > -1) {
        hasReject = true;
        received = false;
        deliverDate = scanDate;
      } else if(trace.indexOf('派件中') > -1) {
        delivering = true;
        deliverDate = scanDate;
      } else if(trace.indexOf('已签收') > -1) {
        received = true;
        hasReject = false;
        deliverDate = scanDate;
        // 有时候是 签收人: ，有时候是： 签收人 :
        const matches = trace.match(/签收人[\s\:]+(\S+?) 已签收/);
        if (matches) {
          deliverRemark = matches[1];
        }
      } else if (trace.indexOf('已发出 下一站') > -1) {
        if(received || hasReject) {
          // 先签收/拒签，再出现后面的物流状态，是退回信息，会干扰结果
          break;
        }
      }
    }
    
    express.deliverRemark = deliverRemark;
    express.deliverDate = deliverDate;
    express.hasReject = hasReject;
    express.received = !hasReject && received;
    express.delivering = delivering;
    express.traces = sortedTraces.map(trace => {
      trace.msg = trace.ProcessInfo;
      delete trace.ProcessInfo;
      return trace;
    });

    let status = records.length > 0 ? '运输中' : '查询不到';
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

module.exports = new YTO;