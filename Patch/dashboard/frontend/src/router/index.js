/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue';
import Router from 'vue-router';

// import Home from '@/views/Home';
// import User from '@/views/User';
// import NotFound from '@/components/404';

// 懒加载方式，当路由被访问的时候才加载对应组件
// Method 1
// const Home = () => import(/* webpackChunkName: "lazy" */ '@/views/Home');
// const User = () => import(/* webpackChunkName: "lazy" */ '@/views/User');
// const NotFound = () => import(/* webpackChunkName: "lazy" */ '@/components/404');

// Method 2
// const Home = resolve => require(['@/views/Home'], resolve);
// const User = resolve => require(['@/views/User'], resolve);
// const NotFound = resolve => require(['@/components/404'], resolve);

// Method 3
const Home = resolve => require.ensure([], () => resolve(require('@/views/Home')), 'lazy');
const Certificate = resolve => require.ensure([], () => resolve(require('@/views/Certificate')), 'lazy');
const Analytics = resolve => require.ensure([], () => resolve(require('@/views/Analytics')), 'lazy');
const FAQ = resolve => require.ensure([], () => resolve(require('@/views/FAQ')), 'lazy');
const Login = resolve => require.ensure([], () => resolve(require('@/views/Login')), 'lazy');
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
    },
    {
      path: '/account',
      name: 'account',
      redirect: '/account/user'
    }
    }
    }
  ]
});

export default router;
