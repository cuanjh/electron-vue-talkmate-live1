import axios from 'axios';
import { Message } from 'element-ui';
// import store from '../store';
import { showLoading, closeLoading } from './loading';
import handleParams from './generateSign';
import Config from './config';

axios.defaults.withCredentials = false;

// 创建axios实例
const service = axios.create({
  baseURL: Config.apiDomain, // api的base_url
  timeout: 15000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use((config) => {
  showLoading();
  const c = config;
  const strParams = handleParams(c.data, c.method);
  c.url += strParams;
  return c;
}, (error) => {
  closeLoading();
  // Do something with request error
  Message({
    showClose: true,
    message: error,
    type: 'error',
  });
  return Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
  (response) => {
    closeLoading();
    // /**
    //   * code为非20000是抛错 可结合自己业务进行修改
    // */
    // const res = response.data;
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000,
    //   });

    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning',
    //     }).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         window.location.reload(); // 为了重新实例化vue-router对象 避免bug
    //       });
    //     });
    //   }
    //   return Promise.reject(new Error('error'));
    // }
    // return response.data;
    const rData = response.data;
    if (rData.success) {
      return rData;
    }
    Message({
      showClose: true,
      message: rData.msg ? rData.msg : '操作非法',
      type: 'error',
      onClose: () => {},
    });
    return Promise.reject(rData.msg);
  }, (error) => {
    closeLoading();
    // console.log(`err ${error}`); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
