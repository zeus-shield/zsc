import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Meta from 'vue-meta';
import router from './router';
import store from './store';
import App from './App';

Vue.use(ElementUI);

Vue.use(Meta);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
