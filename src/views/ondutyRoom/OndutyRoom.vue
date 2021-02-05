<template>
  <el-container class="live-room-container" direction="vertical">
    <header-comp
      :netWorkStatis="netWorkStatis"
      :courseTitle="courseTitle"
      :courseHMS="courseHMS"
      @close="close"/>
    <el-container>
      <el-container direction="vertical">
        <video-comp ref="video" :muteLocalAudio="muteLocalAudio"/>
        <footer-comp
          :muteLocalAudio="muteLocalAudio"
          @onMuteLocalAudio="onMuteLocalAudio"
          @showBeautyDialog="showBeautyDialog"
          @startLiveCountDown="startLiveCountDown"
          @stopLive="stopLive">
        </footer-comp>
      </el-container>
      <aside-comp ref="aside" :isPushing="isPushing"></aside-comp>
    </el-container>
    <div id="count-down-layer" v-if="countDown > 0">
      {{countDown}} 秒后开始直播
    </div>
    <rtc-beauty ref="beauty" @openBeauty="openBeauty"/>
  </el-container>
</template>

<script>
import {
  TRTCAppScene,
  TRTCVideoStreamType,
  TRTCVideoFillMode,
  TRTCRoleType,
  TRTCParams,
  TRTCVideoEncParam,
  TRTCVideoResolution,
  TRTCVideoResolutionMode,
  // TRTCBeautyStyle,
  Rect,
  TRTCTranscodingConfig,
  TRTCTranscodingConfigMode,
  TRTCMixUser,
} from 'trtc-electron-sdk/liteav/trtc_define';
import moment from 'moment';
import Log from '@/utils/log';
import trtcState from '@/utils/trtc-state';
import {
  getUserSign,
  getLiveCourseRoomId,
  liveCourseOnline,
  liveCourseOffline,
} from '@/api/live';

import RtcBeauty from '@/components/RtcBeauty/RtcBeauty.vue';
import HeaderComp from './Header.vue';
import VideoComp from './Video.vue';
import AsideComp from './Aside.vue';
import FooterComp from './Footer.vue';

const logger = new Log('tlRoom');
const TRTCCloud = require('trtc-electron-sdk').default;

let trtcCloud = null;

