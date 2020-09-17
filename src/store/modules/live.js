import { getTeacherInfo, getModuleList } from '@/api/live';

const live = {
  namespaced: false,
  state: {
    teacherInfo: null,
    moduleList: [],
    curLiveCourse: null,
  },
  mutations: {
    SET_TEACHERINFO: (state, teacherInfo) => {
      state.teacherInfo = teacherInfo;
    },
    SET_MODULELIST: (state, list) => {
      state.moduleList = list;
    },
    SET_CURLIVECOURSE: (state, course) => {
      state.curLiveCourse = course;
    },
  },
  actions: {
    // 获取用户信息
    GetTeacherInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTeacherInfo(params).then((response) => {
          commit('SET_TEACHERINFO', response.userInfo);
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 获取专辑列表
    GetModuleList({ commit }, params) {
      return new Promise((reslove, reject) => {
        getModuleList(params).then((response) => {
          commit('SET_MODULELIST', response.data);
          reslove(response);
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
  getters: {},
};

export default live;
