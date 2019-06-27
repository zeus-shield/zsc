import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router';
import App from './App';

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
