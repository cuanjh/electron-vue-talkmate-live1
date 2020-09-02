<template>
  <el-container>
    <sidebar class="sidebar-container"></sidebar>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-container>
</template>

<script>
import { Sidebar } from './components';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    Sidebar,
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
