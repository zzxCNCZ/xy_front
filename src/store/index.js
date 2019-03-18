import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import templates from './modules/templates'
import config from './modules/config'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    templates,
    config
  },
  strict: process.env.NODE_ENV !== 'production'
})
