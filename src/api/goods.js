import request from '@/utils/request'

// 商品

/**
 * @description 商品列表
 * @params search 
 * @params category_id 
 * @params price 
 * @params code 
 */
export function productList(data) {
  return request({
    url: 'items/product/list',
    method: 'post',
    data
  })
}

/**
 * @description 获取新增商品信息
 * @param 
 */

export function getCreatProductInfo() {
  return request({
    url: "items/product/create",
    method: 'get',
  })
}

/**
 * @description 新增商品保存
 * @params name 
 * @params type
 * @params category_id
 * @params price
 * @params remark
 * @params code
 * @params sku    
 * @params imageurl
 */
export function creatProduct(data) {
  return request({
    url: 'items/product',
    method: 'post',
    data
  })
}

/**
 * @description 获取商品信息
 * @param 
 */

export function getEditProductInfo(id) {
  return request({
    url: `items/product/${id}/edit`,
    method: 'get',
  })
}

/**
 * @description 编辑商品保存
 * @params name
 * @params type
 * @params category_id
 * @params price
 * @params remark
 * @params code
 * @params sku
 * @params imageurl
 */

export function eaditProduct(id, data) {
  return request({
    url: `items/product/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 删除商品
 * @params 
 */
export function deleteProduct(id) {
  return request({
    url: `items/product/${id}`,
    method: 'delete',
  })
}

/**
 * @description 批量删除商品
 * @params ids
 */

export function deleteInBatchesProduct(data) {
  return request({
    url: 'items/product/del',
    method: 'post',
    data
  })
}

// ------------------------------------------------------

// 服务

/**
 * @description 服务列表
 * @params search 
 * @params category_id 
 * @params service_time 
 */

export function serviceList(data) {
  return request({
    url: 'items/service/list',
    method: 'post',
    data
  })
}

/**
 * @description 获取新增服务信息
 * @param 
 */

export function getCreatServiceInfo() {
  return request({
    url: "items/service/create",
    method: 'get',
  })
}

/**
 * @description 新增服务保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params code
 * @params service_time
 * @params imageurl
 */

export function creatService(data) {
  return request({
    url: 'items/service',
    method: 'post',
    data
  })
}

/**
 * @description 获取服务信息
 * @params 
 */

export function getEditServiceInfo(id) {
  return request({
    url: `items/service/${id}/edit`,
    method: 'get',
  })
}

/**
 * @description 编辑服务保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params code
 * @params service_time
 * @params imageurl
 */

export function eaditService(id, data) {
  return request({
    url: `items/service/${id}`,
    method: 'patch',
    data
  })
}


/**
 * @description 删除商品
 * @params 
 */
export function deleteService(id) {
  return request({
    url: `/items/service/${id}`,
    method: 'delete',
  })
}

/**
 * @description 批量删除商品
 * @params ids
 */

export function deleteInBatchesService(data) {
  return request({
    url: '/items/service/del',
    method: 'post',
    data
  })
}


// --------------------------------------------------------------

// 次卡

/**
 * @description 
 * @params search
 * @params category_id
 * @params category
 * @params price
 * @params exp
 * @params page
 * @params limit
 */

export function tcardList(data) {
  return request({
    url: 'items/tcard/list',
    method: 'post',
    data
  })
}

/**
 * @description 新增次卡保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params is_limit
 * @params exp
 * @params imageurl
 * @params items_id
 * @params times
 * @params avg_price
 */

export function creatTcard(data) {
  return request({
    url: 'items/tcard',
    method: 'post',
    data
  })
}

/**
 * @description 获取次卡信息
 * @params 
 */

export function getEditTcardInfo(id) {
  return request({
    url: `items/tcard/${id}/edit`,
    method: 'get',
  })
}

/**
 * @description 编辑次卡保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params is_limit
 * @params exp
 * @params imageurl
 * @params items_id
 * @params times
 * @params avg_price
 */

export function eaditTcard(id, data) {
  return request({
    url: `items/tcard/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 删除次卡
 * @params 
 */
export function deleteTcard(id) {
  return request({
    url: `/items/tcard/${id}`,
    method: 'delete',
  })
}

/**
 * @description 批量删除次卡
 * @params ids
 */

export function deleteInBatchesTcard(data) {
  return request({
    url: '/items/tcard/del',
    method: 'post',
    data
  })
}

/**
 * @description 选择搭配商品
 * @params search
 * @params category_id
 */

export function addItems(id, data) {
  return request({
    url: `/items/tcard/additems/${id}`,
    method: 'post',
    data
  })
}


// ----------------------------------------------------

// 储值卡

/**
 * @description 储值卡列表
 * @params search
 * @params category_id
 * @params code
 * @params category
 * @params price
 * @params exp
 */

export function PpcardList(data) {
  return request({
    url: 'items/ppcard/list',
    method: 'post',
    data
  })
}

/**
 * @description 新增储值卡保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params imageurl
 * @params amount
 * @params donation_amount
 * @params exp
 */

export function creatPpcard(data) {
  return request({
    url: 'items/ppcard',
    method: 'post',
    data
  })
}

/**
 * @description 获取储值卡信息
 * @params 
 */

export function getEditPpcardInfo(id) {
  return request({
    url: `items/ppcard/${id}/edit`,
    method: 'get',
  })
}

/**
 * @description 编辑储值卡保存
 * @params name
 * @params category_id
 * @params price
 * @params remark
 * @params imageurl
 * @params amount
 * @params donation_amount
 */

export function eaditPpcard(id, data) {
  return request({
    url: `items/ppcard/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 删除储值卡
 * @params 
 */
export function deletePpcard(id) {
  return request({
    url: `/items/ppcard/${id}`,
    method: 'delete',
  })
}

/**
 * @description 批量删储值卡
 * @params ids
 */

export function deleteInBatchesPpcard(data) {
  return request({
    url: '/items/ppcard/del',
    method: 'post',
    data
  })
}

/**
 * @description 同步数据列表
 * @params search
 * @params page	
 * @params limit
 */
export function syncDataList(type, data) {
  return request({
    url: `items/syncdata/${type}`,
    method: 'post',
    data
  })
}

/**
 * @description 同步数据
 * @params id
 * @params is_sync 0同步取消 1同步 
 */
export function operateSync(data) {
  return request({
    url: 'items/operatesync',
    method: 'post',
    data
  })
}

// 

/**
 * @description 已停售列表
 * @params page
 * @params limit
 * @params type
 */

export function productStopList(data) {
  return request({
    url: 'items/stop/list',
    method: 'post',
    data
  })
}


/**
 * @description 停售 / 批量停售
 * @params ids 
 */
export function stopProduct(ids) {
  return request({
    url: `items/stop/${ids}`,
    method: 'get',
  })
}

/**
 * @description 开售 / 批量开售
 * @params ids 
 */
export function saleProduct(ids) {
  return request({
    url: `items/sale/${ids}`,
    method: 'get',
  })
}
