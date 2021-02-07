const getters = {
  userId: (state) => state.user.userId,
  deviceId: (state) => state.user.deviceId,
  verify: (state) => state.user.verify,
  userInfo: (state) => state.user.userInfo,
  phonenumber: (state) => state.user.phonenumber,
  photo: (state) => state.user.photo,
  verifyStatus: (state) => state.user.verifyStatus,
  moduleList: (state) => state.live.moduleList,
  curLiveCourse: (state) => state.live.curLiveCourse,
  layoutIsShow: (state) => state.layout.isShow,
};

export default getters;
