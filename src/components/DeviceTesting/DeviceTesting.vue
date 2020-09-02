<template>
  <transition name="fade">
    <div class="dialog-modal" v-show="isShowModal">
      <div class="dialog-modal-wrap">
        <div class="close" @click="close"><i class="el-icon-close"></i></div>
        <div class="content">
          {{ version }}
          <!-- <div id="em-container" class="em-container">
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
                <div class="speaker" :key="'speaker'" v-if="stepActive == 0">
                  <audio :src="testPath" ref="speakerAudio" controls></audio>
                  <div class="desc"
                    v-if="speakerList.length > 1">
                      · 检测到计算机外置扬声器：{{ speakerList[speakerList.length - 1].deviceName }}</div>
                  <div class="desc"
                    v-else-if="speakerList.length == 1">
                      · 检测到计算机内置扬声器：{{ speakerList[0].deviceName }}</div>
                  <div class="desc"
                    v-else>· 检测不到扬声器的硬件信息</div>
                  <div class="question">您能否听到声音？</div>
                  <div class="btns">
                    <a href="javascript:;" class="btn plain" @click="speakerTest(false)">
                      <span>听不到</span></a>
                    <a href="javascript:;" class="btn primary" @click="speakerTest(true)">
                      <span>能听到</span></a>
                  </div>
                </div>
                <div class="mic" :key="'mic'" v-if="stepActive == 1">
                  <div class="mic-panel">
                    <div class="panel-desc">请对准麦克风读出以下数字</div>
                    <div class="panel-nums">
                      <span>1</span><span>2</span><span>3</span><span>4</span>
                      <span>5</span><span>6</span><span>7</span>
                    </div>
                    <div class="panel-progress">
                      <span v-for="i in parseInt(testMicVolume/3)" :key="i"></span>
                    </div>
                  </div>
                  <div class="desc" v-if="micList.length > 1">
                    · 检测到计算机外置麦克风：{{ micList[micList.length - 1].deviceName }}</div>
                  <div class="desc" v-else-if="micList.length == 1">
                    · 检测到计算机内置麦克风：{{ micList[0].deviceName }}</div>
                  <div class="desc" v-else>· 检测不到麦克风的硬件信息</div>
                  <div class="question">是否看到音量条波动？</div>
                  <div class="btns">
                    <a href="javascript:;" class="btn plain" @click="micTest(false)">
                      <span>看不到</span></a>
                    <a href="javascript:;" class="btn primary" @click="micTest(true)">
                      <span>能看到</span></a>
                  </div>
                </div>
                <div class="camera" :key="'mic'" v-if="stepActive == 2">
                  <div id="camera_device_video_wrap"></div>
                  <div class="desc" v-if="cameraList.length > 1">
                    · 检测到计算机外置摄像头：{{ cameraList[cameraList.length - 1].deviceName }}</div>
                  <div class="desc" v-else-if="cameraList.length == 1">
                    · 检测到计算机内置摄像头：{{ cameraList[0].deviceName }}</div>
                  <div class="desc" v-else>· 检测不到摄像头的硬件信息</div>
                  <div class="question">是否可以从窗口中看见自己？</div>
                  <div class="btns">
                    <a href="javascript:;" class="btn plain" @click="cameraTest(false)">
                      <span>看不到</span></a>
                    <a href="javascript:;" class="btn primary" @click="cameraTest(true)">
                      <span>能看到</span></a>
                  </div>
                </div>
                <div class="result" :key="'result'" v-if="stepActive == 3">
                  <div class="result-panel">
                    <div class="item">
                      <div class="name">扬声器</div>
                      <div class="passed" v-show="testSpeaker"><i class="el-icon-check"></i>通过</div>
                      <div class="notpassed" v-show="!testSpeaker">
                        <span class="tip"><i class="el-icon-close"></i>未检测到您的设备</span>
                        <span class="help" @click="clickHelp('https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E6%89%AC%E5%A3%B0%E5%99%A8%E6%80%8E%E4%B9%88%E5%8A%9E&rsv_spt=1&oq=electron%2520%25E8%25B7%25B3%25E8%25BD%25AC%25E5%25A4%2596%25E9%2593%25BE%25E6%258E%25A5&rsv_pq=99071dea00004ea6&rsv_t=9e97Nb2vYKAJiRQoof5YGDA9Q6vQYpF5cXpSOmdtHfYDRHR6kyBzkQK4YZ3jW%2B9F2h1O&rqlang=cn&rsv_enter=1&rsv_dl=ts_0&rsv_btype=t&inputT=16786&rsv_sug3=444&rsv_sug1=220&rsv_sug7=101&rsv_sug2=0&prefixsug=%25E6%259C%25AA%25E6%25A3%2580%25E6%25B5%258B%25E5%2588%25B0%25E6%2589%25AC%25E5%25A3%25B0%25E5%2599%25A8&rsp=0&rsv_sug4=17930')">帮助</span>
                      </div>
                    </div>
                    <div class="item">
                      <div class="name">麦克风</div>
                      <div class="passed" v-show="testMic"><i class="el-icon-check"></i>通过</div>
                      <div class="notpassed" v-show="!testMic">
                        <span class="tip"><i class="el-icon-close"></i>未检测到您的设备</span>
                        <span class="help" @click="clickHelp('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E9%BA%A6%E5%85%8B%E9%A3%8E%E6%80%8E%E4%B9%88%E5%8A%9E&rsv_spt=1&oq=%25E6%259C%25AA%25E6%25A3%2580%25E6%25B5%258B%25E5%2588%25B0%25E6%2589%25AC%25E5%25A3%25B0%25E5%2599%25A8%25E6%2580%258E%25E4%25B9%2588%25E5%258A%259E&rsv_pq=9d881ff100004b5d&rsv_t=aa4asICl2T3NneUu5n6IGiK7viG3BQo%2Biyo8PBFrvqn8Sq35odeFEDZ%2BLlSfqe4Vb5j4&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=16786&rsv_sug3=458&bs=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E6%89%AC%E5%A3%B0%E5%99%A8%E6%80%8E%E4%B9%88%E5%8A%9E')">帮助</span>
                      </div>
                    </div>
                    <div class="item">
                      <div class="name">摄像头</div>
                      <div class="passed" v-show="testCamera"><i class="el-icon-check"></i>通过</div>
                      <div class="notpassed" v-show="!testCamera">
                        <span class="tip"><i class="el-icon-close"></i>未检测到您的设备</span>
                        <span class="help" @click="clickHelp('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E6%91%84%E5%83%8F%E5%A4%B4%E6%80%8E%E4%B9%88%E5%8A%9E&rsv_spt=1&oq=%25E6%259C%25AA%25E6%25A3%2580%25E6%25B5%258B%25E5%2588%25B0%25E9%25BA%25A6%25E5%2585%258B%25E9%25A3%258E%25E6%2580%258E%25E4%25B9%2588%25E5%258A%259E&rsv_pq=f5fb80b80000c024&rsv_t=6e46HBDGRSjfBwI5QC9qnEWW841Bd1zWWzrRr68g9RYoWPjUkV35WNycpikJHdTHtWLO&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=7900&rsv_sug3=478&rsv_sug1=223&rsv_sug7=100&bs=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E9%BA%A6%E5%85%8B%E9%A3%8E%E6%80%8E%E4%B9%88%E5%8A%9E')">帮助</span>
                      </div>
                    </div>
                  </div>
                  <div class="btns">
                    <a href="javascript:;" class="btn primary completed" @click="completed()">
                      <span>完成</span></a>
                  </div>
                </div>
              </transition>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import TRTCCloud from 'trtc-electron-sdk';

