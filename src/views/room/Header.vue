<template>
  <el-header>
    <div class="wifi">
      <i></i>
      <span>网络延迟：<b>{{netWorkStatis.rtt}}ms</b></span>
      <span>丢包率：<b>{{netWorkStatis.uploss}}%</b></span>
      <span>网络状态：<b>{{netWorkStatis.rtt &lt; 50 ? '优' : '良'}}</b></span>
    </div>
    <div class="title">
        {{ courseTitle }}
        <span class="time">已开课：{{ courseHMS }}</span>
    </div>
    <div class="quit-live-room">
      <el-button class="quit-live-room" type="text" @click="close">退出</el-button>
    </div>
  </el-header>
</template>

<script>
export default {
  props: ['netWorkStatis', 'courseTitle', 'courseHMS'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  position: relative;
  height: 70px !important;
}

.el-header .wifi{
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-header .wifi i {
  width: 20px;
  height: 16px;
  background-image: url(../../assets/images/room/icon-wifi.svg);
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 12px;
}

.el-header .wifi span {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin-right: 20px;
}

.el-header .wifi span b {
  color: #1AAD19;
}

.el-header .title{
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.el-header .title .time {
  width: 125px;
  height: 22px;
  background: rgba(9,94,251,0.16);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  text-align: center;
  line-height: 22px;
  margin-left: 14px;
}

.quit-live-room {
  position: absolute;
  display: flex;
  flex-direction: row;
  height: 100%;
  right: 10px;
  top: 0;
  align-items: center;
}
</style>
