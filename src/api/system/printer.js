import request from '@/utils/request'

// 智能设备 -- 打印设置

/**
 * @description 更新打印配置
 * @params printer_type int 打印方式：0、不打印 1、打印前提示 2、直接打印
 * @params printer_num int 打印数量
 * @params is_store_name int 是否显示店名
 * @params is_card_no int 是否显示订单号
 * @params is_trade_time int 是否显示交易时间
 * @params is_member int 是否显示顾客
 * @params is_statement int 是否显示交易明细
 * @params is_staff int 是否显示服务员工
 * @params is_payway int 是否显示支付方式
 * @params is_card_balance  int 是否显示卡内余额
 * @params is_point int 是否显示本次积分
 * @params is_all_point int 是否显示总积分
 * @params is_operator int 是否显示操作人
 * @params is_store_tel int 是否显示门店电话
 * @params is_address int 是否显示地址
 * @params is_member_remark int 是否显示会员备注
 * @params is_order_remark int 是否显示单据备注
 * @params is_member_sign int 是否显示顾客签字
 * @params footer_content int 页脚内容
 */
export function savePrinter(data) {
  return request({
    url: 'system/feie/printer',
    method: 'post',
    data
  })
}

/**
 * @description 获取打印配置
 */
export function getPrinter() {
  return request({
    url: 'system/feie/printer',
    method: 'get',
    params: {}
  })
}

/**
 * @description 获取打印机列表
 */
export function getMachine(page = 1, page_size = 10) {
  return request({
    url: 'system/feie/machine',
    method: 'get',
    params: {
      page,
      page_size,
    }
  })
}

/**
 * @description 添加打印机
 */
export function addMachine({ id, name, printer_no, printer_code, card_num }) {
  return request({
    url: 'system/feie/machine',
    method: 'post',
    data: {
      id,
      name,
      printer_no,
      printer_code,
      card_num,
    }
  })
}

/**
 * @description 删除打印机
 */
export function delMachine(machine_id) {
  return request({
    url: `system/feie/machine/${machine_id}`,
    method: 'delete',
    data: {}
  })
}

/**
 * @description 打印订单
 */
export function printOrder(order_id, machine_id) {
  return request({
    url: 'feie/printer',
    method: 'post',
    data: {
      order_id,
      machine_id,
    }
  })
}
