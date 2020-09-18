<template>
  <div class="win-traffic" v-show="isWin">
    <i class="min" @click="winMin"></i>
    <i :class="[{'max': !isMaxWin, 'maxed': isMaxWin}]" @click="winMax"></i>
    <i class="close" @click="winClose"></i>
  </div>
</template>

<script>
const { ipcRenderer } = window.require('electron');

export default {
  data() {
    return {
      isWin: false,
      isMaxWin: false,
    };
  },
  mounted() {
    ipcRenderer.on('winIsMax', (_, args) => {
      this.isMaxWin = args;
    });
    if (navigator.platform.toLowerCase() === 'win32') {
      this.isWin = true;
    }
  },
  methods: {
    winClose() {
      this.$confirm('你确定要退出“全球说教师直播平台”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: '',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$store.commit('SET_LAYOUTISSHOW', false);
          setTimeout(() => {
            this.$router.push({ path: '/login' });
            ipcRenderer.send('logout');
          }, 100);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出',
        });
      });
    },
    winMin() {
      ipcRenderer.send('winMin');
    },
    winMax() {
      ipcRenderer.send('winMax');
    },
  },
};
</script>

<style lang="less" scoped>
.win-traffic {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 2px 0;
  -webkit-app-region: drag;
  z-index: 10;
  height: 26px;
  i {
    width: 20px;
    height: 20px;
    margin-right: 20px;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
  .min {
    background-image: url('../../assets/images/win/icon-min.svg');
  }
  .min:hover {
    background-image: url('../../assets/images/win/icon-min-hover.svg');
  }
  .max {
    background-image: url('../../assets/images/win/icon-max.svg');
  }
  .max:hover {
    background-image: url('../../assets/images/win/icon-max-hover.svg');
  }
  .maxed {
    width: 15px;
    height: 15px;
    background-image: url('../../assets/images/win/icon-maxed.svg');
  }
  .maxed:hover {
    background-image: url('../../assets/images/win/icon-maxed-hover.svg');
  }
  .close {
    width: 15px;
    height: 15px;
    background-image: url('../../assets/images/win/icon-close.svg');
  }
  .close:hover {
    background-image: url('../../assets/images/win/icon-close-hover.svg');
  }
}
</style>
