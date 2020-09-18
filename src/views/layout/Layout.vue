<template>
  <el-container v-show="$store.getters.layoutIsShow">
    <sidebar class="sidebar-container"></sidebar>
    <win-traffic />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-container>
</template>

<script>
import WinTraffic from '@/components/WinTraffic/WinTraffic.vue';

import { Sidebar } from './components';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  data() {
    return {
    };
  },
  components: {
    WinTraffic,
    Sidebar,
  },
  mounted() {
    this.$store.commit('SET_LAYOUTISSHOW', true);
  },
  mixins: [ResizeMixin],
  computed: {
  },
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .el-container {
    height: 100%;
  }
</style>
