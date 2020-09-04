import TRTCCloud from 'trtc-electron-sdk';
import Log from './log';

// const trtcCloud = new TRTCCloud();

const logger = new Log('TRTCState');
class TRTCState {
  constructor() {
    this.trtcCloud = new TRTCCloud();
    this.camera = false;
    this.mic = false;
    this.micVolume = 0;
    this.speaker = false;
    this.speakerVolume = 0;
    this.network = false;
    this.checkTaskId = 0;
    this.cameraDeviceInfo = null;
    this.micDeviceInfo = null;
    this.speakerDeviceInfo = null;
    this.testMicVolume = 0;

    this.trtcCloud.on('onTestMicVolume', (volume) => {
      this.testMicVolume = volume;
    });
  }

  check(callBack) {
    this.isCameraReady();
    this.isMicReady();
    this.isSpeakerReady();
    this.getMicVolume();
    this.getSpeakerVolume();
    if (typeof callBack === 'function') {
      callBack({
        camera: this.camera,
        mic: this.mic,
        speaker: this.speaker,
        micVolume: this.micVolume,
        speakerVolume: this.speakerVolume,
        cameraDeviceInfo: this.cameraDeviceInfo,
        micDeviceInfo: this.micDeviceInfo,
        speakerDeviceInfo: this.speakerDeviceInfo,
        testMicVolume: this.testMicVolume,
      });
    }
  }

  startCheckTask(callBack) {
    this.check(callBack);
    // this.checkTaskId = setInterval(() => {
    //   this.check(callBack);
    // }, 500);
    // logger.log('startCheckTask, checkTaskId', this.checkTaskId);
  }

  stopCheckTask() {
    logger.log('stopCheckTask, checkTaskId', this.checkTaskId);
    clearInterval(this.checkTaskId);
  }

  isCameraReady() {
    const deviceInfo = this.trtcCloud.getCurrentCameraDevice();
    if (deviceInfo && deviceInfo.deviceId !== '') {
      this.camera = true;
      this.cameraDeviceInfo = deviceInfo;
      return true;
    }
    const deviceList = this.trtcCloud.getCameraDevicesList();
    if (deviceList.length >= 1) {
      if (deviceList.length > 1) {
        this.trtcCloud.setCurrentCameraDevice(deviceList[0].deviceId);
        const obj = deviceList[0];
        this.cameraDeviceInfo = obj;
      }
      this.camera = true;
      return true;
    }
    return false;
  }

  isMicReady() {
    const deviceInfo = this.trtcCloud.getCurrentMicDevice();
    if (deviceInfo && deviceInfo.deviceId !== '') {
      this.mic = true;
      this.micDeviceInfo = deviceInfo;
      return true;
    }
    const deviceList = this.trtcCloud.getMicDevicesList();
    if (deviceList.length >= 1) {
      if (deviceList.length > 1) {
        this.trtcCloud.setCurrentMicDevice(deviceList[0].deviceId);
        const obj = deviceList[0];
        this.micDeviceInfo = obj;
      }
      this.mic = true;
      return true;
    }
    return false;
  }

  isSpeakerReady() {
    const deviceInfo = this.trtcCloud.getCurrentSpeakerDevice();
    if (deviceInfo && deviceInfo.deviceId !== '') {
      this.speaker = true;
      this.speakerDeviceInfo = deviceInfo;
      return true;
    }
    const deviceList = this.trtcCloud.getSpeakerDevicesList();
    if (deviceList.length >= 1) {
      if (deviceList.length > 1) {
        this.trtcCloud.setCurrentSpeakerDevice(deviceList[0].deviceId);
        const obj = deviceList[0];
        this.speakerDeviceInfo = obj;
      }
      this.speaker = true;
      return true;
    }
    return false;
  }

  getSpeakerVolume() {
    this.speakerVolume = this.trtcCloud.getCurrentSpeakerVolume();
    return this.speakerVolume;
  }

  getMicVolume() {
    this.micVolume = this.trtcCloud.getCurrentMicDeviceVolume();
    return this.micVolume;
  }

  startTestMic() {
    this.trtcCloud.startMicDeviceTest(300);
  }

  stopTestMic() {
    this.trtcCloud.stopMicDeviceTest();
    this.testMicVolume = 0;
  }
}
const trtcState = new TRTCState();
export default trtcState;
