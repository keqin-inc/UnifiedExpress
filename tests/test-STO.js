const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('申通：签收', (t) => {
  ue.query({
    no: '118115898496',
    company: '申通'
  }).then(body => {
    t.equal(body.no, '118115898496', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.deliverRemark, '王家英', 'deliverRemark');
    t.equal(body.deliverDate, '2018-12-25 22:52:43', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

test('申通：拒收', (t) => {
  ue.query({
    no: '118115868901',
    company: '申通'
  }).then(body => {
    t.equal(body.no, '118115868901', 'NO');
    t.equal(body.status, '拒收', 'status');
    t.equal(body.deliverDate, '2018-12-24 19:15:18', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

// 基本都是派送中出现问题，后续会有更新，将导致测试用例过期
test('申通：派送中', (t) => {
  ue.query({
    no: '118115898295',
    company: '申通'
  }).then(body => {
    t.equal(body.no, '118115898295', 'NO');
    t.equal(body.status, '派送中', 'status');
    t.equal(body.deliverDate, '2018-12-25 13:42:24', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.equal(body.deliverRemark, '超派件,客户自取,电话：0794-4222009', 'deliverRemark');
    t.end();
  })
  .catch(t.fail)
});


