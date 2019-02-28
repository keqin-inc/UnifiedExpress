# UnifiedExpress
封装不同快递接口，并返回统一格式

## 目前支持的快递和接口
| 快递 | 代码 |  接口           | 接口的申请网址         |
|-----|------|----------------|----------------------|
| 中通 |   ZTO|    中通开放平台  | https://zop.zto.com/ |
| 申通 |  STO | 涪擎（阿里云市场）| https://market.aliyun.com/products/56928004/cmapi022273.html|
| 圆通 |   YTO|    圆通开放平台  | http://open.yto.net.cn/ |
| 顺丰 |   SF |    顺丰丰桥接口  | https://qiao.sf-express.com |

未来将增加更多快递和接口支持

# Quick Start

```javascript
// 查询中通的示例，需要把 key 和 company_id 替换成自己在中通开放平台的信息

const UE = require('unifiedexpress');
const ue = new UE({
  ZTO: {
    source: 'zto',
    cfg: {
      key: '', //  替换成自己的配置
      company_id: '' // 中通公司ID
    }
  },
});
ue.query({
    no: '73107975056357',
    company: '中通'
  })
  .then(body => {
    console.log(body);
  })
  .catch(err => {
    console.log('出现异常', err);
  });
```
## 返回的数据
```javascript
{ no: '73107975056357',
  deliverRemark: '自提件',
  deliverDate: '2018-12-27 14:06:25',
  hasReject: false,
  received: false,
  delivering: true,
  traces:
   [ { dispOrRecMan: '冯鑫华',
       dispOrRecManCode: '',
       dispOrRecManPhone: '18307857510',
       isCenter: 'F',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '贵港市',
       scanDate: '2018-12-25 16:17:47',
       scanProv: '广西壮族自治区',
       scanSite: '桂平',
       scanSiteCode: '77530',
       scanSitePhone: '0775-3337900',
       scanType: '收件',
       signMan: '',
       msg: '【贵港市】  【桂平】（0775-3337900） 的 冯鑫华 （18307857510） 已揽收' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'F',
       preOrNextCity: '南昌市',
       preOrNextProv: '江西省',
       preOrNextSite: '南昌中转部',
       preOrNextSiteCode: '79100',
       preOrNextSitePhone: '0791-86150780、0791-86150799',
       remark: '',
       scanCity: '贵港市',
       scanDate: '2018-12-25 19:41:39',
       scanProv: '广西壮族自治区',
       scanSite: '桂平',
       scanSiteCode: '77530',
       scanSitePhone: '0775-3337900',
       scanType: '发件',
       signMan: '',
       msg: '【贵港市】  快件离开 【桂平】 发往 【南昌中转部】' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'T',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '南宁市',
       scanDate: '2018-12-26 00:01:56',
       scanProv: '广西壮族自治区',
       scanSite: '南宁中转',
       scanSiteCode: '77100',
       scanSitePhone: '0771-4309537、0771-4304127',
       scanType: '到件',
       signMan: '',
       msg: '【南宁市】  快件到达 【南宁中转】' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'T',
       preOrNextCity: '南昌市',
       preOrNextProv: '江西省',
       preOrNextSite: '南昌中转部',
       preOrNextSiteCode: '79100',
       preOrNextSitePhone: '0791-86150780、0791-86150799',
       remark: '',
       scanCity: '南宁市',
       scanDate: '2018-12-26 00:07:24',
       scanProv: '广西壮族自治区',
       scanSite: '南宁中转',
       scanSiteCode: '77100',
       scanSitePhone: '0771-4309537、0771-4304127',
       scanType: '发件',
       signMan: '',
       msg: '【南宁市】  快件离开 【南宁中转】 发往 【南昌中转部】' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'T',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '南昌市',
       scanDate: '2018-12-26 23:40:48',
       scanProv: '江西省',
       scanSite: '南昌中转部',
       scanSiteCode: '79100',
       scanSitePhone: '0791-86150780、0791-86150799',
       scanType: '到件',
       signMan: '',
       msg: '【南昌市】  快件到达 【南昌中转部】' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'T',
       preOrNextCity: '九江市',
       preOrNextProv: '江西省',
       preOrNextSite: '九江星子',
       preOrNextSiteCode: '79214',
       preOrNextSitePhone: '0792-2678298、0792-2552298',
       remark: '',
       scanCity: '南昌市',
       scanDate: '2018-12-26 23:41:32',
       scanProv: '江西省',
       scanSite: '南昌中转部',
       scanSiteCode: '79100',
       scanSitePhone: '0791-86150780、0791-86150799',
       scanType: '发件',
       signMan: '',
       msg: '【南昌市】  快件离开 【南昌中转部】 发往 【九江星子】' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'F',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '九江市',
       scanDate: '2018-12-27 08:45:42',
       scanProv: '江西省',
       scanSite: '九江星子',
       scanSiteCode: '79214',
       scanSitePhone: '0792-2678298、0792-2552298',
       scanType: '到件',
       signMan: '',
       msg: '【九江市】  快件到达 【九江星子】' },
     { dispOrRecMan: '刘幼生',
       dispOrRecManCode: '',
       dispOrRecManPhone: '15079270857',
       isCenter: 'F',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '九江市',
       scanDate: '2018-12-27 08:45:51',
       scanProv: '江西省',
       scanSite: '九江星子',
       scanSiteCode: '79214',
       scanSitePhone: '0792-2678298、0792-2552298',
       scanType: '派件',
       signMan: '',
       msg: '【九江市】  【九江星子】 的刘幼生（15079270857） 正在第1次派件, 请保持电话畅通,并耐心等待' },
     { dispOrRecMan: '',
       dispOrRecManCode: '',
       dispOrRecManPhone: '',
       isCenter: 'F',
       preOrNextCity: '',
       preOrNextProv: '',
       preOrNextSite: '',
       preOrNextSiteCode: '',
       preOrNextSitePhone: '',
       remark: '',
       scanCity: '九江市',
       scanDate: '2018-12-27 14:06:25',
       scanProv: '江西省',
       scanSite: '九江星子',
       scanSiteCode: '79214',
       scanSitePhone: '0792-2678298、0792-2552298',
       scanType: '问题件',
       signMan: '',
       msg: '【九江市】  【九江星子】 的 刘幼生 已进行【问题件】上报，原因：自提件' } ],
  status: '派送中' }
```