// let trtcCloud = null; // 用于TRTCQcloud 实例， mounted 时实体化

export default {
  data() {
    return {
      isShowModal: false,
      version: '',
    };
  },
  mounted() {
    // 创建TRTC对象
    // trtcCloud = new TRTCCloud();
    // this.version = trtcCloud.getSDKVersion();
  },
  methods: {
    show() {
      this.isShowModal = true;
    },
    close() {
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

.speaker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speaker audio {
  width: 60%;
  margin-top: 60px;
}

.speaker .desc {
  font-size: 16px;
  font-weight: 300;
  color: #595757;
  margin-top: 20px;
}

.speaker .question {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  margin-top: 80px;
}

.speaker .btns {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
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

.mic {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mic .mic-panel {
  width: 60%;
  margin-top: 40px;
  height: 170px;
  background: rgba(244,245,248,.7);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.panel-desc {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 6px;
}

.panel-nums {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  margin-bottom: 6px;
}

.panel-nums span {
  font-size: 32px;
  font-family: YouSheBiaoTiHei;
  color: #000000;
}

.panel-progress {
  width: 80%;
  height: 44px;
  border: 2px solid #becae0;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px;
}

.panel-progress span {
  width: 10px;
  height: 100%;
  background: #1aad19;
  border-radius: 3px;
  margin: 0 1px;
}
.mic .desc {
  font-size: 16px;
  font-weight: 300;
  color: #595757;
  margin-top: 8px;
}

.mic .question {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  margin-top: 20px;
}

.mic .btns {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.camera {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.camera .camera-panel {
  /* width: 50%;
  margin-top: 40px;
  height: 170px;
  background: rgba(244,245,248,.7);
  border-radius: 6px; */
}

.camera .desc {
  font-size: 16px;
  font-weight: 300;
  color: #595757;
  margin-top: 8px;
}

.camera .question {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  margin-top: 20px;
}

.camera .btns {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.camera_test_video_view {
  overflow: hidden;
  width: 370px;
  height: 180px;
  background-color: grey;
  border-radius: 6px;
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

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-panel {
  margin-top: 60px;
  width: 70%;
  background: #f7f7fa;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.result-panel .item {
  padding: 10px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.result-panel .item .name {
  font-size: 22px;
  font-weight: 400;
  color: #000000;
}

.passed {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 22px;
  font-weight: 400;
  color: #1aad19;
}

.passed i {
  width: 22px;
  height: 22px;
  background: #1aad19;
  border-radius: 50%;
  font-size: 14px;
  color: #FFFFFF;
  text-align: center;
  line-height: 22px;
  margin-right: 10px;
}

.result .btns {
  display: flex;
  flex-direction: row;
  margin-top: 60px;
}

.notpassed {
  font-size: 22px;
  font-weight: 400;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 30px;
}

.notpassed .tip {
  color: #D72A65;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.notpassed .tip i {
  width: 22px;
  height: 22px;
  background: #d72a65;
  border-radius: 50%;
  font-size: 14px;
  color: #FFFFFF;
  text-align: center;
  line-height: 22px;
  margin-right: 10px;
}

.notpassed .help {
  color: #1AAD19;
  cursor: pointer;
}
</style>
