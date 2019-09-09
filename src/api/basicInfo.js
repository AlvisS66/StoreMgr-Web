import request from '@/utils/request'

// 门店全局接口
/**
 * @description 获取门店基础数据
 */
export function getBasicInfo() {
  return request({
    url: 'basicInfo',
    method: 'get',
    params: {}
  })
}