'use strict';

import Vue from 'vue';
import VueQriously from 'vue-qriously';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import BootstrapVue from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.min.css'; // conflict with element
// import 'bootstrap-vue/dist/bootstrap-vue.css';

import Meta from 'vue-meta';
// swiper
// import VueAwesomeSwiper from 'vue-awesome-swiper';

// iconfont can be imported in 'index.tpl'
// if we use svg only, 'iconfont.css' is not necessary.
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';
import router from '@/router';
import store from '@/store';
// import app from './components/navigation/navmenu/navmenu';
import App from '@/App';

Vue.use(VueQriously);
// import locale from 'element-ui/lib/locale/lang/en';
// Vue.use(ElementUI, { locale });
Vue.use(ElementUI);
// Vue.use(BootstrapVue);

// Vue.use(Meta, {
//   keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
//   attribute: 'data-vue-meta', // the attribute name vue-meta adds to the tags it observes
//   ssrAttribute: 'data-vue-meta-server-rendered', // the attribute name that lets vue-meta know that meta info has already been server-rendered
//   tagIDKeyName: 'vmid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
// });

Vue.use(Meta);

// Vue.use(VueAwesomeSwiper, /* { default global options } */);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
