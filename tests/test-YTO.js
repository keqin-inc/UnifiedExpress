const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('圆通：不存在的快递', (t) => {
  ue.query({
    no: 'D00079319239',
    company: '圆通'
  }).then(body => {
    t.equal(body.no, 'D00079319239', 'NO');
    t.equal(body.status, '查询不到', 'status');
    t.equal(body.traces.length === 0, true, 'No traces');
    t.end();
  })
  .catch(t.fail)
});

test('圆通：签收', (t) => {
  ue.query({
    no: 'D00079319233',
    company: '圆通'
  }).then(body => {
    t.equal(body.no, 'D00079319233', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.deliverRemark, '', '签收人');
    t.equal(body.deliverDate, '2018-11-17 10:18:05', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

test('圆通：签收', (t) => {
  ue.query({
    no: 'D00079319429',
    company: '圆通'
  }).then(body => {
    t.equal(body.no, 'D00079319429', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.deliverRemark, '本人签收', '签收人');
    t.equal(body.deliverDate, '2018-9-10 13:11:28', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

// 另一个例子：75113071551054
test('圆通：拒收', (t) => {
  ue.query({
    no: 'D00079319237',
    company: '圆通'
  }).then(body => {
    t.equal(body.no, 'D00079319237', 'NO');
    t.equal(body.status, '拒收', 'status');
    t.equal(body.deliverDate, '2018-11-24 11:15:50', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});
