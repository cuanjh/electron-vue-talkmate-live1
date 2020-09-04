<template>
  <div class="result">
    <div class="result-panel">
      <div class="item">
        <div class="name">扬声器</div>
        <div class="passed" v-show="tabData.testSpeaker"><i class="el-icon-check"></i>通过</div>
        <div class="notpassed" v-show="!tabData.testSpeaker">
          <span class="tip"><i class="el-icon-close"></i>未检测到您的设备</span>
          <span class="help" @click="clickHelp('https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E6%89%AC%E5%A3%B0%E5%99%A8%E6%80%8E%E4%B9%88%E5%8A%9E&rsv_spt=1&oq=electron%2520%25E8%25B7%25B3%25E8%25BD%25AC%25E5%25A4%2596%25E9%2593%25BE%25E6%258E%25A5&rsv_pq=99071dea00004ea6&rsv_t=9e97Nb2vYKAJiRQoof5YGDA9Q6vQYpF5cXpSOmdtHfYDRHR6kyBzkQK4YZ3jW%2B9F2h1O&rqlang=cn&rsv_enter=1&rsv_dl=ts_0&rsv_btype=t&inputT=16786&rsv_sug3=444&rsv_sug1=220&rsv_sug7=101&rsv_sug2=0&prefixsug=%25E6%259C%25AA%25E6%25A3%2580%25E6%25B5%258B%25E5%2588%25B0%25E6%2589%25AC%25E5%25A3%25B0%25E5%2599%25A8&rsp=0&rsv_sug4=17930')">帮助</span>
        </div>
      </div>
      <div class="item">
        <div class="name">麦克风</div>
        <div class="passed" v-show="tabData.testMic"><i class="el-icon-check"></i>通过</div>
        <div class="notpassed" v-show="!tabData.testMic">
          <span class="tip"><i class="el-icon-close"></i>未检测到您的设备</span>
          <span class="help" @click="clickHelp('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E9%BA%A6%E5%85%8B%E9%A3%8E%E6%80%8E%E4%B9%88%E5%8A%9E&rsv_spt=1&oq=%25E6%259C%25AA%25E6%25A3%2580%25E6%25B5%258B%25E5%2588%25B0%25E6%2589%25AC%25E5%25A3%25B0%25E5%2599%25A8%25E6%2580%258E%25E4%25B9%2588%25E5%258A%259E&rsv_pq=9d881ff100004b5d&rsv_t=aa4asICl2T3NneUu5n6IGiK7viG3BQo%2Biyo8PBFrvqn8Sq35odeFEDZ%2BLlSfqe4Vb5j4&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=16786&rsv_sug3=458&bs=%E6%9C%AA%E6%A3%80%E6%B5%8B%E5%88%B0%E6%89%AC%E5%A3%B0%E5%99%A8%E6%80%8E%E4%B9%88%E5%8A%9E')">帮助</span>
        </div>
      </div>
      <div class="item">
        <div class="name">摄像头</div>
        <div class="passed" v-show="tabData.testCamera"><i class="el-icon-check"></i>通过</div>
        <div class="notpassed" v-show="!tabData.testCamera">
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
</template>

<script>
export default {
  props: ['tabData'],
  methods: {
    completed() {
      this.$emit('handlerClick', { tab: 'result', event: 'complete' });
    },
  },
};
</script>

<style lang="less" scoped>
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

.btns {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  .btn {
    width: 190px;
    height: 52px;
    border: 2px solid #007aff;
    border-radius: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &:first-child {
      margin-right: 40px;
    }
     span {
      font-size: 20px;
      font-weight: 400;
      color: #007aff;
    }
  }
  .plain {
    background: #FFFFFF;
  }
  .primary {
    background: #007aff;
    span {
      color: #FFFFFF;
    }
  }
}
</style>
