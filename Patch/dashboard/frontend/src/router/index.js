
import Vue from 'vue';
import Router from 'vue-router';


// Method 3
const Home = resolve => require.ensure([], () => resolve(require('@/views/Home')), 'lazy');
const Certificate = resolve => require.ensure([], () => resolve(require('@/views/Certificate')), 'lazy');
const Analytics = resolve => require.ensure([], () => resolve(require('@/views/Analytics')), 'lazy');
const FAQ = resolve => require.ensure([], () => resolve(require('@/views/FAQ')), 'lazy');
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '*',
      component: NotFound
    },
    {
      path: '/',
      name: '',
      redirect: '/home'
    }
    }
    }
  ]
});

export default router;
