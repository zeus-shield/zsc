// import shop from '../../apis/shop'

// initial state
const state = () => {
  return {
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
      company: {
      },
      insurance: {
        list: 'red',
        add: 'blue',
        edit: 'green'
      }
    }
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