// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest
} from '@/libs/axios';


// 获取订单列表 多条件
export const getSalveOrderList = (params) => {
  return postRequest('/orderSonList', params)
}

// 退款功能
export const orderRefund = (params) => {
  return postRequest('/refund', params)
}

