<template>
  <div class="mic">
    <div class="mic-panel">
      <div class="panel-desc">请对准麦克风读出以下数字</div>
      <div class="panel-nums">
        <span>1</span><span>2</span><span>3</span>
        <span>4</span><span>5</span><span>6</span><span>7</span>
      </div>
      <div class="panel-progress">
        <span v-for="i in parseInt(tabData.micVolume/3)" :key="i"></span>
      </div>
    </div>
    <div class="desc" v-if="tabData.deviceName">
        · 检测到麦克风：{{ tabData.deviceName }}</div>
    <div class="desc" v-else>· 检测不到麦克风的硬件信息</div>
    <div class="question">是否看到音量条波动？</div>
    <div class="btns">
      <a href="javascript:;" class="btn plain"
        @click="micTest(false)"><span>看不到</span></a>
      <a href="javascript:;" class="btn primary"
        @click="micTest(true)"><span>能看到</span></a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabData'],
  mounted() {
    this.$emit('handlerClick', { tab: 'mic', event: 'startTestMic' });
  },
  methods: {
    micTest(flag) {
      this.$emit('handlerClick', { tab: 'mic', flag });
    },
  },
  destroyed() {
    this.$emit('handlerClick', { tab: 'mic', event: 'stopTestMic' });
  },
};
</script>

<style lang="less" scoped>
.mic {
  display: flex;
  flex-direction: column;
  align-items: center;
  .mic-panel {
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
  span {
    font-size: 32px;
    font-family: YouSheBiaoTiHei;
    color: #000000;
  }
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
  span {
    width: 10px;
    height: 100%;
    background: #1aad19;
    border-radius: 3px;
    margin: 0 1px;
  }
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
