<template>
  <el-footer class="footer">
    <div class="operates">
      <div class="left">
        <el-tooltip class="item" effect="dark" content="静音" placement="top">
          <a href="javascript:;"
            @click="onMuteLocalAudio"
            :class="[{'mute': muteLocalAudio, 'mic': !muteLocalAudio}]"><i></i></a>
        </el-tooltip>
        <a href="javascript:;" class="laba"
          @mouseenter="isShowMicVolume = true" @mouseleave="isShowMicVolume = false">
          <i></i>
          <transition name="fade" mode="out-in">
            <div class="audio-volume" v-show="isShowMicVolume">
              <el-slider
                @change="onMicVolumeChanged"
                v-model="micVolume"
                vertical
                height="100px">
              </el-slider>
            </div>
          </transition>
        </a>
        <el-tooltip class="item" effect="dark" content="美颜" placement="top">
          <a href="javascript:;"
          @click="openBeautyDialog = true" :disabled="!inroom" class="beauty"><i></i></a>
        </el-tooltip>
        <a href="javascript:;" class="ratio" @click="handleResolution"><span>标清</span></a>
      </div>
      <div class="btnStartOrEnd">
        <a href="javascript:;" :class="['btn', {'active': isStart }]" @click="startOrEndClass">
          <i :class="{'el-icon-caret-right': !isStart}"></i>{{ isStart ? '结束下课' : '开始上课'}}
        </a>
      </div>
      <div class="right"></div>
    </div>
  </el-footer>
</template>

<script>
export default {
  data() {
    return {
      muteLocalAudio: false,
      isShowMicVolume: false,
      micVolume: 0,
      openBeautyDialog: false,
      inroom: false,
      isStart: false,
    };
  },
  methods: {
    onMuteLocalAudio() {},
    onMicVolumeChanged() {},
    handleResolution() {},
    startOrEndClass() {},
  },
};
</script>
<style lang="less" scoped>
.el-footer {
  height: 50px !important;
  background: #ffffff;
  box-shadow: 0px -5px 44px 0px rgba(0,0,0,0.1);
  z-index: 1;
}

.footer {
  position: relative;
  padding: 0;
}

.operates {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.operates .left {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.operates .left .mute {
  width: 26px;
  height: 26px;
  margin-left: 30px;
}

.operates .left .mute i {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/room/icon-mute.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.operates .left .mute:hover i {
  background-image: url('../../assets/images/room/icon-mute-hover.svg');
}

.operates .left .mic {
  width: 26px;
  height: 26px;
  margin-left: 30px;
}

.operates .left .mic i {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/room/icon-mic.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.operates .left .mic:hover i {
  background-image: url('../../assets/images/room/icon-mic-hover.svg');
}

.operates .left .laba {
  width: 26px;
  height: 26px;
  margin-left: 30px;
  cursor: pointer;
  position: relative;
}

.operates .left .laba i {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/room/icon-laba.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.operates .left .laba:hover i {
  background-image: url('../../assets/images/room/icon-laba-hover.svg');
}

.audio-volume {
  position: absolute;
  display: inline-block;
  bottom: 30px;
  left: -8px;
  width: 42px;
  background: rgba(0, 0, 0, .4);
  border-radius: 4px;
  padding: 20px 10px 10px;
}

.el-slider.is-vertical {
  left: -8px;
}
.operates .left .ratio {
  width: 56px;
  height: 32px;
  background: #6f7484;
  border-radius: 8px;
  text-align: center;
  line-height: 32px;
  margin-left: 30px;
}

.operates .left .ratio span {
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}

.operates .left .beauty {
  width: 26px;
  height: 26px;
  margin-left: 30px;
  cursor: pointer;
}

.operates .left .beauty i {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/room/icon-beauty.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.operates .left .beauty:hover i {
  background-image: url('../../assets/images/room/icon-beauty-hover.svg');
}

.operates .right {
  width: 30%;
}
.btnStartOrEnd {
  flex: 1;
  position: relative;
  /* position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 1; */
}

.btnStartOrEnd .btn {
  width: 283px;
  height: 70px;
  background: #1aad19;
  border-radius: 56px 56px 0px 0px;
  font-size: 28px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: -10px auto 0;
  transition: all .3s ease;
}

.btnStartOrEnd .btn i {
  color: #FFFFFF;
  font-size: 44px;
  margin-right: 18px;
}

.btnStartOrEnd .active {
  background: rgba(215,42,101,1);
}

.btnStartOrEnd .active i {
  width: 23px;
  height: 23px;
  background: #ffffff;
  border-radius: 5px;
}
</style>
