// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest
} from '@/libs/axios';


// 获取主用户申请补发列表 多条件
export const getUserApplyReplacement = (params) => {
  return postRequest('/findReplacement', params)
}

export const checkout = (params) => {
  return postRequest('/checkout', params)
}
