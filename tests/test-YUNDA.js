const test = require('tape');
require('dotenv').config();
const UE = require('../');
const ue = new UE;

test('韵达快递: 不存在的快递', (t) => {
  ue.query({
    no: '3120029251247',
    company: '韵达快递'
  }).then(body => {
    t.equal(body.no, '3120029251247', 'NO');
    t.equal(body.status, '查询不到', 'status');
    t.equal(body.traces.length === 0, true, 'No traces');
    t.end();
  })
  .catch(t.fail)
});

test('韵达快递: 签收', (t) => {
  ue.query({
    no: '3120019757477',
    company: '韵达快递'
  }).then(body => {
    t.equal(body.no, '3120019757477', 'NO');
    t.equal(body.status, '已签收', 'status');
    t.equal(body.traces.length > 0, true, 'Has traces');
    t.end();
  })
  .catch(t.fail)
});

test('韵达快递: 派送中', (t) => {
    ue.query({
      no: '3120029035143',
      company: '韵达快递'
    }).then(body => {
      t.equal(body.no, '3120029035143', 'NO');
      t.equal(body.status, '派送中', 'status');
      t.equal(body.traces.length > 0, true, 'Has traces');
      t.end();
    })
    .catch(t.fail)
})

