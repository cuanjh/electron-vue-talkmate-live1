<template>
  <div class="camera">
    <div id="camera_device_video_wrap"></div>
    <div class="desc" v-if="tabData.deviceName">
      · 检测到摄像头：{{ tabData.deviceName }}</div>
    <div class="desc" v-else>· 检测不到摄像头的硬件信息</div>
    <div class="question">是否可以从窗口中看见自己？</div>
    <div class="btns">
      <a href="javascript:;" class="btn plain" @click="cameraTest(false)">
        <span>看不到</span></a>
      <a href="javascript:;" class="btn primary" @click="cameraTest(true)">
        <span>能看到</span></a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabData'],
  mounted() {
    this.$emit('handlerClick', { tab: 'camera', event: 'startTestCamera' });
  },
  methods: {
    cameraTest(flag) {
      this.$emit('handlerClick', { tab: 'camera', flag });
    },
  },
  destroyed() {
    this.$emit('handlerClick', { tab: 'camera', event: 'stopTestCamera' });
  },
};
</script>

<style lang="less" scoped>
.camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  .desc {
    font-size: 16px;
    font-weight: 300;
    color: #595757;
    margin-top: 8px;
  }
  .question {
    font-size: 32px;
    font-weight: 600;
    color: #000000;
    margin-top: 20px;
  }
}

#camera_device_video_wrap {
  margin-top: 30px;
  flex-wrap: wrap;
  display: flex;
  width: 370px;
  height: 180px;
  border-radius: 6px;
  background-color: grey;
}

.camera .btns {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  .btn {
    width: 190px;
    height: 52px;
    border: 2px solid #007aff;
    border-radius: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:first-child {
      margin-right: 40px;
    }
     span {
      font-size: 20px;
      font-weight: 400;
      color: #007aff;
    }
  }
  .plain {
    background: #FFFFFF;
  }
  .primary {
    background: #007aff;
    span {
      color: #FFFFFF;
    }
  }
}

</style>