export default {
  data() {
    return {
      courseUUID: '',
      netWorkStatis: {
        uploss: 0,
        rtt: 0,
      },
      videoWidth: 0,
      videoHeight: 0,
      courseTitle: '体验课',
      timeCount: 0,
      courseTimer: null,
      userId: '',
      roomId: 0,
      sdkAppId: '',
      userSig: '',
      appId: '',
      bizId: '',
      videoContainer: null,
      isPushing: false,

      muteLocalAudio: false,
      screensList: [],
      screensListVisiable: false,
      isScreenSharing: false,
      beautyParams: {
        style: 0,
        beauty: 5,
        white: 5,
        ruddiness: 0,
      },
      // 存放远程用户视频列表
      remoteVideos: {},
      isRemoteScreenSharing: false, // 远程用户是否正在分享屏幕
      countDown: 0, // 倒计时开播，单位：秒
      countDownMax: 5, // 倒计时最大值
      // 跨房通话
      openConnectDialog: false,
      connectLoading: false,
      connected: false,
      connectLoadingText: '',
      pkUsers: [],
      pkUserId: '',
      pkRoomId: '',
      // 是否为纯音频进房
      pureAudioStyle: false,
      // 混流设置
      mixTranscoding: true,
      mixStreamInfos: [], // 每一路需要混流的信息（不包括当前用户主流）
    };
  },
  components: {
    HeaderComp,
    VideoComp,
    AsideComp,
    FooterComp,
    RtcBeauty,
  },
  mounted() {
    this.init();
    window.onresize = () => {
      this.resize();
    };
  },
  computed: {
    courseHMS() {
      const ret = `${this.addZero(Math.floor(this.timeCount / 60 / 60))}:${this.addZero(Math.floor(this.timeCount / 60))}:${this.addZero(Math.floor(this.timeCount % 60))}`;
      return ret;
    },
  },
  methods: {
    async init() {
      const course = this.$store.state.live.curOnduty;
      this.courseUUID = course.uuid;
      const startTime = moment(course.startTime * 1000).format('HH:mm:ss').slice(0, 5);
      const endTime = moment(course.EndTime * 1000).format('HH:mm:ss').slice(0, 5);
      this.courseTitle = `${startTime} - ${endTime}`;
      this.userId = this.$store.getters.userId;
      const res = await getLiveCourseRoomId({ uuid: course.uuid });
      this.roomId = res.data.roomId;

      // 没有摄像头，有麦克风，可以音频
      if (trtcState.isCameraReady() === false) {
        this.notify('找不到可用的摄像头，学生将无法看到您的画面。', 'warning');
      }

      // 有摄像头，没有麦克风，可以视频
      if (trtcState.isMicReady() === false) {
        this.notify('找不到可用的麦克风，学生将无法听到您的声音。', 'warning');
      }

      // 2.获取计算签名
      const res2 = await getUserSign({ user_id: this.userId });
      if (res2.success && res2.data) {
        this.sdkAppId = res2.data.sdkappid;
        this.userSig = res2.data.usersig;
        this.appId = res2.data.appid;
        this.bizId = res2.data.bizid;
      }
      this.$refs.aside.show({ roomId: this.roomId });
      this.trtcReady();
    },
    resize() {
      this.videoWidth = document.querySelector('#app').clientWidth - 400;
      this.videoHeight = document.querySelector('#app').clientHeight - 160;
      let width = this.videoWidth;
      let height = parseInt((9 * width) / 16, 10);
      if (height > this.videoHeight) {
        height = this.videoHeight;
        width = parseInt((16 * height) / 9, 10);
      }
      if (width > this.videoWidth) {
        width = this.videoWidth;
        height = parseInt((9 * width) / 16, 10);
      }
      if (document.querySelector('.local-video-container')) {
        document.querySelector('.local-video-container').setAttribute('style', `width:${width}px; height:${height}px`);
      }
    },
    trtcReady() {
      // 1. 获取用于承载视频的 HTMLElement；
      this.videoContainer = document.querySelector('#video_wrap');

      // 3. 实例化一个 TRTCCloud （包装了 TRTCCloud的类）
      trtcCloud = new TRTCCloud();
      logger.warn(`sdk version: ${trtcCloud.getSDKVersion()}`);

      // 4. 配置基本的事件订阅
      trtcCloud.on('onError', (err) => { logger.error(err); });
      trtcCloud.on('onEnterRoom', this.onEnterRoom.bind(this));
      trtcCloud.on('onExitRoom', this.onExitRoom.bind(this));
      trtcCloud.on('onRemoteUserEnterRoom', this.onRemoteUserEnterRoom.bind(this));
      trtcCloud.on('onRemoteUserLeaveRoom', this.onRemoteUserLeaveRoom.bind(this));
      trtcCloud.on('onUserSubStreamAvailable', this.onUserSubStreamAvailable.bind(this));
      trtcCloud.on('onFirstVideoFrame', this.onFirstVideoFrame.bind(this));
      // 音视频首帧发送回调监听
      trtcCloud.on('onSendFirstLocalVideoFrame', (streamType) => {
        const st = streamType;
        // console.info(`trtc_demo: onSendFirstLocalVideoFrame streamType: ${st}`);
        const find = this.mixStreamInfos.filter((item) => {
          const ret = item.streamType === TRTCVideoStreamType.TRTCVideoStreamTypeSub;
          return ret;
        });
        if (streamType === TRTCVideoStreamType.TRTCVideoStreamTypeSub && find.length === 0) {
          const mixUser = {
            userId: this.userId,
            roomId: '',
            streamType: st,
            width: 128,
            height: 72,
            fps: 15,
            pureAudio: false,
          };
          this.mixStreamInfos.push(mixUser);
          this.updateMixTranscodeInfo();
        }
      });
      trtcCloud.on('onSendFirstLocalAudioFrame', () => {
        // console.info('trtc_demo: onSendFirstLocalAudioFrame');
      });

      // 5. 设置编码参数
      // TRTCVideoEncParam 的详细说明，请参考： https://trtc-1252463788.file.myqcloud.com/electron_sdk/docs/TRTCVideoEncParam.html
      const encParam = new TRTCVideoEncParam();

      /**
       *  videoResolution
       * 【字段含义】 视频分辨率
       * 【推荐取值】 : Window 和 iMac 建议选择 640 × 360 及以上分辨率，resMode 选择 TRTCVideoResolutionModeLandscape
       * 【特别说明】 TRTCVideoResolution 默认只能横屏模式的分辨率，例如640 × 360。
       */
      encParam.videoResolution = TRTCVideoResolution.TRTCVideoResolution_960_540;
      /**
       * TRTCVideoResolutionMode
       *【字段含义】分辨率模式（横屏分辨率 - 竖屏分辨率）
      *【推荐取值】Window 和 Mac 建议选择 TRTCVideoResolutionModeLandscape
      *【特别说明】如果 videoResolution 指定分辨率 640 × 360，resMode 指定模式为 Portrait，则最终编码出的分辨率为360 × 640。
      */
      encParam.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModeLandscape;
      encParam.videoFps = 25;
      encParam.videoBitrate = 800;
      encParam.enableAdjustRes = true;
      trtcCloud.setVideoEncoderParam(encParam);

      // 6. 开启美颜
      // setBeautyStyle 详细信息，请参考：https://trtc-1252463788.file.myqcloud.com/electron_sdk/docs/TRTCCloud.html#setBeautyStyle
      trtcCloud.setBeautyStyle(this.beautyParams.style,
        this.beautyParams.beauty, this.beautyParams.white, this.beautyParams.ruddiness);

      // 7. 显示摄像头画面和开房麦克风
      this.startCameraAndMic();

      // 执行倒计时
      // this.startLiveCountDown();

      // 挂到 windows BOM 下，方便调试。
      // window.trtc = trtcCloud;
      // window.videoEncode = new BDVideoEncode(trtcCloud);
      // window.beauty = new BDBeauty(trtcCloud);
    },

    /**
    * 当进入房间时触发，显示摄像头画面，设置填充模式
    * @param {number} result - 进房结果， 大于 0 时，为进房间消耗的时间，这表示进进房成功。如果为 -1 ，则表示进房失败。
    * */
    onEnterRoom(result) {
      if (result > 0) {
        logger.log(`onEnterRoom，进房成功，使用了 ${result} 毫秒`);
      } else {
        logger.warn(`onEnterRoom: 进房失败 ${result}`);
      }
    },
    /**
     * 当退出房间时触发
     */
    onExitRoom(reason) {
      logger.warn(`onExitRoom, reason: ${reason}`);
    },
    /**
     * 对视频元素进行排版
     */
    videoTypeSetting() {
      // const marginTop = 80;
      // const margin = 5;
      // const H = this.subStreamHeight;
      // const m = 0;
      // let topIndex = 0;
      // const rv = this.remoteVideos;
      // let typeClassName = '';
      // let top = 0;
      // let i = 0;
      // console.log('remoteVideos', rv);
      // for (let id in rv) {
      //   topIndex = Math.floor(i / 2);
      //   typeClassName = i % 2 === 0 ? 'right' : 'left';
      //   top = (topIndex * H + (topIndex + 1) * margin) + marginTop;
      //   rv[id].className = `user-video-container ${typeClassName}`;
      //   rv[id].style.top = `${top}px`;
      //   logger.log(`videoTypeSetting: i:${i}, ti: ${topIndex},
      //   top ${top}, H: ${H}, m: ${m}, id:${id},`);
      //   i += 1;
      // }
    },
    /**
     * 开始渲染本地或远程用户的首帧画面
     */
    onFirstVideoFrame(userId, streamType, width, height) {
      let uid = userId;
      const st = streamType;
      const w = width;
      const h = height;
      // console.info(`trtc_demo: onFirstVideoFrame
      // userId:${uid}|streamType:${st}|width:${w}|height:${h}`);
      // 添加用户的混流信息（包括本地和远端用户），并实时更新混流信息
      if (uid === null || uid === '') {
        uid = this.userId;
      }
      let find = false;
      this.mixStreamInfos.forEach((item) => {
        const i = item;
        if (find || i.userId !== uid) return;
        // 这里有两种情况（ userId 相同说明当前首帧用户的一路画面已在混流中）
        // 1. 流类型与当前混流的一路相同，无需添加
        // 2. 流类型与当前混流类型不同，主流中的大小流切换了，需要重新设置这路画面的 streamType
        if (i.streamType === st) {
          i.width = w;
          i.height = h;
          find = true;
        } else if (st !== TRTCVideoStreamType.TRTCVideoStreamTypeSub) {
          i.streamType = st;
          find = true;
        }
      });
      if (!find
        && !(st === TRTCVideoStreamType.TRTCVideoStreamTypeBig && uid === this.userId)) {
        const mixUser = {
          userId: uid,
          roomId: '',
          streamType: st,
          width: w,
          height: h,
          fps: 15,
          pureAudio: this.pureAudioStyle,
        };
        this.mixStreamInfos.push(mixUser);
        this.updateMixTranscodeInfo();
      } else if (uid !== this.userId) {
        this.updateMixTranscodeInfo();
      }
    },
    // 更新云端混流界面信息（本地用户进房或远程用户进房或开启本地屏幕共享画面则更新，可根据需求设置混哪一路画面）
    updateMixTranscodeInfo() {
      // 没有打开云端混流功能则退出
      if (!this.mixTranscoding) return;
      // 云端混流的没有辅流界面，则退出（无需混流）
      if (this.mixStreamInfos.length === 0) {
        trtcCloud.setMixTranscodingConfig(null);
        return;
      }
      // 如果使用的是纯音频进房，则需要混流设置每一路为纯音频，云端会只混流音频数据
      if (this.pureAudioStyle) {
        this.mixStreamInfos.forEach((item) => {
          const i = item;
          i.pureAudio = true;
        });
      }
      // 没有主流，直接停止混流
      if (this.muteLocalVideo && this.muteLocalAudio) {
        trtcCloud.setMixTranscodingConfig(null);
        return;
      }
      // 连麦后的 User 可进行设置对应的 roomId
      const self = this;
      this.pkUsers.forEach((users) => {
        const mixSI = self.mixStreamInfos;
        const index = mixSI.findIndex((item) => {
          const i = item;
          return users.userId === i.userId;
        });
        if (index !== -1) {
          mixSI[index].roomId = users.roomId.toString();
        }
      });
      // 配置本地主流的混流信息（可根据自己的需求设置参数，下面仅供参考）
      const localMainStream = {
        userId: this.userId,
        roomId: '',
        streamType: TRTCVideoStreamType.TRTCVideoStreamTypeBig,
        width: 960,
        height: 720,
        fps: 15,
        pureAudio: this.pureAudioStyle,
      };
      // 这里的显示混流的方式只提供参考，如需其他需求请参考以下方式实现
      if (this.appId === 0 || this.bizId === 0) {
        this.notify('混流功能不可使用，请获取混流的账号信息', 'warning');
        return;
      }
      const config = new TRTCTranscodingConfig();
      config.mode = TRTCTranscodingConfigMode.TRTC_TranscodingConfigMode_Manual;
      config.appId = this.appId;
      config.bizId = this.bizId;
      config.videoWidth = localMainStream.width;
      config.videoHeight = localMainStream.height;
      config.videoBitrate = 800;
      config.videoFramerate = 15;
      config.videoGOP = 1;
      config.audioSampleRate = 48000;
      config.audioBitrate = 64;
      config.audioChannels = 1;
      config.mixUsersArraySize = 1 + this.mixStreamInfos.length;
      config.mixUsersArray = [];
      // 设置每一路子画面的位置信息（仅供参考）
      let zOrder = 1;
      let i = 0;
      const localMainView = new TRTCMixUser();
      localMainView.userId = localMainStream.userId;
      localMainView.roomId = localMainStream.roomId;
      localMainView.rect = new Rect();
      localMainView.rect.left = 0;
      localMainView.rect.top = 0;
      localMainView.rect.right = localMainStream.width;
      localMainView.rect.bottom = localMainStream.height;
      zOrder += 1;
      localMainView.zOrder = zOrder;
      localMainView.pureAudio = this.pureAudioStyle;
      localMainView.streamType = localMainStream.streamType;
      const mixWidth = 160;
      const mixHeight = 120;
      config.mixUsersArray.push(localMainView);
      this.mixStreamInfos.forEach((item) => {
        i += 1;
        const left = parseInt(config.videoWidth - (i % 5) * (mixWidth + 10), 10);
        const top = parseInt(config.videoHeight - (mixHeight + 20), 10);
        const mixUser = new TRTCMixUser();
        mixUser.userId = item.userId;
        mixUser.roomId = item.roomId <= 0 ? '' : item.roomId.toString();
        mixUser.rect = new Rect();
        mixUser.rect.left = left;
        mixUser.rect.top = top;
        mixUser.rect.right = mixWidth + left;
        mixUser.rect.bottom = mixHeight + top;
        zOrder += 1;
        mixUser.zOrder = zOrder;
        mixUser.pureAudio = item.pureAudio;
        mixUser.streamType = item.streamType;
        config.mixUsersArray.push(mixUser);
      });
      trtcCloud.setMixTranscodingConfig(config);
    },
    /**
     * 当远端用户进入本房间，显示出此用户的画面
    * */
    onRemoteUserEnterRoom(uid) {
      logger.warn('onRemoteUserEnterRoom', uid);
      this.notify(`主播 ${uid} 进入房间`);
    },

    /**
     * 当远程用户离开房间，关闭此用户的画面
     */
    onRemoteUserLeaveRoom(uid) {
      this.notify(`主播 ${uid} 离开房间`);
      logger.warn('onRemoteUserLeaveRoom', uid);
    },
    /**
     * 当远程用户屏幕分享的状态发生变化，会根据 available 参数打开或关闭画面
     */
    onUserSubStreamAvailable(uid, available) {
      logger.log(`onUserSubStreamAvailable ${uid}, ${available}`);
      if (available) {
        this.showRemoteScreenSharing(uid);
        this.isRemoteScreenSharing = true;
      } else {
        this.closeRemoteScreenSharing(uid);
        this.isRemoteScreenSharing = false;
      }
    },

    /**
     * 显示远程用户的屏幕分享
     */
    showRemoteScreenSharing(uid) {
      const id = `${uid}-${this.roomId}-${TRTCVideoStreamType.TRTCVideoStreamTypeSub}`;
      logger.log(`showRemoteScreenSharing:  uid: ${id}`);
      const W = this.subStreamWidth;
      const H = this.subStreamHeight;
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.style.width = `${W}px`;
        el.style.height = `${H}px`;
        this.videoContainer.appendChild(el);
      }
      this.remoteVideos[id] = el;
      trtcCloud.startRemoteSubStreamView(uid, el);
      trtcCloud.setRemoteSubStreamViewFillMode(uid, TRTCVideoFillMode.TRTCVideoFillMode_Fill);
      this.videoTypeSetting();
    },

    /**
     * 关闭远程用户的屏幕分享
     *
     * @param {*} uid
     */
    closeRemoteScreenSharing(uid) {
      const id = `${uid}-${this.roomId}-${TRTCVideoStreamType.TRTCVideoStreamTypeSub}`;
      const el = document.getElementById(id);
      if (el) {
        this.videoContainer.removeChild(el);
      }
      delete this.remoteVideos[id];
      this.videoTypeSetting();
    },
    /**
     * 启动摄像头、麦克风，显示本地画面
     */
    startCameraAndMic() {
      const id = `local_video-${this.roomId}-${TRTCVideoStreamType.TRTCVideoStreamTypeBig}`;
      logger.log(`startCameraAndMic: ${id}`);
      let view = document.getElementById(id);
      if (!view) {
        view = document.createElement('div');
        view.id = id;
        view.className = 'local-video-container';
        this.videoContainer.appendChild(view);
      }
      trtcCloud.startLocalPreview(view);
      trtcCloud.startLocalAudio();
      trtcCloud.setLocalViewFillMode(TRTCVideoFillMode.TRTCVideoFillMode_Fill);
      setTimeout(() => {
        this.resize();
      }, 100);
    },
    // 设置视频窗口的大小
    setVideoSize() {},
    /**
     * 倒计时3秒开始直播
     */
    startLiveCountDown() {
      const gap = 1000;
      this.countDown = this.countDownMax;
      const intervalID = setInterval(() => {
        this.countDown -= gap / 1000;
        logger.log('startLiveCountDown: ', this.countDown);
        if (this.countDown <= 0) {
          this.startLive();
          clearInterval(intervalID);
        }
      }, gap);
    },
    /**
     * 开始直播，注意：进入房间会开始推流
     */
    startLive() {
      this.timeCount = 0;
      this.courseTimer = setInterval(() => {
        this.timeCount += 1;
      }, 1000);
      this.isPushing = true;
      // 进入房间便会开始推流
      // TRTCParams 详细说明，请查看文档：https://trtc-1252463788.file.myqcloud.com/electron_sdk/docs/TRTCParams.html
      const param = new TRTCParams();
      param.sdkAppId = this.sdkAppId;
      param.userSig = this.userSig;
      param.roomId = this.roomId;
      param.userId = this.userId;
      param.streamId = this.courseUUID;
      param.privateMapKey = ''; // 房间签名（非必填）7.1.157 版本以上（含），可以忽略此参数，7.1.157 之前的版本建议赋值为空字符串
      param.businessInfo = ''; // 业务数据（非必填）7.1.157 版本以上（含），可以忽略此参数，7.1.157 之前的版本建议赋值为空字符串
      // 直播场景下的角色，仅适用于直播场景（TRTCAppSceneLIVE 和 TRTCAppSceneVoiceChatRoom），
      // 视频通话场景下指定无效。默认值：主播（TRTCRoleAnchor）
      param.role = TRTCRoleType.TRTCRoleAnchor;
      trtcCloud.enterRoom(param, TRTCAppScene.TRTCAppSceneLIVE);
      // 上课处理后端业务逻辑
      liveCourseOnline({ uuid: this.courseUUID });
    },

    /**
     * 停止直播
     */
    stopLive() {
      this.isPushing = false;
      trtcCloud.stopScreenCapture(); // 停止屏幕分享
      trtcCloud.exitRoom(); // 退出房间
      setTimeout(() => {
        // 推流结束后，继续观看本地画面
        this.startCameraAndMic();
        // 下课
        liveCourseOffline({ uuid: this.courseUUID });
        clearInterval(this.courseTimer);
      }, 0);
    },
    /**
     * 开启 / 关闭麦克风
     */
    onMuteLocalAudio() {
      this.muteLocalAudio = !this.muteLocalAudio;
      trtcCloud.muteLocalAudio(this.muteLocalAudio);
    },
    showBeautyDialog() {
      this.$refs.beauty.show(this.beautyParams);
    },
    /**
     * 开启美颜
     */
    openBeauty(params) {
      this.beautyParams = {
        style: params.style,
        beauty: params.beauty,
        white: params.white,
        ruddiness: 0,
      };
      trtcCloud.setBeautyStyle(params.style, params.beauty, params.white, 0);
    },
    addZero(num) {
      return num > 9 ? num : `0${num}`;
    },
    close() {
      if (this.isPushing) {
        this.notify('先停止下课，再退出直播间！', 'warning');
        return;
      }
      this.$refs.aside.close();
      // 关闭采集音视频
      trtcCloud.stopLocalPreview();
      trtcCloud.stopLocalAudio();

      // 清除状态
      this.muteLocalVideo = false;
      this.muteLocalAudio = false;
      this.pkUsers = [];
      this.$router.push({ path: '/onduty/rili' });
    },
    notify(msg, type = 'success', title = '提示') {
      this.$message({
        showClose: true,
        title,
        message: msg,
        type,
        offset: 250,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.live-room-container {
  position: relative;
  background: #FAFBFF;
  height: 100%;
  width: 100%;
  .el-main {
    padding: 0;
    position: relative;
  }
}

#count-down-layer{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 66vw;
  height: 14vh;
  font-size: 7vh;
  border: 0.5vw #3f3 solid;
  color: #3f3;
  margin-top: -7vh;
  margin-left: -33vw;
  text-align: center;
  line-height: 14vh;
  overflow: hidden;
  z-index: 99;
}
</style>
