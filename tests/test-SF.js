const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('顺丰：不存在的快递', (t) => {
  ue.query({
    no: '253368960873',
    checkPhoneNo: '',
    company: '顺丰'
  }).then(body => {
    t.equal(body.no, '253368960873', 'NO');
    t.equal(body.status, '查询不到', 'status');
    t.equal(body.checkPhoneNo, '', 'checkPhoneNo');
    t.equal(body.traces.length === 0, true, 'No traces');
    t.end();
  })
  .catch(t.fail)
});

test('顺丰：签收', (t) => {
  ue.query({
    no: '253668879197',
    company: 'SF',
    checkPhoneNo: '1768'
  }).then(body => {
    t.equal(body.no, '253668879197', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.checkPhoneNo, '1768', 'checkPhoneNo');
    t.equal(body.deliverRemark, '在官网"运单资料&签收图",可查看签收人信息', '签收人');
    t.equal(body.deliverDate, '2019-02-21 16:28:00', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

test('顺丰：拒收', (t) => {
  ue.query({
    no: '253368960872',
    checkPhoneNo: '5753',
    company: 'SF'
  }).then(body => {
    t.equal(body.no, '253368960872', 'NO');
    t.equal(body.status, '拒收', 'status');
    t.equal(body.checkPhoneNo, '5753', 'checkPhoneNo');
    t.equal(body.deliverDate, '2019-02-09 14:55:00', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.equal(body.returnNo, '016206190704', 'returnNo');
    t.end();
  })
  .catch(t.fail)
});
