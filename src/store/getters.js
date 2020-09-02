const getters = {
  userId: (state) => state.user.userId,
  userInfo: (state) => state.user.userInfo,
  phonenumber: (state) => state.user.phonenumber,
  photo: (state) => state.user.photo,
  verifyStatus: (state) => state.user.verifyStatus,
  moduleList: (state) => state.live.moduleList,
};

export default getters;
