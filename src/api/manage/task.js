import request from '@/utils/request'

// 查询工单列表
export function listTask(query) {
  return request({
    url: '/manage/task/list',
    method: 'get',
    params: query
  })
}

// 查询工单详细
export function getTask(taskId) {
  return request({
    url: '/manage/task/' + taskId,
    method: 'get'
  })
}

// 新增工单
export function addTask(data) {
  return request({
    url: '/manage/task',
    method: 'post',
    data: data
  })
}

// 修改工单
export function updateTask(data) {
  return request({
    url: '/manage/task',
    method: 'put',
    data: data
  })
}

// 删除工单
export function delTask(taskId) {
  return request({
    url: '/manage/task/' + taskId,
    method: 'delete'
  })
}
