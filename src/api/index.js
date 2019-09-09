// 首页
import request from '@/utils/request'

/**
 * @description 统计数据
 */
export function indexData({ start_date, end_date }) {
  return request({
    url: 'statistics/indexData',
    method: 'get',
    params: {
      start_date,
      end_date,
    }
  })
}

/**
 * @description 图表数据
 */
export function indexGraphData() {
  return request({
    url: 'statistics/indexGraphData',
    method: 'get',
    params: {}
  })
}

/**
 * @description 图片上传
 */
export function upload(imageurl) {
  return request({
    url: 'upload/images',
    method: 'post',
    params: {
      imageurl
    }
  })
}

/**
 * @description 图片上传API
 */
export const uploadUrl = process.env.BASE_API + 'upload/images';