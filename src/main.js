// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from '@/router'
import store from '@/store' // api: https://github.com/vuejs/vuex

import '@/icons' // api: http://www.iconfont.cn/

// svg图片读取
import Icon from 'vue-svg-icon/Icon.vue'

import '@/element-ui'//  自定义引入，为了达到最小打包状态
import 'element-ui/lib/theme-chalk/index.css'
import VueCookie from 'vue-cookie'
import '@/assets/scss/index.scss'

import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios

// import VueResource from 'vue-resource'
// import '@/mock' // 引入mock

import { isAuth } from '@/utils'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 打印插件
import 'print-js'

Vue.use(VueQuillEditor)
// Vue.use(VueResource) //  用express，模拟本地数据
Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法

// svg图片读取
Vue.component('icon', Icon)

Vue.use(VueCookie)
let vm = new Vue({
  el: '#app',
  data () {
    return {
    }
  },
  router,
  store
})

Vue.use({
  vm
})
