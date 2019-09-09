import request from '@/utils/request'
const qs = require('qs');

// 员工设置

/**
 * @description 员工列表
 * @params search
 * @params page
 * @params limit
 */

export function staffList(params) {
  return request({
    url: 'staff/staff',
    method: 'get',
    params
  })
}

/**
 * @description 新增员工
 * @params realname
 * @params password
 * @params mobile
 * @params avatar_url
 * @params position_id
 * @params entry_time
 * @params workcard
 * @params signature
 */

export function createStaff(data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: 'staff/staff',
    method: 'post',
    data
  })
}

/**
 * @description 批量删除
 * @params id
 */

export function delStaff(ids) {
  return request({
    url: `staff/staff/${ids}`,
    method: 'delete',
  })
}

/**
 * @description 更新员工
 * @params realname
 * @params password
 * @params mobile
 * @params avatar_url
 * @params position_id
 * @params entry_time
 * @params workcard
 * @params signature
 */

export function editStaff(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `staff/staff/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 获取门店职位
 * @params 
 */

export function positionList(params) {
  return request({
    url: 'staff/position',
    method: 'get',
    params
  })
}

/**
 * @description 获取职位员工
 * @params 
 */

export function positionStaffList(id) {
  return request({
    url: `staff/position/${id}`,
    method: 'get',
  })
}

/**
 * @description 新增职位
 * @params name
 */

export function createPosition(data) {
  return request({
    url: 'staff/position',
    method: 'post',
    data
  })
}

/**
 * @description 更新职位
 * @params name
 */

export function editPosition(id, data) {
  return request({
    url: `staff/position/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 职位删除
 * @params id
 */

export function delPosition(id) {
  return request({
    url: `staff/position/${id}`,
    method: 'delete',
  })
}

/**
 * @description 获取角色组
 * @params 
 */

export function groupList() {
  return request({
    url: 'permission/group',
    method: 'get',
  })
}


/**
 * @description 新增角色组
 * @params name
 */

export function createGroup(data) {
  return request({
    url: 'permission/group',
    method: 'post',
    data
  })
}

/**
 * @description 更新角色组
 * @params name
 */

export function editGroup(id, data) {
  return request({
    url: `permission/group/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 角色组删除
 * @params id
 */

export function delGroup(id) {
  return request({
    url: `permission/group/${id}`,
    method: 'delete',
  })
}

/**
 * @description 新增角色
 * @params name
 */

export function createRole(data) {
  return request({
    url: 'permission/role',
    method: 'post',
    data
  })
}

/**
 * @description 更新角色
 * @params name
 * @params group_id
 * @params remark
 */

export function editRole(id, data) {
  return request({
    url: `permission/role/${id}`,
    method: 'patch',
    data
  })
}

/**
 * @description 角色删除
 * @params id
 */

export function delRole(id) {
  return request({
    url: `permission/role/${id}`,
    method: 'delete',
  })
}

/**
 * @description 获取角色员工
 * @params 
 */

export function roleStaffList(id) {
  return request({
    url: `permission/role/${id}`,
    method: 'get',
  })
}

/**
 * @description 添加职位成员
 * @params staff_ids[]=1 staff_ids[]=2
 */

export function createPositionStaffs(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `staff/attachPositionStaffs/${id}`,
    method: 'post',
    data
  })
}

/**
 * @description 删除职位成员
 * @params staff_ids[]=1 staff_ids[]=2
 */

export function delPositionStaffs(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `staff/detachPositionStaffs/${id}`,
    method: 'post',
    data
  })
}

/**
 * @description 添加角色成员
 * @params staff_ids[]=1 staff_ids[]=2
 */

export function createRoleStaffs(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `permission/attachRoleStaffs/${id}`,
    method: 'post',
    data
  })
}

/**
 * @description 删除角色成员
 * @params staff_ids[]=1 staff_ids[]=2
 */

export function delRoleStaffs(id, data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: `permission/detachRoleStaffs/${id}`,
    method: 'post',
    data
  })
}



/**
 * @description 获取单店菜单
 * @params 
 */

export function permissionMenus() {
  return request({
    url: 'permission/menus',
    method: 'get',
  })
}

/**
 * @description 获取用户拥有的权限
 * @params 
 */

export function rolePermissions(id) {
  return request({
    url: `permission/getRolePermissions/${id}`,
    method: 'get',
  })
}

/**
 * @description 添加角色成员
 * @params role_id
 * @params menu_ids[]=1 menu_ids[]=1
 */

export function syncRoleMenuPermissions(data) {
  data = qs.stringify(
    data, {
      arrayFormat: "brackets"
      // arrayFormat: "indices"
    });
  return request({
    url: 'permission/syncRoleMenuPermissions',
    method: 'post',
    data
  })
}
