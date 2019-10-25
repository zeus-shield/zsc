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
const Insurance = resolve => require.ensure([], () => resolve(require('@/views/Insurance')), 'lazy');
const Analytics = resolve => require.ensure([], () => resolve(require('@/views/Analytics')), 'lazy');
const FAQ = resolve => require.ensure([], () => resolve(require('@/views/FAQ')), 'lazy');
const Login = resolve => require.ensure([], () => resolve(require('@/views/Login')), 'lazy');
const SignUp = resolve => require.ensure([], () => resolve(require('@/views/SignUp')), 'lazy');
const User = resolve => require.ensure([], () => resolve(require('@/views/User')), 'lazy');
const UserDetail = resolve => require.ensure([], () => resolve(require('@/views/UserDetail')), 'lazy');
const UserSupport = resolve => require.ensure([], () => resolve(require('@/views/UserSupport')), 'lazy');
const UserQuestions = resolve => require.ensure([], () => resolve(require('@/views/UserQuestions')), 'lazy');
const UserGoogle = resolve => require.ensure([], () => resolve(require('@/views/UserGoogle')), 'lazy');
const NotFound = resolve => require.ensure([], () => resolve(require('@/components/404')), 'lazy');
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
    // {
    //   path: '/insurance',
    //   name: '',
    //   redirect: '/insurance/picc'
    // },
    {
      path: '/account',
      name: 'account',
      redirect: '/account/user'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
      // beforeEnter: (to, from, next) => {
      //   console.log('[R1]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },
    {
      path: '/insurance',
      name: 'insurance',
      component: Insurance,
      children: [
      ]
    },
    {
      path: '/insurance',
      name: 'insurance',
      component: Insurance
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics
      // meta: { auth: true },
      // beforeEnter: (to, from, next) => {
      //   console.log('[R3]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
      // meta: { auth: true },
      // beforeEnter: (to, from, next) => {
      //   console.log('[R4]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
      // beforeEnter: (to, from, next) => {
      //   console.log('[R5]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
      // beforeEnter: (to, from, next) => {
      //   console.log('[R6]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },
    {
      path: '/account/user',
      name: 'user',
      component: User,
      meta: { auth: true },
      children: [
        {
          path: '/account/user',
          name: 'userDetail',
          component: UserDetail,
          meta: { auth: true }
        },
        {
          path: '/account/user/support',
          name: 'userSupport',
          component: UserSupport,
          meta: { auth: true }
        },
      ]
    },

    {
      path: '/admin',
      name: '',
      redirect: '/admin/user'
    },
  ]
});

export default router;
