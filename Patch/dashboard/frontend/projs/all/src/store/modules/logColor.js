'use strict';

// initial state
const state = () => {
  return {
    app: 'black',
    header: 'black',
    footer: 'black',
    home: 'black',
    certificate: 'black',
    analytics: 'black',
    faq: 'black',
    login: 'black',
    signUp: 'black',
    user: {
      container: 'black',
      detail: 'black',
      google: 'black',
      policy: 'black',
      point: 'black',
      pc: {
        aside: 'black',
        support: 'black',
        questions: 'black'
      },
      mobile: {
        header: 'black',
        support: 'black',
        questions: 'black'
      }
    },
    insurance: {
      base: 'black',
      pingan: {
        brief: 'black',
        detail: 'black'
      },
      picc: {
        brief: 'black',
        detail: 'black'
      }
    },
    admin: {
      base: 'black',
      aside: 'black',
      sys: {
        user: 'black',
        company: 'black',
        product: {
          list: 'black',
          add: 'black',
          edit: 'black'
        },
        qa: 'black',
        press: 'black',
        setting: 'black'
      },
      core: {
        contract: 'black',
        user: 'black',
        userAssets: 'black',
        stat: 'black',
        wallet: 'black'
      }
    },
    notFound: 'black'
  };
};

// getters
const getters = {};

// mutations
const mutations = {};

// actions
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};