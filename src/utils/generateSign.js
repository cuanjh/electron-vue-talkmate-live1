import md5 from 'md5';
import moment from 'moment';
import cookie from './cookie';
import config from './config';

const getDeviceId = () => {
  let time = Math.round(new Date().getTime() / 1000).toString();
  for (let i = 0; i < 6; i += 1) {
    time += Math.floor(Math.random() * 10);
  }
  return md5(time);
};

const generateSign = (appSecret, _params) => {
  let str = '';
  const keys = Object.keys(_params).sort();
  keys.forEach((key) => {
    str += key + _params[key];
  });
  return md5(appSecret + str).toUpperCase();
};

const randomString = (len) => {
  let rdmString = '';
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
  return rdmString.substr(0, len);
};

const handleParams = (_params, method) => {
  const params = _params || {};
  // 公共参数
  const commonObj = {
    appKey: config.appKey,
    HTTP_API_VERSION: '4.1',
    reqId: randomString(16),
    timeStamp: moment(new Date()).format('YYYYMMDDHHMMss'),
  };

  let deviceId = '';
  if (cookie.getCookie('device_id')) {
    deviceId = cookie.getCookie('device_id');
  } else {
    deviceId = getDeviceId();
    cookie.setCookie('device_id', deviceId);
  }
  commonObj.device_id = deviceId;

  if (cookie.getCookie('user_id')) {
    commonObj.user_id = cookie.getCookie('user_id');
  }

  if (cookie.getCookie('verify')) {
    commonObj.verify = cookie.getCookie('verify');
  }

  let sign = '';
  const obj = {};
  let str = '';
  Object.keys(commonObj).forEach((key) => {
    obj[key] = commonObj[key];
    str += `${key}=${commonObj[key]}&`;
  });

  Object.keys(params).forEach((key) => {
    if (method && method.toLowerCase() === 'get') {
      obj[key] = params[key];
      str += `${key}=${params[key]}&`;
    }
  });
  // 生成sign
  sign = generateSign(config.appSecret, obj);
  // obj['sign'] = sign
  // return obj
  str += `sign=${sign}`;
  return `?${str}`;
};

export default handleParams;
