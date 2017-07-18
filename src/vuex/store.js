import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

// 应用初始状态
const state = {
  count: 10,
  // TODO: 放置初始状态
  isAuth: false, // 是否登录
  user: {}, // 当前登录用户信息
  sessionId: '' // ajax token
};

// 定义所需的 mutations
const mutations = {
  INCREMENT(state) {
    state.count++;
  },
  DECREMENT(state) {
    state.count--;
  },
  isAuth (state, status) {
    state.isAuth = status;
  },
  sessionId (state, sessionId) {
    state.sessionId = sessionId;
  },
  user(state, user) {
    state.user = user;
  }
};

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
});
