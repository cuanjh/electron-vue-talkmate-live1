const layout = {
  namespaced: false,
  state: {
    isShow: false,
  },
  mutations: {
    SET_LAYOUTISSHOW: (state, flag) => {
      state.isShow = flag;
    },
  },
  actions: {},
  getters: {},
};

export default layout;
