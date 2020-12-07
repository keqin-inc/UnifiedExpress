// 默认配置，当用户未提供 source 字段时，合并用户配置到默认配置
module.exports = {
  ZTO: {
    source: 'zto',
    cfg: {
      key: process.env['ZTO_KEY'],
      company_id: process.env['ZTO_COMPANY_ID']
    }
  },
  STO: {
    source: 'fegine',
    cfg: {
      appcode: process.env['FEGINE_APPCODE']
    }
  },
  YTO: {
    source: 'yto',
    cfg: {
      user_id: process.env['YTO_USER_ID'],
      app_key: process.env['YTO_APP_KEY'],
      secret_key: process.env['YTO_SECRET_KEY']
    }
  },
  SF: {
    source: 'sf',
    cfg: {
      customer_code: process.env['SF_CUSTOMER_CODE'],
      checkword: process.env['SF_CHECKWORD']
    }
  },
  JD: {
    source: 'fegine',
    cfg: {
      appcode: process.env['FEGINE_APPCODE']
    }
  }
}
