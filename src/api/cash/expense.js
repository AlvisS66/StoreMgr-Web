// 收银管理 - 支出
import request from '@/utils/request'

/**
 * @description 支出列表
 * @params category_id 分类ID
 * @params user_id 员工ID
 * @params start_price
 * @params end_price
 * @params start_time
 * @params end_time
 * @params page_size
 */
export function getExpense({ category_id, user_id, start_price, end_price, start_time, end_time, page_size ,page}) {
  return request({
    url: `order/expense`,
    method: 'get',
    params: {
      category_id,
      user_id,
      start_price,
      end_price,
      start_time,
      end_time,
      page_size,
      page,
    },
  })
}

/**
 * @description 支出编辑时，获取分类和员工数据
 * @params member_user_id
 * @params item_list[][total_amount]
 * @params item_list[][num]
 * @params item_list[][item_id]
 * @params tem_list[0][staff_list][0][staff_user_id]
 * @params item_list[0][staff_list][0][is_appoint]
 */
export function getEditData({ member_user_id, item_list } = {}) {
  return request({
    url: `order/expense/editData`,
    method: 'get',
    params: {
      member_user_id,
      item_list,
    },
  })
}

/**
 * @description 删除支出记录
 */
export function delExpense(id) {
  return request({
    url: `order/expense/${id}`,
    method: 'delete',
    params: {},
  })
}

/**
 * @description 新增/编辑支出记录
 * @params id
 * @params staff_user_id
 * @params category_id
 * @params time
 * @params operator_id
 * @params remark
 * @params price
 * @params images
 */
export function editExpense({ id, staff_user_id, category_id, time, operator_id, remark, price, images }) {
  return request({
    url: `order/expense`,
    method: 'post',
    data: {
      id,
      staff_user_id,
      category_id,
      time,
      operator_id,
      remark,
      price,
      images,
    },
  })
}

