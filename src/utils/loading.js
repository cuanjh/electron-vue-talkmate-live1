import { Loading } from 'element-ui';

let activeAxios = 0;
let loadingInstance;
let timer;

export const showLoading = () => {
  activeAxios += 1;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      loadingInstance = Loading.service({ fullscreen: true });
    }
  }, 400);
};

export const closeLoading = () => {
  activeAxios -= 1;
  if (activeAxios <= 0) {
    clearTimeout(timer);
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
};
