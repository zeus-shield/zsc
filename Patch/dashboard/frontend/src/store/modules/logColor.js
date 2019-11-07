// import shop from '../../apis/shop'

// initial state
const state = () => {
  return {
    app: 'black',
    header: 'black',
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