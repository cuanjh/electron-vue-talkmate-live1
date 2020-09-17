<template>
  <scroll-bar>
    <div class="nav">
      <div class="nav-header">
        <div @click="clickUserPhoto" class="user-photo">
          <el-avatar :size="88" v-if="photo" :src="photo">
            <img src="@/assets/images/common/icon-avatar.svg" />
          </el-avatar>
          <i class="verified" v-if="verifyStatus == 3"></i>
        </div>
      </div>
      <div class="nav-menu">
        <div class="nav-item" v-for="(item, index) in menus" :key="index">
          <div
            :class="['nav-category', { active: $route.path.indexOf(item.key) > -1 }]"
            @click="switchMenu(item.key)"
          >
            <i :class="item.iconCls"></i>
            <span v-text="item.text"></span>
          </div>
        </div>
      </div>
      <div class="blank"></div>
      <footer class="nav-footer">
        <div class="sys-item" @click="setting">
          <i class="setting"></i>
          <span v-text="'设置'"></span>
        </div>
        <div class="sys-item" @click="quit">
          <i class="quit"></i>
          <span v-text="'退出'"></span>
        </div>
        <div class="talkmate-logo">
          <i></i>
        </div>
      </footer>
    </div>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex';
import ScrollBar from '@/components/ScrollBar/index.vue';
// import SidebarItem from './SidebarItem.vue';
const { ipcRenderer } = window.require('electron');

export default {
  data() {
    return {
      activeMenu: '',
      menus: [
        { key: 'course', text: '课程日历', iconCls: 'course' },
        { key: 'manage', text: '我的课程', iconCls: 'manage' },
      ],
    };
  },
  components: {
    // SidebarItem,
    ScrollBar,
  },
  mounted() {
    console.log(this.$route.path);
  },
  computed: {
    ...mapGetters(['sidebar', 'verifyStatus', 'photo']),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    clickUserPhoto() {
      this.setting();
    },
    switchMenu(key) {
      this.activeMenu = key;
      switch (key) {
        // 课程日历
        case 'course':
          this.$router.push({ path: '/course/rili' });
          break;
        // 我的课程
        case 'manage':
          this.$router.push({ path: '/manage/module' });
          break;
        default:
          break;
      }
    },
    setting() {
      switch (this.verifyStatus) {
        // 编辑认证信息
        case 0:
          this.$router.push({ path: '/verify/edit' });
          break;
        // 认证信息详情
        default:
          this.$router.push({ path: '/verify/detail' });
          break;
      }
    },
    quit() {
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
  },
};
</script>
