import Vue from 'vue';
import Vuex from 'vuex';

import logColor from './modules/logColor';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({});

export default store;
