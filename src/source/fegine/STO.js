const Base = require('./base');

class STO extends Base{
  async query(no, cfg) {
    const body = await this.request(no, 'STO', cfg);
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

  sortTraces(traces) {
    return traces.sort((a, b) => {
      return new Date(a.time) - new Date(b.time)
    });
  }

  format(record) {

    const express = {
      no: record.number,
    }
    const sortedTraces = this.sortTraces(record.list);
  
    let hasReject = false;
    let delivering = false;
    let received = false;
    let deliverRemark = '';
    let deliverDate = '';
    for(let { status: trace, time } of sortedTraces) {
      if(trace.indexOf('客户拒收') > -1) {
        hasReject = true;
        deliverDate = time;
        // 提前签收是错误的行为，重置掉
        if(received) {
          received = false;
        }
      } else if(trace.indexOf('发件公司要求退回') > -1) {
        hasReject = true;
        deliverDate = time;
        // 提前签收是错误的行为，重置掉
        if(received) {
          received = false;
        }
        // 后面的物流状态是退回信息，会干扰结果
        break;
      } else if(trace.indexOf('派件中') > -1) {
        delivering = true;
        deliverDate = time;
      } else if(trace.indexOf('-已签收') > -1) {
        received = true;
        const [ remark ] = trace.split('-已签收');
        deliverRemark = remark;
        deliverDate = time;
        // 拒签又反悔了
        if(hasReject) {
          hasReject = false;
        }
      } else if(trace.indexOf('派送不成功-原因：') > -1) {
        delivering = true;
        const [ , remark ] = trace.split('派送不成功-原因：');
        deliverRemark = remark;
        deliverDate = time;
        // 提前签收是错误的行为，重置掉
        if(received) {
          received = false;
        }
      } else if (trace.indexOf('-已装袋发往-') > -1 || trace.indexOf('-已发往-')) {
        if(received || hasReject) {
          // 先签收/拒签，再出现后面的物流状态，是退回信息，会干扰结果
          break;
        }
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

module.exports = new STO;