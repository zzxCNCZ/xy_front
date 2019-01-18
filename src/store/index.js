import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import templates from './modules/templates'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    templates
  },
  strict: process.env.NODE_ENV !== 'production'
})
