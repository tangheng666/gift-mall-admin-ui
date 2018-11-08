// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest,
} from '@/libs/axios';


// 获取所有加款数据
export const getAllAdditionData = (params) => {
  return postRequest('/userApplyList', params)
}

// 处理加款申请
export const dealAddition = (params) => {
  return postRequest('/dealApply', params)
}