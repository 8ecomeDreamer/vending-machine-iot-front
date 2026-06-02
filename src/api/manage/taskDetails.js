import request from '@/utils/request'

// 查询工单详情列表
export function listTaskDetails(query) {
  return request({
    url: '/manage/taskDetails/list',
    method: 'get',
    params: query
  })
}

// 查询工单详情详细
export function getTaskDetails(detailsId) {
  return request({
    url: '/manage/taskDetails/' + detailsId,
    method: 'get'
  })
}

// 新增工单详情
export function addTaskDetails(data) {
  return request({
    url: '/manage/taskDetails',
    method: 'post',
    data: data
  })
}

// 修改工单详情
export function updateTaskDetails(data) {
  return request({
    url: '/manage/taskDetails',
    method: 'put',
    data: data
  })
}

// 删除工单详情
export function delTaskDetails(detailsId) {
  return request({
    url: '/manage/taskDetails/' + detailsId,
    method: 'delete'
  })
}
