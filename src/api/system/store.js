import request from '@/utils/request'

// 门店设置

/**
 * @description 获取门店设置
 */
export function getStore() {
  return request({
    url: 'system/store',
    method: 'get',
    param : {},
  })
}

/**
 * @description 门店设置保存
 * @params name
 * @params logo
 * @params phone
 * @params address
 * @params store_hour_start
 * @params store_hour_end
 * @params introduce
 * @params envir_images
 */
export function saveStore(data) {
  return request({
    url: 'system/store',
    method: 'post',
    data,
  })
}