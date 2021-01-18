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

// 获取腾讯云用户计算签名sign
export const getUserSign = (data) => {
  const res = request({
    url: urls.findUserSignUrl,
    method: 'get',
    data,
  });
  return res;
};

// 获取课程的房间号
export const getLiveCourseRoomId = (data) => {
  const res = request({
    url: urls.liveCourseRoomIdUrl,
    method: 'post',
    data,
  });
  return res;
};

// 文件转码列表
export const courseFileList = (data) => {
  const res = request({
    url: urls.courseFileListUrl,
    method: 'post',
    data,
  });
  return res;
};

// 删除直播课课件
export const delCourseFile = (data) => {
  const res = request({
    url: urls.delCourseFileUrl,
    method: 'post',
    data,
  });
  return res;
};

// 创建文档转码任务
export const createFilesTranscode = (data) => {
  const res = request({
    url: urls.createFilesTranscodeUrl,
    method: 'post',
    data,
  });
  return res;
};

// 查询文档转码任务
export const describeTranscode = (data) => {
  const res = request({
    url: urls.describeTranscodeUrl,
    method: 'post',
    data,
  });
  return res;
};

// 获取融云IM用户token
export const getIMUserToken = () => {
  const res = request({
    url: urls.imUserTokenUrl,
    method: 'get',
  });
  return res;
};

// 直播评论
export const liveComment = (data) => {
  const res = request({
    url: urls.liveCommentUrl,
    method: 'get',
    data,
  });
  return res;
};

// 值班---上课
export const liveCourseOnline = (data) => {
  const res = request({
    url: urls.liveCourseOnlineUrl,
    method: 'post',
    data,
  });
  return res;
};

// 值班---下课
export const liveCourseOffline = (data) => {
  const res = request({
    url: urls.liveCourseOfflineUrl,
    method: 'post',
    data,
  });
  return res;
};

// 直播评论列表
export const liveCommentList = (data) => {
  const res = request({
    url: urls.liveCommentListUrl,
    method: 'get',
    data,
  });
  return res;
};
