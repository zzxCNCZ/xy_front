import Mock from 'mockjs'
import * as user from './module/user'
import * as common from './module/common'
import merge from 'lodash/merge'
// 获取 mock.Random 对象
const Random = Mock.Random
// mock一组数据
const produceNewsData = function () {
  let articles = []
  for (let i = 0; i < 100; i++) {
    let newArticleObject = {
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    }
    articles.push(newArticleObject)
  }

  return {
    articles: articles
  }
}

fnCreate(user, false) // 管理员管理
fnCreate(common, false) // 公共
/**
 * 创建mock模拟数据
 * @param {*} mods 模块集
 * @param {*} isOpen 是否开启?
 */
function fnCreate (mods, isOpen = true) {
  if (isOpen) {
    for (var key in mods) {
      var mod = mods[key]() || {}
      if (mod.isOpen !== false) {
        // 添加默认[mock]属性, 方便调试
        mod.data = merge({ 'mock': true }, mod.data)

        // 控制台输出信息
        console.log('\n')
        console.log(' url: ', mod.url)
        console.log('type: ', mod.type)
        console.log('data: ', mod.data)
        console.log('\n')

        // 2种url拦截方式
        Mock.mock(mod.url, mod.type, mod.data)
        // Mock.mock(new RegExp(mod.url, 'g'), mod.type, mod.data)
      }
    }
  }
}
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/news/index', 'post', produceNewsData)
