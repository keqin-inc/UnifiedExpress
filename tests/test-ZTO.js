const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('中通：不存在的快递', (t) => {
  ue.query({
    no: '7511306763020811',
    company: '中通'
  }).then(body => {
    t.equal(body.no, '7511306763020811', 'NO');
    t.equal(body.status, '查询不到', 'status');
    t.equal(body.traces.length === 0, true, 'No traces');
    t.end();
  })
  .catch(t.fail)
});

test('中通：签收', (t) => {
  ue.query({
    no: '75113067630208',
    company: '中通'
  }).then(body => {
    t.equal(body.no, '75113067630208', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.deliverDate, '2018-12-09 15:45:21', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

// 另一个例子：75113071551054
test('中通：拒收', (t) => {
  ue.query({
    no: '75113071551054',
    company: '中通'
  }).then(body => {
    t.equal(body.no, '75113071551054', 'NO');
    t.equal(body.status, '拒收', 'status');
    t.equal(body.deliverDate, '2018-12-19 17:36:14', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

// 另一个例子是：75113067630208
test('中通：地址不够详细的签收件', (t) => {
  ue.query({
    no: '73107299621348',
    company: '中通'
  }).then(body => {
    t.equal(body.no, '73107299621348', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.deliverDate, '2018-12-14 10:10:35', 'deliverDate');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

// 另一个例子是：75113067630208
// test('中通：问题件', (t) => {
//   ue.query({
//     no: '75113073636413',
//     company: '中通'
//   }).then(body => {
//     t.equal(body.no, '75113073636413', 'NO');
//     t.equal(body.status, '派送中', 'status');
//     t.equal(body.deliverDate, '2018-12-08 10:46:44', 'deliverDate');
//     t.equal(body.traces.length > 0, true, 'Has traces');
//     t.equal(body.deliverRemark, '送无人，电话联系不上', 'deliverRemark');
//     t.end();
//   })
//   .catch(t.fail)
// });


