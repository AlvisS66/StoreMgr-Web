import request from '@/utils/request'

// 报表管理
/**
 * @description 前台缴款
 */
export function getGeneralView(start_date, end_date) {
  return request({
    url: 'statistics/getGeneralView',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 提成明细
 */
export function getPercentageDetails({ start_date, end_date, staff_user_id, limit = 20, page = 1 }) {
  return request({
    url: 'statistics/getPercentageDetails',
    method: 'get',
    params: {
      start_date,
      end_date,
      staff_user_id,
      limit,
      page,
    }
  })
}

/**
 * @description 获取员工
 */
export function getStaffs() {
  return request({
    url: 'member/getStaffs',
    method: 'get',
    params: {
      withTrashed:'yes'
    }
  })
}

/**
 * @description 提成汇总
 * @params start_date
 * @params end_date
 * @params staff_user_id
 * @params limit
 * @params type all（所有）,sale（销售提成）,service（服务提成）
 */
export function getPercentageSummary({ start_date, end_date, staff_user_id, type, limit = 20, page = 1 }) {
  return request({
    url: 'statistics/getPercentageSummary',
    method: 'get',
    params: {
      start_date,
      end_date,
      staff_user_id,
      type,
      limit,
      page,
    }
  })
}

/**
 * @description 员工生日
 * @params start_date
 * @params end_date
 * @params search
 * @params limit
 */
export function getBirthdayStaffs({ start_date, end_date, search, limit = 20, page = 1 }) {
  return request({
    url: 'statistics/getBirthdayStaffs',
    method: 'get',
    params: {
      start_date,
      end_date,
      search,
      limit,
      page,
    }
  })
}

/**
 * @description 产品分析
 * @params start_date
 * @params end_date
 */
export function getProductAnalysis({ start_date, end_date }) {
  return request({
    url: 'statistics/getProductAnalysis',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 数量分析
 * @params start_date
 * @params end_date
 */
export function getProductSaleNumAnalysis({ start_date, end_date, type, search, limit, page }) {
  return request({
    url: 'statistics/getProductSaleNumAnalysis',
    method: 'get',
    params: {
      start_date,
      end_date,
      type,
      search,
      limit,
      page,
    }
  })
}

/**
 * @description 产品销售排行
 * @params start_date
 * @params end_date
 */
export function getProductRankingList({ start_date, end_date }) {
  return request({
    url: 'statistics/getProductRankingList',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 滞销排行
 * @params start_date
 * @params end_date
 */
export function getUnsalableRankList({ start_date, end_date }) {
  return request({
    url: 'statistics/getUnsalableRankList',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 消费排行
 * @params start_date
 * @params end_date
 * @params search
 * @params max_amount
 * @params min_amount
 * @params limit
 * @params page
 */
export function getMemberRankingList({ start_date, end_date, search, limit, min_amount, max_amount, page }) {
  return request({
    url: 'statistics/getMemberRankingList',
    method: 'get',
    params: {
      start_date,
      end_date,
      search,
      limit,
      min_amount,
      max_amount,
      page,
    }
  })
}

/**
 * @description 客源分析
 * @params start_date
 * @params end_date
 */
export function getSourceAnalysis({ start_date, end_date }) {
  return request({
    url: 'statistics/getSourceAnalysis',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 充值明细
 * @params start_date
 * @params end_date
 * @params search
 * @params limit
 * @params page
 * @params rank_id
 * @params seller_id
 * @params operator_id
 */
export function getRechargeRecords({ start_date, end_date, search, limit, rank_id, seller_id, operator_id, page }) {
  return request({
    url: 'statistics/getRechargeRecords',
    method: 'get',
    params: {
      start_date,
      end_date,
      search,
      limit,
      rank_id,
      seller_id,
      operator_id,
      page,
    }
  })
}

/**
 * @description 员工等级
 */
export function getRank() {
  return request({
    url: 'member/rank',
    method: 'get',
    params: {}
  })
}

/**
 * @description 营销顾问
 */
export function getStaff() {
  return request({
    url: 'staff/staff',
    method: 'get',
    params: {}
  })
}

/**
 * @description 售卡统计
 * @params start_date
 * @params end_date
 * @params card_type
 * @params limit
 * @params page
 * @params min_count
 * @params max_count
 */
export function getCardSalesData({ start_date, end_date, limit, card_type, min_count, max_count, page }) {
  return request({
    url: 'statistics/getCardSalesData',
    method: 'get',
    params: {
      start_date,
      end_date,
      min_count,
      max_count,
      card_type,
      limit,
      page,
    }
  })
}


