// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest,
} from '@/libs/axios';


// 获取物流费用数据
export const getExpressFee = () => {
  return postRequest('/expressFeeBack')
}

export const updateFee = (params) => {
  return postRequest('/updateFee', params)
}