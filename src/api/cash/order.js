// 收银管理 - 订单
import request from '@/utils/request'

/**
 * @description 订单列表搜索选项数据源
 */
export function searchData() {
  return request({
    url: 'order/order/searchData',
    method: 'get',
    params: {},
  })
}

/**
 * @description 获取订单列表（带搜索和分页）
 * @params payway 支付方式
 * @params operator 操作人
 * @params search 购买人姓名、手机号或订单号
 * @params status 订单状态
 * @params is_free 是否免费
 */
export function orderList({ payway, operator, search, status, is_free, start_time, end_time, page = 1, page_size } = {}) {
  return request({
    url: 'order/order',
    method: 'get',
    params: {
      payway,
      operator,
      search,
      status,
      is_free,
      start_time,
      end_time,
      page,
      page_size,
    },
  })
}

/**
 * @description 查看订单信息
 * @params id 订单id
 */
export function orderInfo(id) {
  return request({
    url: `order/order/${id}`,
    method: 'get',
    params: {},
  })
}

/**
 * @description 订单退款
 * @params id 订单id
 */
export function refund(id) {
  return request({
    url: `order/order/refund`,
    method: 'post',
    data: {
      id,
    },
  })
}