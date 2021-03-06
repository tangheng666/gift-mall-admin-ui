import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios';

// 获取全部角色数据
export const getAllRoleList = (params) => {
  return getRequest('/role/getAllList', params)
}
// 分页获取角色数据
export const getRoleList = (params) => {
  return getRequest('/role/getAllByPage', params)
}
// 添加角色
export const addRole = (params) => {
  return postRequest('/role/save', params)
}
// 编辑角色
export const editRole = (params) => {
  return postRequest('/role/edit', params)
}
// 设为或取消注册角色
export const setDefaultRole = (params) => {
  return postRequest('/role/setDefault', params)
}
// 分配角色权限
export const editRolePerm = (id, params) => {
  return postRequest(`/role/editRolePerm/${id}`, params)
}
// 删除角色
export const deleteRole = (ids, params) => {
  return deleteRequest(`/role/delAllByIds/${ids}`, params)
}