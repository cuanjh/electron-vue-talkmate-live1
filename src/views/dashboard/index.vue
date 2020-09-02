<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Phone:{{phonenumber}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'phonenumber',
    ]),
  },
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
