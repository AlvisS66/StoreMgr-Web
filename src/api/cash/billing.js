import request from '@/utils/request'

/**
 * @description 获取产品分类
 */
export function orderCategory() {
  return request({
    url: 'order/category',
    method: 'get',
  })
}

/**
 * @description 获取产品列表
 */
export function orderItem(category_id, page = 1) {
  return request({
    url: 'order/item',
    method: 'get',
    params: {
      category_id,
      page,
    }
  })
}

/**
 * @description 绑定会员
 */
export function orderSearch(search) {
  return request({
    url: 'order/search',
    method: 'get',
    params: {
      search,
    }
  })
}

/**
 * @description 获取提供服务的技师列表
 */
export function staffList() {
  return request({
    url: 'order/staff/getList',
    method: 'get',
    params: {}
  })
}

/**
 * @description 选择技师更新提成数据
 * @params total_amount 计算折扣后当前商品价格
 * @params num 购买数量
 * @params member_user_id  会员ID
 * @params item_id  商品ID
 * @params user_tcard_item_id  划卡选择技师时，必须携带！
 * @params user_advance_item_id  预存消耗选择技师时，必须携带！
 * @params staff_list[][staff_user_id]  选择技师ID
 * @params staff_list[][is_appoint]  是否点客
 */
export function calculateRatio({ total_amount, num, member_user_id, item_id, staff_list, user_tcard_item_id = '', user_advance_item_id = '' }) {
  return request({
    url: 'order/staff/calculateRatio',
    method: 'post',
    data: {
      total_amount,
      num,
      member_user_id,
      item_id,
      staff_list,
      user_tcard_item_id,
      user_advance_item_id
    }
  })
}

/**
 * @description 根据用户ID获取用户信息
 */
export function memberInfo(user_id) {
  return request({
    url: 'order/member/choseMember',
    method: 'get',
    params: {
      user_id,
    }
  })
}

/**
 * @description 获取选中商品详细
 */
export function selectedList(item_ids = []) {
  return request({
    url: 'order/item/getList',
    method: 'get',
    params: {
      item_ids,
    }
  })
}

/**
 * @description 获取支付方式
 */
export function payway() {
  return request({
    url: 'order/payway',
    method: 'get',
    params: {}
  })
}

/**
 * @description 获取用户的储值卡和余额
 * @params member_user_id  会员ID
 */
export function memberPayway(member_user_id) {
  return request({
    url: 'order/member/getPayway',
    method: 'get',
    params: {
      member_user_id,
    }
  })
}

/**
 * @description 保存订单
 * @params mon_member 用户类型：0、会员 1、男散客 2、女散客
 * @params room_id 包厢ID
 * @params id 订单ID
 * @params remark 备注
 * @params member_user_id  下单用户
 * @params order_items[][item_id] 选购的商品ID
 * @params order_items[][is_free] 商品是否免费：0、不免费 1、免费
 * @params order_items[][staff_list] 技师
 * @params order_items[][num] 购买数量默认1
 * @params order_items[][user_advance_item_id] 用户预存商品ID
 * @params order_items[][user_advance_id] 用户预存ID
 * @params discount_type 选择折扣，选中会员状态：1、会员等级折扣 0、不选择折扣 散客状态：1、散客折扣 0、不选折扣
 */
export function saveOrder({ id, mon_member, member_user_id, order_items, room_id, discount_type, remark }) {
  return request({
    url: 'order/trade',
    method: 'post',
    data: {
      id,
      mon_member,
      member_user_id,
      room_id,
      order_items,
      discount_type,
      remark,
    }
  })
}

/**
 * @description 支付订单
 * @params order_id 订单ID
 * @params is_advance 是否预存：0、否 1、是
 * @params pay_data[][pay_id]  支付方式ID
 * @params pay_data[][amount]  该支付方式支付金额
 */
export function orderPay({ order_id, pay_data, is_advance }) {
  return request({
    url: 'order/pay',
    method: 'post',
    data: {
      order_id,
      pay_data,
      is_advance,
    }
  })
}

/**
 * @description 获取包厢
 * @params name 包厢名
 */
export function orderRoom(name) {
  return request({
    url: 'order/room',
    method: 'get',
    params: {
      name
    }
  })
}

/**
 * @description 取单
 * @params name 包厢名
 */
export function stagingList(name) {
  return request({
    url: 'order/trade/stagingList',
    method: 'get',
    params: {
      name
    }
  })
}

/**
 * @description 删除订单
 * @params id 订单ID
 */
export function delOrder(id) {
  return request({
    url: `order/order/${id}`,
    method: 'delete',
    params: {}
  })
}

/**
 * @description  获取订单信息
 * @params id 订单ID
 */
export function orderDetail(id) {
  return request({
    url: `order/trade/${id}`,
    method: 'get',
    params: {}
  })
}

/**
 * @description 划卡支付
 * @params order_id 订单ID
 */
export function tcardPay(order_id) {
  return request({
    url: 'order/tcardPay',
    method: 'post',
    data: {
      order_id,
    }
  })
}

/**
 * @description 根据商品ID实时计算折扣价格
 * @params items[0][item_id]
 * @params items[0][is_free]
 * @params items[0][staff_list] 技师列表
 * @params items[0][num] 数量
 * @params items[0][custom_price] 折扣金额
 * @params discount_type 折扣类型：0、无折扣 1、有折扣
 * @params member_user_id 用户ID
 */
export function preStore({ items = [], discount_type = 0, member_user_id } = {}) {
  return request({
    url: 'order/item/preStore',
    method: 'post',
    data: {
      discount_type,
      member_user_id,
      items,
    }
  })
}

/**
 * @description 开单维持登录状态
 */
export function msgconnect() {
  return request({
    url: 'msgconnect',
    method: 'get',
    params: {}
  })
}