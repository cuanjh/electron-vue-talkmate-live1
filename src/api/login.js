import request from '../utils/request';
import urls from './urls';

// 获取手机验证码
export const getLangs = (data) => {
  const res = request({
    url: urls.langListUrl,
    method: 'get',
    data,
  });
  return res;
};

// 获取手机验证码
export const getSendSmsCode = (data) => {
  const res = request({
    url: urls.sendCodeUrl,
    method: 'get',
    data,
  });
  return res;
};

// 用户快速登录
export const userLogin = (data) => {
  const res = request({
    url: urls.userLoginUrl,
    method: 'get',
    data,
  });
  return res;
};

// 用户退出
export const userLogout = (data) => {
  const res = request({
    url: urls.userLogoutUrl,
    method: 'get',
    data,
  });
  return res;
};

// 获取用户信息
export const getUserInfo = (data) => {
  const res = request({
    url: urls.userInfoUrl,
    method: 'get',
    data,
  });
  return res;
};

// 获取教师认证信息
export const getTeacherInfo = (data) => {
  const res = request({
    url: urls.teacherInfoUrl,
    method: 'post',
    data,
  });
  return res;
};
