<template>
  <el-container id="manage-container" class="manage-container" v-if="moduleInfo">
    <el-header class="manage-header">
      <div class="row">
        <div class="back" @click="back">返回</div>
        <div class="title">{{ moduleInfo.module_name }}</div>
        <a href="javascript:;" class="edit">修改课程简介</a>
      </div>
      <div class="row">
        <div class="summary">
          <div class="item">
            <label>教师姓名：</label>
            <span>{{ moduleInfo.liveInfo.tech_name }}</span>
          </div>
          <div class="item">
            <label>直播时间：</label>
            <span>
              {{ moduleInfo.liveInfo.startDate.replace('-', '年').replace('-', '月') + '日-'
              + moduleInfo.liveInfo.endDate.split('-')[1] + '月'
              + moduleInfo.liveInfo.endDate.split('-')[2] + '日' }}
            </span>
          </div>
          <div class="item">
            <label>授课进程：</label>
            <span>{{
              moduleInfo.live_course.filter(f => {return f.state == -1}).length + '/'
              + moduleInfo.live_course.length
            }}</span>
          </div>
          <div class="item">
            <label>累计学生：</label>
            <span>{{ moduleInfo.subscribe_number }}人</span>
          </div>
          <div class="item">
            <label>累计播放：</label>
            <span>{{ moduleInfo.play_count }}</span>
          </div>
        </div>
      </div>
    </el-header>
    <el-main class="main-content">
      <div class="course-list">
        <div class="course-item" v-for="(c, index) in moduleInfo.live_course" :key="c.uuid">
          <div class="title">
            第<span class="num">{{ index + 1 }}</span>课&nbsp;&nbsp;&nbsp;
            <el-tooltip class="item" effect="dark" :content="c.title" placement="top">
              <div class="content">{{ c.title }}</div>
            </el-tooltip>
          </div>
          <div class="period">上课时间：{{formatCourseDate(c)}}</div>
          <div class="state">
            课程状态：{{ c.state === -1 ? '已结束'
            : (c.state == 0 ? '未开始' : '上课中')}}
            <a href="javascript:;" class="btn" v-if="c.state == -1">课程回放</a>
          </div>
          <div class="statistics">
            <span><i></i>{{formatCourseHour(c)}}分钟</span>
            <span><i></i>{{c.state == -1 ? c.online_number + '学员' : 'N/A '}}</span>
            <span><i></i>{{c.state == -1 ? c.comment_number + '条互动' : 'N/A'}}</span>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      moduleInfo: null,
    };
  },
  mounted() {
    const c = this.$route.params.code;
    this.moduleInfo = this.$store.getters.moduleList.find((f) => {
      const ret = f.code === c;
      return ret;
    });
    console.log(this.moduleInfo);
  },
  methods: {
    formatCourseDate(c) {
      let ret = moment(c.date).format('YYYY年MM月DD日');
      switch (c.state) {
        case 0:
          ret += `${moment(new Date(c.startTime * 1000)).format('HH:mm')}-${moment(new Date(c.EndTime * 1000)).format('HH:mm')}`;
          break;
        case -1:
          ret += `${moment(new Date(c.realStartTime * 1000)).format('HH:mm')}-${moment(new Date(c.realEndTime * 1000)).format('HH:mm')}`;
          break;
        default:
          ret += `${moment(new Date(c.startTime * 1000)).format('HH:mm')}-${moment(new Date(c.realEndTime * 1000)).format('HH:mm')}`;
          break;
      }
      return ret;
    },
    formatCourseHour(c) {
      let ret = '';
      switch (c.state) {
        case 0:
          ret = Math.floor((c.EndTime - c.startTime) / 60);
          break;
        case -1:
          ret = Math.floor((c.realEndTime - c.realStartTime) / 60);
          break;
        default:
          ret = Math.floor((c.endTime - c.realStartTime) / 60);
          break;
      }
      return ret;
    },
    back() {
      this.$router.push({ path: '/manage/module' });
    },
  },
};
</script>

<style lang="less" scoped>

.el-header {
  width: 100%;
  height: 188px !important;
  background: #ffffff;
  border-radius: 0px 6px 0px 0px;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  user-select: none;
  padding-top: 34px;
}

.el-header .row {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.row .back {
  font-size: 18px;
  font-weight: 400;
  color: #053579;
  cursor: pointer;
}

.row .back::after {
  content: ">";
  top: 0;
  left: 5px;
  position: relative;
}

.row .title {
  font-size: 25px;
  font-weight: 400;
  color: #000000;
  margin-left: 20px;
}

.row .edit {
  position: absolute;
  right: 0;
  font-size: 14px;
  font-weight: 400;
  color: #087eff;
}

.row .summary {
  width: 100%;
  height: 63px;
  background: rgba(245,245,251,0.54);
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 39px;
}
.row .summary .item {
  opacity: 0.66;
  font-size: 14px;
  font-weight: 400;
  color: #54647d;
}

.course-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-bottom: 100px;
}

.course-item {
  width: 459px;
  height: 202px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.06);
  margin-right: 30px;
  margin-bottom: 30px;
  overflow: hidden;
  padding-top: 16px;
  padding-left: 24px;
  &:nth-child(even) {
    margin-right: 0;
  }
}

.course-item .title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.course-item .title .content {
  display: inline-block;
  width: 300px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}

.course-item .title .num {
  font-size: 54px;
  font-family: YouSheBiaoTiHei;
  color: #007aff;
  height: 54px;
  line-height: 54px;
  margin: 0 10px;
}

.course-item .period {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-top: 8px;
}

.course-item .state {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.course-item .btn {
  width: 96px;
  height: 30px;
  border: 1px solid #007aff;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  color: #007aff;
  text-align: center;
  line-height: 30px;
  display: inline-block;
  margin-left: 20px;
}

.course-item .statistics {
  font-size: 15px;
  font-weight: 400;
  color: #7d7a7a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}

.course-item .statistics span {
  margin-right: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.course-item .statistics span i {
  margin-right: 10px;
}

.course-item .statistics span:nth-child(1) i {
  width: 19px;
  height: 19px;
  background-image: url('../../assets/images/course/icon-time.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.course-item .statistics span:nth-child(2) i {
  width: 17px;
  height: 19px;
  background-image: url('../../assets/images/course/icon-renyuan.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.course-item .statistics span:nth-child(3) i {
  width: 19px;
  height: 17px;
  background-image: url('../../assets/images/course/icon-hudong.svg');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
