import {
  TRTCBeautyStyle,
} from 'trtc-electron-sdk/liteav/trtc_define';

export default class BDBeauty {
  constructor(trtc) {
    this.trtc = trtc;
    this.style = TRTCBeautyStyle.TRTCBeautyStyleNature;
    this.beauty = 5;
    this.white = 5;
    this.ruddiness = 5;
  }

  get help() {
    const helpOpt = {
      style: {
        type: Object.values(TRTCBeautyStyle),
        current: this.style,
      },
      beauty: {
        type: 'number',
        current: this.beauty,
      },
      white: {
        type: 'number',
        current: this.white,
      },
      ruddiness: {
        type: 'number',
        current: this.ruddiness,
      },
    };
    // console.log(helpOpt);
    return helpOpt;
  }

  update() {
    this.trtc.setBeautyStyle(this.style, this.beauty, this.white, this.ruddiness);
  }

  set style(value) {
    this.style = parseInt(value, 10);
    this.update();
  }

  set beauty(value) {
    this.beauty = parseInt(value, 10);
    this.update();
  }

  set white(value) {
    this.white = parseInt(value, 10);
    this.update();
  }

  set ruddiness(value) {
    this.ruddiness = parseInt(value, 10);
    this.update();
  }
}
