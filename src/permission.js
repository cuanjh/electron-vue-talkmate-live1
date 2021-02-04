import { Message } from 'element-ui';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

import router from './router';
import store from './store';

const Store = window.require('electron-store');
const { ipcRenderer } = window.require('electron');

const eStore = new Store();

const whiteList = ['/login']; // 不重定向白名单

const logout = (next, err) => {
  store.dispatch('FedLogOut').then(() => {
    Message.error(err || 'Verification failed, please login again');
    next({ path: '/' });
  });
};

router.beforeEach((to, from, next) => {
  NProgress.start();
  const isLogin = eStore.get('isLogin');
  if (isLogin && store.getters.userId) {
    if (store.getters.verifyStatus === -1 || to.path === '/' || to.path === '/login') {
      store
        .dispatch('GetUserInfo', { user_id: store.getters.userId })
        .then(() => {
          // 拉取用户信息
          let path = '';
          const { role } = store.getters.userInfo;
          const roles = role.split(',');
          switch (store.getters.verifyStatus) {
            case 0:
              path = '/verify/edit';
              break;
            case 1:
            case 2:
              path = '/verify/detail';
              break;
            default:
              path = '/course/rili';
              if (roles.length === 1 && roles.includes('2')) {
                path = '/onduty/rili';
              }
              break;
          }
          next(path);
        })
        .catch((err) => {
          logout(next, err);
        });
    } else {
      next();
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    ipcRenderer.send('logout');
    next();
  } else {
    next('/login');
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
