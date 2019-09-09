import {getBasicInfo} from '@/api/basicInfo'

const basicInfo = {
  state: {
    store: {},
    user: {},
  },

  mutations: {
    SET_STORE: (state, store) => {
      state.store = store
    },
    SET_USER: (state, user) => {
      state.user = user
    },
  },

  actions: {
    // 获取门店基本信息
    getBasicInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getBasicInfo().then(response => {
          if (!response.success.data) {
            reject('error')
          }
          const data = response.success.data;
          console.log('获取门店基本信息', data);
          commit('SET_STORE', data.store);
          commit('SET_USER', data.user);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
};

export default basicInfo
