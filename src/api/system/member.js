import request from '@/utils/request'

// 会员设置

// 折扣设置 ------------------------------------------------------

/**
 * @description 折扣列表
 * @params 
 */

export function discountList(data) {
  return request({
    url: 'system/memberdiscounts/list',
    method: 'post',
    data
  })
}

/**
 * @description 获取分类折扣信息
 * @params 
 */

export function getEditDiscountInfo(id) {
  return request({
    url: `system/memberdiscounts/set/${id}`,
    method: 'post',
  })
}

/**
 * @description 编辑折扣保存
 * @params category_id
 * @params {id,rank_id,discount} 散客 rank_id = 0
 */

export function editDiscount(category_id, data) {
  return request({
    url: `system/memberdiscounts/discount/${category_id}`,
    method: 'post',
    data
  })
}

/**
 * @description 批量编辑折扣保存
 * @params category_ids: '1,2,3,'
 * @params rankinfo: []
 */

export function editDiscounts(data) {
  return request({
    url: 'system/memberdiscounts/discounts',
    method: 'post',
    data
  })
}

/**
 * @description 获取特殊折扣信息
 * @params 
 */

export function getEditSpecDiscountInfo(id) {
  return request({
    url: `system/memberdiscounts/special/${id}`,
    method: 'get',
  })
}

/**
 * @description 编辑特殊折扣保存
 * @params itemInfo []
 */

export function editSpecDiscount(id, data) {
  return request({
    url: `system/memberdiscounts/specialdiscount/${id}`,
    method: 'post',
    data
  })
}

/**
 * @description 同步数据列表
 * @params page
 * @params limit
 */

export function syncDataList_member(data) {
  return request({
    url: 'system/memberdiscounts/syncdata',
    method: 'post',
    data
  })
}

/**
 * @description 同步数据
 * @params category_ids
 * @params is_sync  0同步取消 1同步
 */

export function operateSync_member(data) {
  return request({
    url: 'system/memberdiscounts/operatesync',
    method: 'post',
    data
  })
}
