import {
  TRTCVideoEncParam,
  TRTCVideoResolution,
  TRTCVideoResolutionMode,
} from 'trtc-electron-sdk/liteav/trtc_define';

export default class BDVideoEncode {
  constructor(trtc) {
    this.trtc = trtc;
    this.encParam = new TRTCVideoEncParam();
    this.encParam.videoResolution = TRTCVideoResolution.TRTCVideoResolution_640_360;
    this.encParam.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModeLandscape;
    this.encParam.videoFps = 25;
    this.encParam.videoBitrate = 800;
    this.encParam.enableAdjustRes = true;
  }

  get help() {
    const helpOpt = {
      videoResolution: {
        type: Object.values(TRTCVideoResolution),
        current: this.encParam.videoResolution,
      },
      resMode: {
        type: Object.values(TRTCVideoResolutionMode),
        current: this.encParam.resMode,
      },
      videoFps: {
        type: 'number',
        current: this.encParam.videoFps,
      },
      videoBitrate: {
        type: 'number',
        current: this.encParam.videoBitrate,
      },
      enableAdjustRes: {
        type: 'boolean',
        current: this.encParam.enableAdjustRes,
      },
    };
    console.log(helpOpt);
    return helpOpt;
  }

  update() {
    console.log('setVideoEncoderParam', this.encParam);
    this.trtc.setVideoEncoderParam(this.encParam);
  }

  set videoResolution(value) {
    this.encParam.videoResolution = parseInt(value, 10);
    this.update();
  }

  set resMode(value) {
    this.encParam.resMode = parseInt(value, 10);
    this.update();
  }

  set videoFps(value) {
    this.encParam.videoFps = parseInt(value, 10);
    this.update();
  }

  set videoBitrate(value) {
    this.encParam.videoBitrate = parseInt(value, 10);
    this.update();
  }

  set enableAdjustRes(value) {
    this.encParam.videoBitrate = parseInt(value, 10);
    this.update();
  }
}
