const request = require('request-promise-native');
const crypto = require('crypto');
const dayjs = require('dayjs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({
  explicitRoot: false,
  explicitArray: false,
  mergeAttrs: true
});
const querystring = require('querystring');

const builder = new xml2js.Builder({
  headless: true,
  renderOpts: {
    newline: ''
  }
});

class SF {
  buildRequestForm({ no, checkPhoneNo }, { customer_code, checkword }) {
    const RouteRequest = {
      tracking_type: 1,
      method_type: 1,
      tracking_number: no
    };
    if (checkPhoneNo) {
      RouteRequest.check_phoneNo = checkPhoneNo;
    }
    const requestObject = {
      $: {
        service: 'RouteService',
        lang: 'zh-CN'
      },
      Head: customer_code,
      Body: {
        RouteRequest: {
          $: RouteRequest
        }
      }
    };
    const xml = builder.buildObject({
      Request: requestObject
    });
    const verifyCode = crypto.createHash('md5')
      .update(xml + checkword)
      .digest("base64");
    return {
      xml,
      verifyCode
    };
  }

  parseXML(xml) {
    return new Promise((resolve, reject) => {
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async parseResponseXML(xml) {
    if (!xml.startsWith('<?xml ')) {
      throw new Error('顺丰接口没有正常返回 XML 格式响应：' + body);
    }
    const result = await this.parseXML(xml);
    const { Head: status, Body: body } = result;
    if (status !== 'OK') {
      throw new Error('顺丰接口异常：' + xml);
    }
    if (!body.RouteResponse) {
      return {
        traces: []
      };
    }
    const { Route = [], mailno } = body.RouteResponse;
    return {
      no: mailno,
      traces: Route
    };
  }

  async request(no, checkPhoneNo, cfg) {
    const form = this.buildRequestForm({
      no,
      checkPhoneNo
    }, cfg);
    const formData =  querystring.stringify(form);
    const body = await request.post({
      headers: {
        'Content-Length': formData.length,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: 'http://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService',
      method: 'POST',
      body: formData
    });
    const result = await this.parseResponseXML(body);
    if (typeof checkPhoneNo !== 'undefined') {
      result.checkPhoneNo = checkPhoneNo;
    }
    if (!result.traces || result.traces.length === 0) {
      const defaultResult = {
        status: '查询不到',
        no,
        traces: []
      };
      return Object.assign(defaultResult, result);
    }
    const formatedResult = this.format(result.traces);
    formatedResult.no = result.no;
    formatedResult.checkPhoneNo = result.checkPhoneNo;
    return formatedResult;
  }

  async query({ no, checkPhoneNo }, cfg) {
    const data = await this.request(no, checkPhoneNo, cfg);
    return data;
  }

  sortTraces(records) {
    return records.sort((a, b) => {
      return new Date(a.accept_time) - new Date(b.accept_time)
    });
  }

  format(records) {
    if(records.length === 0) {
      throw new Error('接口未成功返回数据, 数组空');
    }
    const express = {}
    const sortedTraces = this.sortTraces(records);
    let hasReject = false;
    let delivering = false;
    let received = false;
    let deliverRemark = '';
    let deliverDate = '';
    let returnNo = '';
    for(let { 
        remark: trace,
        accept_address,
        opcode,
        accept_time: scanDate } of sortedTraces) {
      // opcode 操作码参考文档： https://open.sf-express.com/doc/sf_openapi_document_V1.pdf
      switch (opcode) {
        case '80':
          hasReject = false;
          received = true;
          deliverDate = scanDate;
        break;
        case '8000':
          if(trace === '快件被退回') {
            continue;
          }
          deliverRemark = trace;
        break;
        case '44':
          hasReject = false;
          received = false;
          deliverDate = scanDate;
          delivering = true;
        break;
        case '70':
        case '33':
          hasReject = true;
          received = false;
          deliverDate = scanDate;
          deliverRemark = trace;
        break;
        case '648':
          const matches = trace.match(/快件已退回\/转寄,新单号为: (\d+)/);
          if (matches) {
            returnNo = matches[1];
          }
          deliverRemark = trace;
        break;
      }
    }
    
    express.returnNo = returnNo;
    express.deliverRemark = deliverRemark;
    express.deliverDate = deliverDate;
    express.hasReject = hasReject;
    express.received = !hasReject && received;
    express.delivering = delivering;
    express.traces = sortedTraces.map(trace => {
      trace.msg = trace.remark;
      delete trace.remark;
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

module.exports = new SF;