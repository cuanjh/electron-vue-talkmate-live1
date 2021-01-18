import {
  showLoading,
  closeLoading,
} from './loading';

const qiniu = require('qiniu-js');

const uploadQiniu = (file, token, key) => {
  showLoading();
  return new Promise((resolve, reject) => {
    const finishedAttr = [];
    let compareChunks = [];

    const config = {
      useCdnDomain: true,
      disableStatisticsReport: false,
      retryCount: 6,
      region: qiniu.region.z0,
    };

    const putExtra = {
      fname: '',
      params: {},
      // ,
      // mimeType: ['audio/mp3', 'audio/mpeg', 'video/mp4',
      // 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // 'application/vnd.ms-powerpoint', 'image/jpeg', 'image/png',
      // 'image/webp', 'application/pdf'] || null
    };

    const observable = qiniu.upload(file, key, token, putExtra, config);

    observable.subscribe({
      next: (response) => {
        // console.log(response);
        const chunksCopy = response.chunks || [];
        // const totalCopy = response.total;
        // 这里对每个chunk更新进度，并记录已经更新好的避免重复更新，
        // 同时对未开始更新的跳过
        for (let i = 0; i < chunksCopy.length; i += 1) {
          /* eslint-disable */
          if (chunksCopy[i].percent === 0 || finishedAttr[i]) {
            continue;
          }
          if (compareChunks[i].percent === chunksCopy[i].percent) {
            continue;
          }
          /* eslint-enable */
          if (chunksCopy[i].percent === 100) {
            finishedAttr[i] = true;
          }
          // console.log(`${chunksCopy[i].percent}%`);
        }
        // console.log(`进度：${totalCopy.percent}%`);
        compareChunks = chunksCopy;
      },
      error: (err) => {
        reject(err);
      },
      complete: (res) => {
        closeLoading();
        resolve(res);
      },
    });
  }, () => {
    closeLoading();
    // console.log(error);
  });
};

export default uploadQiniu;
