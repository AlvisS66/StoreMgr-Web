const qs = require('qs');
import request from '@/utils/request'

// 会员管理

/**
 * @description 会员管理列表
 * @params page
 * @params limit
 * @params search
 * @params register_start_time  注册起始时间
 * @params register_end_time  注册截止时间
 * @params rank_id	
 * @params point_min  积分下限
 * @params point_max  积分上限
 * @params active_end_time  到店时间
 * @params active_start_time  到店时间
 * @params seller_id 销售员
 */

export function memberList(params) {
  return request({
    url: "member/member",
    method: 'get',
    params,
  })
}

/**
 * @description 等级列表
 * @params 
 */

export function rankList() {
  return request({
    url: "member/rank",
    method: 'get',
  })
}

/**
 * @description 营销顾问列表
 * @params 
 */

export function staffsList(params) {
  return request({
    url: "member/getStaffs",
    method: 'get',
    params
  })
}

/**
 * @description 支付方式列表
 * @params 
 */

export function payWay(params) {
  return request({
    url: "order/payway",
    method: 'get',
    params
  })
}

/**
 * @description 充值
 * @params member_user_id 用户ID
 * @params amount 充值金额
 * @params pay_id 支付方式ID
 * @params staff_user_id 支付方式ID
 */

export function doRecharge(data) {
  return request({
    url: "order/recharge/doRecharge",
    method: 'post',
    data,
  })
}

/**
 * @description 获取赠送金额
 * @params amount 充值金额
 */

export function getDonation(params) {
  return request({
    url: "order/recharge/getDonation",
    method: 'get',
    params
  })
}

/**
 * @description 编辑会员保存
 * @params avatar_url
 * @params card_no
 * @params rank_id
 * @params realname
 * @params mobile
 * @params created_at
 * @params staffs
 * @params gender
 * @params remark
 * @params birthday
 * @params password
 * @params weight
 * @params address
 */

export function editMember(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `member/member/${id}`,
    method: 'patch',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data

  })
}

/**
 * @description 新增会员保存
 * @params avatar_url
 * @params card_no
 * @params rank_id
 * @params realname
 * @params mobile
 * @params created_at
 * @params staffs
 * @params gender
 * @params remark
 * @params birthday
 * @params password
 * @params weight
 * @params address
 */

// export function createMember(data) {
//   return request({
//     url: "member/member",
//     method: 'post',
//     data
//   })
// }

export function createMember(data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: "member/member",
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}




/**
 * @description 删除会员
 * @params 
 */

export function deleteMember(ids) {
  return request({
    url: `member/member/${ids}`,
    method: 'delete',
  })
}

/**
 * @description 分配会员
 * @params staff_ids 
 */

export function updateMemberOwners(params) {
  return request({
    url: "member/updateMemberOwners",
    method: 'patch',
    params
  })
}

/**
 * @description 消费明细
 * @params member_user_id
 */

export function consumingRecords(params) {
  return request({
    url: "member/getConsumingRecords",
    method: 'get',
    params
  })
}

/**
 * @description 余额明细
 * @params member_user_id
 */

export function accountRecords(params) {
  return request({
    url: "member/getAccountRecords",
    method: 'get',
    params
  })
}

/**
 * @description 次卡明细
 * @params member_user_id
 */

export function tCardRecords(params) {
  return request({
    url: "member/getTCardRecords",
    method: 'get',
    params
  })
}

/**
 * @description 储值卡明细
 * @params member_user_id
 */

export function ppCardRecords(params) {
  return request({
    url: "member/getPpCardRecords",
    method: 'get',
    params
  })
}

/**
 * @description 预存查询
 * @params member_user_id
 */

export function advanceRecords(params) {
  return request({
    url: "member/getAdvanceRecords",
    method: 'get',
    params
  })
}

/**
 * @description 选择技师/营销顾问更新提成数据
 * @params recharge_amount
 * @params staff_list[0][id]
 * @params staff_list[0][is_appoint]
 * @params staff_list[0][staff_user_id]
 */
export function calculateRatio({
  recharge_amount,
  staff_list
}) {
  return request({
    url: "order/staff/calculateRatio",
    method: 'post',
    data: {
      staff_list,
      recharge_amount,
    }
  })
}

// --------------------------------------------------

// 分析

/**
 * @description 睡眠会员
 * @params type
 * @params search
 * @params rank_id
 * @params sleep_days
 * @params tcard_days	
 * @params ppcard_days	
 * @params balance 
 */

export function analysisList(params) {
  return request({
    url: "member/analysis",
    method: 'get',
    params
  })
}
