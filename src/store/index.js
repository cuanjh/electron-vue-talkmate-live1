import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import user from './modules/user';
import live from './modules/live';
import layout from './modules/layout';
import getters from './getters';

Vue.use(Vuex);

const vuexLocal = new VuexPersist({
  storage: window.localStorage,
  modules: ['user', 'live', 'layout'],
});

export default new Vuex.Store({
  modules: {
    user,
    live,
    layout,
  },
  plugins: [vuexLocal.plugin],
  getters,
});
