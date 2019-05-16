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

import "./assets/style/index.css"; //引入CSS
import "./assets/style/colorbox.css"; //引入CSS
import "./assets/style/bootstrap.css"; //引入CSS
import "./assets/style/font-awesome.css"; //引入CSS
import "./assets/style/style.css"; //引入CSS



import Meta from 'vue-meta'
import MetaInfo from 'vue-meta-info'




Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta, {
  keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-vue-meta', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-vue-meta-server-rendered', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'vmid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
})

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path != '/login') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
  next();
})

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


