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
      user: 'black',
      company: {
        list: 'black',
        add: 'black',
        edit: 'black'
      },
      insurance: {
        list: 'black',
        add: 'black',
        edit: 'black'
      },
      setting: 'black',
      contract: 'red'
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