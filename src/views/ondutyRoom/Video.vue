<template>
  <div class="video-container">
    <div class="control" id="video_wrap"></div>
    <i class="muted" v-show="muteLocalAudio"></i>
  </div>
</template>

<script>
export default {
  props: ['muteLocalAudio'],
};
</script>

<style lang="less" scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#video_wrap {
  flex-wrap: wrap;
  display: flex;
  background: rgba(153,153,153,1);
  border-radius: 4px;
  overflow: hidden;
}

.video_view {
  width: 320px;
  height: 180px;
}

.muted {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-image: url('../../assets/images/room/icon-muted.svg');
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  right: 50px;
  bottom: 60px;
}
</style>
