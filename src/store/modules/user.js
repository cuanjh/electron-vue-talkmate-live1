import {
  userLogin,
  // userLogout,
  getTeacherInfo,
} from '@/api/login';
import config from '@/utils/config';
import cookie from '@/utils/cookie';

const Store = window.require('electron-store');

const store = new Store();

const user = {
  namespaced: false,
  state: {
    userInfo: null,
    userId: '',
    deviceId: '',
    verify: '',
    phonenumber: '',
    photo: '',
    verifyStatus: -1,
  },
  mutations: {
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_DEVICEID: (state, deviceId) => {
      state.deviceId = deviceId;
    },
    SET_VERIFY: (state, verify) => {
      state.verify = verify;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_PHONENUMBER: (state, phone) => {
      state.phonenumber = phone;
    },
    SET_PHOTO: (state, photo) => {
      state.photo = photo.indexOf('http') > -1 ? photo : config.uploadDomain + photo;
    },
    SET_VERIFYSTATUS: (state, status) => {
      state.verifyStatus = status;
    },
  },
  actions: {
    // 登录
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        userLogin(params)
          .then((response) => {
            if (response.result) {
              cookie.setCookie('user_id', response.result.user_id);
              cookie.setCookie('verify', response.result.verify);
              store.set('isLogin', true);
              commit('SET_USERID', response.result.user_id);
              commit('SET_VERIFY', response.result.verify);
              resolve(response);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    GetUserInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTeacherInfo(params)
          .then((response) => {
            commit('SET_USERINFO', response.data);
            commit('SET_PHONENUMBER', response.data.phonenumber);
            commit('SET_PHOTO', response.data.photo);
            commit('SET_VERIFYSTATUS', response.data.status);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve) => {
        cookie.delCookie('user_id');
        cookie.delCookie('verify');
        store.set('isLogin', false);
        commit('SET_USERID', '');
        commit('SET_VERIFY', '');
        resolve();
        // userLogout()
        //   .then(() => {
        //     cookie.delCookie('user_id');
        //     cookie.delCookie('verify');
        //     resolve();
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        cookie.delCookie('user_id');
        cookie.delCookie('verify');
        store.set('isLogin', false);
        commit('SET_USERID', '');
        commit('SET_VERIFY', '');
        resolve();
      });
    },
  },
  getters: {},
};

export default user;
