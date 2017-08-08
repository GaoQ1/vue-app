/**
 * Created by GaoQ on 2017/7/11.
 */
import Vue from 'vue'
import './assets/filter'
// import home from './container/home'
import app from './container/app'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

/**引入第三方样式**/
import 'normalize.css/normalize.css'
import 'leaflet/dist/leaflet.css'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(app)
})
