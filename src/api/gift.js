// 统一请求路径前缀在libs/axios.js中修改
import {
  postRequest,
} from '@/libs/axios';


// 获取全部礼品数据
export const getAllGiftData = (params) => {
  return postRequest('/goodsList', params)
}

// 添加礼品
export const addGift = (params) => {
  return postRequest('/addGoods', params)
}

// 编辑礼品
export const editGift = (params) => {
  return postRequest('/updateGoods', params)
}

// 删除礼品
export const deleteGift = (params) => {
  return postRequest('/delGoods', params)
}