<template>
  <div class="speaker">
    <audio src="/resources/testspeak.mp3" ref="speakerAudio" controls></audio>
    <div class="desc"
      v-if="tabData.deviceName">
        · 检测到扬声器：{{ tabData.deviceName }}</div>
    <div class="desc" v-else>· 检测不到扬声器的硬件信息</div>
    <div class="question">您能否听到声音？</div>
    <div class="btns">
      <a href="javascript:;"
        class="btn plain" @click="speakerTest(false)"><span>听不到</span></a>
      <a href="javascript:;"
        class="btn primary" @click="speakerTest(true)"><span>能听到</span></a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tabData'],
  mounted() {
    if (this.$refs.speakerAudio) {
      this.$refs.speakerAudio.play();
    }
  },
  methods: {
    show() {
    },
    speakerTest(flag) {
      this.$emit('handlerClick', { tab: 'speaker', flag });
    },
    close() {
      if (this.$refs.speakerAudio) {
        this.$refs.speakerAudio.pause();
      }
    },
  },
  destroyed() {
    this.close();
  },
};
</script>

<style lang="less" scoped>
.speaker {
  display: flex;
  flex-direction: column;
  align-items: center;
  audio {
    width: 60%;
    margin-top: 60px;
  }
  .desc {
    font-size: 16px;
    font-weight: 300;
    color: #595757;
    margin-top: 20px;
  }
  .question {
    font-size: 32px;
    font-weight: 600;
    color: #000000;
    margin-top: 80px;
  }
}

.speaker .btns {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
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
