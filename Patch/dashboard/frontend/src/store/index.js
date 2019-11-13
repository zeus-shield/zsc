import Vue from 'vue';
import Vuex from 'vuex';

import logColor from './modules/logColor';
import lang from './modules/lang';
import device from './modules/device';

// import createLogger from '../plugins/logger'
// import createLogger from '../../../dist/logger'

// for 'export default {...}'
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
// import { getters } from './getters'
// import { mutations } from './mutations'
// for 'export const xxx = ...'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    logColor,
    lang,
    device
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : [],

  // Root level state/getters/mutations/actions
  state() {
    return {
      activeIndex: '1'
    };
  },
  getters,
  mutations,
  actions
});

// if (module.hot) {
//   // ? action ? mutation ????????
//   module.hot.accept(['./getters', './mutations', './actions'], () => {
//     // ????????

//     // for 'export default {...}'
//     // ?? babel 6 ?????????,?????? `.default`
//     // ?????
//     store.hotUpdate({
//       getters: require('./getters').default,
//       mutations: require('./mutations').default,
//       actions: require('./actions').default
//     });

//     // for 'export const xxx = {...}'
//     // store.hotUpdate({
//     //   getters: require('./getters').getters,
//     //   mutations: require('./mutations').mutations,
//     //   actions: require('./actions').actions
//     // })

//     // for 'export const xxx = ...'
//     // store.hotUpdate({
//     //   getters: require('./getters'),
//     //   mutations: require('./mutations'),
//     //   actions: require('./actions')
//     // })
//   });
// }

export default store;
