<template>
  <transition name="fade" mode="out-in">
    <div class="self-dialog" v-show="dialogVisible">
      <div class="self-dialog-wrap">
        <el-container class="live-room-container" direction="vertical">
          <header-comp
            :netWorkStatis="netWorkStatis"
            :courseTitle="courseTitle"
            :courseHMS="courseHMS" />
          <el-container>
            <el-main>
              <tiw-comp :boardData="boardData"/>
              <footer-comp></footer-comp>
            </el-main>
            <aside-comp></aside-comp>
          </el-container>
        </el-container>
      </div>
    </div>
  </transition>
</template>

<script>
import HeaderComp from './Header.vue';
import AsideComp from './Aside.vue';
import TiwComp from './TIW.vue';
import FooterComp from './Footer.vue';

export default {
  data() {
    return {
      dialogVisible: false,
      netWorkStatis: {
        uploss: 0,
        rtt: 0,
      },
      courseTitle: '体验课',
      courseTimer: null,
      timeCount: 0,

      muteLocalAudio: false,
      // board(白板操作)
      boardData: {
        currentBoardId: null, // 当前白板ID
        boardIdlist: [], // 白板ID列表
        current: 0, // 当前白板index
        total: 0, // 总页数
      },
      boardWidth: 800,
      boardHeight: 450,
    };
  },
  components: {
    HeaderComp,
    AsideComp,
    TiwComp,
    FooterComp,
  },
  computed: {
    courseHMS() {
      const ret = `${this.addZero(Math.floor(this.timeCount / 60 / 60))}:${this.addZero(Math.floor(this.timeCount / 60))}:${this.addZero(Math.floor(this.timeCount % 60))}`;
      return ret;
    },
  },
  methods: {
    show(course) {
      console.log(course);
      if (course) {
        this.courseTitle = course.title;
      }
      this.dialogVisible = true;
    },
    addZero(i) {
      return i < 10 ? `0${i}` : i.toString();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.self-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .4);
  z-index: 999;
  &-wrap {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
}

.el-container {
  position: relative;
  background: #FAFBFF;
  height: 100%;
  width: 100%;
  .el-main {
  }
}
</style>
