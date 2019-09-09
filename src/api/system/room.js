import request from '@/utils/request'

// 包厢设置

/**
 * @description 包间列表
 */
export function getPrivateroom() {
  return request({
    url: 'system/privateroom',
    method: 'get',
    params : {},
  })
}

/**
 * @description 新增包间
 * @params name
 */
export function addPrivateroom(name) {
  return request({
    url: 'system/privateroom',
    method: 'post',
    data : {
      name
    },
  })
}

/**
 * @description 删除包间
 * @params id
 */
export function delPrivateroom(id) {
  return request({
    url: `system/privateroom/${id}`,
    method: 'delete',
    params : {},
  })
}