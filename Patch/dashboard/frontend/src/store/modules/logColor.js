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
    user: 'black',
    userAside: 'black',
    userDetail: 'black',
    userPolicy: 'black',
    userSupport: 'black',
    userQuestions: 'black',
    userGoogle: 'black',
    insurance: {
      base: 'yellow',
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
      }
    },
    notFound: 'red'
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