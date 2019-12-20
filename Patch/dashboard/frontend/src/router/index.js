'use strict';

/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue';
import Router from 'vue-router';

// import Home from '@/views/Home';
// import User from '@/views/User';
// import NotFound from '@/components/404';

// Lazy load mode: load the corresponding components when the route is accessed
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
const InsuranceBase = resolve => require.ensure([], () => resolve(require('@/views/InsuranceBase')), 'lazy');
const Analytics = resolve => require.ensure([], () => resolve(require('@/views/Analytics')), 'lazy');
const FAQ = resolve => require.ensure([], () => resolve(require('@/views/FAQ')), 'lazy');
const Login = resolve => require.ensure([], () => resolve(require('@/views/Login')), 'lazy');
const SignUp = resolve => require.ensure([], () => resolve(require('@/views/SignUp')), 'lazy');
const User = resolve => require.ensure([], () => resolve(require('@/views/User')), 'lazy');
const UserDetail = resolve => require.ensure([], () => resolve(require('@/views/UserDetail')), 'lazy');
const UserPolicy = resolve => require.ensure([], () => resolve(require('@/views/UserPolicy')), 'lazy');
const UserSupport = resolve => require.ensure([], () => resolve(require('@/views/UserSupport')), 'lazy');
const UserQuestions = resolve => require.ensure([], () => resolve(require('@/views/UserQuestions')), 'lazy');
const UserGoogle = resolve => require.ensure([], () => resolve(require('@/views/UserGoogle')), 'lazy');
const NotFound = resolve => require.ensure([], () => resolve(require('@/views/404')), 'lazy');

const Admin = resolve => require.ensure([], () => resolve(require('@/views/Admin')), 'lazy');
const AdminUser = resolve => require.ensure([], () => resolve(require('@/views/AdminUser')), 'lazy');
const AdminCompany = resolve => require.ensure([], () => resolve(require('@/views/AdminCompany')), 'lazy');
const AdminCompanyAdd = resolve => require.ensure([], () => resolve(require('@/views/AdminCompanyAdd')), 'lazy');
const AdminCompanyEdit = resolve => require.ensure([], () => resolve(require('@/views/AdminCompanyEdit')), 'lazy');
const AdminInsurance = resolve => require.ensure([], () => resolve(require('@/views/AdminInsurance')), 'lazy');
const AdminInsuranceAdd = resolve => require.ensure([], () => resolve(require('@/views/AdminInsuranceAdd')), 'lazy');
const AdminInsuranceEdit = resolve => require.ensure([], () => resolve(require('@/views/AdminInsuranceEdit')), 'lazy');

// const Test = resolve => require.ensure([], () => resolve(require('@/views/Test')), 'lazy');

Vue.use(Router);

let router = new Router({
  // mode: 'history',
  // base: '/dashboard/src/dist/',
  // linkActiveClass: 'is-active',
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
    // {
    //   path: '/insurance',
    //   name: 'insurance',
    //   component: Insurance,
    //   children: [
    //     {
    //       path: '/insurance/picc',
    //       name: 'insurancePICC',
    //       component: InsurancePICC
    //     },
    //     {
    //       path: '/insurance/pingan',
    //       name: 'insurancePingAn',
    //       component: InsurancePingAn
    //     }
    //   ]
    //   // meta: { auth: true },
    //   // beforeEnter: (to, from, next) => {
    //   //   console.log('[R2]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
    //   //   next();
    //   // }
    // },
    {
      path: '/insurance',
      name: 'insurance',
      component: InsuranceBase
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
          path: '/account/user/policy',
          name: 'userPolicy',
          component: UserPolicy,
          meta: { auth: true }
        },
        {
          path: '/account/user/support',
          name: 'userSupport',
          component: UserSupport,
          meta: { auth: true }
        },
        {
          path: '/account/user/questions',
          name: 'userQuestions',
          component: UserQuestions,
          meta: { auth: true }
        },
        {
          path: '/account/user/google/:cmd',
          name: 'userGoogle',
          component: UserGoogle,
          // props: { cmd: 'set' },
          props: true,
          meta: { auth: true }
        }
      ]
      // beforeEnter: (to, from, next) => {
      //   console.log('[R7]beforeEnter: (%s) => (%s)', from.fullPath, to.fullPath);
      //   next();
      // }
    },

    {
      path: '/admin',
      name: '',
      redirect: '/admin/user'
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: '/admin/user',
          name: 'adminUser',
          component: AdminUser
        },
        {
          path: '/admin/company',
          name: 'adminCompany',
          component: AdminCompany
        },
        {
          path: '/admin/company/add',
          name: 'adminCompanyAdd',
          component: AdminCompanyAdd
        },
        {
          path: '/admin/company/edit',
          name: 'adminCompanyEdit',
          component: AdminCompanyEdit,
          props: (route) => ({ name: route.query.name })
        },
        {
          path: '/admin/insurance',
          name: 'adminInsurance',
          component: AdminInsurance
        },
        {
          path: '/admin/insurance/add',
          name: 'adminInsuranceAdd',
          component: AdminInsuranceAdd
        },
        {
          path: '/admin/insurance/edit',
          name: 'adminInsuranceEdit',
          component: AdminInsuranceEdit,
          props: (route) => ({
            method: route.query.method,
            company: route.query.company,
            category: route.query.category,
            title: route.query.title,
            id: route.query.id
          })
        }
      ]
    }
  ]
});

import utils from '../common/utils';

const auth = {
  checkLogin: () => {
    return (utils.storage.cookie.get('login_token') !== null && utils.storage.cookie.get('login_account') !== null && utils.storage.cookie.get('login_id') !== null && utils.storage.cookie.get('login_token') !== 'undefined' && utils.storage.cookie.get('login_account') !== 'undefined' && utils.storage.cookie.get('login_id') !== 'undefined');
  }
};

router.beforeEach((to, from, next) => {
  console.log('[G]beforeEach (%s) => (%s)', from.fullPath, to.fullPath);

  if (to.matched.some(data => data.meta.auth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.checkLogin()) {
      setTimeout(() => { // fix active index issue for jump
        // router.push('login');
        next({
          path: '/login'
          // query: { redirect: to.fullPath }
        });
      }, 1);
      next(); // then auth page can twinkle, but we can fix active index issue
    } else {
      next();
    }
  } else {
    next();
  }
  if (to.path.startsWith('/login')) {
  } else {
  }
});

router.beforeResolve((to, from, next) => {
  console.log('[G]beforeResolve: (%s) => (%s)', from.fullPath, to.fullPath);
  next();
});

router.afterEach((to, from) => {
  console.log('[G]afterEach: (%s) => (%s)', from.fullPath, to.fullPath);
});

export default router;