# 查询接口参数
```javascript
ue.query({ 
  no: '',
  company: '' ,
  checkPhoneNo: '' // 可选参数
});
```
- no 为快递单号
- company 为指定的快递公司，可以是中文（申通）或代码（STO）
- checkPhoneNo 可选，当快递为顺丰时可使用，为收件人或发件人后手机号 4 位，验证订单。当丰桥账号已经绑定月结账号或使用的是其他快递公司时，可以省略。

> 由于不同快递公司使用不同接口，自动根据单号识别公司存在误差，所以必须指定 `company` 参数

# 返回结果
```javascript
{ 
  no: '73107975056357',
  deliverRemark: '自提件',
  deliverDate: '2018-12-27 14:06:25',
  hasReject: false,
  returnNo: '',
  received: false,
  delivering: true,
  traces:
   [],
  status: '派送中'
}
```
字段说明
- no: string 查询的快递单号
- deliverRemark: string 派送备注，可能是签收人信息或者派送中的备注
- deliverDate: datetime 派送/签收时间，上报派送、签收的时间
- hasReject: boolean 是否出现过退回信息，拒收、发件公司召回、错分件都有可能产生此信息，拒收以 status 为准
- received: boolean 是否已签收
- returnNo: 【顺丰特有】退件时的快递单号，其他快递公司的当前快递会直接追加退件物流状态，顺丰则单独返回单号。你大爷就是你大爷。
- delivering: boolean 是否出现过派送中的信息
- traces: array
  - msg: string  路由状态，在 traces 里目前仅此字段是统一的，其他字段由不同接口会返回不同字段；将来可能统一更多字段，例如时间
- status: string 共五种状态，为 `查询不到`、`运输中` 、`派送中`、`已签收`、`拒收`。未来可能增加更多状态，例如“揽收”或“快递柜签收”。

# 安装
`npm i unifiedexpress --save`

# 配置

```javascript
const UE = require('unifiedexpress');
const ue = new UE({
  // 要查询的快递公司
  ZTO: {
    // 数据源
    source: 'zto',
    // 数据源配置
    cfg: {
      key: '',
      company_id: '' // 中通公司ID
    }
  },
  STO: {
    source: 'fegine',
    cfg:{
      appcode: '', //阿里云市场后台的 AppCode
    }
  },
  YTO: {
    source: 'yto',
    cfg: {
      user_id: '', // 圆通 User_Id
      app_key: '', // 圆通  App_Key
      secret_key: '' // 圆通 Secret_Key
    }
  },
  SF: {
    source: 'sf',
    cfg: {
      customer_code: '', // 顺丰丰桥顾客编码
      checkword: '' // 顺丰丰桥校验码
    }
  }
});
```

# 环境变量配置
通过环境变量配置，可启用约定的默认接口查询，无需额外配置。
此项目的测试用例也是用这种方式配置的，把 `.env` 文件放在根目录下后 `npm run test` 即可运行测试用例。

示例：
```
ZTO_KEY=
ZTO_COMPANY_ID=
FEGINE_APPCODE=
YTO_USER_ID=
YTO_APP_KEY=
YTO_SECRET_KEY=
SF_CUSTOMER_CODE=
SF_CHECKWORD=
```

# Changelog
- 1.0.8 支持顺丰丰桥接口
- 1.0.5 支持圆通开放平台的查询
- 1.0.1 增加`查询不到`、`运输中`状态，并在接口异常时抛出错误
- 1.0.0 第一版