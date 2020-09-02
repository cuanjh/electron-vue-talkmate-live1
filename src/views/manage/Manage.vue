<template>
  <el-container id="manage-container" class="manage-container">
    <el-header class="manage-header">
      <div class="item">
        <div class="name">我的课程</div>
        <div class="result">{{summary.myCourse}}<span>门</span></div>
      </div>
      <div class="item">
        <div class="name">已完结</div>
        <div class="result">{{summary.completed}}<span>门</span></div>
      </div>
      <div class="item">
        <div class="name">累计直播</div>
        <div class="result">{{summary.totalHour}}<span>小时</span></div>
      </div>
      <div class="item">
        <div class="name">待上课</div>
        <div class="result">{{summary.notStart}}<span>节</span></div>
      </div>
    </el-header>
    <el-main class="main-content">
      <div class="course-list">
        <div class="course-item"
          v-for="item in moduleList"
          :key="item.code"
          @click="entryModuleDetail(item)">
          <div class="cover">
            <el-image
              v-if="item.cover_v2"
              :src="uploadDomain + item.cover_v2"
              fit="cover">
            </el-image>
            <div class="progress">进度{{item.completedNum}}/{{item.live_course.length}}</div>
          </div>
          <div class="period">
            课程时间：{{item.liveInfo.startDate.replace(/-/g, '.')}} -
            {{item.liveInfo.endDate.replace(/-/g, '.')}}
          </div>
          <div class="state" v-if="item.isCompleted">已完结
            <i class="el-icon-check completed"></i>
          </div>
          <div class="state" v-else>下次直播：{{ item.nextTime }}</div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from 'moment';
import config from '@/utils/config';

export default {
  data() {
    return {
      uploadDomain: config.uploadDomain,
      moduleList: [],
      summary: {
        myCourse: 0,
        completed: 0,
        totalHour: 0,
        notStart: 0,
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch('GetModuleList', {
        user_id: this.$store.getters.userId,
      }).then((res) => {
        console.log(res);
        if (res.success && res.data) {
          this.moduleList = [];
          this.summary.myCourse = res.data.length;
          this.summary.completed = 0;
          this.summary.notStart = 0;
          let count = 0;
          res.data.forEach((item) => {
            const obj = item;
            obj.isCompleted = false;
            // 判断是否完结
            const findIndex = item.live_course.findIndex((c) => {
              const ret = c.state === 0;
              return ret;
            });
            if (findIndex === -1) {
              this.summary.completed += 1;
              obj.isCompleted = true;
              obj.completedNum = item.live_course.length;
            } else {
              obj.nextTime = moment(new Date(item.live_course[findIndex].startTime * 1000)).format('YYYY.MM.DD HH:mm');
              obj.completedNum = findIndex + 1;
              this.summary.notStart += item.live_course.length - (findIndex + 1);
            }
            item.live_course.filter((c) => {
              const ret = c.state === -1;
              return ret;
            }).forEach((i) => {
              count += i.realEndTime - i.startTime;
            });
            this.moduleList.push(obj);
          });
          this.summary.totalHour = Math.round(count / 60 / 60);
        }
      });
    },
    entryModuleDetail(item) {
      this.$router.push({ path: `/manage/detail/${item.code}` });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  width: 100%;
  height: 121px !important;
  background: #ffffff;
  border-radius: 0px 6px 0px 0px;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 60px;
  user-select: none;
}

.el-header .item {
  display: flex;
  flex-direction: column;
}

.el-header .item .name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
  margin-bottom: 8px;
}

.el-header .item .result {
  font-size: 34px;
  font-family: GoogleSans, GoogleSans-Medium;
  font-weight: 500;
  color: #000000;
}

.el-header .item .result span {
  font-size: 16px;
}

.el-main {
  padding: 40px 0 40px 20px;
}

.course-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.course-item {
  width: 316px;
  height: 241px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.06);
  margin-right: 22px;
  margin-bottom: 22px;
  overflow: hidden;
  cursor: pointer;
  &:nth-child(3n+0) {
    margin-right: 0;
  }
}

.course-item .cover {
  height: 168px;
  width: 100%;
  background: rgba(0,0,0,0.1);
  position: relative;
}

.course-item .cover .el-image {
  height: 168px;
  width: 100%;
}

.course-item .cover .progress {
  position: absolute;
  left: 16px;
  bottom: 10px;
  width: 63px;
  height: 20px;
  background: rgba(0,0,0,0.6);
  border-radius: 15px;
  font-size: 10px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
}

.course-item .period {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 14px;
  margin-left: 16px;
}

.course-item .state {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 4px;
  margin-left: 16px;
}

.course-item .state .completed {
  width: 15px;
  height: 15px;
  background: #00b86b;
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 12px;
  text-align: center;
  line-height: 15px;
  margin-left: 4px;
}
</style>
