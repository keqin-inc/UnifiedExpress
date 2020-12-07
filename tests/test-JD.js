const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('京东物流: 不存在的快递', (t) => {
  ue.query({
    no: 'JDVB06705999999',
    company: '京东物流'
  }).then(body => {
    t.equal(body.no, 'JDVB06705999999', 'NO');
    t.equal(body.status, '查询不到', 'status');
    t.equal(body.traces.length === 0, true, 'No traces');
    t.end();
  })
  .catch(t.fail)
});

test('京东物流: 签收', (t) => {
  ue.query({
    no: 'JDVB06705811660',
    company: '京东物流'
  }).then(body => {
    t.equal(body.no, 'JDVB06705811660', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

test('京东物流: 代收', (t) => {
  ue.query({
    no: 'JDVB06705801303',
    company: '京东物流'
  }).then(body => {
    t.equal(body.no, 'JDVB06705801303', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
})

// 后续订单状态变更请替换订单号
test('京东物流: 运输中', (t) => {
  ue.query({
    no: 'JDVB06869281691',
    company: '京东物流'
  }).then(body => {
    t.equal(body.no, 'JDVB06869281691', 'NO');
    t.equal(body.status, '运输中', 'status');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
})
