// 默认配置，当用户未提供 source 字段时，合并用户配置到默认配置
module.exports = {
  ZTO: {
    source: 'zto',
    cfg:{
      key: process.env['ZTO_KEY'],
      company_id: process.env['ZTO_COMPANY_ID']
    }
  },
  STO: {
    source: 'fegine',
    cfg:{
      appcode: process.env['FEGINE_APPCODE']
    }
  }
}