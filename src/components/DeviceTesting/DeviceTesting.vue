<template>
  <transition name="fade">
    <div class="dialog-modal" v-show="isShowModal">
      <div class="dialog-modal-wrap">
        <div class="close" @click="close"><i class="el-icon-close"></i></div>
        <div class="content">
          <div id="em-container" class="em-container">
            <div class="steps">
              <div :class="['step', {'active': stepActive == index }]"
                @click="switchStep(index)"
                v-for="(item, index) in steps"
                :key="index">
                <span class="num" v-text="index + 1"></span>
                <span class="name" v-text="item.text"></span>
              </div>
            </div>
            <div class="step-content">
              <transition name="fade" mode="out-in">
                <component
                  :ref="view"
                  :is="view"
                  :tabData="tabData"
                  @handlerClick="handlerClick"></component>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Speaker from './Speaker.vue';
import Mic from './Mic.vue';
import Camera from './Camera.vue';
import Result from './Result.vue';

const TRTCCloud = require('trtc-electron-sdk').default;
const {
  TRTCDeviceType,
  TRTCDeviceState,
} = require('trtc-electron-sdk/liteav/trtc_define');

export default {
  data() {
    return {
      isShowModal: false,
      view: '',
      steps: [
        { text: '扬声器', cls: 'speaker' },
        { text: '麦克风', cls: 'mic' },
        { text: '摄像头', cls: 'camera' },
        { text: '监测结果', cls: 'result' },
      ],
      stepActive: 0,
      rtcCloud: null,
      version: '',
      // 设备信息
      openDeviceDialog: false,
      cameraDeviceName: '',
      cameraList: [],
      micDeviceName: '',
      micVolume: 0,
      micList: [],
      speakerDeviceName: '',
      speakerVolume: 0,
      speakerList: [],
      testCamera: false,
      testedCamera: false,
      testMic: false,
      testedMic: false,
      testMicVolume: 0,
      testSpeaker: false,
      testedSpeaker: false,
      testSpeakerVolume: 0,
      testBGM: false,
    };
  },
  components: {
    speaker: Speaker,
    mic: Mic,
    camera: Camera,
    result: Result,
  },
  mounted() {
    // 重要点, 创建TRTC 对象
    this.rtcCloud = new TRTCCloud();

    this.initSDKLocalData();
    this.subscribeEvents(this.rtcCloud);
  },
  computed: {
    tabData() {
      let name = '';
      switch (this.view) {
        case 'speaker':
          name = this.speakerDeviceName;
          break;
        case 'mic':
          name = this.micDeviceName;
          break;
        case 'camera':
          name = this.cameraDeviceName;
          break;
        default:
          name = '';
          break;
      }
      return {
        deviceName: name,
        micVolume: this.testMicVolume,
        testMic: this.testMic,
        testSpeaker: this.testSpeaker,
        testCamera: this.testCamera,
      };
    },
  },
  methods: {
    show() {
      this.isShowModal = true;
      this.view = 'speaker';
    },
    close() {
      this.completed();
      this.$refs[this.view].close();
    },
    subscribeEvents(rtcCloud) {
      // errcode, errmsg
      rtcCloud.on('onError', () => {
        // console.error(`trtc_demo: onError: ${errcode}msg: ${errmsg}`);
      });
      // warncode, warnmsg
      rtcCloud.on('onWarning', () => {
        // console.warn(`trtc_demo: onWarning: ${warncode} msg:${warnmsg}`);
      });
      // 麦克风音量回调监听
      rtcCloud.on('onTestMicVolume', (volume) => {
        this.testMicVolume = volume;
        // console.log(this.testMicVolume);
      });
      // 设备状态监控回调
      rtcCloud.on('onDeviceChange', (deviceId, type, state) => {
        // 实时监控本地设备的拔插
        // console.info(`trtc_demo: onDeviceChange
        // deviceId: ${deviceId} |type: ${type} |state: ${state}`);
        if (type === TRTCDeviceType.TRTCDeviceTypeCamera) {
          this.cameraList = this.rtcCloud.getCameraDevicesList();
          let select = false;
          if (state === TRTCDeviceState.TRTCDeviceStateRemove) {
            // 选择设备被移除了，尝试选择其他设备
            if (this.cameraDeviceName === deviceId) {
              select = true;
              // this.destroyVideoView("local_video", TRTCVideoStreamType.TRTCVideoStreamTypeBig)
            }
          } else if (state === TRTCDeviceState.TRTCDeviceStateAdd) {
            // 如果之前没有设备，此时添加了设备，则重新选择
            if (this.cameraDeviceName === '') {
              select = true;
            }
          }
          if (select) {
            if (this.cameraList.length > 0) {
              this.rtcCloud.setCurrentCameraDevice(this.cameraList[0].deviceName);
              this.cameraDeviceName = this.cameraList[0].deviceName;
              // 重新选择设备后需要重新打开采集摄像头
              // let view = this.findVideoView("local_video",
              // TRTCVideoStreamType.TRTCVideoStreamTypeBig);
              // this.rtcCloud.startLocalPreview(view);
            } else {
              this.cameraDeviceName = '';
            }
          }
        } else if (type === TRTCDeviceType.TRTCDeviceTypeMic) {
          this.micList = this.rtcCloud.getMicDevicesList();
          let select = false;
          if (state === TRTCDeviceState.TRTCDeviceStateRemove) {
            // 选择设备被移除了，尝试选择其他设备
            if (this.micDeviceName === deviceId) {
              select = true;
            }
          } else if (state === TRTCDeviceState.TRTCDeviceStateAdd) {
            // 如果之前没有设备，此时添加了设备，则重新选择
            if (this.micDeviceName === '') {
              select = true;
            }
          }
          if (select) {
            if (this.micList.length > 0) {
              this.rtcCloud.setCurrentMicDevice(this.micList[0].deviceName);
              this.micDeviceName = this.micList[0].deviceName;
            } else {
              this.micDeviceName = '';
            }
          }
        }
      });
    },
    resetData() {
      this.stepActive = 0;
      // 设备信息
      this.openDeviceDialog = false;
      this.cameraDeviceName = '';
      this.cameraList = [];
      this.micDeviceName = '';
      this.micVolume = 0;
      this.micList = [];
      this.speakerDeviceName = '';
      this.speakerVolume = 0;
      this.speakerList = [];
      this.testCamera = false;
      this.testedCamera = false;
      this.testMic = false;
      this.testedMic = false;
      this.testMicVolume = 0;
      this.testSpeaker = false;
      this.testedSpeaker = false;
      this.testSpeakerVolume = 0;
      this.testBGM = false;
    },
    handlerClick(params) {
      // console.log(params);
      switch (params.tab) {
        case 'speaker':
          this.testedSpeaker = true;
          this.testSpeaker = params.flag;
          this.switchStep(1);
          break;
        case 'mic':
          if (params.event === 'startTestMic') {
            this.startTestMic();
          } else if (params.event === 'stopTestMic') {
            this.stopTestMic();
          } else {
            this.testedMic = true;
            this.testMic = params.flag;
            this.switchStep(2);
          }
          break;
        case 'camera':
          if (params.event === 'startTestCamera') {
            this.startTestCamera();
          } else if (params.event === 'stopTestCamera') {
            this.stopTestCamera();
          } else {
            this.testedCamera = true;
            this.testCamera = params.flag;
            this.switchStep(3);
          }
          break;
        default:
          if (params.event === 'complete') {
            this.completed();
          }
          break;
      }
    },
    playSpeakerAudio(flag) {
      if (!this.$refs.speakerAudio) return;
      if (flag) {
        this.$refs.speakerAudio.play();
      } else {
        this.$refs.speakerAudio.pause();
      }
    },
    startTestMic() {
      this.rtcCloud.startMicDeviceTest(300);
    },
    stopTestMic() {
      this.rtcCloud.stopMicDeviceTest();
      this.testMicVolume = 0;
    },
    // 摄像头选择
    onCameraDeviceSelect() {
      this.rtcCloud.setCurrentCameraDevice(this.cameraDeviceName);
    },
    startTestCamera() {
      const key = 'camera_device_video_view';
      let cameraTestVideoEl = document.getElementById(key);
      if (!cameraTestVideoEl) {
        cameraTestVideoEl = document.createElement('div');
        cameraTestVideoEl.id = key;
        cameraTestVideoEl.classList.add('camera_test_video_view');
        document.querySelector('#camera_device_video_wrap').appendChild(cameraTestVideoEl);
      }
      this.rtcCloud.startCameraDeviceTest(cameraTestVideoEl);
    },
    stopTestCamera() {
      const key = 'camera_device_video_view';
      // 暂时不需要主动调用 stopCameraDeviceTest 这样会导致 Renderer 失效
      const cameraTestVideoEl = document.getElementById(key);
      if (cameraTestVideoEl) {
        document.querySelector('#camera_device_video_wrap').removeChild(cameraTestVideoEl);
      }
    },
    // 初始化 SDK 本地配置信息
    initSDKLocalData() {
      // 初始化设备信息
      this.cameraList = this.rtcCloud.getCameraDevicesList();
      if (this.cameraList.length > 0) {
        this.cameraDeviceName = this.cameraList[0].deviceName;
      }
      this.micList = this.rtcCloud.getMicDevicesList();
      if (this.micList.length > 0) {
        this.micDeviceName = this.micList[0].deviceName;
      }
      this.speakerList = this.rtcCloud.getSpeakerDevicesList();
      // console.log('speakerList', this.speakerList);
      if (this.speakerList.length > 0) {
        this.speakerDeviceName = this.speakerList[0].deviceName;
      }
      this.micVolume = this.rtcCloud.getCurrentMicDeviceVolume();
      this.speakerVolume = this.rtcCloud.getCurrentSpeakerVolume();
    },
    switchStep(index) {
      switch (index) {
        case 1:
          if (this.testedSpeaker) {
            this.stepActive = index;
          }
          break;
        case 2:
          if (this.testedMic) {
            this.stepActive = index;
          }
          break;
        case 3:
          if (this.testedCamera) {
            this.stepActive = index;
          }
          break;
        default:
          this.stepActive = index;
          break;
      }
      if (this.stepActive === index) {
        this.view = this.steps[index].cls;
      }
    },
    // 扬声器检测
    speakerTest(flag) {
      this.testSpeaker = flag;
      this.testedSpeaker = true;
      this.switchStep(1);
    },
    // 麦克风检测
    micTest(flag) {
      this.testMic = flag;
      this.testedMic = true;
      this.stopTestMic();
      this.switchStep(2);
    },
    // 摄像头检测
    cameraTest(flag) {
      this.testCamera = flag;
      this.testedCamera = true;
      this.switchStep(3);
    },
    completed() {
      this.playSpeakerAudio(false);
      this.rtcCloud.stopSpeakerDeviceTest();
      // 关闭采集音视频
      this.rtcCloud.stopLocalPreview();
      this.rtcCloud.stopLocalAudio();
      this.resetData();
      this.isShowModal = false;
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 999;
  -webkit-app-region: drag;
}

.dialog-modal-wrap {
  width: 60%;
  margin: 0 auto;
  margin-top: 15vh;
  box-shadow: 0px 4px 40px 0px rgba(17,75,149,0.07);
  position: relative;
}

.dialog-modal-wrap .close {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .25);
  right: -44px;
  top: -32px;
  line-height: 35px;
  text-align: center;
  -webkit-app-region: no-drag;
  cursor: pointer;
}

.dialog-modal-wrap .close i {
  color: #FFFFFF;
  font-size: 22px;
}

.dialog-modal-wrap .content {
  height: 500px;
  width: 100%;
  background: #FFFFFF;
  overflow: hidden;
  border-radius: 6px;
}

.em-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.steps {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 80px;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #2c91ff;
  width: 100%;
  height: 100%;
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: all .3s linear;
}

.step .num {
  font-size: 76px;
  font-family: YouSheBiaoTiHei;
  color: #2587f1;
  margin-right: 10px;
  transition: all .3s linear;
}

.step .name {
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  transition: all .3s linear;
}

.active {
  background: #FFFFFF;
}

.active .name {
  color: #000000;
}

.step-content {
  flex: 1;
}

.btns .btn {
  width: 190px;
  height: 52px;
  border: 2px solid #007aff;
  border-radius: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.btns .btn:first-child {
  margin-right: 40px;
}

.btns .btn span {
  font-size: 20px;
  font-weight: 400;
  color: #007aff;
}

.btns .plain {
  background: #FFFFFF;
}

.btns .primary {
  background: #007aff;
}

.btns .primary span {
  color: #FFFFFF;
}
</style>

<style lang="less">
.camera_test_video_view {
  overflow: hidden;
  width: 370px;
  height: 180px;
  background-color: grey;
  border-radius: 6px;
}
</style>
