// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest
} from '@/libs/axios';

// 获取公告数据 多条件
export const getNoticeList = (params) => {
  return postRequest('/noticeListBack', params)
}

// 添加公告
export const addNotice = (params) => {
  return postRequest('/publishNotice', params)
}
// 编辑公告
export const editNotice = (params) => {
  return postRequest('/updateNotice', params)
}
