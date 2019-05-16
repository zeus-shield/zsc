import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import 'element-theme-default';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//router.afterEach(transition => {
//NProgress.done();
//});
new Vue({
  el: '#app',
  // template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')
