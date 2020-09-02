<template>
  <div class="user-info">
    <div class="nickname">
      <label for="nickname">用户昵称：</label>
      <el-input ref="nickname"
        :style="{'border-bottom': isEditNN ? '1px solid #007aff' : '1px solid #FAFBFF'}"
        v-model="nickname"
        :readonly="!isEditNN"
        @blur="isEditNN = false"
        @change="updateNickname"></el-input>
      <i class="icon-shuxie" @click="setEditNickname"></i>
    </div>
    <div class="phone">
      <label for="phone">手机号：</label>
      <span>{{ $store.getters.phonenumber.slice(0, 3)
        + '****' + $store.getters.phonenumber.slice(7, 11) }}</span>
    </div>
  </div>
</template>

<script>
import {
  editUserNickname,
} from '@/api/live';

export default {
  data() {
    return {
      isEditNN: false,
      nickname: this.$store.getters.userInfo.nickname,
    };
  },
  methods: {
    // 更新用户昵称
    updateNickname() {
      editUserNickname({ user_id: this.$store.getters.userId, nickname: this.nickname });
    },
    setEditNickname() {
      this.isEditNN = !this.isEditNN;
      if (this.isEditNN) {
        this.$refs.nickname.focus();
      } else {
        this.$refs.nickname.blur();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 58px;
}

.user-info .nickname {
  margin-bottom: 9px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.nickname .el-input {
  width: 160px;
  font-size: 24px;
  font-weight: 500;
}

.user-info .nickname span {
  height: 33px;
  font-size: 24px;
  font-weight: 500;
  color: #007aff;
  line-height: 33px;
}

.user-info .nickname i {
  cursor: pointer;
}

.user-info .nickname .icon-shuxie {
  width: 24px;
  height: 23px;
  background-image: url(../../assets/images/common/icon-shuxie.svg);
  background-repeat: no-repeat;
  background-size: cover;
}

.user-info .phone {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.user-info {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
}

.user-info label {
  width: 120px;
  height: 33px;
  line-height: 33px;
  display: inline-block;
}

.user-info span {
  width: 150px;
}
</style>

<style lang="less">
.nickname {
  .el-input {
    .el-input__inner {
      color: #007aff;
      border: 0;
      padding-left: 0;
      background-color: #FAFBFF;
    }
  }
}
</style>
