import Mock from 'mockjs'
import util from '@/libs/util'

const noticeList = []
const count = 13;

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'

for (let i = 0; i < count; i++) {
  noticeList.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content: baseContent,
    createTime: '@datetime',
    topping:false,
  }))
}



export default {
  getNoticeList: config => {
    const {title, createDate, pageNumber = 1, pageSize = 20, sort } = util.param2Obj(config.url)

    let mockList = noticeList.filter(item => {
      if (title && item.title.indexOf(title) < 0) return false
      if(createDate && item.createTime !==createDate.replace("+"," ") ) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * pageNumber && index >= pageSize * (pageNumber - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  }
}
