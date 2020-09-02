import request from '../utils/request';
import urls from './urls';

// 获取教师认证信息
export const getTeacherInfo = (data) => {
  const res = request({
    url: urls.teacherInfoUrl,
    method: 'post',
    data,
  });
  return res;
};

// 获取上传qiniu token
export const getQiniuUploadToken = () => {
  const res = request({
    url: urls.uploadTokenUrl,
    method: 'get',
  });
  return res;
};

// 获取语言列表
export const getAllLangs = (data) => {
  const res = request({
    url: urls.langListUrl,
    method: 'get',
    data,
  });
  return res;
};

// 获取语种
export const getCourseLangs = (data) => {
  const res = request({
    url: urls.courseLangsUrl,
    method: 'get',
    data,
  });
  return res;
};

// 添加老师认证信息
export const addIdentifyInfo = (data) => {
  const res = request({
    url: urls.addTeacherInfoUrl,
    method: 'post',
    data,
  });
  return res;
};

// 更新教师认证信息
export const editIdentifyInfo = (data) => {
  const res = request({
    url: urls.updateTeacherInfoUrl,
    method: 'put',
    data,
  });
  return res;
};

// 编辑用户头像
export const editUserPhoto = (data) => {
  const res = request({
    url: urls.editUserPhotoUrl,
    method: 'put',
    data,
  });
  return res;
};

// 编辑用户昵称
export const editUserNickname = (data) => {
  const res = request({
    url: urls.updateUserNicknameUrl,
    method: 'put',
    data,
  });
  return res;
};

// 根据日期区间获取直播课
export const getLiveCourseList = (data) => {
  const res = request({
    url: urls.liveCourseListUrl,
    method: 'post',
    data,
  });
  return res;
};

// 获取直播专辑列表
export const getModuleList = (data) => {
  const res = request({
    url: urls.moduleListUrl,
    method: 'post',
    data,
  });
  return res;
};
