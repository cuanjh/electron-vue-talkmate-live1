<template>
  <div class="user-photo">
    <el-avatar
      :size="88"
      v-show="$store.getters.photo"
      :src="$store.getters.photo">
      <img src="@/assets/images/common/icon-avatar.svg"/>
    </el-avatar>
    <el-upload
      class="upload-demo"
      action="#"
      accept="image/jpeg,image/jpg,image/png"
      :on-change="changeUploadPhoto"
      :show-file-list="false"
      :limit="1"
      :auto-upload="false"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import moment from 'moment';

import {
  getQiniuUploadToken,
  editUserPhoto,
} from '@/api/live';
import uploadQiniu from '@/utils/uploadQiniu';

export default {
  methods: {
    // 上传头像
    changeUploadPhoto(file) {
      const date = new Date();
      const dateStr = moment(date).format('YYYY/MM/DD');
      const i = file.name.lastIndexOf('.');
      const ext = file.name.substring(i + 1);
      const url = `liveroom/images/${dateStr}/${file.uid}.${ext}`;
      getQiniuUploadToken().then((r) => {
        uploadQiniu(file.raw, r.token, url).then((res) => {
          editUserPhoto({
            user_id: this.$store.getters.userId,
            photo: res.key,
          }).then(() => {
            this.$store.dispatch('GetUserInfo', { user_id: this.$store.getters.userId });
          });
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.user-photo {
  width: 88px;
  height: 88px;
  position: relative;
}

.el-avatar {
  background: #FFFFFF;
}

.user-photo i {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #007AFF;
  border-radius: 50%;
  cursor: pointer;
  bottom: -15px;
  left: 30px;
}

.el-icon-plus {
  color: #ffffff;
  text-align: center;
  line-height: 30px;
}
</style>
