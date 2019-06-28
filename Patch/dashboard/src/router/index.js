
import Vue from 'vue';
import Router from 'vue-router';

// Method 3
const Home = resolve => require.ensure([], () => resolve(require('@/views/Home')), 'lazy');
Vue.use(Router);

let router = new Router({});

export default router;
