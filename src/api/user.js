// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, deleteRequest} from '@/libs/axios';


// 获取用户数据 多条件
export const getUserListData = (params) => {
  return postRequest('/usrAccountList', params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
  return getRequest('/usrAccountList', params)
}
// 添加用户
export const addUser = (params) => {
  return postRequest('/user/admin/add', params)
}
// 编辑用户
export const editUser = (params) => {
  return postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
  return postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
  return postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
  return deleteRequest(`/user/delByIds/${ids}`, params)
}

// 用户加款
export const charge = (params) => {
  return postRequest('/charge', params)
}

// 重置密码
export const restPwd = (params) => {
  return postRequest('/resetPd', params)
}