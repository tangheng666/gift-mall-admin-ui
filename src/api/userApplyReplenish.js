// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest
} from '@/libs/axios';


// 获取主订单列表 多条件
export const getUserApplyReplacement = (params) => {
  return postRequest('/findReplacement', params)
}