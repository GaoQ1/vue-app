/**
 * Created by GaoQ on 2017/7/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import leaflet from './modules/leaflet'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    menu,
    leaflet
  },
  strict: debug
})
