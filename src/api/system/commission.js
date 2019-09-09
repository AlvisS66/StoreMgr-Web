import request from '@/utils/request'

// 提成设置

/**
 * @description 提成列表
 * @params type
 * @params page
 * @params limit
 * @params search
 */

export function commisionList(data) {
  return request({
    url: 'system/percentage/list',
    method: 'post',
    data
  })
}

/**
 * @description 新增方案
 * @params name
 * @params type
 */

export function createCommision(data) {
  return request({
    url: 'system/percentage',
    method: 'post',
    data
  })
}

/**
 * @description 删除方案
 * @params 
 */

export function deleteCommision(id) {
  return request({
    url: `system/percentage/${id}`,
    method: 'delete',
  })
}

/**
 * @description 获取方案信息
 * @params 
 */
export function getEditCommisionInfo(id) {
  return request({
    url: `system/percentage/${id}/edit`,
    method: 'get',
  })
}

/**
 * @description 编辑提成方案保存
 * @params name
 * @params user_ids
 * @params per_cate   []
 */

export function editCommision(id,data) {
  return request({
    url: `system/percentage/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 编辑余额提成方案保存
 * @params name
 * @params user_ids       
 * @params rechargeData   []
 */

export function editRechargeCommision(id,data) {
  return request({
    url: `system/percentage/updateRecharge/${id}`,
    method: 'post',
    data
  })
}

/**
 * @description 特殊提成列表
 * @params scheme_id
 * @params category_id	
 * @params search	
 */

export function specCommisionList(data) {
  return request({
    url: 'system/percentage/special',
    method: 'post',
    data
  })
}

/**
 * @description 编辑特殊提成保存
 * @params scheme_id
 * @params category_id
 * @params specdata   []
 */

export function editSpecCommisionList(data) {
  return request({
    url: 'system/percentage/specialstore',
    method: 'post',
    data
  })
}

/**
 * @description 选择会员列表
 * @params 
 */

export function selectUser(data) {
  return request({
    url: 'system/percentage/user',
    method: 'post',
    data
  })
}

/**
 * @description 同步数据列表
 * @params page
 * @params limit
 * @params search
 */

export function syncDataList_commission(data) {
  return request({
    url: 'system/percentage/syncdata',
    method: 'post',
    data
  })
}

/**
 * @description 同步数据
 * @params id
 * @params is_sync  0同步取消 1同步
 */

export function operateSync_commission(data) {
  return request({
    url: 'system/percentage/operatesync',
    method: 'post',
    data
  })
}












