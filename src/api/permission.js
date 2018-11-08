// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios';

// 获取全部权限数据
export const getAllPermissionList = (params) => {
  return getRequest('/permission/getAllList', params)
}
// 添加权限
export const addPermission = (params) => {
  return postRequest('/permission/add', params)
}
// 编辑权限
export const editPermission = (params) => {
  return postRequest('/permission/edit', params)
}
// 删除权限
export const deletePermission = (ids, params) => {
  return deleteRequest(`/permission/delByIds/${ids}`, params)
}
// 搜索权限
export const searchPermission = (params) => {
  return getRequest('/permission/search', params)
}