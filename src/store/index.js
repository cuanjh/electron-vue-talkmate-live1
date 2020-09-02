import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import user from './modules/user';
import live from './modules/live';
import getters from './getters';

Vue.use(Vuex);

const vuexLocal = new VuexPersist({
  storage: window.localStorage,
  modules: ['user', 'live'],
});

export default new Vuex.Store({
  modules: {
    user,
    live,
  },
  plugins: [vuexLocal.plugin],
  getters,
});
