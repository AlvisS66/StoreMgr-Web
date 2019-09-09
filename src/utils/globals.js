// 商品类型
export const PRODUCT = 0;

export const SERVICES = 1;

export const TCARD = 2;

export const PPCARD = 3;

export const RECHARGE = 4;

export const TYPE = {
  [PRODUCT]: '商品',
  [SERVICES]: '服务',
  [TCARD]: '计次卡',
  [PPCARD]: '储值卡',
  [RECHARGE]: '余额充值',
};

export const PRODUCTS = {
  ppcard: '储值卡',
  product: '商品',
  service: '服务',
  tcard: '计次卡',
  recharge: '余额充值'
};

export const PAYMENTS = {
  'ALIPAY': '支付宝',
  'CASH': '现金',
  'BANKCARD': '银行卡',
  'WECHATPAY': '微信',
  'OTHERS': '其他',
  'PPCARD': '储值卡',
  'DEPOSIT': '余额',
  'GROUP_BUYING': '团购',
};